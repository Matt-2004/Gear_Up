"use client";

import { useToast } from "@/app/features/toast/hooks/useToast";
import { UserItem } from "@/app/features/navbar/types/user.types";
import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import { updateUserProfile } from "@/app/shared/utils/API/UserAPI";
import {
  Bell,
  Camera,
  RotateCcw,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  FillDetailField,
  FillDetailInput,
  FillDetailLabel,
} from "@/app/features/dashboards/dealer/ui/add-car-form/FillDetailFormComponents";
import Button from "../../../../../shared/ui/Button";
import Input from "../../../../../shared/ui/Input";

// ─── types ──────────────────────────────────────────────────────────────────

type Tab = "profile" | "security" | "notifications";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
}

// ─── small helpers ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-4 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
    {children}
  </h3>
);

const inputCls =
  "focus:ring-primary w-full rounded-lg border border-gray-200 px-4 py-2 text-black placeholder:text-sm placeholder:text-gray-400 focus:bg-green-50 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

// ─── main component ───────────────────────────────────────────────────────────

type ProfileState = {
  input: UserItem | undefined;
  originalInput: UserItem | undefined;
  isDataChange: boolean;
  savingProfile: boolean;
  avatarPreview: string | null;
};

const DealerProfile = () => {
  const { user } = useUserData();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // ── profile state ──
  const [profileState, setProfileState] = useState<ProfileState>({
    input: undefined,
    originalInput: undefined,
    isDataChange: false,
    savingProfile: false,
    avatarPreview: null,
  });

  const updateProfileStates = (updates: Partial<ProfileState>) => {
    setProfileState((prev) => ({
      ...prev,
      ...updates,
    }));
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── security state ──
  const [pwForm, setPwForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  const [pwErrors, setPwErrors] = useState<Partial<PasswordForm>>({});
  const [savingPw, setSavingPw] = useState(false);

  // ── notifications state ──
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const { addToastMessage } = useToast({
    toastType: null,
    message: null,
  });

  // seed form from context
  useEffect(() => {
    if (!user) return;
    updateProfileStates({ input: user });
    updateProfileStates({ originalInput: user });
  }, [user]);

  // track dirty
  useEffect(() => {
    if (!profileState.originalInput || !profileState.input) {
      updateProfileStates({ isDataChange: false });
      return;
    }
    const changed = Object.keys(profileState.originalInput).some(
      (k) =>
        (profileState.originalInput as Record<string, any>)[k] !==
        (profileState.input as Record<string, any>)[k],
    );
    updateProfileStates({
      isDataChange: changed || profileState.avatarPreview !== null,
    });
  }, [
    profileState.input,
    profileState.avatarPreview,
    profileState.originalInput,
  ]);
  // ── handlers ──────────────────────────────────────────────────────────────

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (!profileState.input) return;
    updateProfileStates({ input: { ...profileState.input, [name]: value } });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateProfileStates({ avatarPreview: url });
  };

  const handleCancelProfile = () => {
    updateProfileStates({ input: profileState.originalInput });
    updateProfileStates({ avatarPreview: null });
  };

  const handleSaveProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateProfileStates({ savingProfile: true });
    try {
      const fd = new FormData();
      if (profileState.input) {
        Object.entries(profileState.input).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.set(k, String(v));
        });
      }
      if (fileInputRef.current?.files?.[0]) {
        fd.set("AvatarImage", fileInputRef.current.files[0]);
      }
      const res = await updateUserProfile(fd);
      if (res?.isSuccess) {
        updateProfileStates({ originalInput: profileState.input });
        updateProfileStates({ avatarPreview: null });
        addToastMessage("success", res.message ?? "Profile updated!");
      } else {
        addToastMessage(
          "error",
          res?.message ?? "Update failed. Please try again.",
        );
      }
    } catch (err: any) {
      addToastMessage(
        "error",
        err?.response?.data?.errorMessage ?? err?.message ?? "Update failed.",
      );
    } finally {
      updateProfileStates({ savingProfile: false });
    }
  };

  // basic password validation
  const validatePw = (): boolean => {
    const errs: Partial<PasswordForm> = {};
    if (!pwForm.currentPassword) errs.currentPassword = "Required";
    if (!pwForm.newPassword || pwForm.newPassword.length < 8)
      errs.newPassword = "At least 8 characters";
    if (pwForm.newPassword !== pwForm.confirmedNewPassword)
      errs.confirmedNewPassword = "Passwords do not match";
    setPwErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validatePw()) return;
    setSavingPw(true);
    try {
      const fd = new FormData();
      fd.set("CurrentPassword", pwForm.currentPassword);
      fd.set("NewPassword", pwForm.newPassword);
      fd.set("ConfirmedNewPassword", pwForm.confirmedNewPassword);
      const res = await updateUserProfile(fd);
      if (res?.isSuccess) {
        setPwForm({
          currentPassword: "",
          newPassword: "",
          confirmedNewPassword: "",
        });
        addToastMessage("success", "Password changed successfully!");
      } else {
        addToastMessage("error", res?.message ?? "Failed to change password.");
      }
    } catch (err: any) {
      addToastMessage(
        "error",
        err?.response?.data?.errorMessage ??
          err?.message ??
          "Failed to change password.",
      );
    } finally {
      setSavingPw(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    {
      id: "security",
      label: "Security",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
    },
  ];

  return (
    <div className=" bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* ── page header ──────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your dealership account preferences
          </p>
        </div>

        {/* ── tab bar ──────────────────────────────────────────── */}
        <div className="mb-6 flex gap-1 rounded-full bg-white shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-primary text-white shadow"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: PROFILE                                           */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* gradient hero */}
            <div className="bg-white relative px-8 py-10">
              <div className="relative flex flex-col items-center gap-3">
                {/* avatar */}
                <div className="group relative">
                  <Image
                    src={
                      profileState.avatarPreview ??
                      profileState.input?.avatarUrl ??
                      "/default_profile.jpg"
                    }
                    alt={profileState.input?.name ?? "Avatar"}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-0 bottom-0 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4 text-gray-700" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl text-black font-bold">
                    {profileState.input?.name}
                  </p>
                  <span className="mt-1 inline-block rounded-full text-primary bg-white/20 px-3 py-0.5 text-sm font-medium">
                    {profileState.input?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* form body */}
            <div className="p-8">
              <SectionTitle>Personal Information</SectionTitle>
              <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FillDetailField>
                  <FillDetailLabel label="Full Name" />
                  <FillDetailInput
                    type="text"
                    name="name"
                    value={profileState.input?.name ?? ""}
                    placeholder="John Doe"
                    onChange={handleInput}
                  />
                </FillDetailField>

                <FillDetailField>
                  <FillDetailLabel label="Full Name" />
                  <FillDetailInput
                    type="text"
                    name="name"
                    value={profileState.input?.email ?? ""}
                    placeholder="John Doe"
                    onChange={handleInput}
                  />
                </FillDetailField>

                <FillDetailField>
                  <FillDetailLabel label="Username" />
                  <FillDetailInput
                    type="text"
                    name="username"
                    value={profileState.input?.username ?? ""}
                    placeholder="my_dealership"
                    onChange={handleInput}
                  />
                </FillDetailField>

                <FillDetailField>
                  <FillDetailLabel label="Phone Number" />
                  <FillDetailInput
                    type="tel"
                    name="phoneNumber"
                    value={profileState.input?.phoneNumber ?? ""}
                    placeholder="+66-XX-XXX-XXXX"
                    onChange={handleInput}
                  />
                </FillDetailField>

                <FillDetailField>
                  <FillDetailLabel label="Date of Birth" />
                  <FillDetailInput
                    type="date"
                    name="dateOfBirth"
                    value={profileState.input?.dateOfBirth ?? ""}
                    placeholder="John Doe"
                    onChange={handleInput}
                  />
                </FillDetailField>

                <FillDetailField>
                  <FillDetailLabel label="Role" />
                  <FillDetailInput
                    type="text"
                    value={profileState.input?.role ?? ""}
                    disabled
                  />
                </FillDetailField>
              </div>

              {/* actions */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-500">
                  {profileState?.isDataChange ? (
                    <span className="flex items-center gap-2 text-orange-500">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                      Unsaved changes
                    </span>
                  ) : (
                    "No changes made"
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    disabled={!profileState.isDataChange}
                    className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <Button
                    type="button"
                    width="half"
                    onClick={(e) => handleSaveProfile(e)}
                    disabled={!profileState.isDataChange}
                    loading={profileState.savingProfile}
                  >
                    {profileState.savingProfile ? (
                      <RotateCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {profileState.savingProfile ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: SECURITY                                          */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* change password card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b border-gray-100 px-8 py-5">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-400">
                    Keep your account secure with a strong password
                  </p>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-5">
                  {(
                    [
                      {
                        id: "currentPassword" as const,
                        label: "Current Password",
                      },
                      { id: "newPassword" as const, label: "New Password" },
                      {
                        id: "confirmedNewPassword" as const,
                        label: "Confirm New Password",
                      },
                    ] as const
                  ).map(({ id, label }) => (
                    <FillDetailField key={id}>
                      <FillDetailLabel label={label} />
                      <Input
                        type="password"
                        value={pwForm[id]}
                        placeholder="••••••••"
                        onChange={(e) =>
                          setPwForm((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                      />
                    </FillDetailField>
                  ))}
                </div>

                {/* password strength hint */}
                {pwForm.newPassword.length > 0 && (
                  <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                    <p className="mb-1 font-semibold text-gray-600">
                      Password requirements
                    </p>
                    {[
                      {
                        ok: pwForm.newPassword.length >= 8,
                        text: "At least 8 characters",
                      },
                      {
                        ok: /[A-Z]/.test(pwForm.newPassword),
                        text: "One uppercase letter",
                      },
                      {
                        ok: /[0-9]/.test(pwForm.newPassword),
                        text: "One number",
                      },
                      {
                        ok: /[^A-Za-z0-9]/.test(pwForm.newPassword),
                        text: "One special character",
                      },
                    ].map((r) => (
                      <p
                        key={r.text}
                        className={`flex items-center gap-1.5 ${r.ok ? "text-green-600" : "text-gray-400"}`}
                      >
                        <span>{r.ok ? "✓" : "○"}</span> {r.text}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                  <Button
                    width="half"
                    type="button"
                    onClick={(e) => handleSavePassword(e)}
                    disabled={savingPw}
                  >
                    {savingPw ? (
                      <RotateCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {savingPw ? "Saving…" : "Update Password"}
                  </Button>
                </div>
              </div>
            </div>

            {/* account info card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b border-gray-100 px-8 py-5">
                <p className="font-semibold text-gray-900">
                  Account Information
                </p>
                <p className="text-sm text-gray-400">
                  Read-only details about your account
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2">
                {[
                  { label: "User ID", value: user?.id ?? "—" },
                  { label: "Role", value: user?.role ?? "—" },
                  { label: "Sign-in Provider", value: user?.provider ?? "—" },
                  { label: "Username", value: user?.username ?? "—" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate font-medium text-gray-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: NOTIFICATIONS                                     */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "notifications" && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">
                  <Bell className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Notification Preferences
                  </p>
                  <p className="text-sm text-gray-400">
                    Choose how you want to be notified
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 px-8">
              {(
                [
                  {
                    id: "email" as const,
                    title: "Email Notifications",
                    desc: "Receive updates about your listings and appointments via email",
                  },
                  {
                    id: "push" as const,
                    title: "Push Notifications",
                    desc: "Get real-time alerts on new enquiries and test-drive requests",
                  },
                  {
                    id: "marketing" as const,
                    title: "Marketing & Promotions",
                    desc: "Stay informed about Gear Up tips, features, and offers",
                  },
                ] as const
              ).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-5"
                >
                  <div className="pr-8">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="mt-0.5 text-sm text-gray-400">{item.desc}</p>
                  </div>
                  {/* toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                      notifications[item.id] ? "bg-primary-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        notifications[item.id]
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-gray-100 px-8 py-5">
              <button
                type="button"
                onClick={() =>
                  addToastMessage("success", "Notification preferences saved!")
                }
                className="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex items-center gap-2 rounded-xl bg-linear-to-r px-6 py-2 font-semibold text-white shadow transition-all"
              >
                <Save className="h-4 w-4" />
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerProfile;
