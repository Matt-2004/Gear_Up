"use client";

import { IAdminLogin } from "@/types/admin.types";
import {
  ForgetPasswordDTO,
  LoginDTO,
  NewPasswordDTO,
  ProfileDTO,
  RegisterDTO,
} from "@/types/auth.types";
import { ChangeEvent, useState } from "react";

export type DynamicForm<T extends FormType> = T extends "login"
  ? LoginDTO
  : T extends "register"
    ? RegisterDTO
    : T extends "emailVerify"
      ? ForgetPasswordDTO
      : T extends "newPassword"
        ? NewPasswordDTO
        : T extends "profile"
          ? ProfileDTO
          : T extends "admin_login"
            ? IAdminLogin
            : null;

export type FormType =
  | "login"
  | "register"
  | "emailVerify"
  | "newPassword"
  | "profile"
  | "admin_login";

export function useInputData<T extends FormType>(
  formType: T,
  initiate?: DynamicForm<T>,
) {
  const [inputData, setInputData] = useState<DynamicForm<T>>(
    initiate as DynamicForm<T>,
  );

  const handleInputChange = (e: ChangeEvent) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setInputData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return {
    inputData,
    handleInputChange,
  };
}
