import { useState } from "react";

interface IFormData {
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

interface IEmailVerify {
  email: string;
}

export interface INewPassword {
  newPassword: string;
  comfirmPassword: string;
}

type DynamicForm<T extends FormType> = T extends "login"
  ? ILoginFormData
  : T extends "register"
  ? IFormData
  : T extends "emailVerify"
  ? IEmailVerify
  : T extends "newPassword"
  ? INewPassword
  : null;

type FormType = "login" | "register" | "emailVerify" | "newPassword";

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
