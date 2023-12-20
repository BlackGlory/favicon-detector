import assert from 'assert'

export async function getPageInfo(tabId: number): Promise<{
  url: string
, html: string
}> {
  const results = await chrome.scripting.executeScript({
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
