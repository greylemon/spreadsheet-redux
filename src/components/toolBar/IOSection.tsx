import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import { loadWorkbook } from '../../redux/thunk'
import { Publish } from '@material-ui/icons'
import { SmallLabelButton } from '../misc/buttons'

const FileUploadAction: FunctionComponent = () => {
  const dispatch = useDispatch()
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files

      if (files) {
        const file = files[0]

        dispatch(loadWorkbook(file))
      }
    },
    [dispatch]
  )

  return (
    <SmallLabelButton title="Upload">
      <Fragment>
        <Publish />
        <input
          type="file"
          style={{ display: 'none' }}
          accept=".xlsx, .xls"
          onChange={handleChange}
        />
      </Fragment>
    </SmallLabelButton>
  )
}

const IOSection: FunctionComponent = () => (
  <div>
    <FileUploadAction />
  </div>
)

export default IOSection
