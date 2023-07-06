import { ref } from "vue"
import { defineStore } from "pinia"
import type { Channel } from "@/types/Channel"
import type { CurrentChannel } from "@/types/CurrentChannel"
import { apiurl, fetchWithTimeout } from "@/global"

export const useChannelStore = defineStore("channel", () => {
  const parentChannel = ref<CurrentChannel | undefined>()
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
          throw new Error("Response is not ok")
        }
      })
      .then(data => {
        if (!data.currentChannel || !data.currentChannel.channel) {
          throw new Error("Did not get channel info from response")
        }

        channel.value = data.currentChannel.channel

        if (userId != 0) {
          if (channel.value?.id !== 1 && !data.parentChannel) {
            throw new Error("Did not get parentChannel from response")
          }
          if (!data.childChannels) {
            throw new Error("Did not get childChannels from response")
          }

          parentChannel.value = data.parentChannel
          currentChannel.value = data.currentChannel
          childChannels.value = data.childChannels
        }
      })
      .catch(error => {
        unloadChannel()
        console.log(error)
      })
  }

  function unloadChannel() {
    parentChannel.value = undefined
    currentChannel.value = undefined
    channel.value = undefined
    childChannels.value = []
  }

  return { parentChannel, currentChannel, channel, childChannels, loadChannel, unloadChannel }
})
