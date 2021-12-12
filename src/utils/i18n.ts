export function i18n(message: string): string {
  return browser.i18n.getMessage(message)
}
