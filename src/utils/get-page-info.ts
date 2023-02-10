export async function getPageInfo(): Promise<{
  url: string
  html: string
}> {
  const result = await browser.tabs.executeScript({
    code: `({
      url: document.URL
    , html: document.querySelector('html').outerHTML
    })`
  , runAt: 'document_end'
  })

  return result[0]
}
