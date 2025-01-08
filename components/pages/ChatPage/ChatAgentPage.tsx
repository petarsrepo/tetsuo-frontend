"use client";

import { type ChatType } from "@/mutations/useChatCompletion";
import { type FC } from "react";

import { ChatContainer } from "@/components/Chat/ChatContainer";

export const ChatAgentPage: FC<{ chatType: ChatType }> = ({ chatType }) => {
  return <ChatContainer chatType={chatType} />;
};
