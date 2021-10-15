<script lang="ts">
  import ConfirmModal from '../components/ConfirmModal.svelte';
  import { Status } from '../constants';

  let showModal = false;
  let modalStatus = Status.WAITING;
  let error: string;
  let txid: string;

  let name: string;
  let ticker: string;
  let supply: number;

  const handleSubmit = () => {
    console.log(name);

    // use name, ticker and assetAmount
    //issueAsset(networks.liquid)(greedyCoinSelector())()
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
<ConfirmModal bind:active={showModal} status={modalStatus} {txid} {error} />
