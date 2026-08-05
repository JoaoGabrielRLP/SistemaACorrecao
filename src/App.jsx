import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import CharacterCreator from './components/CharacterCreator'
import { supabase } from './services/supabaseClient'

function App() {
  const [user, setUser] = useState(null)
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function checkProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('profile check error', error.message)
      setMessage('Não foi possível verificar o perfil.')
      return
    }

    setProfileExists(Boolean(data))
  }

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)
      setLoading(false)

      if (sessionUser) {
        await checkProfile(sessionUser.id)
      }
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user ?? null
        setUser(sessionUser)
        setMessage('')
        if (sessionUser) {
          await checkProfile(sessionUser.id)
        } else {
          setProfileExists(false)
        }
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-700 bg-slate-900/90 p-12 text-center shadow-2xl">
          <p className="text-lg font-medium">Carregando o painel da Correção...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">A Correção</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Autenticação & Criação de Personagem
          </h1>
          <p className="mt-4 max-w-3xl text-slate-400 sm:text-lg">
            Acesse com e-mail e senha. Depois, escolha nome, classe, escola e personalize seu personagem.
          </p>
        </header>

        {user ? (
          <CharacterCreator
            user={user}
            profileExists={profileExists}
            onProfileSaved={() => setProfileExists(true)}
          />
        ) : (
          <div className="mx-auto w-full max-w-2xl">
            <AuthForm />
          </div>
        )}

        {message ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 px-6 py-4 text-sm text-slate-200">
            {message}
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default App
