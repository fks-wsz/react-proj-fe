import { Image } from './'

export type Organization = {
  id: string
  organizationName: string
  logoUrl: string
  tags: string
  businessLicenseUrl: string
  idCardFrontUrl: string
  idCardBackUrl: string
  description: string
  address: string
  longitude: string
  latitude: string
  phoneNumber: string
  orgFrontImg: Image[]
  orgRoomImg: Image[]
  orgOtherImg: Image[]
}
