"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

export const Tabs = ({ selectedTab }: { selectedTab: string }) => {
  const router = useRouter();
  const path = usePathname();
  return (
    <ul
      className={
        " w-full flex flex-col gap-2 items-start [&>ol]:w-full [&>ol]:cursor-pointer [&>ol]:px-4 [&>ol]:py-2 [&>ol]:rounded-sm [&>ol]:hover:border-gray-600 [&>ol]:hover:bg-gray-700"
      }
    >
      <ol
        className={clsx(
          selectedTab === "dashboard" ? "bg-gray-700 border-gray-600" : "",
        )}
        onClick={() => router.replace(`${path}?tab=dashboard`)}
      >
        Dashboard
      </ol>
      <ol
        className={clsx(
          selectedTab === "kyc-verification"
            ? "bg-gray-700 border-gray-600"
            : "",
        )}
        onClick={() => router.replace(`${path}?tab=kyc-verification`)}
      >
        Kyc Verification
      </ol>
      <ol
        className={clsx(
          selectedTab === "dealership-verification"
            ? "bg-gray-700 border-gray-600"
            : "",
        )}
        onClick={() => router.replace(`${path}?tab=dealership-verification}`)}
      >
        Dealership Verification
      </ol>
      <ol
        className={clsx(
          selectedTab === "generate-report"
            ? "bg-gray-700 border-gray-600"
            : "",
        )}
        onClick={() => router.replace(`${path}?tab=generate-report`)}
      >
        Generate report
      </ol>
    </ul>
  );
};
