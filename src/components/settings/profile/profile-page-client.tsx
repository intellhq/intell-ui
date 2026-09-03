"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Check, Loader2, Upload } from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileQueries } from "@/hooks/use-profile-queries";
import { SelectField } from "@/components/settings/select-field";
import { PhotoUploadDialog } from "./photo-upload-dialog";
import { PhotoSuccessDialog } from "./photo-success-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { ProfileUpdateRequest } from "@/types/profile";
import { ProfileService } from "@/services/profile-service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_TYPES,
  NIGERIAN_STATES,
  CITIES_BY_STATE,
} from "@/constants/profile";
import { SavingsSetupSettingsSection } from "./savings-setup-settings-section";

const profileSchema = z.object({
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  businessName: z.string().trim().optional(),
  businessType: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


export function ProfilePageClient() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const { usePersonalSettings, useUpdateProfile, useDeleteAccount } =
    useProfileQueries();
  const {
    data: personalSettings,
    isLoading: isLoadingPersonalSettings,
  } = usePersonalSettings();

  const [isEditing, setIsEditing] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = React.useState(false);
  const [photoSuccessOpen, setPhotoSuccessOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const profileValues = React.useMemo<ProfileFormValues>(
    () => ({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      businessName:
        personalSettings?.businessName ?? user?.businessName ?? "",
      businessType:
        personalSettings?.businessType ?? user?.businessType ?? "",
      state: personalSettings?.state ?? user?.state ?? "",
      city: personalSettings?.city ?? user?.city ?? "",
    }),
    [
      personalSettings?.businessName,
      personalSettings?.businessType,
      personalSettings?.city,
      personalSettings?.state,
      user?.businessName,
      user?.businessType,
      user?.city,
      user?.firstName,
      user?.lastName,
      user?.state,
    ],
  );

  const { mutate: deleteAccount, isPending: deletePending } = useDeleteAccount(() => {
    setDeleteDialogOpen(false);
    logout();
    router.replace("/login");
  });

  const handleDeleteConfirm = () => {
    if (!user?.id) {
      toast.error("Unable to delete account right now. Please refresh and try again.");
      return;
    }
    deleteAccount(user.id);
  };
  const resolvedLang = (user?.aiLanguage ?? "").toLowerCase();
  const initialLang =
    resolvedLang === "pidgin" || resolvedLang === "english" ? resolvedLang : "";
  const [aiLanguage, setAiLanguage] = React.useState(initialLang);
  const [langSaving, setLangSaving] = React.useState(false);

  const [prevInitialLang, setPrevInitialLang] = React.useState(initialLang);
  if (initialLang !== prevInitialLang) {
    setAiLanguage(initialLang);
    setPrevInitialLang(initialLang);
  }

  const handleLanguageSave = async () => {
    if (!aiLanguage || langSaving) return;
    setLangSaving(true);
    try {
      const updated = await ProfileService.updateProfile({ aiLanguage });
      if (user) {
        setUser({
          ...user,
          aiLanguage,
          ...updated,
        });
      }
      toast.success("AI Preferred Language updated successfully", { duration: 4000 });
    } catch {
      toast.error("Failed to save language preference. Please try again.");
    } finally {
      setLangSaving(false);
    }
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileValues,
  });

  const selectedState = useWatch({ control, name: "state" });
  const cityOptions = selectedState
    ? (CITIES_BY_STATE[selectedState] ?? [])
    : [];

  React.useEffect(() => {
    if (!isEditing) {
      reset(profileValues);
    }
  }, [profileValues, isEditing, reset]);

  React.useEffect(() => {
    if (!personalSettings || !user) return;

    const nextUser = {
      ...user,
      businessName: personalSettings.businessName ?? user.businessName,
      businessType: personalSettings.businessType ?? user.businessType,
      state: personalSettings.state ?? user.state,
      city: personalSettings.city ?? user.city,
      aiLanguage: personalSettings.aiLanguage ?? user.aiLanguage,
      profilePhoto: personalSettings.profileUrl ?? user.profilePhoto,
      profileUrl: personalSettings.profileUrl ?? user.profileUrl,
    };

    if (
      nextUser.businessName !== user.businessName ||
      nextUser.businessType !== user.businessType ||
      nextUser.state !== user.state ||
      nextUser.city !== user.city ||
      nextUser.aiLanguage !== user.aiLanguage ||
      nextUser.profilePhoto !== user.profilePhoto ||
      nextUser.profileUrl !== user.profileUrl
    ) {
      setUser(nextUser);
    }
  }, [personalSettings, setUser, user]);

  const updateProfile = useUpdateProfile(() => {
    setIsEditing(false);
    setProfileSaved(true);
  });

  const onSubmit = (values: ProfileFormValues) => {
    // Only send fields with non-empty values to avoid backend errors
    const updatedFields: Partial<ProfileUpdateRequest> = {};
    
    if (values.firstName?.trim()) updatedFields.firstName = values.firstName.trim();
    if (values.lastName?.trim()) updatedFields.lastName = values.lastName.trim();
    if (values.businessName?.trim()) updatedFields.businessName = values.businessName.trim();
    if (values.businessType?.trim()) updatedFields.businessType = values.businessType.trim();
    if (values.state?.trim()) updatedFields.state = values.state.trim();
    if (values.city?.trim()) updatedFields.city = values.city.trim();
    
    updateProfile.mutate(updatedFields as ProfileUpdateRequest);
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    reset(profileValues);
  };

  const sectionTitle = profileSaved
    ? "User Profile"
    : "Personal and Business Information.";
  const profilePhoto = user?.profilePhoto ?? user?.profileUrl;
  const hasPhoto = !!profilePhoto;

  if (!user || isLoadingPersonalSettings) {
    return (
      <div className="space-y-4">
        <div className="mb-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-muted/70" />
        </div>
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">Profile Settings</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Manage your personal and business information.
        </p>
      </div>

      {/* Profile Photo Section */}
      <div className="mb-4 rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-dark-text">
          Profile Photo
        </h2>
        <p className="mt-0.5 text-sm text-[#5D5C5D]">PNG or JPG, up to 2MB.</p>

        <div className="mt-4 flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D1D5DB]">
            {hasPhoto ? (
              <Image
                src={profilePhoto!}
                alt="Profile photo"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-[#374151]">
                {user
                  ? `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
                    "AA"
                  : "AA"}
              </span>
            )}
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={() => setPhotoDialogOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-dark-text hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" />
            {hasPhoto ? "Upload new photo" : "Upload photo"}
          </button>
        </div>
      </div>

      {/* Personal Business and Information */}
      <div className="rounded-xl border border-border bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-dark-text">
                {sectionTitle}
              </h2>
              <p className="mt-0.5 text-sm text-[#5D5C5D]">
                This information is used across your INTELL account.
              </p>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/90 sm:w-auto"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            ) : updateProfile.isPending ? (
              <button
                type="button"
                disabled
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-white opacity-80 cursor-not-allowed"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </button>
            ) : (
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-dark-text hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-white hover:bg-secondary/90 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                First name
              </label>
              <input
                {...register("firstName")}
                disabled={!isEditing}
                placeholder="First name"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-default"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Last name
              </label>
              <input
                {...register("lastName")}
                disabled={!isEditing}
                placeholder="Last name"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-default"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Email
              </label>
              <input
                value={user?.email ?? ""}
                disabled
                readOnly
                placeholder="Email"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none disabled:opacity-60 disabled:cursor-default"
              />
            </div>

            {/* Business name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Business name
              </label>
              <input
                {...register("businessName")}
                disabled={!isEditing}
                placeholder="Business name"
                className="h-14 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-default"
              />
              {errors.businessName && (
                <p className="text-xs text-red-500">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            {/* Business type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                Business type
              </label>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <SelectField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={BUSINESS_TYPES}
                    placeholder="Select business type"
                    disabled={!isEditing}
                  />
                )}
              />
              {errors.businessType && (
                <p className="text-xs text-red-500">
                  {errors.businessType.message}
                </p>
              )}
            </div>

            {/* State */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">
                State
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <SelectField
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("city", "", { shouldValidate: true });
                    }}
                    options={NIGERIAN_STATES}
                    placeholder="Select state"
                    disabled={!isEditing}
                  />
                )}
              />
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state.message}</p>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-text">City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <SelectField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={cityOptions}
                    placeholder={
                      selectedState ? "Select city" : "Select state first"
                    }
                    disabled={!isEditing || !selectedState}
                  />
                )}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      <SavingsSetupSettingsSection />

      {/* ── AI Preferences ─────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-text">
            AI Preferences
          </h2>
          <p className="mt-0.5 text-sm text-[#5D5C5D]">
            Choose the language INTELL AI responds in.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xs">
            <label className="mb-1.5 block text-sm font-medium text-dark-text">
              Response language
            </label>
            <SelectField
              value={
                aiLanguage === "english"
                  ? "English"
                  : aiLanguage === "pidgin"
                  ? "Nigerian Pidgin"
                  : ""
              }
              onChange={(val) => {
                if (val === "English") {
                  setAiLanguage("english");
                } else if (val === "Nigerian Pidgin") {
                  setAiLanguage("pidgin");
                } else {
                  setAiLanguage("");
                }
              }}
              options={["English", "Nigerian Pidgin"]}
              placeholder="Select language (default: auto-detect)"
            />
          </div>

          <Button
            type="button"
            disabled={!aiLanguage || langSaving || initialLang === aiLanguage}
            onClick={() => void handleLanguageSave()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto hover:text-white"
          >
            {langSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              "Save Preference"
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-[#5D5C5D]">
          If not set, the AI detects the language from each message automatically.
        </p>
      </div>

      {/* ── Danger Zone ── */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-destructive">
              Danger Zone
            </h2>
            <p className="mt-0.5 text-sm text-[#5D5C5D]">
              Permanently delete your account and all associated data. This action is irreversible.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-destructive px-4 text-sm font-medium text-white hover:text-white transition-colors hover:bg-destructive/90 sm:w-auto cursor-pointer"
          >
            Delete Account
          </Button>
        </div>
      </div>

      <PhotoUploadDialog
        open={photoDialogOpen}
        onOpenChange={setPhotoDialogOpen}
        onUploadSuccess={() => setPhotoSuccessOpen(true)}
      />

      <PhotoSuccessDialog
        open={photoSuccessOpen}
        onOpenChange={setPhotoSuccessOpen}
      />

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isPending={deletePending}
      />
    </div>
  );
}
