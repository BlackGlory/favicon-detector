export function getMaxSize(sizes: Array<{ width: number, height: number }>): { width: number, height: number } {
  return sizes.reduce((ret, cur) => {
    if (getArea(cur) > getArea(ret)) {
      return cur
    } else {
      return ret
    }
  })

  function getArea(size: { width: number, height: number }): number {
    return size.width * size.height
  }
}
