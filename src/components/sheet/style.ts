import { CSSProperties } from 'react'
import {
  STYLE_SHEET_NAVIGATION_HEIGHT,
  STYLE_TOOL_BAR_HEIGHT,
} from '../../constants/styles'

const sheet: CSSProperties = {
  width: '100%',
  height: `calc(100% - ${
    STYLE_TOOL_BAR_HEIGHT + STYLE_SHEET_NAVIGATION_HEIGHT
  }px)`,
}

export default sheet