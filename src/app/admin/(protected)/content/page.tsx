import ContentForm from './ContentForm'
import { getContentSettings } from './actions'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const { hero, about, problem } = await getContentSettings()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Content Editor</h1>
        <p className="text-zinc-400 mt-1">Customize the text and messaging on your public-facing pages.</p>
      </div>

      <ContentForm
        initialHero={hero}
        initialAbout={about}
        initialProblem={problem}
      />
    </div>
  )
}
