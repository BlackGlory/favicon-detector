export function getMaxSize(sizes: Array<{ width: number, height: number }>): {
  width: number
  height: number
} {
  return sizes.reduce((ret, cur) => {
    if (computeSizeArea(cur) > computeSizeArea(ret)) {
      return cur
    } else {
      return ret
    }
  })
}

function computeSizeArea(size: { width: number, height: number }): number {
  return size.width * size.height
}
