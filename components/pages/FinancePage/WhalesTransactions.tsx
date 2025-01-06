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
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[50px] w-full" />
      </div>
    );
  }

  if (whalesTransactionsQuery.error) {
    return <AlertErrorMessage message="Issue fetching whales transactions" />;
  }

  return (
    <ScrollArea className="max-w-lg mx-auto h-[500px]">
      <Table className="max-w-lg mx-auto">
        <TableCaption>Whales Transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Txn Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {whalesTransactionsQuery.data?.map((whaleTransaction) => (
            <TableRow key={whaleTransaction.transaction_hash}>
              <TableCell>
                {formatDecimal(whaleTransaction.amount_tokens)} <br />
                <span className="text-muted-foreground text-sm">
                  (${formatDecimal(whaleTransaction.amount_usd, 2)})
                </span>
              </TableCell>
              <TableCell>
                {dayjs(whaleTransaction.timestamp).format("MM/DD/YYYY HH:mm")}
              </TableCell>
              <TableCell className="text-right">
                <a
                  href={getSolscanTxnUrl(whaleTransaction.transaction_hash)}
                  target="_blank"
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

// const WhaleTransactionCard: FC<{ whaleTransaction: WhaleTransactionResponse }> = ({
//   whaleTransaction,
// }) => {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row justify-between items-center">
//         <CardTitle>
//           {truncateAddress(whaleTransaction.transaction_hash)}
//         </CardTitle>
//         <CardDescription>
//           {dayjs(whaleTransaction.timestamp).format("MM/DD/YYYY HH:mm")}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div>
//           {formatDecimal(whaleTransaction.amount_tokens)}{" "}
//           <span className="text-muted-foreground text-sm">
//             (${formatDecimal(whaleTransaction.amount_usd, 2)})
//           </span>
//         </div>
//       </CardContent>
//       <CardFooter className="justify-end">
//         <Button variant="link" asChild>
//           <a
//             href={getSolscanTxnUrl(whaleTransaction.transaction_hash)}
//             target="_blank"
//           >
//             View on Solscan
//           </a>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };
