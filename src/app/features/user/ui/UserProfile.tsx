"use client";

import { useToast } from "@/app/features/toast/hooks/useToast";
import { UserItem } from "@/app/features/navbar/types/user.types";
import Input from "@/app/shared/ui/Input";
import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import { updateUserProfile } from "@/app/shared/utils/API/UserAPI";
import { Camera, Save, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const UserProfile = () => {
  const { user } = useUserData();
  const [isDataChange, setIsDataChange] = useState<boolean>(false);
  const [input, setInput] = useState<UserItem>();
  const [originalInput, setOriginalInput] = useState<UserItem>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addToastMessage, removeToastMessage } = useToast({
    toastType: "success",
    message: null,
  });

  // original data
  // when user change data, set to input and compare with original data to check if there is any change

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setInput((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (!user) return;
    setInput(user);
    setOriginalInput(user);
  }, [user]);

  useEffect(() => {
    if (!originalInput || !input) {
      setIsDataChange(false);
      return;
    }

    const changed = Object.keys(originalInput).some(
      (key) =>
        (originalInput as Record<string, any>)[key] !==
        (input as Record<string, any>)[key],
    );

    setIsDataChange(changed || !!avatarFile);
  }, [input, originalInput, avatarFile]);

  const handleAvatarPick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setIsDataChange(true);
  };

  const handleCancel = () => {
    setInput(originalInput);
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsDataChange(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !originalInput) return;

    const formData = new FormData();

    Object.keys(originalInput).forEach((key) => {
      const prev = (originalInput as Record<string, any>)[key];
      const next = (input as Record<string, any>)[key];
      if (prev !== next) formData.set(key, next ?? "");
    });

    if (avatarFile) formData.set("AvaterImage", avatarFile);

    if (![...formData.keys()].length) return;
    await updateProfile(formData);
  };

  async function updateProfile(formData: FormData) {
    try {
      const res = await updateUserProfile(formData);
      if (res?.isSuccess) {
        setIsDataChange(false);
        setOriginalInput(input);
        setAvatarFile(null);
        addToastMessage("success", res.message);
      }
      setTimeout(() => {
        removeToastMessage();
      }, 2500);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          {/* Profile Header Section */}
          <div className="from-primary-500 to-primary-600 relative bg-linear-to-r px-4 py-8 sm:px-8 sm:py-12">
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <div className="relative flex flex-col items-center gap-4">
              <div className="group relative">
                <Image
                  src={
                    avatarPreview || input?.avatarUrl || "/default_profile.jpg"
                  }
                  alt={input?.name || "User Avatar"}
                  width={120}
                  height={120}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="avatarImage"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  onClick={handleAvatarPick}
                  className="absolute cursor-pointer right-0 bottom-0 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50"
                  aria-label="Change profile image"
                >
                  <Camera className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold">{input?.name}</h2>
                <p className="mt-1 inline-block rounded-full bg-white/20 px-3 py-1 font-medium text-white/90">
                  {input?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="p-4 sm:p-8">
            <div className="mb-6">
              <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Input
                  type="text"
                  value={input?.name ?? ""}
                  placeholder={"John Doe"}
                  onChange={handleInput}
                  name="name"
                >
                  Full Name
                </Input>

                <Input
                  type={"text"}
                  value={input?.email ?? ""}
                  placeholder={"test@email.com"}
                  onChange={handleInput}
                  name="email"
                >
                  Email Address
                </Input>

                <Input
                  type="tel"
                  value={input?.phoneNumber ?? ""}
                  onChange={handleInput}
                  name="phoneNumber"
                  placeholder="+66-XX-XXX-XXXX"
                >
                  Phone Number
                </Input>

                <Input
                  type="date"
                  value={input?.dateOfBirth ?? ""}
                  onChange={handleInput}
                  name="dateOfBirth"
                  max={new Date().toISOString().split("T")[0]}
                  min={"1990-01-01"}
                >
                  Date of Birth
                </Input>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                {isDataChange ? (
                  <span className="flex items-center gap-2 text-orange-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-orange-600"></span>
                    Unsaved changes
                  </span>
                ) : (
                  "No changes made"
                )}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isDataChange}
                  className="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex items-center gap-2 rounded-lg bg-linear-to-r px-6 py-2.5 font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
