declare type CallerHistory = {
  callerId: string,
  callerName: string,
  updatedBy: string,
  updatedAt: string
}

declare type CallStatusHistory = {
  callType: number,
  callStatus: number,
  updatedBy: string,
  updatedAt: string
}

declare type CallPacket = {
  _id?: string,
  callCenterId: string,
  callCenterName: string,
  callerId: string,
  callerName: string,
  callerHistory: Array<CallerHistory>,
  veteranCallSheetId: string,
  veteranDbId: string,
  veteranFirstName: string,
  veteranLastName: string,
  veteranStatus: number,
  guardianCallSheetId: string,
  guardianDbId: string,
  guardianFirstName: string,
  guardianLastName: string,
  guardianStatus: number,
  mailCallStatus: number,
  callStatusHistory: Array<CallStatusHistory>,
  createdAt: string,
  updatedAt: string,
  isRemoved: boolean
}

