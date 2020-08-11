import { Icon } from 'parse-favicon'

export function computeIconArea(icon: Icon): number {
  return computeSizeArea(icon.size)
}

function computeSizeArea(size: Icon['size']): number {
  if (size === undefined) {
    return 0
  } else if (typeof size === 'string') {
    return Infinity
  } else if (Array.isArray(size)) {
    return size.map(computeSizeArea).reduce((ret, cur) => Math.max(ret, cur))
  } else {
    return size.width * size.height
  }
}
