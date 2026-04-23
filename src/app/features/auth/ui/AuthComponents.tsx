import { ReactNode } from "react";

export const AuthPageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-dvh w-screen flex-col items-stretch justify-start bg-gray-50 px-0 py-0 sm:min-h-screen sm:w-full sm:items-center sm:justify-center sm:px-6 sm:py-12 lg:px-8">
      {children}
    </div>
  );
};

export const AuthPageCaption = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="text-primary text-xl font-bold tracking-tight sm:text-2xl md:text-2xl">
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
