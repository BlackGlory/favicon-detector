import assert from 'assert'
import browser from 'webextension-polyfill'

export async function getPageInfo(tabId: number): Promise<{
  url: string
, html: string
}> {
  const results = await browser.scripting.executeScript({
    target: { tabId }
  , injectImmediately: false
  , func: () => {
      return {
        url: document.URL
      , html: document.documentElement.outerHTML
      }
    }
  })

  const result = results[0].result
  assert(result, 'The result is undefined')

  return result
}
