export function makePrivateState(secretKey, bidAmount) {
  return {
    secretKey,
    bidAmount,
  };
}

export const witnesses = {
  myBidAmount: (context) => [context.privateState, context.privateState.bidAmount],
};
