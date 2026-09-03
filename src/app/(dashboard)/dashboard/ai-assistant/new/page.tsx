"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Mic,
  Plus,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { blockClick, blockKeyPress } from "@/lib/block-interaction";
import { chatService } from "@/services/chat-service";
import { toast } from "sonner";
import {
  clearChatCreateAttempt,
  createChatRecoveryToken,
  findRecoveredCreatedChat,
  stashChatCreateAttempt,
} from "@/lib/chat-create-recovery";
import {
  createLocalChatTitle,
  getChatActionsStorageKey,
  saveLocalChatTitle,
} from "@/lib/chat-actions-storage";
import { useAuthStore } from "@/stores/auth-store";
import type { ChatSession } from "@/types/chat";

interface SuggestionCard {
  title: string;
  description: string;
}

const SUGGESTIONS: SuggestionCard[] = [
  {
    title: "Why did my battery drain fast last night?",
    description:
      "Analyze overnight usage and identify what consumed the most power.",
  },
  {
    title: "Is my inverter overloaded?",
    description: "Identify dangerous load spikes and system overload periods.",
  },
  {
    title: "Are my solar panels underperforming?",
    description:
      "Detect weather impact, shading issues, or reduced solar output.",
  },
];

function isRecoverableCreateError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("maximum call stack") ||
    message.includes("rangeerror") ||
    message.includes("timeout") ||
    message.includes("504") ||
    message.includes("econnaborted")
  );
}

export default function NewChatPage() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isCreatingChatRef = useRef(false);

  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const EXPAND_THRESHOLD = 40;
  const MAX_CHARS = 3000;

  const handleStartConversation = async (text: string) => {
    const cleanText = text.trim();

    if (!cleanText || sending) return;
    if (isCreatingChatRef.current) return;
    if (!userId) {
      setError("Please wait while your session loads, then try again.");
      return;
    }

    isCreatingChatRef.current = true;
    setSending(true);
    setPendingPrompt(cleanText);
    setError(null);

    const requestedAt = Date.now();
    const recoveryToken = createChatRecoveryToken();

    stashChatCreateAttempt(userId, recoveryToken, cleanText, requestedAt);

    try {
      let chat: ChatSession | undefined;

      try {
        chat = await chatService.createChat({
          startingMessage: cleanText,
        });
      } catch (createError) {
        if (!isRecoverableCreateError(createError)) {
          throw createError;
        }

        chat = await findRecoveredCreatedChat(
          userId,
          recoveryToken,
          cleanText,
          requestedAt,
        );
        if (!chat) throw createError;
      }

      clearChatCreateAttempt(userId, recoveryToken);

      if (!chat?.id) {
        throw new Error("The chat was created, but no chat id was returned.");
      }

      const title = createLocalChatTitle(cleanText);
      if (userId) {
        saveLocalChatTitle(getChatActionsStorageKey(userId), chat.id, title);
      }

      const pendingKey = `pending-chat-message:${chat.id}`;
      sessionStorage.setItem(
        pendingKey,
        JSON.stringify({
          content: cleanText,
          timestamp: new Date().toISOString(),
        }),
      );

      router.push(`/dashboard/ai-assistant/${chat.id}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.includes("504")
            ? "This is taking longer than usual. Check your chat list or try again."
            : err.message
          : "Failed to start chat. Please try again.";

      console.error("Failed to start chat:", message);
      setError(message);
      setSending(false);
      setPendingPrompt("");
    } finally {
      isCreatingChatRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleStartConversation(input);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-[calc(100dvh-130px)] w-full max-w-full flex-col overflow-y-auto bg-background md:min-h-[calc(100dvh-140px)]">
      <div className="w-full px-4 pt-4 sm:px-6 md:pt-6">
        <div className="mx-auto w-full max-w-7xl">
          <DashboardBreadcrumb
            items={[
              { label: "AI Assistant", href: "/dashboard/ai-assistant" },
              { label: "New Chat" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 text-center sm:px-6">
        <div className="flex w-full max-w-7xl flex-col items-center mt-12 sm:mt-0">
          <div className="mb-6 flex h-16 w-16 items-center justify-center">
            <Image
              src="/images/logo.svg"
              alt="INTELL Logo"
              width={64}
              height={64}
              className="h-10 w-10 object-contain"
              priority
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ask INTELL anything about <br /> your power system
          </h1>

          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            INTELL analyzes your inverter and energy data to explain battery
            drain, generator usage, savings, and solar performance in simple
            language.
          </p>

          <div className="mt-8 w-full rounded-xl border border-border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <div
              className={cn(
                "flex gap-2 px-2 py-1.5 sm:gap-3 sm:px-3",
                isTextareaExpanded ? "items-end" : "items-center",
              )}
            >
              <Tooltip content="Attachments (coming soon)" align="start">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Attach"
                  aria-disabled="true"
                  onClick={blockClick}
                  onKeyDown={blockKeyPress}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-transparent hover:text-foreground cursor-not-allowed opacity-50"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </Tooltip>

              <div className="flex min-h-9 flex-1 items-center">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > MAX_CHARS) {
                      toast.error(
                        `Message limit is ${MAX_CHARS} characters. Your text was trimmed.`,
                      );
                      setInput(value.slice(0, MAX_CHARS));
                    } else {
                      setInput(value);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your energy system"
                  rows={1}
                  className={cn(
                    "h-auto max-h-32 min-h-0 w-full resize-none border-0 bg-transparent p-0 py-1 text-sm leading-5 text-foreground shadow-none outline-none placeholder:text-muted-foreground",
                    "focus-visible:ring-0",
                  )}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                    setIsTextareaExpanded(el.scrollHeight > EXPAND_THRESHOLD);
                  }}
                />
              </div>
              <div className="hidden justify-end sm:flex">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {input.length}/{MAX_CHARS}
                </span>
              </div>

              <div className="mb-0.5 flex shrink-0 items-center gap-2 self-end md:mb-0 md:self-auto">
                <Tooltip content="Voice input (coming soon)">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Record voice message"
                    aria-disabled="true"
                    onClick={blockClick}
                    onKeyDown={blockKeyPress}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-transparent hover:text-foreground cursor-not-allowed opacity-50"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </Tooltip>

                <Button
                  type="button"
                  title={sending ? "Sending" : "Send message"}
                  aria-label={sending ? "Sending" : "Send message"}
                  onClick={() => void handleStartConversation(input)}
                  disabled={!input.trim() || sending || !userId}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border-0 p-0 shadow-none transition-colors",
                    input.trim() && !sending
                      ? "bg-foreground text-background hover:bg-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground hover:bg-muted",
                  )}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {sending ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Sending
              {pendingPrompt ? `: "${pendingPrompt.slice(0, 80)}"` : ""}...
            </p>
          ) : null}

          {error ? (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          ) : null}

          <div className="mt-10 w-full text-left">
            <Button
              variant="ghost"
              onClick={() => setShowSuggestions((value) => !value)}
              className="flex h-auto items-center gap-1 p-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <span>Suggested Questions</span>
              {showSuggestions ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>

            {showSuggestions ? (
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {SUGGESTIONS.map((card) => (
                  <Button
                    key={card.title}
                    variant="outline"
                    onClick={() => void handleStartConversation(card.title)}
                    disabled={sending}
                    className="flex h-auto cursor-pointer flex-col items-start whitespace-normal rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:border-muted-foreground/30 hover:bg-muted/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {sending && pendingPrompt === card.title ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      <span className="line-clamp-2">{card.title}</span>
                    </span>
                    <span className="mt-1.5 line-clamp-2 text-xs font-normal text-muted-foreground">
                      {card.description}
                    </span>
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
