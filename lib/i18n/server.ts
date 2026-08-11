import { cookies } from 'next/headers'
import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  type Locale,
} from './config'
import { getDictionaryForLocale, type Dictionary } from './dictionaries'

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return value && isLocale(value) ? value : defaultLocale
}

export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale()
  return getDictionaryForLocale(locale)
}

export async function getServerContext(): Promise<{
  locale: Locale
  dict: Dictionary
}> {
  const locale = await getLocale()
  return { locale, dict: getDictionaryForLocale(locale) }
}
