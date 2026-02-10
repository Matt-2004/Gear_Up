"use client";

import { useEffect } from "react";

interface CookieSetterProps {
    userId: string | null;
}

export default function CookieSetter({ userId }: CookieSetterProps) {
    useEffect(() => {
        if (userId) {
            // Set cookie via API route
            fetch("/api/set-user-cookie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            }).catch((error) => {
                console.error("Failed to set user_id cookie:", error);
            });
        }
    }, [userId]);

    return null;
}
