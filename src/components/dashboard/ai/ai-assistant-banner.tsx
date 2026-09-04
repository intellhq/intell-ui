"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { chatService } from "@/services/chat-service";
import { toast } from "sonner";
import {
  createLocalChatTitle,
  getChatActionsStorageKey,
  saveLocalChatTitle,
} from "@/lib/chat-actions-storage";
import {
  clearChatCreateAttempt,
  createChatRecoveryToken,
  findRecoveredCreatedChat,
  stashChatCreateAttempt,
} from "@/lib/chat-create-recovery";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

const suggestions = [
  "Why is my battery low?",
  "What used the most power today?",
  "Should I run the AC tonight?",
];

function isStackOverflowCreateError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes("maximum call stack") || message.includes("rangeerror")
  );
}

export function AIAssistantBanner() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const isCreatingChatRef = useRef(false);

  const [sendingPrompt, setSendingPrompt] = useState<string | null>(null);

  const handleStartConversation = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || sendingPrompt) return;
    if (!userId) return;
    if (isCreatingChatRef.current) return;

    isCreatingChatRef.current = true;
    setSendingPrompt(cleanText);

    const requestedAt = new Date().getTime();
    const recoveryToken = createChatRecoveryToken();

    stashChatCreateAttempt(userId, recoveryToken, cleanText, requestedAt);

    try {
      let chat:
        | {
            id: string;
            title?: string;
            updatedAt?: string;
            createdAt?: string;
            dateLabel?: string;
          }
        | undefined;

      try {
        chat = await chatService.createChat({ startingMessage: cleanText });
      } catch (createError) {
        if (!isStackOverflowCreateError(createError)) throw createError;

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
      sessionStorage.setItem(
        `pending-chat-message:${chat.id}`,
        JSON.stringify({
          content: cleanText,
          timestamp: new Date().toISOString(),
        }),
      );

      router.push(`/dashboard/ai-assistant/${chat.id}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to start chat. Please try again.";

      console.error("Failed to start chat:", message);
      toast.error(message);
    } finally {
      isCreatingChatRef.current = false;
      setSendingPrompt(null);
    }
  };

  return (
    <div className="bg-secondary text-secondary-foreground rounded-2xl p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Have a question about your energy?
          </h3>
          <p className="text-secondary-foreground/60 mt-1 text-sm">
            Ask INTELL in English or Pidgin
          </p>
        </div>

        <Link
          href="/dashboard/ai-assistant/new"
          className="bg-background text-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center gap-1 self-start rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Ask Energy AI <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <span className="text-secondary-foreground/60 shrink-0 text-sm">
          Try this:
        </span>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Button
              key={s}
              type="button"
              disabled={!!sendingPrompt || !userId}
              onClick={() => void handleStartConversation(s)}
              className="border-secondary-foreground/20 bg-secondary-foreground/5 hover:bg-secondary-foreground/10 inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {s}
              {sendingPrompt === s ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ArrowUpRight className="h-3 w-3" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
