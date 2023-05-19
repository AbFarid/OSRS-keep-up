import Home from './components/Home.svelte'
import Skills from './components/Skills.svelte'
import Quests from './components/Quests.svelte'
// import { redirect } from 'svelte-spa-router'

export default {
  '/': Home,
  '/skills/': Skills,
  // '/skills/:p1/:p2': Skills,
  '/quests/': Quests,
  '/music/': Quests,
  '/diaries/': Quests,
  '/combat/': Quests,
  // '/music/': Music,
  // '/diaries/': Diaries,
  // '/combat/': Combat,
}
