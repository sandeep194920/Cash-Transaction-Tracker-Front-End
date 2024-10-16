import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";

const useTransaction = () => {
  const { orderedItems, taxPercentage } = useAppContext();
  let currentBalance = 0;
  const { currentCustomer } = useAppContext();
  if (currentCustomer) {
    currentBalance = currentCustomer.totalBalance;
  }

  const transactionAmount = useMemo(() => {
    const grossPrice = orderedItems.reduce((acc, currentItem) => {
      return acc + currentItem.price * currentItem.quantity;
    }, 0);

    const taxAmount = (grossPrice * taxPercentage) / 100;

    const orderPrice = grossPrice + taxAmount;

    const totalAmount = orderPrice + currentBalance;

    return { grossPrice, orderPrice, totalAmount };
  }, [orderedItems, taxPercentage]);

  return {
    transactionAmountWithTax: transactionAmount.orderPrice,
    transactionAmountWithoutTax: transactionAmount.grossPrice,
    transactionTotalAmount: transactionAmount.totalAmount,
  };
};

export default useTransaction;
