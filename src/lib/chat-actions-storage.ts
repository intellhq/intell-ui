export interface StoredChatActions {
  deletedIds: string[];
  archivedIds: string[];
  pinnedIds: string[];
  renamedTitles: Record<string, string>;
}

const CHAT_ACTIONS_STORAGE_KEY = "intell-ai-chat-actions";

function createEmptyChatActions(): StoredChatActions {
  return {
    deletedIds: [],
    archivedIds: [],
    pinnedIds: [],
    renamedTitles: {},
  };
}

export function getChatActionsStorageKey(userId?: string): string {
  return userId
    ? `${CHAT_ACTIONS_STORAGE_KEY}:${userId}`
    : CHAT_ACTIONS_STORAGE_KEY;
}

function readStoredChatActions(storageKey: string): StoredChatActions {
  if (typeof window === "undefined") return createEmptyChatActions();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return createEmptyChatActions();
    const parsed = JSON.parse(raw) as Partial<StoredChatActions>;
    return {
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
      archivedIds: Array.isArray(parsed.archivedIds) ? parsed.archivedIds : [],
      pinnedIds: Array.isArray(parsed.pinnedIds) ? parsed.pinnedIds : [],
      renamedTitles:
        parsed.renamedTitles && typeof parsed.renamedTitles === "object"
          ? parsed.renamedTitles
          : {},
    };
  } catch {
    return createEmptyChatActions();
  }
}

export function loadStoredChatActions(storageKey: string): StoredChatActions {
  const actions = readStoredChatActions(storageKey);
  if (storageKey === CHAT_ACTIONS_STORAGE_KEY) return actions;

  const legacyActions = readStoredChatActions(CHAT_ACTIONS_STORAGE_KEY);
  return {
    ...actions,
    renamedTitles: {
      ...legacyActions.renamedTitles,
      ...actions.renamedTitles,
    },
  };
}

export function saveStoredChatActions(
  storageKey: string,
  actions: StoredChatActions,
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(actions));
  } catch {
    // Keep UI state in memory when persistence is unavailable.
  }
}

export function createLocalChatTitle(message: string) {
  const normalized = message.trim().replace(/\s+/g, " ");
  if (normalized.length <= 70) return normalized;
  return `${normalized.slice(0, 67).trimEnd()}...`;
}

export function sanitizeChatTitle(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw
    .trim()
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/i, "")
    .trim();

  if (!trimmed) return undefined;
  if (/^new chat$/i.test(trimmed)) return undefined;
  if (/^json/i.test(trimmed)) return undefined;
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return undefined;

  try {
    JSON.parse(trimmed);
    return undefined;
  } catch {
    return createLocalChatTitle(trimmed);
  }
}

export function getFirstUserMessageTitle(
  messages: Array<{ role?: string; content?: string }> | undefined,
) {
  const firstUserMessage = messages
    ?.find((message) => message.role === "user")
    ?.content?.trim();

  return firstUserMessage ? createLocalChatTitle(firstUserMessage) : undefined;
}

export function saveLocalChatTitle(
  storageKey: string,
  chatId: string,
  title: string,
) {
  const actions = loadStoredChatActions(storageKey);
  saveStoredChatActions(storageKey, {
    ...actions,
    renamedTitles: {
      ...actions.renamedTitles,
      [chatId]: title,
    },
  });
}
