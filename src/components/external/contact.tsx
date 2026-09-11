"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ContactService } from "@/services/contact-service";
import { contactSchema, ContactFormValues } from "@/lib/schemas/contact";

type ContactInputFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  label: string;
  error?: string;
};

type ContactTextareaFieldProps = ComponentPropsWithoutRef<"textarea"> & {
  label: string;
  error?: string;
};

const contactLabelClassName = "text-base font-medium text-[#2A2F3C] md:text-lg";
const contactInputClassName =
  "h-12.5 rounded-[8px] border border-[#D8DBE2] bg-[#FCFCFC] px-7 py-3.5 text-base font-light placeholder:text-[#9CA3AF] md:text-lg";

const ContactInputField = forwardRef<HTMLInputElement, ContactInputFieldProps>(
  ({ id, label, error, ...props }, ref) => {
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id} className={contactLabelClassName}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={id}
          className={contactInputClassName}
          {...props}
          aria-describedby={error ? errorId : undefined}
          // Only adds the attribute to the DOM if an error actually exists
          {...(error ? { "aria-invalid": "true" } : {})}
        />
        {error && (
          <p id={errorId} className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

ContactInputField.displayName = "ContactInputField";

const ContactTextareaField = forwardRef<
  HTMLTextAreaElement,
  ContactTextareaFieldProps
>(({ id, label, error, ...props }, ref) => {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={contactLabelClassName}>
        {label}
      </Label>
      <textarea
        ref={ref}
        id={id}
        className="placeholder:text-muted-foreground focus-visible:border-border-active h-60.5 resize-none rounded-[8px] border border-[#D8DBE2] bg-[#FCFCFC] px-7 py-3.5 text-base font-light transition-colors outline-none focus-visible:ring-0 md:text-lg"
        {...props}
        aria-describedby={error ? errorId : undefined}
        // Only adds the attribute to the DOM if an error actually exists
        {...(error ? { "aria-invalid": "true" } : {})}
      />
      {error && (
        <p id={errorId} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

ContactTextareaField.displayName = "ContactTextareaField";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      await ContactService.submitMessage(data);
      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible.",
      });
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Something went wrong";
      toast.error(message, {
        description: "Please try again later.",
      });
    }
  }

  return (
    <section className="flex flex-col bg-white">
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left pointer-events-none"
        style={{ scaleX }}
      />

      {/* Hero Section with Background Image */}
      <div className="relative flex h-87.5 w-full items-center justify-center overflow-hidden md:h-112.5">
        <Image
          src="/images/pages.jpg"
          alt="Contact hero background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 flex max-w-3xl flex-col items-center px-4 text-center"
        >
          <h1 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Contact us
          </h1>
          <p className="text-base leading-relaxed text-gray-300 md:text-lg">
            Have questions about your data or need help optimizing your
            dashboard?
            <br className="hidden md:block" />
            Our team is ready to provide the technical support and insights you
            need.
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          aria-label="Contact support form"
          noValidate
        >
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ContactInputField
              id="firstName"
              label="First name"
              placeholder="Enter your first name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <ContactInputField
              id="lastName"
              label="Last name"
              placeholder="Enter your last name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ContactInputField
              id="email"
              type="email"
              label="Email"
              placeholder="contact@intell.ng"
              error={errors.email?.message}
              {...register("email")}
            />
            <ContactInputField
              id="phone"
              type="tel"
              label="Phone number"
              placeholder="Enter your phone number"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
          </div>

          {/* Message */}
          <ContactTextareaField
            id="message"
            label="Message"
            rows={6}
            placeholder="Leave us a message"
            error={errors.message?.message}
            {...register("message")}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-[#f5a623] px-4 py-2 text-sm font-medium text-[#111928] hover:bg-[#e0961d] md:text-base"
            >
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
