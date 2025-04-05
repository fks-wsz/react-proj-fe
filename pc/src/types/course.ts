import { Weeks } from '.'

/** 课程预约时间 */
export type CourseTimeRecord = {
  key: string
  startTime: string
  endTime: string
}

export type CourseReserverTimeDay = {
  week: Weeks
  reserverTimes: CourseTimeRecord[]
}

export type Course = {
  id: string
  name: string
  description: string
  fitPeople: string
  baseAbility: string
  sections: number
  sectionDuration: number
  stuCount: number
  reserveInfo: string
  refundInfo: string
  otherInfo: string
  reserverTimes: CourseReserverTimeDay[]
}
