import { parseFavicon, Icon } from 'parse-favicon'
import { getPageInfo } from '@shared/get-page-info'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export async function getIcons(): Promise<Observable<Icon>> {
  const { url: pageUrl, html } = await getPageInfo()

  return parseFavicon(pageUrl, textFetcher, bufferFetcher).pipe(
    map(x => Object.assign({}, x, { url: toAbsoluteUrl(x.url, pageUrl) }))
  )

  async function textFetcher(url: string): Promise<string> {
    console.log('text', url)
    if (url === pageUrl) return html
    return await fetch(toAbsoluteUrl(url, pageUrl)).then(res => res.text())
  }

  async function bufferFetcher(url: string): Promise<ArrayBuffer> {
    console.log('image', url)
    return await fetch(toAbsoluteUrl(url, pageUrl)).then(res => res.arrayBuffer())
  }
}

function toAbsoluteUrl(url: string, base: string) {
  return new URL(url, base).href
}
