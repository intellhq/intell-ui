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
    container: "h-10 w-10 md:h-12 md:w-12",
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
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2 font-bold", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          sizes[size].container,
          imageClassName,
        )}
      >
        <Image
          src="/images/logo.svg"
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
