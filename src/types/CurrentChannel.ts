import type { Channel } from "./Channel"

export type CurrentChannel = {
  userId: number
  channelId: number
  canWrite: boolean
  joinedAt: string
  channel?: Channel
}
