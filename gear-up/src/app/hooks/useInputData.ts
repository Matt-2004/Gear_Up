"use client";

import {ChangeEvent, useState} from "react";
import {ILoginFormData, IRegisterFormData, IForgotPassword, INewPassword, IProfileFormData} from "@/app/types/auth.types";



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

export function useInputData<T extends FormType>(
  formType: T,
  initiate?: DynamicForm<T>
) {
  const [inputData, setInputData] = useState<DynamicForm<T>>(
    initiate as DynamicForm<T>
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
