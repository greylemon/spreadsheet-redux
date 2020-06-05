export type IPosition = { x: number; y: number }

export type IArea = { start: IPosition; end: IPosition }

export type IRange = { start: number; end: number }

export type IError = object

export type ICSSLength = number | string
export type ICSSPercentage = string

export type IBlockStyles = {
  borderTopColor?: any
  borderTopWidth?: any
  borderTopStyle?: any

  borderLeftColor?: any
  borderLeftWidth?: any
  borderLeftStyle?: any

  borderRightColor?: any
  borderRightWidth?: any
  borderRightStyle?: any

  borderBottomColor?: any
  borderBottomWidth?: any
  borderBottomStyle?: any
}

export type IInlineStyles = {
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  fontFamily?: any
  fontSize?: ICSSLength | ICSSPercentage
  textDecoration?:
    | 'underline'
    | 'line-through'
    | 'underline line-through'
    | 'line-through underline'
  verticalAlign?: 'sub' | 'super'
  color?: any
}

export type IStyles = IBlockStyles & IInlineStyles

export type IFragment = {
  value: string
  styles: IInlineStyles
}

export type IRichText = IFragment[]

export type IHyperlink = {
  type: 'external' | 'internal'
  link: string
}

export type ICell = {
  value?: string | IRichText
  formula?: string
  hyperlink?: IHyperlink
  merged?: IArea
}

export type IOffset = number
export type IRowOffsets = Array<IOffset>
export type IColumnOffsets = Array<IOffset>

export type IColumns = { [key: number]: ICell }

export type IRows = { [key: number]: IColumns }

export type IColumnIndex = number
export type IRowIndex = number

export type IGridMeasurements<T> = { [key: number]: T }

export type IColumnWidth = number
export type IColumnWidths = IGridMeasurements<IColumnWidth>

export type IRowheight = number
export type IRowHeights = IGridMeasurements<IRowheight>

export type IRowCount = number
export type IColumnCount = number
export type IFreezeColumnCount = number
export type IFreezeRowCount = number

export type IIsEditMode = boolean
export type IIsSelectionMode = boolean

export type ISheetName = string

export type IActiveCellPosition = IPosition

export type IStagnantSelectionAreas = IArea[]

export type ISelectionArea = IArea

export type ISelectionAreaIndex = number

export type ISheet = {
  data: IRows

  activeCellPosition: IActiveCellPosition
  selectionArea?: ISelectionArea
  stagnantSelectionAreas: IStagnantSelectionAreas

  selectionAreaIndex: ISelectionAreaIndex

  sheetName: ISheetName

  isEditMode: IIsEditMode
  isSelectionMode: IIsSelectionMode

  rowCount: IRowCount
  columnCount: IColumnCount

  columnWidths: IColumnWidths
  rowHeights: IRowHeights

  freezeColumnCount: IFreezeColumnCount
  freezeRowCount: IFreezeRowCount

  error: IError
}

export type IInactiveSheets = {
  [key: string]: ISheet
}

export type IExcelState = ISheet & { inactiveSheets: IInactiveSheets }