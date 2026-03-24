import { ReactNode } from "react";

export const AuthPageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export const AuthPageCaption = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mb-4 flex flex-col items-center justify-center text-center">
      {/* Logo */}
      <h1 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl md:text-3xl">
        {children}
      </h1>
    </div>
  );
};

export const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 sm:p-10">
      {children}
    </div>
  );
};

export const AuthPageContent = ({ children }: { children: ReactNode }) => {
  return <p className="mb-6 text-center text-sm text-gray-600">{children}</p>;
};
