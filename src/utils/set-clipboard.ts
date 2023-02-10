export function setClipboard(text: string): void {
  const textarea = document.createElement('textarea')
  textarea.textContent = text
  const body = document.querySelector('body')!
  body.appendChild(textarea)
  textarea.select()
  document.execCommand('Copy', false)
  body.removeChild(textarea)
}
