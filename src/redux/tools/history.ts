import { Dispatch } from '@reduxjs/toolkit'
import {
  selectActiveCellPosition,
  selectInactiveSelectionAreas,
  selectCellEditorState,
} from '../selectors/base'
import IRootStore from '../../@types/store'
import { IGeneralActionPayload } from '../../@types/history'
import { ExcelActions } from '../store'
import { selectCell, selectData } from '../selectors/activeSheet'
import { createValueFromCellAndEditorState } from '../../tools/text'
import { isCellEqualOtherCell } from './compare'
import { selectPosition } from '../selectors/custom'

export const getGeneralActionPayload = (
  state: IRootStore
): IGeneralActionPayload => ({
  activeCellPosition: selectActiveCellPosition(state),
  inactiveSelectionAreas: selectInactiveSelectionAreas(state),
})

export const dispatchSaveActiveCell = (
  dispatch: Dispatch,
  state: IRootStore
) => {
  const newCell = createValueFromCellAndEditorState(
    selectData(state),
    selectCell(state),
    selectCellEditorState(state)
  )

  if (!isCellEqualOtherCell(newCell, selectCell(state)))
    dispatch(
      ExcelActions.SAVE_ACTIVE_CELL({
        cell: newCell,
        inactiveSelectionAreas: selectInactiveSelectionAreas(state),
        activeCellPosition: selectPosition(state),
      })
    )
}
