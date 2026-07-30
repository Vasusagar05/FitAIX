import { apiClient } from "@/lib/apiClient";

export const getCoachResponse = async (message: string) => {
  const res = await apiClient.post("/coach", { message });
  return res.data.data;
};