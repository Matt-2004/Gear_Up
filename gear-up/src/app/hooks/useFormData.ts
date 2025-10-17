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

type DynamicForm<T extends FormType> = T extends "login"
  ? ILoginFormData
  : IFormData;

type FormType = "login" | "register";

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
