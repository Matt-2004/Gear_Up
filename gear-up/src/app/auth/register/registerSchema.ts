import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3).max(20),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain a lowercase letter" })
      .regex(/\d/, { message: "Must contain a digit" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain a special character",
      })
      .min(8, { message: "Must be at least 8 characters" }),
    retypePassword: z.string(),
  })
  .refine((data) => data.password === data.retypePassword, {
    path: ["retypePassword"],
    message: "Password do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
