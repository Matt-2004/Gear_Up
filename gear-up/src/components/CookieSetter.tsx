"use client";

import { useUserData } from "@/Context/UserDataContext";
import { useEffect } from "react";

export default function CookieSetter() {
    const { user } = useUserData();

    useEffect(() => {
        if (user?.id && user?.role) {

            // Set cookie via API route
            fetch("/api/set-user-cookie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id, role: user.role }),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((data) => {
                            throw new Error(data.message || "Failed to set cookie");
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Cookie set successfully:", data);
                })
                .catch((error) => {
                    console.error("Failed to set user_id cookie:", error);
                });
        }
    }, [user?.id, user?.role]);

    return null;
}
