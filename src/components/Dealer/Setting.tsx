"use client";

import { useToast } from "@/app/hooks/useToast";
import { UserItem } from "@/types/user.types";
import { useUserData } from "@/Context/UserDataContext";
import { updateUserProfile } from "@/utils/API/UserAPI";
import { AnimatePresence } from "framer-motion";
import {
  Bell,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

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

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex w-full flex-col gap-1">
    <label className="text-sm font-semibold text-gray-500">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "focus:ring-primary w-full rounded-lg border border-gray-200 px-4 py-2 text-black placeholder:text-sm placeholder:text-gray-400 focus:bg-green-50 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

// ─── main component ───────────────────────────────────────────────────────────

const Setting = () => {
  const { user } = useUserData();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // ── profile state ──
  const [input, setInput] = useState<UserItem | undefined>();
  const [originalInput, setOriginalInput] = useState<UserItem | undefined>();
  const [isDataChange, setIsDataChange] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── security state ──
  const [pwForm, setPwForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });
  const [showPw, setShowPw] = useState<Record<keyof PasswordForm, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmedNewPassword: false,
  });
  const [pwErrors, setPwErrors] = useState<Partial<PasswordForm>>({});
  const [savingPw, setSavingPw] = useState(false);

  // ── notifications state ──
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const { ToastComponent, addToastMessage } = useToast({
    toastType: null,
    message: null,
  });

  // seed form from context
  useEffect(() => {
    if (!user) return;
    setInput(user);
    setOriginalInput(user);
  }, [user]);

  // track dirty
  useEffect(() => {
    if (!originalInput || !input) {
      setIsDataChange(false);
      return;
    }
    const changed = Object.keys(originalInput).some(
      (k) =>
        (originalInput as Record<string, any>)[k] !==
        (input as Record<string, any>)[k],
    );
    setIsDataChange(changed || avatarPreview !== null);
  }, [input, avatarPreview, originalInput]);

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInput((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleCancelProfile = () => {
    setInput(originalInput);
    setAvatarPreview(null);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const fd = new FormData();
      if (input) {
        Object.entries(input).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.set(k, String(v));
        });
      }
      if (fileInputRef.current?.files?.[0]) {
        fd.set("AvatarImage", fileInputRef.current.files[0]);
      }
      const res = await updateUserProfile(fd);
      if (res?.isSuccess) {
        setOriginalInput(input);
        setAvatarPreview(null);
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
      setSavingProfile(false);
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

  const handleSavePassword = async () => {
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
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>

      <div className="mx-auto max-w-4xl">
        {/* ── page header ──────────────────────────────────────── */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-primary-500 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow">
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your dealership account preferences
            </p>
          </div>
        </div>

        {/* ── tab bar ──────────────────────────────────────────── */}
        <div className="mb-6 flex gap-1 rounded-2xl bg-white p-1.5 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-primary-500 text-white shadow"
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
            <div className="from-primary-500 to-primary-600 relative bg-linear-to-r px-8 py-10">
              <div className="absolute inset-0 bg-black/5" />
              <div className="relative flex flex-col items-center gap-3">
                {/* avatar */}
                <div className="group relative">
                  <Image
                    src={
                      avatarPreview ??
                      input?.avatarUrl ??
                      "/default_profile.jpg"
                    }
                    alt={input?.name ?? "Avatar"}
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
                <div className="text-center text-white">
                  <p className="text-xl font-bold">{input?.name}</p>
                  <span className="mt-1 inline-block rounded-full bg-white/20 px-3 py-0.5 text-sm font-medium">
                    {input?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* form body */}
            <div className="p-8">
              <SectionTitle>Personal Information</SectionTitle>
              <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Field label="Full Name">
                  <input
                    className={inputCls}
                    type="text"
                    name="name"
                    value={input?.name ?? ""}
                    placeholder="John Doe"
                    onChange={handleInput}
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    className={inputCls}
                    type="email"
                    name="email"
                    value={input?.email ?? ""}
                    placeholder="dealer@example.com"
                    onChange={handleInput}
                  />
                </Field>

                <Field label="Username">
                  <input
                    className={inputCls}
                    type="text"
                    name="username"
                    value={input?.username ?? ""}
                    placeholder="my_dealership"
                    onChange={handleInput}
                  />
                </Field>

                <Field label="Phone Number">
                  <input
                    className={inputCls}
                    type="tel"
                    name="phoneNumber"
                    value={input?.phoneNumber ?? ""}
                    placeholder="+66-XX-XXX-XXXX"
                    onChange={handleInput}
                  />
                </Field>

                <Field label="Date of Birth">
                  <input
                    className={inputCls}
                    type="date"
                    name="dateOfBirth"
                    value={input?.dateOfBirth ?? ""}
                    max={new Date().toISOString().split("T")[0]}
                    min="1950-01-01"
                    onChange={handleInput}
                  />
                </Field>

                <Field label="Role">
                  <input
                    className={inputCls}
                    type="text"
                    value={input?.role ?? ""}
                    disabled
                  />
                </Field>
              </div>

              {/* actions */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-500">
                  {isDataChange ? (
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
                    disabled={!isDataChange}
                    className="flex items-center gap-2 rounded-xl border-2 border-gray-300 px-5 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={!isDataChange || savingProfile}
                    className="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex items-center gap-2 rounded-xl bg-linear-to-r px-6 py-2 font-semibold text-white shadow transition-all disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                  >
                    {savingProfile ? (
                      <RotateCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {savingProfile ? "Saving…" : "Save Changes"}
                  </button>
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
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                    <KeyRound className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Change Password
                    </p>
                    <p className="text-sm text-gray-400">
                      Keep your account secure with a strong password
                    </p>
                  </div>
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
                    <Field key={id} label={label}>
                      <div className="relative">
                        <input
                          className={inputCls + " pr-10"}
                          type={showPw[id] ? "text" : "password"}
                          value={pwForm[id]}
                          placeholder="••••••••"
                          onChange={(e) =>
                            setPwForm((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPw((prev) => ({
                              ...prev,
                              [id]: !prev[id],
                            }))
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPw[id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {pwErrors[id] && (
                        <p className="mt-1 text-xs text-red-500">
                          {pwErrors[id]}
                        </p>
                      )}
                    </Field>
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
                  <button
                    type="button"
                    onClick={handleSavePassword}
                    disabled={savingPw}
                    className="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex items-center gap-2 rounded-xl bg-linear-to-r px-6 py-2 font-semibold text-white shadow transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingPw ? (
                      <RotateCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {savingPw ? "Saving…" : "Update Password"}
                  </button>
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

export default Setting;
