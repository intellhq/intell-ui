import TermsAndCondition from "@/components/external/terms-and-condition";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | INTELL",
  description: "Terms and conditions for using the INTELL platform.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="flex w-full flex-col">
      <TermsAndCondition />
    </div>
  );
}
