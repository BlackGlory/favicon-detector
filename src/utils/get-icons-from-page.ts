import { parseFavicon, IIcon } from 'parse-favicon'
import { getPageInfo } from '@utils/get-page-info'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { assert, Awaitable } from '@blackglory/prelude'
import { produce } from 'immer'
import { getActiveTab } from 'extra-webextension'

export async function getIconsFromPage(): Promise<Observable<IIcon>> {
  const activeTab = await getActiveTab()
  assert(activeTab.id, 'The activeTab.id is undefined')

  const page = await getPageInfo(activeTab.id)

  return parseFavicon(page.url, textFetcher, bufferFetcher)
    .pipe(
      map(icon => produce(icon, icon => {
        icon.url = createAbsoluteUrl(page.url, icon.url)
      }))
    )

  function textFetcher(url: string): Awaitable<string> {
    if (url === page.url) {
      return page.html
    } else {
      return fetch(createAbsoluteUrl(page.url, url))
        .then(res => res.text())
    }
  }

  function bufferFetcher(url: string): Awaitable<ArrayBuffer> {
    return fetch(createAbsoluteUrl(page.url, url))
      .then(res => res.arrayBuffer())
  }
}

function createAbsoluteUrl(base: string, url: string) {
  return new URL(url, base).href
}
