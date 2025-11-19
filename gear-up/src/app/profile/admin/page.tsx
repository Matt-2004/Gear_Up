"use server";

import { Tabs } from "@/components/Admin/Tabs";
import { PageSwitcher } from "@/components/Admin/PageSwticher";

export default async function Page({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const queryTab = searchParams.tab ?? "dashboard";
  console.log("QueryTab:: ", queryTab);

  return (
    <div className={"text-white w-full flex h-screen"}>
      <div
        className={
          "w-1/6 p-2 mx-auto border-r-gray-800 shadow-gray-700  shadow-sm"
        }
      >
        <Tabs selectedTab={queryTab ?? "dashboard"} />
      </div>
      <div className={"w-5/6"}>
        <PageSwitcher selectedTab={queryTab ?? "dashboard"} />
      </div>
    </div>
  );
}
