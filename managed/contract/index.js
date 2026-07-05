import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = __compactRuntime.CompactTypeField;

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      submitBid(context, ...args_1) {
        return { result: pureCircuits.submitBid(...args_1), context };
      },
      closeAuction(context, ...args_1) {
        return { result: pureCircuits.closeAuction(...args_1), context };
      }
    };
    this.impureCircuits = {};
    this.provableCircuits = {};
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _submitBid_0(bid_0, currentHighest_0) { return bid_0; }
  _closeAuction_0(highest_0) { return highest_0; }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({ });
export const pureCircuits = {
  submitBid: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`submitBid: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const bid_0 = args_0[0];
    const currentHighest_0 = args_0[1];
    if (!(typeof(bid_0) === 'bigint' && bid_0 >= 0 && bid_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('submitBid',
                                 'argument 1',
                                 'auction.compact line 5 char 1',
                                 'Field',
                                 bid_0)
    }
    if (!(typeof(currentHighest_0) === 'bigint' && currentHighest_0 >= 0 && currentHighest_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('submitBid',
                                 'argument 2',
                                 'auction.compact line 5 char 1',
                                 'Field',
                                 currentHighest_0)
    }
    return _dummyContract._submitBid_0(bid_0, currentHighest_0);
  },
  closeAuction: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`closeAuction: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const highest_0 = args_0[0];
    if (!(typeof(highest_0) === 'bigint' && highest_0 >= 0 && highest_0 <= __compactRuntime.MAX_FIELD)) {
      __compactRuntime.typeError('closeAuction',
                                 'argument 1',
                                 'auction.compact line 13 char 1',
                                 'Field',
                                 highest_0)
    }
    return _dummyContract._closeAuction_0(highest_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
