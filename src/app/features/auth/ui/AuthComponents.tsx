import { ReactNode } from "react";

export const AuthPageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-dvh w-screen flex-col items-stretch justify-start bg-[#050505] px-0 py-0 sm:min-h-screen sm:w-full sm:items-center sm:justify-center sm:px-6 sm:py-12 lg:px-8">
      {/* Subtle radial emerald glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at top center, rgba(76,175,80,0.15), transparent 70%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export const AuthPageCaption = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-2xl">
      {children}
    </h1>
  );
};

export const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:p-10">
      {children}
    </div>
  );
};

export const AuthPageContent = ({ children }: { children: ReactNode }) => {
  return <p className="mb-6 text-center text-sm text-gray-600">{children}</p>;
};
