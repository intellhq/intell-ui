import type { AiResponseCard } from "@/types/chat";
import {
  deriveAiResponseCardsFromText,
  normalizeBackendCard,
  normalizeBackendCards,
  type BackendAiCardPayload,
} from "@/lib/chat-cards";
import type { ChatMessage } from "@/types/chat";

const STORAGE_KEY = "intell-chat-response-cards:v1";

interface StoredCardEntry {
  messageId?: string;
  userPrompt?: string;
  cards: AiResponseCard[];
  updatedAt: number;
}

interface CardsStore {
  [chatId: string]: StoredCardEntry[];
}

function readStore(): CardsStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};

    const store: CardsStore = {};
    for (const [chatId, entries] of Object.entries(
      parsed as Record<string, unknown>,
    )) {
      if (!Array.isArray(entries)) continue;
      const valid = entries.filter(
        (e) =>
          e &&
          typeof e === "object" &&
          Array.isArray((e as Record<string, unknown>).cards) &&
          typeof (e as Record<string, unknown>).updatedAt === "number",
      ) as StoredCardEntry[];
      if (valid.length > 0) store[chatId] = valid;
    }
    return store;
  } catch {
    return {};
  }
}

function writeStore(store: CardsStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore quota / private mode errors.
  }
}

function normalizePrompt(prompt?: string) {
  return (prompt ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

export function saveChatMessageCards(
  chatId: string,
  options: {
    messageId?: string;
    userPrompt?: string;
    cards: AiResponseCard[];
  },
) {
  if (!chatId || options.cards.length === 0) return;

  const store = readStore();
  const entries = store[chatId] ?? [];
  const userPromptKey = normalizePrompt(options.userPrompt);
  const existingIndex = entries.findIndex((entry) => {
    if (options.messageId && entry.messageId === options.messageId) return true;
    if (
      userPromptKey &&
      entry.userPrompt &&
      normalizePrompt(entry.userPrompt) === userPromptKey
    ) {
      return true;
    }
    return false;
  });

  const nextEntry: StoredCardEntry = {
    messageId: options.messageId,
    userPrompt: options.userPrompt?.trim() || undefined,
    cards: options.cards,
    updatedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    entries.splice(existingIndex, 1);
  }
  entries.push(nextEntry);
  store[chatId] = entries.slice(-50);

  store[chatId] = entries.slice(-50);
  writeStore(store);
}

export function linkChatMessageCards(
  chatId: string,
  tempMessageId: string,
  realMessageId: string,
) {
  if (
    !chatId ||
    !tempMessageId ||
    !realMessageId ||
    tempMessageId === realMessageId
  ) {
    return;
  }

  const store = readStore();
  const entries = store[chatId];
  if (!entries?.length) return;

  let changed = false;
  for (const entry of entries) {
    if (entry.messageId === tempMessageId) {
      entry.messageId = realMessageId;
      changed = true;
    }
  }

  if (changed) writeStore(store);
}

function findStoredCards(
  entries: StoredCardEntry[],
  messageId: string,
  userPrompt?: string,
): AiResponseCard[] | undefined {
  const byId = entries.find((entry) => entry.messageId === messageId);
  if (byId?.cards.length) return byId.cards;

  const promptKey = normalizePrompt(userPrompt);
  if (!promptKey) return undefined;

  const byPrompt = entries.find(
    (entry) =>
      entry.userPrompt && normalizePrompt(entry.userPrompt) === promptKey,
  );
  return byPrompt?.cards.length ? byPrompt.cards : undefined;
}

export function extractCardsFromApiMessage(
  message: Record<string, unknown>,
): AiResponseCard[] {
  const candidates = [
    message.cards,
    message.responseCards,
    message.response_cards,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const normalized = normalizeBackendCards(
        candidate as BackendAiCardPayload[],
      );
      if (normalized.length > 0) return normalized;
    }
  }

  const metadata = message.metadata;
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const metaCards = (metadata as Record<string, unknown>).cards;
    if (Array.isArray(metaCards)) {
      const normalized = normalizeBackendCards(
        metaCards as BackendAiCardPayload[],
      );
      if (normalized.length > 0) return normalized;
    }
  }

  const structured = message.structuredContent ?? message.structured_content;
  if (
    structured &&
    typeof structured === "object" &&
    !Array.isArray(structured)
  ) {
    const structCards = (structured as Record<string, unknown>).cards;
    if (Array.isArray(structCards)) {
      const normalized = normalizeBackendCards(
        structCards as BackendAiCardPayload[],
      );
      if (normalized.length > 0) return normalized;
    }
  }

  const content =
    typeof message.content === "string"
      ? message.content
      : typeof message.textContent === "string"
        ? message.textContent
        : typeof message.text_content === "string"
          ? message.text_content
          : "";

  const trimmed = content.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && parsed[0] && typeof parsed[0] === "object") {
          const first = parsed[0] as Record<string, unknown>;
          if ("cardType" in first || "type" in first) {
            return normalizeBackendCards(parsed as BackendAiCardPayload[]);
          }
        }
        const alertCards = parsed
          .map((item) =>
            item && typeof item === "object"
              ? normalizeBackendCard(item as BackendAiCardPayload)
              : null,
          )
          .filter((card): card is AiResponseCard => card !== null);
        if (alertCards.length > 0) return alertCards;
      }
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>;
        if (Array.isArray(obj.cards)) {
          return normalizeBackendCards(obj.cards as BackendAiCardPayload[]);
        }
      }
    } catch {
      // Not JSON cards payload.
    }
  }

  return [];
}

export function hydrateChatMessagesWithCards(
  chatId: string,
  messages: ChatMessage[],
): ChatMessage[] {
  const entries = readStore()[chatId] ?? [];
  let lastUserPrompt = "";

  return messages.map((message) => {
    if (message.role === "user") {
      lastUserPrompt = message.content.trim();
      return message;
    }

    if (message.role !== "assistant" && message.role !== "ai") {
      return message;
    }

    const apiCards = message.cards ?? [];
    const storedCards =
      findStoredCards(entries, message.id, lastUserPrompt) ?? [];
    const derivedCards =
      apiCards.length === 0 && storedCards.length === 0
        ? deriveAiResponseCardsFromText(message.content)
        : [];
    const cards =
      apiCards.length > 0
        ? apiCards
        : storedCards.length > 0
          ? storedCards
          : derivedCards.length > 0
            ? derivedCards
            : undefined;

    if (!cards?.length) return message;

    const shouldTrimLongText =
      message.content.trim().length > 120 && cards.length > 0;

    return {
      ...message,
      cards,
      content: shouldTrimLongText ? "" : message.content,
    };
  });
}
