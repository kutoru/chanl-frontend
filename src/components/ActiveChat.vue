<template>
  <div v-if="everythingLoaded && channel" class="channel-container">
    <ChannelInfoContainer :is-connected="isConnected" />
    <ChannelMessageContainer :messages="receivedMessages" />
    <ChannelInputContainer :is-connected="isConnected" @submit-message-text="(msg) => sendMessage(msg)" />
  </div>

  <h2 style="margin: 20px;" v-else-if="loadFailed">Either could not connect or could not load the necessary information</h2>
  <h2 style="margin: 20px;" v-else>Loading the channel...</h2>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useChannelStore } from "@/stores/channel";
import ChannelInfoContainer from "@/components/chat/ChannelInfoContainer.vue";
import ChannelMessageContainer from "@/components/chat/ChannelMessageContainer.vue";
import ChannelInputContainer from "@/components/chat/ChannelInputContainer.vue";
import type { Message } from "@/types/Message";
import { apiurl, fetchWithTimeout } from "@/global";

const props = defineProps({
  channelId: { type: Number, required: true },
})

const everythingLoaded = ref<boolean>(false)
const loadFailed = ref<boolean>(false)
const isConnected = ref<boolean>(false)
const receivedMessages = ref<Message[]>([])
const socket = ref<WebSocket | undefined>()

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const channelStore = useChannelStore()
const { channel } = storeToRefs(channelStore)
const { loadChannel, unloadChannel } = channelStore

async function loadInfo() {

  // Loading and checking the necessary info

  const _ = await loadChannel(props.channelId, currentUser.value.id)

  if (!channel.value) {
    loadFailed.value = true
    return
  }

  // If the function got here, that means everything was loaded successfully

  everythingLoaded.value = true

  // Trying to connect to the channel's websocket

  const gotCookie: boolean = await fetchWithTimeout(`http://${apiurl}/prepare-channel/${props.channelId}`, {
      headers: { "User-ID": currentUser.value.id.toString() },
      credentials: "include",
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return false
      }
    })

  if (!gotCookie) {
    console.log("Didn't get a cookie")
    return
  }

  const serverUrl = `ws://${apiurl}/connect-to-channel/${props.channelId}`
  socket.value = new WebSocket(serverUrl)

  // Setting up the websocket event listeners

  socket.value.addEventListener("open", () => {
    isConnected.value = true
  })

  socket.value.addEventListener("close", () => {
    isConnected.value = false
    socket.value = undefined
  })

  socket.value.addEventListener("message", (event) => {
    console.log("New messages from server")

    try {
      const messages: Message[] = JSON.parse(event.data)
      console.log(messages)
      for (let i = messages.length - 1; i >= 0; i--) {
        receivedMessages.value.unshift(messages[i])
      }
    } catch (error) {
      console.log("Could not parse the received messages")
      console.log(error)
    }
  })
}

function unloadInfo() {
  if (socket.value) {
    socket.value.close()
    socket.value = undefined
  }

  everythingLoaded.value = false
  loadFailed.value = false
  isConnected.value = false
  receivedMessages.value = []

  unloadChannel()
}

function sendMessage(text: string) {
  if (!channel.value || currentUser.value.id == 0 ||
      !socket.value || !isConnected.value) {
    return
  }

  const newMessage: Message = {
    id: 0,
    userId: currentUser.value.id,
    channelId: channel.value.id,
    text: text,
    sentAt: "",
  }

  socket.value.send(JSON.stringify(newMessage))
}

onMounted(() => {
  loadInfo()
})

onBeforeUnmount(() => {
  unloadInfo()
})

watch(() => props.channelId, () => {
  unloadInfo()
  loadInfo()
})
</script>

<style scoped>
.channel-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  /* background-color: rgb(15, 30, 25); */
  /* margin: 5px 0 5px 0; */
  overflow: hidden;
}
</style>
