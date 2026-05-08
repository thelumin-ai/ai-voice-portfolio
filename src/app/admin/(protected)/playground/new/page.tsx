import { PlaygroundForm } from '../PlaygroundForm'

export default function NewPlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add App</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add a new interactive AI demo to the playground.</p>
      </div>
      <PlaygroundForm />
    </div>
  )
}
