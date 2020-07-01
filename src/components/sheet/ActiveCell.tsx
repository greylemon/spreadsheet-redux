import React, { useCallback, Fragment, FunctionComponent } from 'react'
import { Editor, RichUtils, EditorState } from 'draft-js'
import { useTypedSelector } from '../../redux/redux'
import { shallowEqual, useDispatch } from 'react-redux'
import {
  IActiveCellProps,
  INormalActiveCellProps,
  IEditorCellProps,
} from '../../@types/components'
import {
  selectIsEditMode,
  selectFactoryActiveCellStyle,
  selectCellEditorState,
  selectActiveCellPosition,
  selectFreezeColumnCount,
  selectFreezeRowCount,
} from '../../redux/selectors'
import { ExcelActions } from '../../redux/store'

const EditorCell: FunctionComponent<IEditorCellProps> = ({ style }) => {
  const dispatch = useDispatch()

  const editorState = useTypedSelector(
    (state) => selectCellEditorState(state),
    shallowEqual
  )

  const handleChange = useCallback(
    (editorState) =>
      dispatch(ExcelActions.CELL_EDITOR_STATE_UPDATE(editorState)),
    [dispatch]
  )

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      handleChange(newState)
      return 'handled'
    }

    return 'not-handled'
  }

  return (
    <div className="cell__active cell__active--edit" style={style}>
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  )
}

const NormalActiveCell = ({ style }: INormalActiveCellProps) => {
  return <div className="cell__active cell__active--normal" style={style} />
}

const ActiveCell: FunctionComponent<IActiveCellProps> = ({
  computeActiveCellStyle,
  checkIsActiveCellInCorrectPane,
}) => {
  const {
    isEditMode,
    style,
    activeCellPosition,
    freezeColumnCount,
    freezeRowCount,
  } = useTypedSelector(
    (state) => ({
      isEditMode: selectIsEditMode(state),
      style: selectFactoryActiveCellStyle(computeActiveCellStyle)(state),
      activeCellPosition: selectActiveCellPosition(state),
      freezeColumnCount: selectFreezeColumnCount(state),
      freezeRowCount: selectFreezeRowCount(state),
    }),
    shallowEqual
  )

  if (
    !checkIsActiveCellInCorrectPane(
      activeCellPosition,
      freezeColumnCount,
      freezeRowCount
    )
  )
    return <Fragment />

  return isEditMode ? (
    <EditorCell style={style} />
  ) : (
    <NormalActiveCell style={style} />
  )
}

export default ActiveCell