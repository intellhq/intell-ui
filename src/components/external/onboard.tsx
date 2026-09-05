"use client";

import Image from "next/image";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Controller, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useScroll, useSpring } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INVERTER_TYPES,
  NIGERIAN_STATES,
  ONBOARDING_INTEREST_OPTIONS,
} from "@/constants/marketing";
import {
  waitlistLeadSchema,
  type WaitlistLeadValues,
} from "@/lib/schemas/waitlist";
import { WaitlistService } from "@/services/waitlist-service";

type OnboardInputFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  label: string;
  error?: string;
};

type OnboardTextareaFieldProps = ComponentPropsWithoutRef<"textarea"> & {
  label: string;
  error?: string;
};

const labelClassName = "text-base font-medium text-[#2A2F3C] md:text-lg";
const inputClassName =
  "h-12.5 rounded-[8px] border border-[#D8DBE2] bg-[#FCFCFC] px-7 py-3.5 text-base font-light placeholder:text-[#9CA3AF] md:text-lg";

const OnboardInputField = forwardRef<HTMLInputElement, OnboardInputFieldProps>(
  ({ id, label, error, ...props }, ref) => {
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={id}
          className={inputClassName}
          {...props}
          aria-describedby={error ? errorId : undefined}
          {...(error ? { "aria-invalid": "true" } : {})}
        />
        {error ? (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

OnboardInputField.displayName = "OnboardInputField";

const OnboardTextareaField = forwardRef<
  HTMLTextAreaElement,
  OnboardTextareaFieldProps
>(({ id, label, error, ...props }, ref) => {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={labelClassName}>
        {label}
      </Label>
      <textarea
        ref={ref}
        id={id}
        className="h-60.5 resize-none rounded-[8px] border border-[#D8DBE2] bg-[#FCFCFC] px-7 py-3.5 text-base font-light outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-border-active focus-visible:ring-0 md:text-lg"
        {...props}
        aria-describedby={error ? errorId : undefined}
        {...(error ? { "aria-invalid": "true" } : {})}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

OnboardTextareaField.displayName = "OnboardTextareaField";

export function OnboardPageContent() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistLeadValues>({
    resolver: zodResolver(waitlistLeadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      state: "",
      inverterType: "",
      interest: "",
      message: "",
    },
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  async function onSubmit(data: WaitlistLeadValues) {
    try {
      await WaitlistService.joinWaitlist(data);
      toast.success("Your details have been submitted.", {
        description: "The INTELL team will contact you with next steps.",
      });
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your details right now.",
        {
          description: "Please try again or contact the team directly.",
        },
      );
    }
  }

  return (
    <section className="flex flex-col bg-white">
      <motion.div
        className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-1.5 origin-left bg-primary"
        style={{ scaleX }}
      />

      <div className="relative flex h-87.5 w-full items-center justify-center overflow-hidden md:h-112.5">
        <Image
          src="/images/pages.jpg"
          alt="INTELL onboarding hero background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 flex max-w-3xl flex-col items-center px-4 text-center"
        >
          <h1 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Make your inverter smarter with INTELL
          </h1>
          <p className="text-base leading-relaxed text-gray-300 md:text-lg">
            Tell us about your solar or inverter setup and we will help you
            connect it to smarter monitoring, proactive alerts, savings
            visibility, and AI guidance for better energy decisions.
          </p>
        </motion.div>
      </div>

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
          aria-label="INTELL onboarding interest form"
          noValidate
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <OnboardInputField
              id="firstName"
              label="First name"
              placeholder="Enter your first name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <OnboardInputField
              id="lastName"
              label="Last name"
              placeholder="Enter your last name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <OnboardInputField
              id="email"
              type="email"
              label="Email"
              placeholder="johndoe@gmail.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <OnboardInputField
              id="phoneNumber"
              type="tel"
              label="Phone number"
              placeholder="Enter your phone number"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <OnboardSelectField
              name="state"
              label="State"
              control={control}
              options={NIGERIAN_STATES}
              placeholder="Select state"
              error={errors.state?.message}
            />
            <OnboardSelectField
              name="inverterType"
              label="Inverter type"
              control={control}
              options={INVERTER_TYPES}
              placeholder="Select inverter type"
              error={errors.inverterType?.message}
            />
          </div>

          <OnboardSelectField
            name="interest"
            label="What do you want to do?"
            control={control}
            options={ONBOARDING_INTEREST_OPTIONS}
            placeholder="Select an option"
            error={errors.interest?.message}
          />

          <OnboardTextareaField
            id="message"
            label="Message"
            rows={6}
            placeholder="Tell us about your site, inverter, or monitoring needs."
            error={errors.message?.message}
            {...register("message")}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-[#f5a623] px-4 py-2 text-sm font-medium text-[#111928] hover:bg-[#e0961d] md:text-base"
            >
              {isSubmitting ? "Submitting..." : "Submit details"}
            </Button>
          </div>
        </form>
      </motion.div>

    </section>
  );
}

function OnboardSelectField({
  name,
  label,
  control,
  options,
  placeholder,
  error,
}: {
  name: "state" | "inverterType" | "interest";
  label: string;
  control: Control<WaitlistLeadValues>;
  options: readonly string[];
  placeholder: string;
  error?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label className={labelClassName}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger
              className="h-12.5 rounded-[8px] border-[#D8DBE2] bg-[#FCFCFC] px-7 text-base font-light md:text-lg"
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
