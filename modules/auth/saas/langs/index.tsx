import { GlobalCore } from '@/core/module/module.types'
import ca from './ca.json'
import en from './en.json'
import es from './es.json'
import pt from './pt.json'


GlobalCore.manager.langs('auth', { en, ca, es, pt })