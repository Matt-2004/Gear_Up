"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, CircleXMark, XIcon } from "@/components/SVGs";
import clsx from "clsx";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    type: ToastType;
    message: string;
    duration: number;
}

type MessageType = "login" | "register" | "emailVerify" | "newPassword";
interface MessageRequireType {
    login: string;
    register: string;
    emailVerify: string;
    newPassword: string
}

export function useToast(refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<boolean, Error>>, type: MessageType) {

    const message: MessageRequireType = {
        login: "Login successful. Redirecting...",
        register: "Account created successful, Redirecting...",
        emailVerify: "Verification email sent. Please check your inbox.",
        newPassword: "Password updated successfully. Please login again!"
    }

    const errorMessage: MessageRequireType = {
        login: "Incorrect username or password.",
        register: "Registration failed. Please try again later.",
        emailVerify: "No account found with this email.",
        newPassword: "Failed to update password. Please try again."
    }

    const [toast, setToast] = useState<Toast | null>(null);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const showToast = (type: ToastType, message: string, duration = 5000) => {
        setToast({ id: Date.now(), type, message, duration });
        setTimeout(() => setToast(null), duration);
    };

    function handleToast(redirect: boolean) {
        setShow(true)
        setTimeout(() => {
            setShow(false)
            // if (redirect) router.push("/");
        }, 5000)
    }

    const handleToastContext = async () => {
        setLoading(true);
        try {
            // Start both the API call and minimum timer simultaneously
            const [result] = await Promise.all([
                refetch(),
                new Promise(resolve => setTimeout(resolve, 1200)) // Minimum 2 seconds
            ]);

            const { data, isError } = result;
            setLoading(false); // End loading after BOTH complete

            if (isError || !data) {
                showToast(
                    "error", errorMessage[type]

                );
                handleToast(false);
            } else if (data) {
                showToast("success", message[type]);
                handleToast(true);
            } else {
                showToast("error", "Login failed.");
                handleToast(false);
            }
        } catch (error) {
            setLoading(false);
            showToast("error", "An error occurred. Please try again.");
            handleToast(false);
        }
    }

    const ToastUI = () => (
        <AnimatePresence>
            {toast && (
                <motion.div
                    key={toast.id}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`fixed w-[350px] top-6 left-1/2 -translate-x-1/2  z-[9999]`}
                >
                    <div
                        className={`flex items-start justify-between gap-3 px-4 py-3 shadow-md border max-w-sm w-full
                            ${toast.type === "success" ? "bg-[#00a973] border-green-500" : ""}
                            ${toast.type === "error" ? "bg-red-400 border-red-500" : ""}
                            ${toast.type === "info" ? "bg-blue-400 border-blue-500" : ""}
                        `}
                    >
                        <div className="mt-1 text-green-500">
                            {toast.type === "success" ? <CircleCheck /> : <CircleXMark />}

                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-gray-200 text-base">
                                {toast.type === "success"
                                    ? "Success"
                                    : toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
                            </div>
                            <div className="text-sm text-gray-100">{toast.message}</div>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600"
                        >
                            <XIcon />
                        </button>
                    </div>

                    {/* ✅ Smooth progress animation handled by Framer Motion */}
                    <div className="h-1 bg-gray-200 overflow-hidden ">
                        <motion.div
                            className={clsx(toast.type === "success" ? "bg-green-500" : "bg-[#ff0000]", "h-1")}
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: toast.duration / 1000, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return { ToastUI, loading, show, handleToastContext };
}
