import { useEffect, useState } from 'react'
import Login from './components/Login'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Gagal mengambil profil')
        const data = await res.json()
        setMe(data)
      } catch (e) {
        console.error(e)
        setMe(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    setMe(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      {!token ? (
        <Login onSuccess={(t) => setToken(t)} />
      ) : (
        <div className="max-w-lg w-full mx-auto bg-white/80 backdrop-blur rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat datang</h2>
          {loading ? (
            <p className="text-gray-600">Memuat profil...</p>
          ) : me ? (
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-semibold">Username:</span> {me.username}</p>
              <p className="text-green-700 font-medium">Akses penuh diberikan.</p>
            </div>
          ) : (
            <p className="text-gray-600">Tidak dapat memuat profil.</p>
          )}
          <button onClick={handleLogout} className="mt-6 w-full py-2 px-4 rounded-md bg-gray-800 text-white font-semibold hover:bg-black">
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}

export default App
