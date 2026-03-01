import z, { email } from "zod";

export const LoginSchema = z.object({
  usernameOrEmail: z.email({
    message: "Invalid email format, end with @gmail.com, @yahoo.com, etc.",
  }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password is too long")
    .regex(/[a-z]/, "- Must Contain at least one lowercase letter")
    .regex(/[0-9]/, "- Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "- Must contain at least one symbol"),
});


export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username is too long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),

    email: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password is too long")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one symbol"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms and conditions",
    }), 
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ResetPasswordSchema = z.object({
   newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password is too long")
    .regex(/[a-z]/, "- Must Contain at least one lowercase letter")
    .regex(/[0-9]/, "- Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "- Must contain at least one symbol"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
})

export const sendEmailSchema = z.object({
  email: z.email({
    message: "Invalid email format, end with @gmail.com, @yahoo.com, etc.",
  })})