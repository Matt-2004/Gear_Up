"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { CreatePostDTO } from "../types/post.dto";

interface CreatePostContextType {
  postData: CreatePostDTO;
  updatePostData: (data: Partial<CreatePostDTO>) => void;
  resetPostData: () => void;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(
  undefined,
);

const initialPostData: CreatePostDTO = {
  caption: "",
  content: "",
  visibility: "Default",
  carId: "",
};

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
  const [postData, setPostData] = useState<CreatePostDTO>(initialPostData);

  const updatePostData = (data: Partial<CreatePostDTO>) => {
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
