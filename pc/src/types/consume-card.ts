export enum ConsumeCardType {
  TIMES = 'TIMES',
  DURATION = 'DURATION',
}

export type ConsumeCard = {
  id: string
  name: string
  type: ConsumeCardType
  times: number
  days: number
}
