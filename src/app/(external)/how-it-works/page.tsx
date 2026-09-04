import HowItWorks from "@/components/external/how-it-works";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | INTELL",
  description: "Learn how the INTELL platform works.",
};

export default function HowItWorksPage() {
  return (
    <div className="flex w-full flex-col">
      <HowItWorks />
    </div>
  );
}
