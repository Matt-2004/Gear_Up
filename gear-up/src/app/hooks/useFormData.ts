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
  newEmail: "string";
  name: "string";
  avatarUrl: "string";
  dateOfBirth: "2025-10-27";
  phoneNumber: "string";
  currentPassword: "string";
  newPassword: "string";
  confirmedNewPassword: "string";
}

type DynamicForm<T extends FormType> = T extends "login"
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

type FormType =
  | "login"
  | "register"
  | "emailVerify"
  | "newPassword"
  | "profile";

export function useFormData<T extends FormType>(formType: T) {
  const [formData, setFormData] = useState<DynamicForm<T>>(
    {} as DynamicForm<T>
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return {
    formData,
    handleChange,
  };
}
