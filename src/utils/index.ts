export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export function scrollToContentWithId(id: string) {
  const element = document.getElementById(id)
  if (!element) {
    return
  }
  const yOffset = 80
  const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset
  window.scrollTo({ behavior: 'smooth', top: y })
}
