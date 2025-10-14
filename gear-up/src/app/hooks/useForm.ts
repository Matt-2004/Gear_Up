import { useState } from "react";

type IFormData = Record<string, String | boolean | number | undefined>;

export const useForm = (
  initialValues: IFormData | null,
  onSubmit: (data: IFormData) => void
) => {
  const [formData, setFormData] = useState<IFormData>(initialValues || {});

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
