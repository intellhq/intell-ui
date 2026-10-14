import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  href?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  darkBg?: boolean;
}

const sizes = {
  sm: {
    container: "h-6 w-6",
    text: "text-base",
  },
  md: {
    container: "h-8 w-8",
    text: "text-lg",
  },
  lg: {
    container: "h-12 w-12 md:h-14 md:w-14",
    text: "text-xl md:text-2xl",
  },
};

export function Logo({
  className,
  imageClassName,
  textClassName,
  href = "/",
  showText = true,
  size = "md",
  darkBg = false,
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center font-bold", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          sizes[size].container,
          imageClassName,
        )}
      >
        <Image
          src={darkBg ? "/images/logo-dark-bg.png" : "/images/logo.png"}
          alt="INTELL Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span
          className={cn(
            "font-display tracking-tight text-dark-text",
            sizes[size].text,
            textClassName,
          )}
        >
          INTE<span className="text-primary">LL</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
