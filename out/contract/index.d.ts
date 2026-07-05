import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
}

export type ProvableCircuits<PS> = {
}

export type PureCircuits = {
  submitBid(bid_0: bigint, currentHighest_0: bigint): bigint;
  closeAuction(highest_0: bigint): bigint;
}

export type Circuits<PS> = {
  submitBid(context: __compactRuntime.CircuitContext<PS>,
            bid_0: bigint,
            currentHighest_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>, highest_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
