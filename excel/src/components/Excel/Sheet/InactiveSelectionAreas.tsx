import React, { Fragment } from 'react'
import { IInactiveSelectionAreasProps } from '../../../@types/excel/components'
import { useTypedSelector } from '../../../redux'
import { selectFactoryInactiveSelectionAreasStyle } from '../../../redux/ExcelStore/selectors'

const InactiveSelectionAreas = ({
  computeSelectionAreaStyle,
  checkIsAreaInRelevantPane,
}: IInactiveSelectionAreasProps) => {
  const inactiveSelectionAreasStyle = useTypedSelector((state) =>
    selectFactoryInactiveSelectionAreasStyle(
      computeSelectionAreaStyle,
      checkIsAreaInRelevantPane
    )(state)
  )

  if (!inactiveSelectionAreasStyle.length) return null

  return (
    <Fragment>
      {inactiveSelectionAreasStyle.map((inactiveSelectionAreaStyle) => (
        <div
          className="selectionArea__inactive"
          style={inactiveSelectionAreaStyle}
        />
      ))}
    </Fragment>
  )
}

export default InactiveSelectionAreas
