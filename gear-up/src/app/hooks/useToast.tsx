"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, CircleXMark, XIcon } from "@/components/SVGs";
import clsx from "clsx";


export type ToastType = "success" | "error" | "info" ;

interface Toast {
    toastType: ToastType;
    message: string | null;
}

export function useToast({toastType, message}: Toast ) {

    const [toast, setToast] = useState<Toast>(
        {
            toastType: toastType,
            message: message,
        }
    );

    const addToastMessage = (toastType: ToastType, message: string) => {
        setToast({toastType, message});
    }

    const removeToastMessage = (toastType: ToastType, message = null) => {
        setToast({toastType, message});
    }

    const ToastComponent = () => {
        if(toast?.toastType !==  null && toast?.message !== null) {
            return (
                <AnimatePresence>
                    {toast && (
                        <motion.div

                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`fixed w-[350px] top-6 left-1/2 -translate-x-1/2  z-[9999]`}
                        >
                            <div
                                className={`flex items-start justify-between gap-3 px-4 py-3 shadow-md border max-w-sm w-full
                            ${toast.toastType === "success" ? "bg-[#00a973] border-green-500" : ""}
                            ${toast.toastType === "error" ? "bg-red-400 border-red-500" : ""}
                            ${toast.toastType === "info" ? "bg-blue-400 border-blue-500" : ""}
                        `}
                            >
                                <div className="mt-1 text-green-500">
                                    {toast.toastType === "success" ? <CircleCheck /> : <CircleXMark />}

                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-200 text-base">
                                        {
                                            toast.toastType?.charAt(0).toUpperCase() + toast.toastType?.substring(1)
                                        }
                                    </div>
                                    <div className="text-sm text-gray-100">{toast.message}</div>
                                </div>
                                <button
                                    onClick={() => (false)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600"
                                >
                                    <XIcon />
                                </button>
                            </div>

                            {/* ✅ Smooth progress animation handled by Framer Motion */}
                            <div className="h-1 bg-gray-200 overflow-hidden ">
                                <motion.div
                                    className={clsx(toast.toastType === "success" ? "bg-green-500" : "bg-[#ff0000]", "h-1")}
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 4000 / 1000, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )
        }
    }


    return { ToastComponent, setToast, addToastMessage, removeToastMessage };
}
