import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('http://pbc.103.177.95.246.sslip.io/');

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
  console.log('authStore changed', auth);
  currentUser.set(pb.authStore.model);
})
