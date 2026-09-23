import { api } from './api/client.js'
import SlotPicker from './pages/SlotPicker.jsx'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <SlotPicker client={api} />
      </div>
    </main>
  )
}
