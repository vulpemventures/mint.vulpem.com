import { greedyCoinSelector, IdentityInterface, UtxoInterface, walletFromCoins, address, decodePset } from "ldk";
import type { IssuanceContract } from "liquidjs-lib/types/issuance";
import { issueAsset } from "./issue-asset";

export async function mintAsset(
  identity: IdentityInterface,
  utxos: UtxoInterface[],
  chain: string,
  supply: number,
  issuanceContract: IssuanceContract,
) {
  const tokenAddress = await identity.getNextAddress()
  const assetAddress = await identity.getNextAddress()
  const wallet = walletFromCoins(utxos, chain);

  const changeAddr = await identity.getNextChangeAddress()
  const changeGetter = () => changeAddr.confidentialAddress;
  const makeIssuePset = issueAsset(identity.network)(greedyCoinSelector())(changeGetter)(wallet);

  const issuancePset = makeIssuePset({
    tokenAmount: 1,
    assetAmount: supply,
    tokenAddress: tokenAddress.confidentialAddress,
    assetAddress: assetAddress.confidentialAddress,
    blindedIssuance: true,
    precision: 0,
    contract: issuanceContract,
  })

  const decoded = decodePset(issuancePset);
  const inputAddress = address.fromOutputScript(decoded.data.inputs[0].witnessUtxo.script, identity.network);
  const blindingKeyInput = (await identity.getAddresses())
    .find(addr => address.fromConfidential(addr.confidentialAddress).unconfidentialAddress === inputAddress).blindingPrivateKey

  const blindedIssuancePset = await decoded.blindOutputsByIndex(
    new Map().set(0, Buffer.from(blindingKeyInput, 'hex')),
    new Map()
      .set(1, address.fromConfidential(changeAddr.confidentialAddress).blindingKey)
      .set(2, address.fromConfidential(assetAddress.confidentialAddress).blindingKey)
      .set(3, address.fromConfidential(tokenAddress.confidentialAddress).blindingKey),
    new Map().set(0, {
      tokenKey: Buffer.from(blindingKeyInput, 'hex'),
      assetKey: Buffer.from(blindingKeyInput, 'hex')
    })
  )

  const signed = await identity.signPset(blindedIssuancePset.toBase64())
  const hex = decodePset(signed).finalizeAllInputs().extractTransaction().toHex()
  return hex;
}


export function createContract(name: string, ticker: string): IssuanceContract {
  return {
    entity: {
      domain: 'mint.vulpem.com'
    },
    name,
    precision: 0,
    ticker,
    version: 0
  }
}