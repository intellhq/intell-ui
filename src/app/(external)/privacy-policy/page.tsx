import PrivacyPolicy from "@/components/external/privacy-policy"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | INTELL",
  description:
    "Our privacy policy outlines how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex w-full flex-col">
      <PrivacyPolicy />
    </div>
  )
}
