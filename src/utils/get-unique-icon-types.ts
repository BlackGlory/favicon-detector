import { IIcon } from 'parse-favicon'
import { pipe } from 'extra-utils'
import { map, filter, uniq, toArray } from 'iterable-operator'

export function getUniqueIconTypes(icons: IIcon[]): string[] {
  return pipe(
    icons
  , icons => map(icons, x => x.type)
  , types => filter<string | null, string>(types, x => !!x)
  , uniq
  , toArray
  )
}
