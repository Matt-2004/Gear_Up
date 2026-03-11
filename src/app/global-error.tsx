"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Catches crashes in the root layout itself — must be a minimal HTML document
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9fafb",
            padding: "1rem",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "28rem",
              borderRadius: "1rem",
              backgroundColor: "#ffffff",
              padding: "2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                margin: "0 auto 1rem",
                display: "flex",
                height: "3.5rem",
                width: "3.5rem",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
              }}
            >
              <AlertTriangle
                style={{
                  height: "1.75rem",
                  width: "1.75rem",
                  color: "#dc2626",
                }}
              />
            </div>
            <h1
              style={{
                marginBottom: "0.5rem",
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Application Error
            </h1>
            <p
              style={{
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              The application failed to load. Please refresh the page.
            </p>
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "#111827",
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#ffffff",
                cursor: "pointer",
                border: "none",
              }}
            >
              <RefreshCcw style={{ height: "1rem", width: "1rem" }} />
              Reload page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
