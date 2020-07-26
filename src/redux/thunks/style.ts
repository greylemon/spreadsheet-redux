import { IAppThunk } from '../../@types/store'
import { ExcelActions } from '../store'
import {
  selectIsBold,
  selectIsUnderline,
  selectIsStrikeThrough,
  selectIsItalic,
} from '../selectors/style'
import { getGeneralActionPayload } from '../tools/history'

export const THUNK_TOGGLE_BOLD = (): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const isBold = selectIsBold(state)
  const payload = getGeneralActionPayload(getState())

  dispatch(
    isBold ? ExcelActions.UNSET_BOLD(payload) : ExcelActions.SET_BOLD(payload)
  )
}

export const THUNK_TOGGLE_ITALIC = (): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const isItalic = selectIsItalic(state)
  const payload = getGeneralActionPayload(getState())

  dispatch(
    isItalic
      ? ExcelActions.UNSET_ITALIC(payload)
      : ExcelActions.SET_ITALIC(payload)
  )
}

export const THUNK_TOGGLE_STRIKETHROUGH = (): IAppThunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const isStrikethrough = selectIsStrikeThrough(state)
  const payload = getGeneralActionPayload(getState())

  dispatch(
    isStrikethrough
      ? ExcelActions.UNSET_STRIKETHROUGH(payload)
      : ExcelActions.SET_STRIKETHROUGH(payload)
  )
}

export const THUNK_TOGGLE_UNDERLINE = (): IAppThunk => (dispatch, getState) => {
  const state = getState()
  const isUnderline = selectIsUnderline(state)
  const payload = getGeneralActionPayload(getState())

  dispatch(
    isUnderline
      ? ExcelActions.UNSET_UNDERLINE(payload)
      : ExcelActions.SET_UNDERLINE(payload)
  )
}

export const THUNK_MERGE_AREA = (): IAppThunk => (dispatch, getState) => {
  dispatch(ExcelActions.MERGE_AREA(getGeneralActionPayload(getState())))
}