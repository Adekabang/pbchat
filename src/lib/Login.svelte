<script lang="ts">
  import { currentUser, pb } from "./pocketbase";

  let username: string;
  let password: string;

  async function login() {
    await pb.collection("users").authWithPassword(username, password);
  }

  async function signUp() {
    try {
      const data = {
        username,
        password,
        passwordConfirm: password,
        name: username,
      };
      const createdUser = await pb.collection("users").create(data);
      await login();
    } catch (error) {
      console.log(error);
    }
  }

  async function signOut() {
    pb.authStore.clear();
  }
</script>

{#if $currentUser}
  <p>Signed in as {$currentUser.username}</p>
  <button on:click={signOut}>Logout</button>
{:else}
  <form on:submit|preventDefault>
    <input placeholder="username" type="text" bind:value={username} />
    <input placeholder="password" type="password" bind:value={password} />
  </form>
  <button on:click={signUp}>Sign Up</button>
  <button on:click={login}>Login</button>
{/if}
