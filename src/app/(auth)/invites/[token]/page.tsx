import { AcceptInviteFlow } from "@/components/auth/accept-invite-flow";

export default async function InviteLandingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <AcceptInviteFlow inviteToken={token} />;
}
