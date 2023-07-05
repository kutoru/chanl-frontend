import { ref } from "vue"
import { defineStore } from "pinia"
import type { Channel } from "@/types/Channel"
import type { CurrentChannel } from "@/types/CurrentChannel"
import { apiurl, fetchWithTimeout } from "@/global"

export const useChannelStore = defineStore("channel", () => {
  const currentChannel = ref<CurrentChannel | undefined>()
  const channel = ref<Channel | undefined>()
  const childChannels = ref<CurrentChannel[]>([])

  // If userId is not 0, loads currentChannel, channel and childChannels. Otherwise only loads channel
  async function loadChannel(channelId: number, userId: number) {
    await fetchWithTimeout(`http://${apiurl}/get-channel/${channelId}`, {
      headers: { "User-ID": userId.toString() }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Cannot get channel info")
        }
      })
      .then(data => {
        channel.value = data.currentChannel.channel
        if (userId != 0) {
          currentChannel.value = data.currentChannel
          childChannels.value = data.childChannels
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  function unloadChannel() {
    channel.value = undefined
    currentChannel.value = undefined
    childChannels.value = []
  }

  return { currentChannel, channel, childChannels, loadChannel, unloadChannel }
})
