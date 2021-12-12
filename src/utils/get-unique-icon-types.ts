import { Icon } from 'parse-favicon'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'

export function getUniqueIconTypes(icons: Icon[]): string[] {
  return new IterableOperator(icons)
    .map(x => x.type)
    .filter<string>(x => !!x)
    .uniq()
    .toArray()
}
