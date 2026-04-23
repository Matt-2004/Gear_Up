"use client";

import { CreatePostData } from "@/app/features/post/types/post.types";
import { createContext, ReactNode, useContext, useState } from "react";

interface CreatePostContextType {
  postData: CreatePostData;
  updatePostData: (data: Partial<CreatePostData>) => void;
  resetPostData: () => void;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(
  undefined,
);

const initialPostData: CreatePostData = {
  caption: "",
  content: "",
  visibility: "Default",
  carId: "",
};

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
  const [postData, setPostData] = useState<CreatePostData>(initialPostData);

  const updatePostData = (data: Partial<CreatePostData>) => {
    setPostData((prev) => ({ ...prev, ...data }));
  };

  const resetPostData = () => {
    setPostData(initialPostData);
  };

  return (
    <CreatePostContext.Provider
      value={{ postData, updatePostData, resetPostData }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export const useCreatePostContext = () => {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error(
      "useCreatePostContext must be used within CreatePostProvider",
    );
  }
  return context;
};
