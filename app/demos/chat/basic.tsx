"use client";

import { Chat, type ChatMessage } from "@/ui/skins";

const roleConfig = {
  user: { name: "You", avatar: "" },
  assistant: { name: "Assistant" },
  system: { name: "System" },
};

const chats: ChatMessage[] = [
  { id: "1", role: "assistant", content: "Hi! I am your assistant. Ask me anything about this library.", status: "completed" },
  { id: "2", role: "user", content: "Compare the two schemes for me.", status: "completed" },
  {
    id: "3",
    role: "assistant",
    status: "completed",
    content: [
      {
        type: "reasoning",
        summary: [{ type: "summary_text", text: "The user wants a comparison. I should outline both schemes briefly." }],
      },
      {
        type: "output_text",
        text: "Minimal keeps a quiet surface with soft elevation; neo goes hard edges with solid offset shadows.",
      },
      { type: "function_call", name: "get_scheme", arguments: '{"name":"neo-brutalist"}' },
    ],
  },
  { id: "4", role: "assistant", status: "in_progress" },
];

export default function Demo() {
  return (
    <Chat chats={chats} roleConfig={roleConfig} align="leftRight" mode="bubble" />
  );
}
