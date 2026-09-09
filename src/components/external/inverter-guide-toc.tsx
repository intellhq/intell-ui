"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type InverterGuideTocItem = {
  id: string;
  title: string;
};

export function InverterGuideToc({
  sections,
}: {
  sections: InverterGuideTocItem[];
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const element = document.getElementById(section.id);

        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= 180 && rect.bottom >= 180) {
          setActiveSection(section.id);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <aside className="lg:sticky lg:top-24 lg:w-1/4">
      <div className="border-none bg-white shadow-none lg:bg-transparent lg:p-0">
        <h2 className="mb-6 text-lg font-bold tracking-wider text-slate-900 uppercase lg:text-xl">
          Table of content
        </h2>
        <nav className="flex flex-col space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "group flex items-center border-l-2 py-2.5 pl-4 text-left text-sm transition-all duration-200",
                activeSection === section.id
                  ? "border-primary bg-amber-10 text-primary font-semibold"
                  : "border-slate-30 text-slate-70 hover:bg-slate-10 hover:border-slate-50 hover:text-slate-100",
              )}
            >
              <span
                className={cn(
                  "transition-transform duration-200 group-hover:translate-x-1",
                  activeSection === section.id && "translate-x-1",
                )}
              >
                {section.title}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
