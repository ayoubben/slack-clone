"use client";
import { useGetChannel } from "@/app/features/channels/api/use-get-channel";
import { useChannelId } from "@/app/hooks/use-channel-id";
import { Loader, Triangle } from "lucide-react";
import Header from "./components/header";
import ChatInput from "./components/chat-input";

const ChannelPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading } = useGetChannel({ id: channelId });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-full">
        <Loader className="animate-spin size-5" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-full">
        <Triangle className="size-5" />
        <p className="text-center text-sm text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <Header name={channel.name} />

      <div className="flex-1 " />
      <ChatInput placeholder={`#${channel.name} : write something ...`} />
    </div>
  );
};

export default ChannelPage;
