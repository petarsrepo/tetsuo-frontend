"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useWhalesTransactions } from "@/queries/useWhalesTransactions";
import dayjs from "dayjs";
import { formatDecimal, getSolscanTxnUrl, truncateAddress } from "@/lib/utils";
import { AlertErrorMessage } from "@/components/shared/AlertErrorMessage";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export const WhalesTransactions = () => {
  const whalesTransactionsQuery = useWhalesTransactions();

  if (whalesTransactionsQuery.isFetching) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[50px] w-full" />
        ))}
      </div>
    );
  }

  if (whalesTransactionsQuery.error) {
    console.error("Error fetching whale transactions:", whalesTransactionsQuery.error);
    return <AlertErrorMessage message="Issue fetching whales transactions" />;
  }

  if (!whalesTransactionsQuery.data?.length) {
    return <div>No whale transactions found.</div>;
  }

  return (
    <ScrollArea className="max-w-lg mx-auto h-[500px]">
      <Table aria-label="Whales Transactions Table" className="max-w-lg mx-auto">
        <TableCaption>Whales Transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Txn Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {whalesTransactionsQuery.data.map((whaleTransaction) => (
            <TableRow key={whaleTransaction.transaction_hash}>
              <TableCell>
                {formatDecimal(whaleTransaction.amount_tokens)}
                <div className="text-muted-foreground text-sm">
                  (${formatDecimal(whaleTransaction.amount_usd, 2)})
                </div>
              </TableCell>
              <TableCell>
                {dayjs(whaleTransaction.timestamp).format("MM/DD/YYYY HH:mm")}
              </TableCell>
              <TableCell className="text-right">
                <a
                  href={getSolscanTxnUrl(whaleTransaction.transaction_hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateAddress(whaleTransaction.transaction_hash)}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
