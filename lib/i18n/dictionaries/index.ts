import { enDictionary, type EnDictionary } from './en'
import { myDictionary } from './my'
import type { Locale } from '../config'

export type Dictionary = EnDictionary

export { enDictionary, myDictionary }

export function getDictionaryForLocale(locale: Locale): Dictionary {
  return locale === 'my' ? myDictionary : enDictionary
}
