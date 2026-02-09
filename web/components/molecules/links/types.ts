export type Link = {
  _id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: string
  aiStatus?: string
  tags?: string[]
}
