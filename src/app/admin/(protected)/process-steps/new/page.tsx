import { ProcessStepForm } from '../ProcessStepForm'

export default function NewProcessStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Step</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add a new step to your agency process.</p>
      </div>
      <ProcessStepForm />
    </div>
  )
}
