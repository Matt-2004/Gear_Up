import MessagesClient from "@/app/features/messaging/ui/MessagesClient";

import { cookies } from "next/headers";
import {
  IMessageData,
  IMessageDetailData,
} from "../features/messaging/types/message.types";
import {
  getConversationByOtherUserId,
  getConversationsByConversationId,
} from "../shared/utils/API/MessageAPI";

export const dynamic = "force-dynamic";

const getData = async (otherUserId: string) => {
  const res = await getConversationByOtherUserId(otherUserId);
  if (!res) {
    console.log("No response from getConversationByOtherUserId");
  }
  const conversationId = res.data.conversationId;
  const resp = await getConversationsByConversationId(conversationId);
  return resp.data;
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ userId: string }>;
}) {
  const searchparam = await searchParams;
  const userId = searchparam.userId;
  const messages = await getData(userId);
  const access_token = (await cookies()).get("access_token")?.value!;

  return (
    <MessagesClient
      userId={userId}
      messages={messages}
      access_token={access_token}
    />
  );
}
