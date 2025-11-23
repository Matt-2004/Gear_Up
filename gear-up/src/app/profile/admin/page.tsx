"use server";

import { Tabs } from "@/components/Admin/Tabs";
import { PageSwitcher } from "@/components/Admin/PageSwticher";

export default async function Page({
  searchParams,
}: {
  searchParams: { tab: string };
}) {
  const { tab } = await searchParams;
  console.log("QueryTab:: ", tab);

  return (
    <div className={"text-white w-full flex h-screen"}>
      <div
        className={
          "w-1/6 p-2 mx-auto border-r-gray-800 shadow-gray-700  shadow-sm"
        }
      >
        <Tabs selectedTab={tab ?? "dashboard"} />
      </div>
      <div className={"w-5/6"}>
        <PageSwitcher selectedTab={tab ?? "dashboard"} />
      </div>
    </div>
  );
}
