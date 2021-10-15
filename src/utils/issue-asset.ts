import { ChangeAddressFromAssetGetter, CoinSelector, createFeeOutput, decodePset, networks, WalletInterface } from "ldk"
import type { AddIssuanceArgs } from "liquidjs-lib/types/psbt";

// create an issuance transaction
export const issueAsset = (network: networks.Network) => (coinSelector: CoinSelector) => (changeAddressGetter: ChangeAddressFromAssetGetter) => (wallet: WalletInterface) => (issuance: AddIssuanceArgs) => {
  const emptyFundedPset = createPsetWithOnlyFee(network)(coinSelector)(changeAddressGetter)(wallet);
  return withIssuance(emptyFundedPset)(issuance);
}

// add an issuance to the first input in pset
const withIssuance = (psetBase64: string) => (issuanceArgs: AddIssuanceArgs) => decodePset(psetBase64).addIssuance(issuanceArgs).toBase64();

// estimate the size of a future issuance pset
// 2 inputs = 1 for LBTC input (for fees) + the issuance object we'll attach to it
// 4 outputs = token output + asset output + fee output (+ change output)
const createPsetWithOnlyFee = (network: networks.Network) => (coinSelector: CoinSelector) => (changeAddressGetter: ChangeAddressFromAssetGetter) => (wallet: WalletInterface) => {
  const feeRecipient = createFeeOutput(2, 5, 0.1, network.assetHash)
  return wallet.buildTx(wallet.createTx(), [feeRecipient], coinSelector, changeAddressGetter)
}
