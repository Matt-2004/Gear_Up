import { useEffect, useState, useTransition } from "react";
import { useToast } from "../hooks/useToast";
import { useRouter } from "next/dist/client/components/navigation";
import z, { ZodSchema } from "zod";


export const useAuthForm = <T>(
    initialFormData: T, 
    schema: ZodSchema,
    submit: (formData: FormData) => Promise<void>
) => {
    // input store
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isButtonActive, setIsButtonActive] = useState(false)
    const [formData, setFormData] = useState<T>(initialFormData);
    const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
    toastType: "success",
    message: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
        

    // input validation
    useEffect(() => {
         
        const validationResult = schema.safeParse(formData);
    
        if (!validationResult.success) {
          const fieldErrors = validationResult.error.flatten().fieldErrors as Record<string, string[]>;

          const formattedErrors = Object.keys(fieldErrors).reduce(
            (acc: Record<string, string>, key) => {
              console.log(acc, key)
              acc[key] = fieldErrors[key]?.[0] || "Invalid input";
              return acc;
            },
            {} as Record<string, string>
          );

          setErrors(formattedErrors);
          setIsButtonActive(false);
        } else {
          setErrors({});
          setIsButtonActive(true);
        }
      }, [formData]);

    // action handler for form submission
    const handleSubmit = async (formData: FormData) => {
        try {
            startTransition(async () => {
                const res = await submit(formData);
              
                    addToastMessage(
                        "success", "Login Successful! Redirecting to dashboard...",
                    )
                router.push("/dashboard");
                }
            )    
        } catch (error) {
            addToastMessage(
                "error", "An error occurred while submitting the form.",
            );
        } finally {
             setTimeout(() => {
                removeToastMessage();
                router.push("/")
            }, 2500);
        }
       
    };

  return {
    isPending,
    isButtonActive,
    formData,
    setFormData,
    setIsButtonActive,
    ToastComponent,
    errors,
    handleSubmit
  };
};