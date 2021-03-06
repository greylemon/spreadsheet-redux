import { createSlice, Action } from '@reduxjs/toolkit'
import { undox } from 'undox'
import { createInitialExcelState } from './tools/state'

import * as MOUSE_REDUCERS from './reducers/mouse'
import * as KEYBOARD_REDUCERS from './reducers/keyboard'
import * as EVENT_REDUCERS from './reducers/events'
import * as SHEET_REDUCERS from './reducers/sheet'
import * as OPERATION_REDUCERS from './reducers/operations'
import * as STYLE_REDUCERS from './reducers/style'
import * as COMMON_REDUCERS from './reducers/common'
import * as CLEAN_REDUCERS from './reducers/clean'

export const initialExcelState = createInitialExcelState()

export const ExcelStore = createSlice({
  name: 'EXCEL',
  initialState: initialExcelState,
  reducers: {
    ...MOUSE_REDUCERS,
    ...KEYBOARD_REDUCERS,
    ...SHEET_REDUCERS,
    ...EVENT_REDUCERS,
    ...OPERATION_REDUCERS,
    ...STYLE_REDUCERS,
    ...COMMON_REDUCERS,
    ...CLEAN_REDUCERS,
  },
})

export const ExcelActions = ExcelStore.actions

export const createActionIgnoreMap = (): { [key: string]: boolean } => {
  const ignoreActionMap = {}

  Object.keys(ExcelActions).forEach((actionKey) => {
    const action: Action = ExcelActions[actionKey]
    ignoreActionMap[action.type] = true
  })

  // TODO : Ignore certain actions here
  ignoreActionMap[ExcelActions.UPDATE_STATE.type] = false

  // SHEET
  ignoreActionMap[ExcelActions.CHANGE_SHEET.type] = false
  ignoreActionMap[ExcelActions.ADD_SHEET.type] = false
  ignoreActionMap[ExcelActions.DELETE_SHEET.type] = false
  ignoreActionMap[ExcelActions.CHANGE_ACTIVE_SHEET_NAME.type] = false

  // STYLE
  ignoreActionMap[ExcelActions.SAVE_ACTIVE_CELL.type] = false
  ignoreActionMap[ExcelActions.SET_BOLD.type] = false
  ignoreActionMap[ExcelActions.SET_ITALIC.type] = false
  ignoreActionMap[ExcelActions.SET_STRIKETHROUGH.type] = false
  ignoreActionMap[ExcelActions.SET_UNDERLINE.type] = false
  ignoreActionMap[ExcelActions.UNSET_BOLD.type] = false
  ignoreActionMap[ExcelActions.UNSET_ITALIC.type] = false
  ignoreActionMap[ExcelActions.UNSET_STRIKETHROUGH.type] = false
  ignoreActionMap[ExcelActions.UNSET_UNDERLINE.type] = false
  ignoreActionMap[ExcelActions.MERGE_AREA.type] = false

  // HEADER
  ignoreActionMap[ExcelActions.ROW_DRAG_END.type] = false
  ignoreActionMap[ExcelActions.COLUMN_DRAG_END.type] = false

  // OPERATIONS
  ignoreActionMap[ExcelActions.CELL_KEY_DELETE.type] = false

  return ignoreActionMap
}

const ignoredActionsMap = createActionIgnoreMap()

const UndoxExcelStore = undox(
  ExcelStore.reducer,
  undefined,
  undefined,
  ignoredActionsMap
)

export default UndoxExcelStore
