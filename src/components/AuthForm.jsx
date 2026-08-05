import { useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function AuthForm() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAuth(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Preencha e-mail e senha para continuar.')
      setLoading(false)
      return
    }

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          setError(error.message)
        } else if (data?.user) {
          // Cadastro criado com sucesso; dependendo da aplicação pode-se redirecionar ou mostrar confirmação
          setError('')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
        } else {
          // Login bem sucedido; normalmente redirecionar ou atualizar estado global
          setError('')
        }
      }
    } catch (err) {
      console.error('auth error', err)
      setError('Erro ao autenticar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800/90 bg-zinc-900/95 shadow-2xl shadow-black/40 ring-1 ring-zinc-800/70 p-8 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-emerald-300 shadow-sm shadow-emerald-500/10">
              A Correção
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                Terminal Biopunk
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Entre com suas credenciais para acessar o painel e iniciar a criação do Sentinela.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-3xl border border-zinc-800 bg-zinc-950/90 p-1 shadow-inner shadow-black/20">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                              setError('')
              }}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                mode === 'login'
                  ? 'bg-emerald-500 text-zinc-950 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.8)]'
                  : 'bg-transparent text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                              setError('')
              }}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                mode === 'register'
                  ? 'bg-emerald-500 text-zinc-950 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.8)]'
                  : 'bg-transparent text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Criar conta
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            <div className="space-y-4">
              <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                E-mail
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-200 placeholder:text-zinc-500 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="seu@dominio.com"
                  autoComplete="email"
                />
              </label>

              <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Senha
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-200 placeholder:text-zinc-500 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </label>
            </div>

            <div className="space-y-4">
                          {error ? (
                            <div className="rounded-2xl px-4 py-2 text-sm text-red-300 bg-red-900/10 border border-red-800/20">
                              {error}
                            </div>
                          ) : null}

                          <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Registrar'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMode(mode === 'login' ? 'register' : 'login')
                              setError('')
                            }}
                            className="flex w-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:border-emerald-500 hover:text-zinc-100"
                          >
                            {mode === 'login' ? 'Quero criar nova conta' : 'Já tenho conta'}
                          </button>
                        </div>

          </form>

          <div className="rounded-3xl border border-zinc-800/90 bg-zinc-950/80 px-4 py-4 text-sm text-zinc-500">
            Autenticação segura ativada. Seus dados ficam protegidos nas camadas digitais do Nexus.
          </div>
        </div>
      </div>
    </section>
  )
}
