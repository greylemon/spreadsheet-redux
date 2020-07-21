import { createSelector } from '@reduxjs/toolkit'
import { DraftInlineStyleType } from 'draft-js'
import {
  selectEditorState,
  selectIsEditMode,
  selectIsSelectionMode,
  selectInactiveSelectionAreas,
} from './base'
import {
  selectCell,
  selectCellFontStyle,
  selectCellBlockStyle,
  selectMerged,
  selectCellType,
} from './activeSheet'
import { IInlineStyles } from '../../@types/state'
import { checkIsAreaEqualPosition } from '../../tools'
import { TYPE_MERGE } from '../../constants/types'

/* eslint-disable */
export const selectFactoryIsStyle = (
  editorStyle: DraftInlineStyleType,
  inlineStyleEqFn: (style: IInlineStyles) => boolean
) =>
  createSelector(
    [selectIsEditMode, selectCell, selectEditorState],
    (isEditMode, activeCell, editorState) => {
      let isToggled = false

      if (isEditMode) {
        isToggled = editorState.getCurrentInlineStyle().has(editorStyle)
      } else {
        if (activeCell && activeCell.style) {
          isToggled = inlineStyleEqFn(activeCell.style.font)
        }
      }

      return isToggled
    }
  )
/* eslint-enable */

export const selectIsBold = selectFactoryIsStyle(
  'BOLD',
  (style) => style.fontWeight === 'bold'
)

export const selectIsUnderline = selectFactoryIsStyle(
  'UNDERLINE',
  (style) =>
    style.textDecoration !== undefined &&
    style.textDecoration.includes('underline')
)

export const selectIsStrikeThrough = selectFactoryIsStyle(
  'STRIKETHROUGH',
  (style) =>
    style.textDecoration !== undefined &&
    style.textDecoration.includes('line-through')
)

export const selectIsItalic = selectFactoryIsStyle(
  'ITALIC',
  (style) => style.fontStyle === 'italic'
)

export const selectCombinedCellStyle = createSelector(
  [selectCellFontStyle, selectCellBlockStyle],
  (fontStyle, blockStyle) => ({ ...fontStyle, ...blockStyle })
)

export const selectIsMergable = createSelector(
  [
    selectInactiveSelectionAreas,
    selectIsSelectionMode,
    selectCellType,
    selectMerged,
  ],
  (inactiveSelectionAreas, isSelectionMode, cellType, merged) =>
    !isSelectionMode &&
    ((inactiveSelectionAreas.length === 1 &&
      !checkIsAreaEqualPosition(inactiveSelectionAreas[0])) ||
      (inactiveSelectionAreas.length === 0 &&
        cellType !== TYPE_MERGE &&
        merged))
)