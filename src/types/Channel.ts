import ChannelType from "./ChannelType"

export type Channel = {
  id: number
  ownerId: number
  parentId: number
  name: string
  type: ChannelType
  createdAt: string
}
