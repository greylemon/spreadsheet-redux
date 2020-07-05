import {
  IPosition,
  ISelectionArea,
  IRange,
  IArea,
  IAreaRange,
} from '../@types/state'

export const getMinPositionFromArea = ({ start, end }: IArea): IPosition => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
})

export const getMaxPositionFromArea = ({ start, end }: IArea): IPosition => ({
  x: Math.max(start.x, end.x),
  y: Math.max(start.y, end.y),
})

export const checkIsAreaRangeContainedInOtherAreaRange = (
  areaRange: IAreaRange,
  otherAreaRange: IAreaRange
): boolean =>
  checkIsRangeContainedInOtherRange(areaRange.xRange, otherAreaRange.xRange) &&
  checkIsRangeContainedInOtherRange(areaRange.yRange, otherAreaRange.yRange)

export const checkIsSelectionAreaEqualPosition = ({
  start,
  end,
}: ISelectionArea): boolean => start.x === end.x && start.y === end.y

export const checkIsRangeContainedInOtherRange = (
  range: IRange,
  otherRange: IRange
): boolean => otherRange.start <= range.start && range.end <= otherRange.end

export const getOrderedAreaFromPositions = (
  position: IPosition,
  position2: IPosition
): IArea => ({
  start: {
    x: Math.min(position.x, position2.x),
    y: Math.min(position.y, position2.y),
  },
  end: {
    x: Math.max(position.x, position2.x),
    y: Math.max(position.y, position2.y),
  },
})

export const getOrderedAreaFromArea = (area: IArea): IArea => ({
  start: getMinPositionFromArea(area),
  end: getMaxPositionFromArea(area),
})

export const getAreaRanges = (area: IArea): IAreaRange => {
  const orderedArea = getOrderedAreaFromArea(area)

  return getAreaRangesFromOrderedArea(orderedArea)
}

export const getAreaRangesFromOrderedArea = (
  orderedArea: IArea
): IAreaRange => ({
  xRange: { start: orderedArea.start.x, end: orderedArea.end.x } as IRange,
  yRange: { start: orderedArea.start.y, end: orderedArea.end.y } as IRange,
})

export const checkIsPositionEqualOtherPosition = (
  position: IPosition,
  otherPosition: IPosition
): boolean => position.x === otherPosition.x && position.y === otherPosition.y

export const getAreaFromPosition = (position: IPosition): IArea => ({
  start: { ...position },
  end: { ...position },
})

export const getAreaDifference = (
  areaToSubtract: IArea,
  area: IArea
): IArea[] => {
  const areaDifference: Array<IArea> = []

  const areaRange = getAreaRanges(area)
  const areaToSubtractRange = getAreaRanges(areaToSubtract)

  const minSX = areaRange.xRange.start
  const midLeftSX = areaToSubtractRange.xRange.start
  const midRightSX = areaToSubtractRange.xRange.end
  const maxSX = areaRange.xRange.end

  const minSY = areaRange.yRange.start
  const midTopSY = areaToSubtractRange.yRange.start
  const midBottomSY = areaToSubtractRange.yRange.end
  const maxSY = areaRange.yRange.end

  if (minSY !== midTopSY)
    areaDifference.push({
      start: {
        x: minSX,
        y: minSY,
      },
      end: {
        x: maxSX,
        y: midTopSY - 1,
      },
    })
  if (minSX !== midLeftSX)
    areaDifference.push({
      start: {
        x: minSX,
        y: midTopSY,
      },
      end: {
        x: midLeftSX - 1,
        y: midBottomSY,
      },
    })
  if (maxSX !== midRightSX)
    areaDifference.push({
      start: {
        x: midRightSX + 1,
        y: midTopSY,
      },
      end: {
        x: maxSX,
        y: midBottomSY,
      },
    })
  if (maxSY !== midBottomSY)
    areaDifference.push({
      start: {
        x: minSX,
        y: midBottomSY + 1,
      },
      end: {
        x: maxSX,
        y: maxSY,
      },
    })

  return areaDifference
}

export const getAndAddAreaFromSuperAreaIndex = (
  superAreaIndex: number,
  area: IArea,
  areas: Array<IArea>
): IArea[] => [
  ...areas.slice(0, superAreaIndex),
  ...getAreaDifference(area, areas[superAreaIndex]),
  ...areas.slice(superAreaIndex + 1),
]

export const getAndAddArea = (
  area: IArea,
  areas: Array<IArea>
): {
  superAreaIndex: number
  newAreas: IArea[]
} => {
  let newAreas: Array<IArea>

  const superAreaIndex = getFirstSuperAreaIndex(area, areas)

  if (superAreaIndex > -1) {
    newAreas = getAndAddAreaFromSuperAreaIndex(superAreaIndex, area, areas)
  } else {
    newAreas = [...areas, area]
  }

  return { superAreaIndex, newAreas }
}

/**
 * Finds the index of the first superset of area
 */
export const getFirstSuperAreaIndex = (
  area: IArea,
  areas: Array<IArea>
): number => {
  const orderedArea = getOrderedAreaFromArea(area)

  const areaRanges = getAreaRangesFromOrderedArea(orderedArea)

  return areas.findIndex((elementArea) => {
    const potentialSuperArea = getOrderedAreaFromArea(elementArea)
    const potentialSuperAreaRanges = getAreaRangesFromOrderedArea(
      potentialSuperArea
    )

    return checkIsAreaRangeContainedInOtherAreaRange(
      areaRanges,
      potentialSuperAreaRanges
    )
  })
}

export const getCellMapSetFromAreas = (
  areas: IArea[]
): { [key: string]: Set<number> } => {
  const cellMapSet: { [key: number]: Set<number> } = {}

  areas.forEach((area) => {
    const { xRange, yRange } = getAreaRanges(area)

    for (let rowIndex = yRange.start; rowIndex <= yRange.end; rowIndex++) {
      if (!cellMapSet[rowIndex]) cellMapSet[rowIndex] = new Set()

      for (
        let columnIndex = xRange.start;
        columnIndex <= xRange.end;
        columnIndex++
      )
        cellMapSet[rowIndex].add(columnIndex)
    }
  })

  return cellMapSet
}
