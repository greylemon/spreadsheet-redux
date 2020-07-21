import React, { ChangeEvent, FunctionComponent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Publish } from '@material-ui/icons'
import { loadWorkbook } from '../../redux/thunk'
import { SmallLabelButton } from '../misc/buttons'

const FileUploadAction: FunctionComponent = () => {
  const dispatch = useDispatch()
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target

      if (files) {
        const file = files[0]

        dispatch(loadWorkbook(file))
      }
    },
    [dispatch]
  )

  return (
    <SmallLabelButton title="Upload">
      <>
        <Publish />
        <input
          type="file"
          style={{ display: 'none' }}
          accept=".xlsx, .xls"
          onChange={handleChange}
        />
      </>
    </SmallLabelButton>
  )
}

const IOSection: FunctionComponent = () => (
  <div>
    <FileUploadAction />
  </div>
)

export default IOSection