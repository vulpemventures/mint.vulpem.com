<script lang="ts">
import { BrowserInject, getUnblindURLFromTx, IdentityType, makeUnblindURL, TxInterface, UtxoInterface } from 'ldk';
import { detectProvider } from 'marina-provider';

import ConfirmModal from '../components/ConfirmModal.svelte';
import { Status } from '../constants';
import { broadcastTransaction } from '../utils/broadcast';
import { createContract, mintAsset } from '../utils/issuance';

let showModal = false;
let modalStatus = Status.WAITING;
let error: string;

let name: string;
let ticker: string;
let supply: number;

let explorerLink: string;

const marinaIdentity = (chain: 'liquid' | 'regtest') => new BrowserInject({
  chain,
  type: IdentityType.Inject,
  opts: {
    windowProvider: 'marina',
  },
});


const handleSubmit = async () => {
  try {
    showModal = true;
    modalStatus = Status.WAITING;

    const marina = await detectProvider('marina');
  
    const utxos = await marina.getCoins();
    const chain = await marina.getNetwork();

    const signedHex = await mintAsset(
      marinaIdentity(chain),
      utxos as UtxoInterface[],
      chain,
      supply,
      createContract(name, ticker),
    )

    const txid = await broadcastTransaction(chain, signedHex);
    explorerLink = `https://liquid.network/tx/${txid}`
    modalStatus = Status.COMPLETED;
  } catch (e) {
    modalStatus = Status.ERROR;
    console.error(e)
  }
};
</script>

<form class="box">
  <!--  <h1 class="title">Mint & Sell your NFT</h1> -->
  <div class="field">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">Name</label>
    <p class="control">
      <input
        class="input"
        type="text"
        placeholder="eg. MyToken"
        bind:value={name}
      />
    </p>
  </div>
  <div class="field">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">Ticker</label>
    <p class="control">
      <input
        class="input"
        type="text"
        placeholder="eg. TKN"
        bind:value={ticker}
      />
    </p>
  </div>

  <div class="field">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">Initial Supply</label>
    <p class="control">
      <input
        class="input"
        type="number"
        placeholder="eg. 100"
        bind:value={supply}
      />
    </p>
  </div>
  <button type="button" class="button" on:click={handleSubmit}>Mint</button>
</form>
<ConfirmModal bind:active={showModal} status={modalStatus} {explorerLink} {error} />
