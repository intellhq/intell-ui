"use client";

import { useState, useEffect, useRef } from "react";
import {
  Pencil,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { ALERT_ROWS, DELIVERY_CHANNELS } from "@/constants/notifications";
import { useAuthStore } from "@/stores/auth-store";

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[20px] font-semibold leading-none text-(--color-surface-100)">
        {title}
      </h2>
      <p className="text-base font-normal leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function AlertRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-(--color-border-active) p-3 gap-4 min-h-19">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="flex shrink-0 items-center justify-center rounded-[6.5px] border border-(--color-border-disabled) bg-(--color-surface-10)"
          style={{ width: 52, height: 52, padding: 13 }}
        >
          <Icon
            className="text-(--color-primary)"
            style={{ width: 26, height: 26 }}
            strokeWidth={1.63}
          />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-(--color-surface-100)">
            {title}
          </span>
          <span className="text-sm text-muted-foreground leading-snug">
            {description}
          </span>
        </div>
      </div>
      <div className="shrink-0 mr-3">
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="h-6 w-12 data-checked:bg-(--color-secondary) data-unchecked:bg-(--color-slate-40)"
        />
      </div>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-[8px] border border-(--color-border-disabled) p-6 flex flex-col gap-8">
      {children}
    </div>
  );
}

function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.firstName || "Amaka";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-card rounded-[8px] p-6 flex flex-col items-center gap-6 w-[calc(100vw-32px)] max-w-122.25 border-none shadow-lg focus:outline-none"
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div
            className="flex items-center justify-center rounded-full mt-10 bg-(--color-success-alt)"
            style={{ width: 86, height: 86, padding: 12 }}
          >
            <svg
              width="74"
              height="74"
              viewBox="0 0 74 74"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 37L30 50L56 24"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-3 w-full sm:w-102.25">
            <h2 className="font-bold text-center leading-none text-[36px] text-(--color-dark-bg)">
              Phone Verification Successful
            </h2>
            <p className="font-normal text-base text-center leading-none text-(--color-slate-80)">
              Hello {firstName}, your phone number has been successfully
              verified.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={onClose}
            className="h-13.5 rounded-(--radius) text-sm font-medium px-16 w-full sm:w-61.75"
          >
            Continue
          </Button>
        </div>

        <DialogTitle className="sr-only">
          Phone Verification Successful
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

function VerifyModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<
    "idle" | "error" | "success" | "loading"
  >("idle");
  const [seconds, setSeconds] = useState(119);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setOtp("");
      setStatus("idle");
      setSeconds(119);
    }
  }

  useEffect(() => {
    if (!open) return;
    if (status === "error" || status === "success") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, status]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}s`;
  };

  const handleVerify = () => {
    if (otp.length < 6) return;
    setStatus("loading");
    setTimeout(() => {
      if (otp === "123456") {
        setStatus("success");
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 800);
      } else {
        setStatus("error");
      }
    }, 1500);
  };

  const isOtpFull = otp.length === 6;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-card rounded-[8px] p-0 flex flex-col w-[calc(100vw-32px)] max-w-143.75 border-none shadow-lg focus:outline-none overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-base leading-none text-(--color-surface-100)">
              Phone number verification
            </p>
            <p className="text-sm font-normal text-muted-foreground leading-snug">
              Enter the 6-digit code sent to your phone number to verify
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close modal"
            className="size-8 p-0 shrink-0 flex items-center justify-center hover:bg-transparent hover:opacity-75 transition-opacity"
          >
            <X className="size-6 text-(--color-surface-100)" />
          </Button>
        </div>

        <div className="flex flex-col items-center w-full pt-6 px-6">
          <div className="w-full sm:w-70">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              containerClassName="gap-1 sm:gap-2 justify-center"
            >
              <InputOTPGroup className="gap-1 sm:gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-[8px] border text-sm font-medium first:rounded-l-[8px] first:border-l last:rounded-r-[8px]",
                      status === "error"
                        ? "border-destructive"
                        : status === "success"
                          ? "border-(--color-success-alt)"
                          : "border-(--color-surface-90)",
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {status === "idle" || status === "loading" ? (
            <p className="text-sm text-muted-foreground text-center mt-8.5 w-full sm:w-70">
              Code is valid for {formatTimer(seconds)}
            </p>
          ) : status === "error" ? (
            <div className="flex items-center gap-2 rounded-[8px] p-2.5 bg-(--color-danger-bg) mt-8.5 w-full sm:w-91.5">
              <AlertCircle className="size-4 shrink-0 text-destructive" />
              <span className="text-sm text-destructive sm:whitespace-nowrap">
                Oh no! The code you entered is incorrect.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-[8px] p-2.5 bg-(--color-success-bg) mt-8.5 w-full sm:w-70">
              <CheckCircle2 className="size-4 shrink-0 text-(--color-success-alt)" />
              <span className="text-sm text-(--color-success-alt)">
                Successful
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mr-6 mb-6 mt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="w-19.75 h-10 px-4 py-2 rounded-(--radius) text-sm font-medium border border-(--color-border-disabled) bg-(--color-surface-10) text-(--color-dark-bg) hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleVerify}
            disabled={
              !isOtpFull || status === "loading" || status === "success"
            }
            className={cn(
              "h-10 px-4 py-2 rounded-(--radius) text-sm font-medium transition-colors border",
              isOtpFull
                ? "bg-(--color-secondary) text-(--color-surface-10) border-transparent"
                : "bg-(--color-surface-10) text-(--color-dark-bg) border-(--color-border-disabled)",
            )}
            style={{ width: status === "loading" ? 222 : 79 }}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying number...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </div>

        <DialogTitle className="sr-only">Phone number verification</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationContent() {
  const [alertStates, setAlertStates] = useState<Record<string, boolean>>({
    battery_low: true,
    predictive_depletion: false,
    panel_underperformance: true,
    load_spike: false,
  });
  const [phone, setPhone] = useState("");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    DELIVERY_CHANNELS.filter((c) => c.defaultChecked).map((c) => c.id),
  );
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [threshold, setThreshold] = useState("20%");

  const handleToggle = (id: string, val: boolean) => {
    setAlertStates((prev) => ({ ...prev, [id]: val }));
  };

  const hasPhone = phone.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--color-dark-text)">
          Notification Preferences
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how EnergyIQ keeps you updated about your energy system
        </p>
      </div>

      <SectionCard>
        <SectionHeader
          title="Alert Preference"
          description="Toggle the alerts you want to receive from EnergyIQ"
        />
        <div className="flex flex-col gap-4">
          {ALERT_ROWS.map((row) => (
            <AlertRow
              key={row.id}
              icon={row.icon}
              title={row.title}
              description={row.description}
              enabled={alertStates[row.id]}
              onToggle={(val) => handleToggle(row.id, val)}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="SMS & WhatsApp Delivery Route"
          description="Enter your number to get battery and load alerts on WhatsApp or SMS"
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-(--color-surface-100)">
              Phone number
            </span>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="flex shrink-0 items-center justify-between rounded-md border border-(--color-border-active) py-2 px-3 h-13 w-full sm:w-33.5 cursor-pointer gap-2 bg-card">
                <span className="text-sm font-medium text-(--color-surface-100) whitespace-nowrap">
                  NG +234
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0 text-muted-foreground"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Input
                type="tel"
                placeholder="e.g, 0807 423 8919"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-13 flex-1 rounded-[8px] border border-(--color-border-active) px-7 py-3.25 text-sm bg-(--color-surface-20) placeholder:text-muted-foreground focus-visible:border-(--color-border-active)"
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => hasPhone && setVerifyModalOpen(true)}
                className={cn(
                  "w-full sm:w-38.5 h-10 rounded-(--radius) text-sm font-medium transition-colors",
                  !hasPhone &&
                    "pointer-events-none bg-(--color-border-disabled) text-(--color-slate-60)",
                )}
              >
                Verify Number
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="Delivery Channels"
          description="Where should we send your notifications?"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {DELIVERY_CHANNELS.map((channel) => (
            <label
              key={channel.id}
              className="flex items-start gap-3 rounded-[8px] border border-(--color-border-active) px-7 py-3.25 bg-(--color-surface-20) cursor-pointer min-h-19.5"
            >
              <input
                type="checkbox"
                checked={selectedChannels.includes(channel.id)}
                onChange={(e) => {
                  setSelectedChannels((prev) =>
                    e.target.checked
                      ? [...prev, channel.id]
                      : prev.filter((id) => id !== channel.id),
                  );
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-(--color-border-active) accent-(--color-secondary) cursor-pointer"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-(--color-surface-100)">
                    {channel.label}
                  </span>
                  {"verified" in channel && channel.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-(--color-success-bg) text-(--color-success-alt)">
                      Verified
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground leading-snug truncate">
                  {channel.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            title="Alert Threshold"
            description="Set when battery alert should trigger"
          />
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setIsEditingThreshold((prev) => !prev)}
            className="shrink-0 w-full sm:w-38.5 h-10 rounded-(--radius) text-sm font-medium gap-1.5"
          >
            <Pencil className="size-4" />
            {isEditingThreshold ? "Save" : "Edit"}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium leading-none text-(--color-dark-card)">
            Battery warning threshold
          </span>
          <Input
            type="text"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            disabled={!isEditingThreshold}
            className={cn(
              "h-13 w-full rounded-[8px] border border-(--color-border-active) px-7 py-3.25 text-sm bg-(--color-surface-20) focus-visible:border-(--color-border-active)",
              !isEditingThreshold &&
                "opacity-75 cursor-not-allowed bg-(--color-surface-30)",
            )}
          />
        </div>
      </SectionCard>

      <VerifyModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onSuccess={() => setSuccessModalOpen(true)}
      />
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
}
