import FormulaParser from 'fast-formula-parser'
import cloneDeep from 'clone-deep'
import { ICellRefMap, IVisited } from '../@types/objects'
import {
  IPosition,
  ISheetName,
  IDependentReferences,
  IIndependentReferences,
  IExcelState,
  IResults,
  ISheetsMap,
  ICell,
} from '../@types/state'
import { sheetNameAdressRegex } from './regex'
import {
  convertAddressRangeToRange,
  convertStringPositionToPosition,
} from './conversion'
import { TYPE_FORMULA, TYPE_NUMBER, TYPE_TEXT } from '../constants/types'
import { Queue } from './data_structures/queue'

export const createFormulaParser = (sheetsMap: ISheetsMap): FormulaParser =>
  new FormulaParser({
    onCell: ({ sheet, row: rowIndex, col: columnIndex }) => {
      let value: string | number | null = null
      const sheetContent = sheetsMap[sheet].data

      const { results } = window

      if (sheetContent) {
        if (sheetContent[rowIndex] && sheetContent[rowIndex][columnIndex]) {
          const cell = sheetContent[rowIndex][columnIndex]

          switch (cell.type) {
            case TYPE_FORMULA:
              if (results[sheet] && results[sheet][rowIndex] !== undefined)
                value = results[sheet][rowIndex][columnIndex]
              break
            case TYPE_NUMBER:
            case TYPE_TEXT:
              value = cell.value as string | number
              break
            default:
              break
          }
        }
      }

      return value
    },
    onRange: ({ from, to, sheet }) => {
      const rangeData = []
      const sheetContent = sheetsMap[sheet].data

      const { results } = window

      if (sheetContent) {
        for (let rowIndex = from.row; rowIndex <= to.row; rowIndex += 1) {
          const row = sheetContent[rowIndex]
          const rowArray = []
          if (row) {
            for (
              let columnIndex = from.col;
              columnIndex <= to.col;
              columnIndex += 1
            ) {
              const cell = row[columnIndex]
              let value: string | number | null = null

              if (cell) {
                switch (cell.type) {
                  case TYPE_FORMULA:
                    if (
                      results[sheet] &&
                      results[sheet][rowIndex] !== undefined
                    )
                      value = results[sheet][rowIndex][columnIndex]
                    break
                  case TYPE_NUMBER:
                  case TYPE_TEXT:
                    value = cell.value as string | number
                    break
                  default:
                    break
                }
              }

              rowArray.push(value)
            }
          }

          rangeData.push(rowArray)
        }
      }

      return rangeData
    },
  })

export const createCellRefMap = (
  formula: string,
  sheetName: ISheetName
): ICellRefMap => {
  const cellRefMap: ICellRefMap = {}

  const addresses = formula.match(sheetNameAdressRegex)
  // Get the references in the formula
  if (addresses) {
    addresses.forEach((address) => {
      let adrSheetName = sheetName
      let adrRef = address
      if (address.includes('!')) {
        const [refSheetName, ref] = address.split('!')
        adrRef = ref
        adrSheetName =
          refSheetName.startsWith("'") && refSheetName.endsWith("'")
            ? refSheetName.substring(1, refSheetName.length - 1)
            : refSheetName
      }

      if (!cellRefMap[adrSheetName])
        cellRefMap[adrSheetName] = {
          positions: [],
          areaRanges: [],
        }

      if (adrRef.includes(':')) {
        cellRefMap[adrSheetName].areaRanges.push(
          convertAddressRangeToRange(adrRef)
        )
      } else {
        cellRefMap[adrSheetName].positions.push(
          convertStringPositionToPosition(adrRef)
        )
      }
    })
  }

  return cellRefMap
}

/**
 * For these functions, assume that the state value have already been updated...
 */

/**
 * Clear sheet results
 * Clear sheet dependents
 * Go through sheet independents and recompute the dependents values
 */
export const updateReferencesDeleteSheet = (
  sheetName: ISheetName,
  dependents: IDependentReferences,
  // independents: IIndependentReferences,
  results: IResults
): void => {
  delete results[sheetName]
  delete dependents[sheetName]

  // const sheetIndependents = independents[sheetName]
}

const assignSheetIndependents = (
  independents: IIndependentReferences,
  sheetName: ISheetName,
  dependentSheetName: ISheetName,
  position: IPosition,
  dependentPosition: IPosition
): void => {
  const { x, y } = position
  if (!independents[sheetName]) independents[sheetName] = {}
  if (!independents[sheetName][y]) independents[sheetName][y] = {}
  if (!independents[sheetName][y][x]) independents[sheetName][y][x] = {}
  if (!independents[sheetName][y][x][dependentSheetName])
    independents[sheetName][y][x][dependentSheetName] = {}
  if (!independents[sheetName][y][x][dependentSheetName][dependentPosition.y])
    independents[sheetName][y][x][dependentSheetName][dependentPosition.y] = {}
  if (
    !independents[sheetName][y][x][dependentSheetName][dependentPosition.y][
      dependentPosition.x
    ]
  )
    independents[sheetName][y][x][dependentSheetName][dependentPosition.y][
      dependentPosition.x
    ] = true
}

const assignResult = (
  parser: FormulaParser,
  sheetsMap: ISheetsMap,
  sheetName: ISheetName,
  position: IPosition
) => {
  try {
    const { results } = window

    if (!results[sheetName]) results[sheetName] = {}
    if (!results[sheetName][position.y]) results[sheetName][position.y] = {}

    results[sheetName][position.y][position.x] = parser.parse(
      sheetsMap[sheetName].data[position.y][position.x].value,
      {
        sheet: sheetName,
        row: position.y,
        col: position.x,
      }
    )
  } catch (error) {
    console.error(
      `Error at [ sheet name: ${sheetName} | position:  ${JSON.stringify(
        position
      )} ] - ${error}`
    )
  }
}

const computeDependents = (
  parser: FormulaParser,
  sheetsMap: ISheetsMap,
  sheetName: ISheetName,
  position: IPosition,
  independents: IIndependentReferences,
  visited: IVisited
) => {
  const queue = new Queue()

  if (
    independents[sheetName] &&
    independents[sheetName][position.y] &&
    independents[sheetName][position.y][position.x]
  ) {
    const sheetDependents = independents[sheetName][position.y][position.x]

    Object.keys(sheetDependents).forEach((dependentSheetName) => {
      const sheetDependent = sheetDependents[dependentSheetName]

      if (!visited[dependentSheetName]) visited[dependentSheetName] = {}

      Object.keys(sheetDependent).forEach((rowIndex) => {
        const rowDependents = sheetDependent[rowIndex]
        if (!visited[dependentSheetName][rowIndex])
          visited[dependentSheetName][rowIndex] = new Set()

        Object.keys(rowDependents).forEach((columnIndex) => {
          queue.enqueue({
            position: { x: +columnIndex, y: +rowIndex },
            sheetName: dependentSheetName,
          })
        })
      })
    })
  }

  while (!queue.isEmpty()) {
    const {
      sheetName: poppedSheetName,
      position: poppedPosition,
    } = queue.dequeue()

    if (
      !visited[poppedSheetName] ||
      !visited[poppedSheetName][poppedPosition.y] ||
      !visited[poppedSheetName][poppedPosition.y].has(+poppedPosition.x)
    ) {
      visited[poppedSheetName][poppedPosition.y].add(poppedPosition.x)
      assignResult(parser, sheetsMap, poppedSheetName, poppedPosition)
    }

    if (
      independents[poppedSheetName] &&
      independents[poppedSheetName][poppedPosition.y] &&
      independents[poppedSheetName][poppedPosition.y][poppedPosition.x]
    ) {
      const sheetDependents =
        independents[poppedSheetName][poppedPosition.y][poppedPosition.x]

      Object.keys(sheetDependents).forEach((dependentSheetName) => {
        const sheetDependent = sheetDependents[dependentSheetName]

        if (!visited[dependentSheetName]) visited[dependentSheetName] = {}

        Object.keys(sheetDependent).forEach((rowIndex) => {
          const rowDependents = sheetDependent[rowIndex]
          if (!visited[dependentSheetName][rowIndex])
            visited[dependentSheetName][rowIndex] = new Set()

          Object.keys(rowDependents).forEach((columnIndex) => {
            if (!visited[dependentSheetName][rowIndex].has(+columnIndex)) {
              queue.enqueue({
                position: { x: +columnIndex, y: +rowIndex },
                sheetName: dependentSheetName,
              })
            }
          })
        })
      })
    }
  }
}

export const updateReferenceCell = (
  state: IExcelState,
  visited: IVisited,
  focusedCell: ICell,
  focusedCellPosition: IPosition,
  focusedSheetName: ISheetName
): void => {
  const dependents = state.dependentReferences
  const independents = state.independentReferences
  const { results } = state
  const { sheetsMap } = state
  const parser: FormulaParser = createFormulaParser(sheetsMap)

  window.results = results

  // Result is to be recomputed because we changed the value
  if (
    results[focusedSheetName] &&
    results[focusedSheetName][focusedCellPosition.y] &&
    results[focusedSheetName][focusedCellPosition.y][focusedCellPosition.x]
  ) {
    delete results[focusedSheetName][focusedCellPosition.y][
      focusedCellPosition.x
    ]
  }

  // Dependents need to be removed
  if (
    dependents[focusedSheetName] &&
    dependents[focusedSheetName][focusedCellPosition.y] &&
    dependents[focusedSheetName][focusedCellPosition.y][focusedCellPosition.x]
  ) {
    delete dependents[focusedSheetName][focusedCellPosition.y][
      focusedCellPosition.x
    ]

    // const sheetIndependents =
    //   dependents[focusedSheetName][focusedCellPosition.y][focusedCellPosition.x]

    // ! This doesn't work.. how to remove independents properly?
    // for (const sheetName in sheetIndependents) {
    //   const { areaRanges, positions } = sheetIndependents[sheetName]

    //   if (positions) {
    //     for (const position of positions) {
    //       const { x, y } = position

    //       delete independents[sheetName][y][x]
    //     }
    //   }

    //   if (areaRanges) {
    //     for (const areaRange of areaRanges) {
    //       const { xRange, yRange } = areaRange

    //       for (
    //         let rowIndex = yRange.start;
    //         rowIndex <= yRange.end;
    //         rowIndex += 1
    //       ) {
    //         for (
    //           let columnIndex = xRange.start;
    //           columnIndex <= xRange.end;
    //           columnIndex += 1
    //         ) {
    //           delete independents[sheetName][rowIndex][columnIndex]
    //         }
    //       }
    //     }
    //   }
    // }
  }

  // Dependents and independents need to be created due to formula
  if (focusedCell && focusedCell.type === TYPE_FORMULA) {
    // TODO
    // ! Check for cyclic dependencies
    const formulaReferences = createCellRefMap(
      focusedCell.value as string,
      focusedSheetName
    )
    const { x, y } = focusedCellPosition
    if (!dependents[focusedSheetName]) dependents[focusedSheetName] = {}
    if (!dependents[focusedSheetName][y]) dependents[focusedSheetName][y] = {}
    if (!dependents[focusedSheetName][y][x])
      dependents[focusedSheetName][y][x] = {}

    const formulaIndependents = dependents[focusedSheetName][y][x]

    // create new dependents
    Object.keys(formulaReferences).forEach((sheetName) => {
      const sheetFormulaDependents = formulaReferences[sheetName]
      const { areaRanges, positions } = sheetFormulaDependents

      if (!formulaIndependents[sheetName]) formulaIndependents[sheetName] = {}

      if (areaRanges) formulaIndependents[sheetName].areaRanges = areaRanges
      if (positions) formulaIndependents[sheetName].positions = positions

      if (!independents[sheetName]) independents[sheetName] = {}

      positions.forEach((position) => {
        assignSheetIndependents(
          independents,
          sheetName,
          focusedSheetName,
          position,
          focusedCellPosition
        )
      })

      areaRanges.forEach((areaRange) => {
        const { xRange, yRange } = areaRange

        for (
          let rowIndex = yRange.start;
          rowIndex <= yRange.end;
          rowIndex += 1
        ) {
          for (
            let columnIndex = xRange.start;
            columnIndex <= xRange.end;
            columnIndex += 1
          ) {
            assignSheetIndependents(
              independents,
              sheetName,
              focusedSheetName,
              { x: columnIndex, y: rowIndex },
              focusedCellPosition
            )
          }
        }
      })
    })

    // ! Recompute value
    assignResult(parser, sheetsMap, focusedSheetName, focusedCellPosition)

    visited[focusedSheetName] = {
      [focusedCellPosition.y]: new Set(),
    }

    visited[focusedSheetName][focusedCellPosition.y].add(focusedCellPosition.x)
  }

  // Look at dependents of this cell and recompute...
  computeDependents(
    parser,
    state.sheetsMap,
    focusedSheetName,
    focusedCellPosition,
    independents,
    visited
  )

  delete window.results
}

export const visitFormulaCell = (
  parser: FormulaParser,
  state: IExcelState,
  visited: IVisited,
  sheetName: ISheetName,
  curPosition: IPosition,
  formula: string
): void => {
  const { sheetsMap } = state
  const independents = state.independentReferences
  const dependents = state.dependentReferences

  const cellRefMap = createCellRefMap(formula, sheetName)

  if (!visited[sheetName]) visited[sheetName] = {}

  const visitedSheet = visited[sheetName]

  if (!visitedSheet[curPosition.y]) visitedSheet[curPosition.y] = new Set()
  if (!visitedSheet[curPosition.y].has(+curPosition.x))
    visitedSheet[curPosition.y].add(+curPosition.x)

  if (!dependents[sheetName]) dependents[sheetName] = {}
  if (!dependents[sheetName][curPosition.y])
    dependents[sheetName][curPosition.y] = {}
  if (!dependents[sheetName][curPosition.y][curPosition.x])
    dependents[sheetName][curPosition.y][curPosition.x] = {}

  const formulaIndependents =
    dependents[sheetName][curPosition.y][curPosition.x]

  Object.keys(cellRefMap).forEach((refSheetName) => {
    if (sheetsMap[refSheetName]) {
      if (!visited[refSheetName]) visited[refSheetName] = {}

      const { areaRanges, positions } = cellRefMap[refSheetName]
      const refVisitedSheet = visited[refSheetName]

      if (!formulaIndependents[refSheetName])
        formulaIndependents[refSheetName] = {}

      if (areaRanges) formulaIndependents[refSheetName].areaRanges = areaRanges
      if (positions) formulaIndependents[refSheetName].positions = positions

      const refSheet = sheetsMap[refSheetName].data

      positions.forEach((position) => {
        const { x, y } = position

        if (!refVisitedSheet[y]) refVisitedSheet[y] = new Set()
        if (!refVisitedSheet[y].has(x)) {
          refVisitedSheet[y].add(x)

          if (refSheet[y] && refSheet[y][x]) {
            const cell = refSheet[y][x]

            if (cell.type === TYPE_FORMULA) {
              visitFormulaCell(
                parser,
                state,
                visited,
                refSheetName,
                position,
                cell.value as string
              )
            }
          }
        }

        assignSheetIndependents(
          independents,
          refSheetName,
          sheetName,
          position,
          curPosition
        )
      })

      areaRanges.forEach((areaRange) => {
        const { xRange, yRange } = areaRange

        for (
          let rowIndex = yRange.start;
          rowIndex <= yRange.end;
          rowIndex += 1
        ) {
          const row = refSheet[rowIndex]
          if (!refVisitedSheet[rowIndex]) refVisitedSheet[rowIndex] = new Set()

          for (
            let columnIndex = xRange.start;
            columnIndex <= xRange.end;
            columnIndex += 1
          ) {
            const position = { x: +columnIndex, y: +rowIndex }

            if (!refVisitedSheet[rowIndex].has(columnIndex)) {
              refVisitedSheet[rowIndex].add(columnIndex)

              if (refSheet[rowIndex] && refSheet[rowIndex][columnIndex]) {
                const cell = row[columnIndex]
                if (cell.type === TYPE_FORMULA) {
                  visitFormulaCell(
                    parser,
                    state,
                    visited,
                    refSheetName,
                    position,
                    cell.value as string
                  )
                }
              }
            }

            assignSheetIndependents(
              independents,
              refSheetName,
              sheetName,
              position,
              curPosition
            )
          }
        }
      })
    }
  })

  assignResult(parser, sheetsMap, sheetName, curPosition)
}

/**
 * Visits cells from top down
 */
export const updateWorkbookReference = (state: IExcelState): IExcelState => {
  const visited: IVisited = {}

  const { sheetsMap } = state

  const parser: FormulaParser = createFormulaParser(sheetsMap)

  window.results = state.results

  Object.keys(sheetsMap).forEach((sheetName) => {
    const sheet = sheetsMap[sheetName].data

    if (!visited[sheetName]) visited[sheetName] = {}

    Object.keys(sheet).forEach((rowIndex) => {
      const row = sheet[rowIndex]

      if (!visited[sheetName][rowIndex])
        visited[sheetName][rowIndex] = new Set()

      Object.keys(row).forEach((columnIndex) => {
        const cell = row[columnIndex]

        if (!visited[sheetName][rowIndex].has(+columnIndex)) {
          visited[sheetName][rowIndex].add(+columnIndex)

          if (cell.type === TYPE_FORMULA) {
            visitFormulaCell(
              parser,
              state,
              visited,
              sheetName,
              { x: +columnIndex, y: +rowIndex },
              cell.value as string
            )
          }
        }
      })
    })
  })

  // Update references
  state.independentReferences = cloneDeep(state.independentReferences)
  state.dependentReferences = cloneDeep(state.dependentReferences)
  state.results = cloneDeep(state.results)

  delete window.results

  return state
}
