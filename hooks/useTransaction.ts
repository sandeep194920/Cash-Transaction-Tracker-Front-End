import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";

const useTransaction = () => {
  const { unsettledTransaction, taxPercentage } = useAppContext();
  const { items: orderedItems } = unsettledTransaction;

  const currentTransactionAmount = useMemo(() => {
    if (!orderedItems || !orderedItems.length)
      return {
        gross: 0,
        total: 0,
      };

    const gross = orderedItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const total = gross + (taxPercentage * gross) / 100;
    return { gross, total };
  }, [unsettledTransaction, taxPercentage]);

  return {
    orderGrossAmount: currentTransactionAmount.gross,
    orderTotalAmount: currentTransactionAmount.total,
  };
};

export default useTransaction;
