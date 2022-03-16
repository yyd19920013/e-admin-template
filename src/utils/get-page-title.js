import defaultSettings from 'src/settings'

export default function getPageTitle(pageTitle) {
  return pageTitle || defaultSettings.title
}
