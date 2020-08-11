import { parseFavicon, Icon } from 'parse-favicon'
import { getPageInfo } from '@shared/get-page-info'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { produce } from 'immer'

export async function getIconsFromPage(): Promise<Observable<Icon>> {
  const { url: pageUrl, html } = await getPageInfo()

  return parseFavicon(pageUrl, textFetcher, bufferFetcher)
    .pipe(
      map(icon => produce(icon, icon => {
        icon.url = createAbsoluteUrl(pageUrl, icon.url)
      }))
    )

  function textFetcher(url: string): Promise<string> {
    if (url === pageUrl) return html
    return fetch(createAbsoluteUrl(pageUrl, url))
      .then(res => res.text())
  }

  function bufferFetcher(url: string): Promise<ArrayBuffer> {
    return fetch(createAbsoluteUrl(pageUrl, url))
      .then(res => res.arrayBuffer())
  }
}

function createAbsoluteUrl(base: string, url: string) {
  return new URL(url, base).href
}
