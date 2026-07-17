import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { Buffer } from 'buffer';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { createKeystore } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';

const SEED = '51cc39f65fc06d5dfbd3d036a993f599beef40c62efc77baa8f7aa1236303e48';

setNetworkId('preprod');

const hdWallet = HDWallet.fromSeed(Buffer.from(SEED, 'hex'));

if (hdWallet.type === 'seedOk') {
  const result = hdWallet.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);

  if (result.type === 'keysDerived') {
    const keys = result.keys;
    const keystore = createKeystore(keys[Roles.NightExternal], 'preprod');
    
    const bech32 = keystore.getBech32Address();
    console.log('Type:', typeof bech32);
    console.log('toString:', bech32.toString());
    console.log('JSON:', JSON.stringify(bech32));
    
    // Try all properties
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(bech32))) {
      try {
        if (key !== 'constructor') console.log(`${key}:`, bech32[key]());
      } catch(e) {}
    }
  }
}
