export function applyPartialPayment({
  principal,
  accruedInterest,
  paymentAmount,
}: {
  principal: number;
  accruedInterest: number;
  paymentAmount: number;
}) {
  let interestPaid = Math.min(accruedInterest, paymentAmount);
  let remainingPayment = paymentAmount - interestPaid;
  let newPrincipal = principal - remainingPayment;

  return {
    interestPaid,
    principalReduced: remainingPayment,
    remainingPrincipal: Math.max(newPrincipal, 0),
  };
}
