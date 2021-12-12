import { Icon } from 'parse-favicon'
import { isArray, isNull, isString } from '@blackglory/types'

export function computeIconArea(icon: Icon): number {
  return computeSizeArea(icon.size)
}

function computeSizeArea(size: Icon['size']): number {
  if (isNull(size)) {
    return 0
  } else if (isString(size)) {
    return Infinity
  } else if (isArray(size)) {
    return size.map(computeSizeArea).reduce((ret, cur) => Math.max(ret, cur))
  } else {
    return size.width * size.height
  }
}
