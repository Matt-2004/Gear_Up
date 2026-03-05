"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ActionButtons() {
    const router = useRouter()
    const [showAuthModal, setShowAuthModal] = useState(false)

    const checkAuthAndNavigate = (path: string) => {
        // Check if user_id cookie exists
        const hasUserCookie = document.cookie
            .split("; ")
            .some((cookie) => cookie.startsWith("user_id="))

        if (hasUserCookie) {
            // User is authenticated, navigate to the page
            router.push(path)
        } else {
            // User is not authenticated, show modal
            setShowAuthModal(true)
        }
    }

    return (
        <>
            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    onClick={() => checkAuthAndNavigate("/car/search")}
                    className="rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                    Explore Cars
                </button>
                <button
                    onClick={() => checkAuthAndNavigate("/post/discover")}
                    className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Discover Posts
                </button>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setShowAuthModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                                <svg
                                    className="h-6 w-6 text-primary-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">
                                Sign in required
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Please log in or create an account to access this feature and explore our platform.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <Link
                                href="/auth/login"
                                className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors text-center"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors text-center"
                            >
                                Create Account
                            </Link>
                        </div>

                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
