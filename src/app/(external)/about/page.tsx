import AboutPage from "@/components/external/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | INTELL",
  description: "Discover the mission, team, and technology driving INTELL.",
};

export default function AboutUsPage() {
  return (
    <div className="flex w-full flex-col">
      <AboutPage />
    </div>
  );
}
