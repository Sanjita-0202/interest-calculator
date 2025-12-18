export function applyPartialPayment(
  transaction: any,
  paymentAmount: number
) {
  let remainingPayment = paymentAmount;

  // Clear interest first
  if (transaction.interestAmount > 0) {
    const interestPaid = Math.min(
      transaction.interestAmount,
      remainingPayment
    );
    transaction.interestAmount -= interestPaid;
    remainingPayment -= interestPaid;
  }

  // Then reduce principal
  if (remainingPayment > 0) {
    transaction.principal -= remainingPayment;
  }

  transaction.paidAmount += paymentAmount;
  transaction.totalPayable =
    transaction.principal + transaction.interestAmount;

  transaction.outstandingAmount = transaction.totalPayable;

  if (transaction.outstandingAmount <= 0) {
    transaction.status = "closed";
    transaction.outstandingAmount = 0;
  }

  return transaction;
}
