import React, { FunctionComponent } from 'react'
import { Group } from 'react-konva'
import { IGenergicPaneProps } from '../../@types/components'
import GridLayer from './grid_layer/GridLayer'
import TextLayer from './text_layer/TextLayer'
import ContainerLayer from './container_layer/ContainerLayer'
import BlockLayer from './block_layer/BlockLayer'

const GenericPane: FunctionComponent<IGenergicPaneProps> = ({
  id,
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  rowOffsets,
  columnOffsets,
  getColumnWidth,
  getRowHeight,

  columnStartBound,
  rowStartBound,

  CellComponent,
  data,
  enableRowHeader,
  enableColumnHeader,
}) => (
  <Group>
    <BlockLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
      data={data}
    />
    <GridLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
    />
    <TextLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      CellComponent={CellComponent}
      data={data}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
      enableRowHeader={enableRowHeader}
      enableColumnHeader={enableColumnHeader}
    />
    <ContainerLayer
      id={id}
      rowStart={rowStart}
      rowEnd={rowEnd}
      columnStart={columnStart}
      columnEnd={columnEnd}
      rowOffsets={rowOffsets}
      columnOffsets={columnOffsets}
      getColumnWidth={getColumnWidth}
      getRowHeight={getRowHeight}
      columnStartBound={columnStartBound}
      rowStartBound={rowStartBound}
    />
  </Group>
)

export default GenericPane