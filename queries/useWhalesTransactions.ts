import { useQuery } from "@tanstack/react-query";

export type WhaleTransactionResponse = {
  transaction_hash: string;
  amount_tokens: number;
  amount_usd: number;
  price_usd: number;
  timestamp: string;
};

export const useWhalesTransactions = () => {
  return useQuery({
    queryKey: ["whales-transactions"],
    queryFn: async () => {
      const response = await fetch("/api/v1/whales/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch whale transactions");
      }
      const data = (await response.json()) as WhaleTransactionResponse[];
      return data;
    },
  });
};
