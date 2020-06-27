import { CSSProperties } from 'react'
import {
  IRows,
  IRowOffsets,
  IPosition,
  IFreezeColumnCount,
  IFreezeRowCount,
  IColumnWidths,
  IRowHeights,
  IColumnOffsets,
  ISelectionArea,
  IExcelState,
} from './state'

export interface IComputeActiveCellStyle {
  (
    position: IPosition,
    columnWidths: IColumnWidths,
    columnOffsets: IColumnOffsets,
    rowHeights: IRowHeights,
    rowOffsets: IRowOffsets,
    freezeRowCount: IFreezeRowCount,
    data: IRows
  ): CSSProperties
}

export interface IComputeSelectionAreaStyle {
  (
    columnWidths: IColumnWidths,
    columnOffsets: IColumnOffsets,
    rowHeights: IRowHeights,
    rowOffsets: IRowOffsets,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    selectionArea?: ISelectionArea
  ): CSSProperties
}

export interface ICheckIsAreaInRelevantPane {
  (
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount,
    area?: ISelectionArea
  ): boolean
}

export interface ICheckIsActiveCellInCorrectPane {
  (
    position: IPosition,
    freezeColumnCount: IFreezeColumnCount,
    freezeRowCount: IFreezeRowCount
  ): boolean
}

export interface IHandleSave {
  (excelState: IExcelState): any
}
