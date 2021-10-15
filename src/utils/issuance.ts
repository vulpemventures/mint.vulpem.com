import type { UtxoInterface } from "ldk";
import { Network, Psbt } from "liquidjs-lib";
import type { AddIssuanceArgs } from 'liquidjs-lib/types/psbt';

function createAssetIssuance(utxo:UtxoInterface, assetAddress: string, tokenAddress: string, assetAmount: number,) {
  const psbt = new Psbt();
/*     psbt.addInput({
      txid:
    }); */
    psbt.addIssuance({
      assetAddress,
      tokenAddress,
      assetAmount,
      tokenAmount: 1,
      precision: 0,
      contract: {
        name: 'testcoin-bis',
        ticker: 'T-COI',
        entity: {
          domain: 'vulpemventures.com',
        },
        version: 0,
        precision: 0,
      },
    });

}