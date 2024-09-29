<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser, pb } from "./pocketbase";

  let messages: any = [];
  let newMessage: string;
  let unsubscribe: () => void;

  onMount(async () => {
    const resultList = await pb.collection("messages_").getList(1, 50, {
      sort: "created",
      expand: "user",
    });
    console.log(resultList);
    messages = resultList.items;

    // Subscribe to realtime messages
    unsubscribe = await pb
      .collection("messages_")
      .subscribe("*", async ({ action, record }) => {
        if (action == "create") {
          const user = await pb.collection("users").getOne(record.user);
          record.expand = { user };
          messages = [...messages, record];
        }
        if (action == "delete") {
          messages = messages.filter((m: any) => m.id !== record.id);
        }
      });
  });

  // Unsubscribe
  onDestroy(() => {
    unsubscribe?.();
  });

  async function sendMessage() {
    const data = {
      text: newMessage,
      user: $currentUser?.id,
    };
    const createdMessage = await pb.collection("messages_").create(data);
    newMessage = "";
  }
</script>

<div class="messages">
  {#each messages as message (message.id)}
    <div class="msg">
      <img
        class="avatar"
        src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${message.expand?.user?.username}`}
        alt="avatar"
        width="40px"
      />
      <div class="msg-text">
        <small>
          Sent by @{message.expand?.user?.username}
        </small>
        <p>{message.text}</p>
      </div>
    </div>
  {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input type="text" placeholder="Message" bind:value={newMessage} />
  <button type="submit">Send</button>
</form>
