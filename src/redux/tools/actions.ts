import { Action } from '@reduxjs/toolkit'
import { ExcelActions } from '../store'

export const createActionIgnoreMap = (): { [key: string]: boolean } => {
  const ignoreActionMap = {}

  for (const actionKey in ExcelActions) {
    const action: Action = ExcelActions[actionKey]
    ignoreActionMap[action.type] = true
  }

  // TODO : Ignore certain actions here
  ignoreActionMap[ExcelActions.UPDATE_STATE.type] = false
  ignoreActionMap[ExcelActions.CHANGE_SHEET.type] = false

  return ignoreActionMap
}
