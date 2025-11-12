"use client";

import { useState } from "react";

export interface IRegisterFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface INewPassword {
  newPassword: string;
  confirmedPassword: string;
}

export interface IProfileFormData {
  NewEmail: string;
  Name: string;
  AvatarImage: string;
  DateOfBirth: string;
  PhoneNumber: string;
  CurrentPassword: string;
  NewPassword: string;
  ConfirmedNewPassword: string;
}

export type DynamicForm<T extends FormType> = T extends "login"
  ? ILoginFormData
  : T extends "register"
  ? IRegisterFormData
  : T extends "emailVerify"
  ? IForgotPassword
  : T extends "newPassword"
  ? INewPassword
  : T extends "profile"
  ? IProfileFormData
  : never;

export type FormType =
  | "login"
  | "register"
  | "emailVerify"
  | "newPassword"
  | "profile";

export function useJSON<T extends FormType>(
  formType: T,
  initiate?: DynamicForm<T>
) {
  const [JSONData, setJSONData] = useState<DynamicForm<T>>(
    initiate as DynamicForm<T>
  );

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setJSONData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return {
    JSONData,
    handleChange,
  };
}
