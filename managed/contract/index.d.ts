import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum AuctionState { OPEN = 0, CLOSED = 1 }

export type Witnesses<PS> = {
  myBidAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  submitBid(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               secretKey_0: Uint8Array,
               price_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  submitBid(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               secretKey_0: Uint8Array,
               price_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  agentPublicKey(sk_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  submitBid(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               secretKey_0: Uint8Array,
               price_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  agentPublicKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly state: AuctionState;
  readonly taskId: Uint8Array;
  readonly bidCount: bigint;
  readonly winner: { is_some: boolean, value: Uint8Array };
  readonly winningPrice: { is_some: boolean, value: bigint };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               id_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
