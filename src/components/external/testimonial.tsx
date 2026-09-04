"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import {
  motion,
  useAnimate,
  type AnimationPlaybackControls,
} from "motion/react";
import { useState, useEffect, useRef } from "react";

interface Testimonial {
  id: string;
  text: string;
  rating: number;
  author: {
    name: string;
    title: string;
    image: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    text: "With INTELL I finally see where my solar underperforms and i get the alert on my WhatsApp before my freezers go off.",
    rating: 5,
    author: {
      name: "Amaka",
      title: "SME Owner",
      image: "/images/testimonial_01.png",
    },
  },
  {
    id: "2",
    text: "My clients used to disturb me every week, now I onboard them on INTELL and i get to have my weekends.",
    rating: 5,
    author: {
      name: "Tunde",
      title: "Installer",
      image: "/images/testimonial_02.png",
    },
  },
  {
    id: "3",
    text: "Eight rural sites, 3 states. I cannot dispatch a tech for every flicker. INTELL tells me where the real fault is ahead of time.",
    rating: 5,
    author: {
      name: "Emeka",
      title: "EPC Contractor",
      image: "/images/testimonial_03.png",
    },
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="w-[300px] shrink-0 cursor-pointer rounded-[20px] border border-[#E7E7E7] bg-[#FDFDFD] px-6 py-8 transition-shadow md:w-[400px]"
  >
    <div className="mb-6 flex">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} size={18} className="fill-primary text-primary" />
      ))}
    </div>

    <p className="mb-8 text-sm leading-relaxed text-[#4A4A4A] md:text-base">
      &quot;{testimonial.text}&quot;
    </p>

    <div className="flex items-center gap-3">
      <div className="relative size-10 overflow-hidden rounded-full md:size-12">
        <Image
          src={testimonial.author.image}
          alt={testimonial.author.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="text-[#2A2F3C]">
        <p className="text-sm font-bold md:text-base">
          {testimonial.author.name}
        </p>
        <p className="text-xs text-[#666] md:text-sm">
          {testimonial.author.title}
        </p>
      </div>
    </div>
  </motion.div>
);

export function TestimonialsSection() {
  const [scope, animate] = useAnimate();
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && scope.current) {
      animationRef.current = animate(
        scope.current,
        { x: ["0%", "-33.333%"] },
        {
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        },
      );
    } else if (animationRef.current) {
      animationRef.current.stop();
    }
  }, [animate, scope, isMobile]);

  useEffect(() => {
    if (!isMobile && animationRef.current) {
      if (isPaused) {
        animationRef.current.pause();
      } else {
        animationRef.current.play();
      }
    }
  }, [isPaused, isMobile]);

  const allTestimonials = isMobile
    ? testimonials
    : [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="w-full overflow-hidden bg-white/10 py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h2 className="mb-1 text-3xl leading-tight font-bold md:text-5xl">
            Trusted by Installers.
            <br />
            <span className="text-primary">Relied</span> on by Businesses.
          </h2>
        </div>
      </div>

      {!isMobile ? (
        <div
          className="relative mx-auto mt-10 flex max-w-[1440px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scope}
            className="flex gap-6 px-4"
            style={{ width: "max-content" }}
          >
            {allTestimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={`${testimonial.id}-${idx}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative mt-8 px-4">
          <motion.div
            drag="x"
            dragConstraints={{
              left: -(testimonials.length - 1) * 316,
              right: 0,
            }}
            onDragEnd={(_, info) => {
              const threshold = 50;
              if (
                info.offset.x < -threshold &&
                activeIndex < testimonials.length - 1
              ) {
                setActiveIndex((prev) => prev + 1);
              } else if (info.offset.x > threshold && activeIndex > 0) {
                setActiveIndex((prev) => prev - 1);
              }
            }}
            animate={{ x: -activeIndex * 316 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex gap-4"
            style={{ width: "max-content" }}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`size-2.5 rounded-full transition-colors ${
                  activeIndex === idx ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
