import { writable } from 'svelte/store';

export interface MarinaStore {
  installed: boolean;
  enabled: boolean;
}

const initialState = { installed: false, enabled: false, network:"liquid" }

export const marinaStore = writable<MarinaStore>(initialState);