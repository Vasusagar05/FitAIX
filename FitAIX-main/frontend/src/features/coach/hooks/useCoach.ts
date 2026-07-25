import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '../services/coachService';

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: (message: string) => sendChatMessage(message),
  });
};
