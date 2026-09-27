import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Home() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    api
      .get('/api/v1/ping')
      .then((res) => setStatus(res.data.message))
      .catch(() => setStatus('Could not reach the API — is `php artisan serve` running?'))
  }, [])

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">Marketplace — Phase 1</h1>
      <p className="mt-2 text-slate-600">Backend connection status: <span className="font-medium">{status}</span></p>
    </div>
  )
}
