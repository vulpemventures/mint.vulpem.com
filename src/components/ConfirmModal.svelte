<script lang="ts">
  import { Status } from '../constants';
  import SuccessIcon from './icons/SuccessIcon.svelte';
  import ErrorIcon from './icons/ErrorIcon.svelte';

  export let active: boolean;

  export let explorerLink: string;
  export let error: string;

  export let status: Status;

  const onCancel = () => {
    active = false;
  };
</script>

<div class="modal {active && 'is-active'}">
  <div class="modal-background" on:click={onCancel} />
  <div class="modal-content box has-background-black">
    <div class="columns">
      <div class="column is-full has-text-centered mt-6">
        {#if status === Status.WAITING}
          <div class="loader-wrapper is-active">
            <div class="loader is-loading" />
          </div>
          <div class="block mt-6 mb-3">
            <h1 class="title has-text-white">Waiting for Confirmation...</h1>
            <p class="subtitle is-6 has-text-weight-light has-text-grey">
              Confirm this transaction in your Marina wallet
            </p>
          </div>
        {:else if status === Status.COMPLETED}
          <SuccessIcon />
          <div class="block mt-6 mb-3">
            <h1 class="title is-3 has-text-white">Issuance Submitted</h1>
            <a
              target="_blank"
              href={explorerLink}
            >
              <p class="subtitle">View on Explorer</p>
            </a>
            <button
              type="button"
              class="button is-primary is-medium is-rounded mt-6"
              on:click={onCancel}
            >
              Close
            </button>
          </div>
        {:else}
          <ErrorIcon />
          <div class="block mt-6 mb-3">
            <h1 class="title has-text-white">Something went wrong</h1>
            <p class="subtitle">
              {error}
            </p>
            <button
              type="button"
              class="button is-primary is-medium is-rounded mt-6"
              on:click={onCancel}
            >
              Close
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
