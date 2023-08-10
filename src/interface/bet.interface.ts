import { type Types } from 'mongoose'

export interface IBet {
  user: Types.ObjectId
  type: '3D' | 'STL'
  schedule: Date
  amount: number
  number: string
  rambled: boolean
  reference: string
  code: string
  time: '10:30 AM' | '3:00 PM' | '8:00 PM' | '2:00 PM' | '5:00 PM' | '9:00 PM'
}

export interface IBetContent {
  type: string
  schedule: string
  time: string
  amount: number
  rambled: boolean
  number: string
}

export interface IBetConfig {
  rambleLimit: number
  normalNumLimit: number
  doubleNumLimit: number
  tripleNum: number
}

export interface INumberStats {
  user: Types.ObjectId
  schedule: Date
  amount: number
  number: string
  time: '10:30 AM' | '3:00 PM' | '8:00 PM' | '2:00 PM' | '5:00 PM' | '9:00 PM'
}

export interface IBetResult {
  type: 'S3' | 'STL'
  schedule: Date
  number: string
  time: '10:30 AM' | '3:00 PM' | '8:00 PM' | '2:00 PM' | '5:00 PM' | '9:00 PM'
}

export type TNumbeClassification = 'double' | 'triple' | 'normal' | 'ramble'

export interface ITransaction {
  user: Types.ObjectId
  game: '3D' | 'STL'
  content: any
  schedule: Date
  total: number
  reference: string
  time: '10:30 AM' | '3:00 PM' | '8:00 PM' | '2:00 PM' | '5:00 PM' | '9:00 PM'
}
