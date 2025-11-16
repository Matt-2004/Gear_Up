"use client";

import {ChangeEvent, useState} from "react";
import {ILoginFormData, IRegisterFormData, IForgotPassword, INewPassword, IProfileFormData} from "@/app/types/auth.types";
import {IAdminLogin} from "@/app/types/admin.types";



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
  : T extends "admin_login"
  ? IAdminLogin : null;


export type FormType =
  | "login"
  | "register"
  | "emailVerify"
  | "newPassword"
  | "profile"
  | "admin_login"

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
