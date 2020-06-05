import React, { FunctionComponent } from 'react'
import { ICell } from '../../../@types/excel/components'
import EditableCell from './EditableCell'
import RowCell from './RowCell'
import ColumnCell from './ColumnCell'
import RootCell from './RootCell'

const Cell = ({ data, style, columnIndex, rowIndex }: ICell) => {
  let CellComponent: FunctionComponent<ICell>

  if (columnIndex && rowIndex) {
    CellComponent = EditableCell
  } else if (rowIndex) {
    CellComponent = RowCell
  } else if (columnIndex) {
    CellComponent = ColumnCell
  } else {
    CellComponent = RootCell
  }

  return (
    <CellComponent
      data={data}
      style={style}
      columnIndex={columnIndex}
      rowIndex={rowIndex}
    />
  )
}

export default Cell