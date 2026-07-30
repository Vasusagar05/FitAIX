import { useState } from "react";
import { getCoachResponse } from "../services/coachService";
import { useMutation } from "@tanstack/react-query";
import { ChatMessage } from "../types";
import { apiClient, ApiResponse } from "@/lib/apiClient";

export const useCoach = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "coach"; text: string }[]
  >([]);

  const sendMessage = async (input: string) => {
    try {
      setLoading(true);

      // add user message
      setMessages((prev) => [...prev, { role: "user", text: input }]);

      const reply = await getCoachResponse(input);

      // add coach reply
      setMessages((prev) => [
        ...prev,
        { role: "coach", text: reply },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};

export const useSendChatMessage = () => {
  return useMutation<ChatMessage, Error, string>({
    mutationFn: async (message: string) => {
      const response = await apiClient.post<ApiResponse<ChatMessage>>('/chat', { message });
      return response.data.data;
    }
  });
};