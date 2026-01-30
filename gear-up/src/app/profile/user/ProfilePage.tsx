"use client";

import { IUser } from "@/app/types/user.types";
import Input from "@/components/Common/Input";

import { Camera, Save, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { updateProfile } from "./action";

const ProfilePage = ({ data }: { data: IUser }) => {
  const [isDataChange, setIsDataChange] = useState<boolean>(false);
  const [input, setInput] = useState<Partial<IUser>>();
  const [originalInput, setOriginalInput] = useState<Partial<IUser>>();
  const formData = new FormData();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!data) return;
    setInput(data);
    setOriginalInput(data);
  }, []);

  useEffect(() => {
    if (!originalInput || !input) {
      setIsDataChange(false);
      return;
    }

    Object.entries(originalInput).map(([key]) => {
      if (
        (originalInput as Record<string, any>)[key] !==
        (input as Record<string, any>)[key]
      ) {
        formData.set(key, (input as Record<string, any>)[key]);
        setIsDataChange(true);
      }
    });
  }, [input]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        <form
          action={() => updateProfile(formData)}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Profile Header Section */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-12 relative">
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <div className="relative flex flex-col items-center gap-4">
              <div className="relative group">
                <Image
                  src={data.avatarUrl || "/default_profile.jpg"}
                  alt={data.name || "User Avatar"}
                  width={120}
                  height={120}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Camera className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold">{data.name}</h2>
                <p className="text-white/90 font-medium mt-1 px-3 py-1 bg-white/20 rounded-full inline-block">
                  {data.role}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  type="text"
                  value={input?.name}
                  placeholder={"John Doe"}
                  onChange={handleInput}
                  name="name"
                >
                  Full Name
                </Input>

                <Input
                  type={"text"}
                  value={input?.email}
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
                  value={input?.dateOfBirth}
                  onChange={handleInput}
                  name="dateOfBirth"
                  max={Date.now()}
                  min={"1990-01-01"}
                >
                  Date of Birth
                </Input>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {isDataChange ? (
                  <span className="flex items-center gap-2 text-orange-600">
                    <span className="h-2 w-2 bg-orange-600 rounded-full animate-pulse"></span>
                    Unsaved changes
                  </span>
                ) : (
                  "No changes made"
                )}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isDataChange}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-sm disabled:shadow-none"
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

export default ProfilePage;
