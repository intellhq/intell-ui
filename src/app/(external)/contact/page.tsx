import Contact from "@/components/external/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | INTELL",
  description: "Get in touch with the INTELL team.",
};

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <Contact />
    </div>
  );
}
