"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { COMPANY_CONTACT, SOCIAL_LINKS } from "@/constants/marketing";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardFeedbackPage() {
  const user = useAuthStore((state) => state.user);
  const [category, setCategory] = useState("Product feedback");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Feedback captured locally for super-admin review.");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">
          Feedback & Support
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[#5D5C5D]">
          Tell the INTELL team what is unclear, what is broken, or what would
          help you manage your inverter system better.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-white p-5 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feedback-name">Name</Label>
              <Input
                id="feedback-name"
                defaultValue={
                  user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : ""
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-email">Email</Label>
              <Input
                id="feedback-email"
                type="email"
                defaultValue={user?.email ?? ""}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="feedback-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product feedback">
                    Product feedback
                  </SelectItem>
                  <SelectItem value="Inverter monitoring issue">
                    Inverter monitoring issue
                  </SelectItem>
                  <SelectItem value="AI assistant response">
                    AI assistant response
                  </SelectItem>
                  <SelectItem value="Billing or savings report">
                    Billing or savings report
                  </SelectItem>
                  <SelectItem value="Installer support">
                    Installer support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="feedback-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="feedback-message">Message</Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe what happened or what you would like INTELL to improve."
              className="min-h-36"
              required
            />
          </div>
          <Button
            type="submit"
            className="mt-5 h-11 rounded-lg bg-secondary px-6 text-white hover:bg-secondary/90"
          >
            Submit Feedback
          </Button>
        </form>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-lg font-semibold text-dark-text">
              Get in Touch
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              <a
                href={`mailto:${COMPANY_CONTACT.email}`}
                className="flex items-center gap-3 text-[#5D5C5D] hover:text-secondary"
              >
                <Mail className="size-4" />
                {COMPANY_CONTACT.email}
              </a>
              <a
                href={`tel:${COMPANY_CONTACT.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-[#5D5C5D] hover:text-secondary"
              >
                <Phone className="size-4" />
                {COMPANY_CONTACT.phone}
              </a>
              <p className="flex items-center gap-3 text-[#5D5C5D]">
                <MapPin className="size-4" />
                {COMPANY_CONTACT.location}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-lg font-semibold text-dark-text">
              Follow INTELL
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => (
                <Button
                  key={social.label}
                  asChild
                  variant="outline"
                  className="h-10 rounded-lg"
                >
                  <Link href={social.href} target="_blank" rel="noreferrer">
                    <Image
                      src={social.icon}
                      alt=""
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    {social.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
