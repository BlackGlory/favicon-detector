import { parseFavicon, IIcon } from 'parse-favicon'
import { getPageInfo } from '@utils/get-page-info'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Awaitable } from '@blackglory/prelude'
import { produce } from 'immer'

export async function getIconsFromPage(): Promise<Observable<IIcon>> {
  const { url: pageUrl, html } = await getPageInfo()

  return parseFavicon(pageUrl, textFetcher, bufferFetcher)
    .pipe(
      map(icon => produce(icon, icon => {
        icon.url = createAbsoluteUrl(pageUrl, icon.url)
      }))
    )

  function textFetcher(url: string): Awaitable<string> {
    if (url === pageUrl) {
      return html
    } else {
      return fetch(createAbsoluteUrl(pageUrl, url))
        .then(res => res.text())
    }
  }

  function bufferFetcher(url: string): Awaitable<ArrayBuffer> {
    return fetch(createAbsoluteUrl(pageUrl, url))
      .then(res => res.arrayBuffer())
  }
}

function createAbsoluteUrl(base: string, url: string) {
  return new URL(url, base).href
}
