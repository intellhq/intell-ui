"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AcceptInviteFlow } from "@/components/auth/accept-invite-flow";

function AcceptInvitePageContent() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken") ?? "";
  return <AcceptInviteFlow inviteToken={inviteToken} />;
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInvitePageContent />
    </Suspense>
  );
}
