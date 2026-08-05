import { useMemo, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const characterOptions = {
  body: ['Frame Cerne', 'Frame Nebula', 'Frame Quantic'],
  face: ['Visor Espiral', 'Máscara Voraz', 'Rosto Holográfico'],
  torso: ['Tórax Atlas', 'Casco Horizon', 'Capa Echo'],
  armor: ['Placas Leves', 'Placas de Cerâmica', 'Placas de Titânio'],
}

const classes = ['Triblader', 'Hexacast', 'Circuit Sentry']
const schools = ['Horizon', 'Atlas', 'Nova']

export default function CharacterCreator({ user, profileExists, onProfileSaved }) {
  const [sentinelName, setSentinelName] = useState('')
  const [playerClass, setPlayerClass] = useState(classes[0])
  const [school, setSchool] = useState(schools[0])
  const [selections, setSelections] = useState({
    body: characterOptions.body[0],
    face: characterOptions.face[0],
    torso: characterOptions.torso[0],
    armor: characterOptions.armor[0],
    armorColor: '#22c55e',
  })
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)

  const previewLayers = useMemo(
    () => [
      {
        key: 'body',
        label: selections.body,
        className: 'bg-slate-800',
        style: { width: '220px', height: '280px', borderRadius: '40% 40% 32% 32%' },
      },
      {
        key: 'torso',
        label: selections.torso,
        className: 'bg-violet-700/85',
        style: { width: '162px', height: '152px', borderRadius: '32px' },
      },
      {
        key: 'face',
        label: selections.face,
        className: 'bg-amber-300',
        style: { width: '112px', height: '112px', borderRadius: '999px' },
      },
      {
        key: 'armor',
        label: selections.armor,
        className: 'mix-blend-multiply shadow-[0_0_40px_rgba(34,197,94,0.5)]',
        style: {
          width: '180px',
          height: '180px',
          borderRadius: '34px',
          backgroundColor: selections.armorColor,
        },
      },
    ],
    [selections],
  )

  function cycleOption(key) {
    setSelections((current) => {
      const list = characterOptions[key]
      const nextIndex = (list.indexOf(current[key]) + 1) % list.length
      return { ...current, [key]: list[nextIndex] }
    })
  }

  function handleArmorColorChange(event) {
    setSelections((current) => ({ ...current, armorColor: event.target.value }))
  }

  async function handleSave() {
    if (!sentinelName.trim()) {
      setFeedback('Digite o nome do Sentinela antes de salvar.')
      return
    }

    setSaving(true)
    setFeedback('')

    const profileData = {
      user_id: user.id,
      sentinel_name: sentinelName.trim(),
      sentinel_class: playerClass,
      sentinel_school: school,
      character_json: {
        body: selections.body,
        face: selections.face,
        torso: selections.torso,
        armor: selections.armor,
        armorColor: selections.armorColor,
      },
    }

    const { error } = await supabase.from('profiles').upsert(profileData, {
      onConflict: 'user_id',
      returning: 'representation',
    })

    setSaving(false)

    if (error) {
      setFeedback(`Erro ao salvar perfil: ${error.message}`)
    } else {
      setFeedback('Perfil salvo com sucesso!')
      onProfileSaved?.()
    }
  }

  return (
    <section className="grid gap-8 rounded-[2rem] border border-slate-700 bg-slate-950/80 p-8 shadow-2xl sm:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Onboarding</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-100">Criação de Personagem</h2>
          <p className="mt-2 text-slate-400">
            Configure seu Sentinela e personalize a aparência usando um paper doll com camadas.
          </p>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <label className="text-sm font-medium text-slate-200">Nome do Sentinela</label>
          <input
            value={sentinelName}
            onChange={(event) => setSentinelName(event.target.value)}
            placeholder="Ex: Vectra"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-200">Classe</label>
              <select
                value={playerClass}
                onChange={(event) => setPlayerClass(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              >
                {classes.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200">Escola</label>
              <select
                value={school}
                onChange={(event) => setSchool(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              >
                {schools.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          {['body', 'face', 'torso', 'armor'].map((key) => (
            <div key={key} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Camada</p>
                  <p className="text-base font-semibold text-slate-100 capitalize">{key}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {selections[key]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => cycleOption(key)}
                className="self-start rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Alternar {key}
              </button>
            </div>
          ))}

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200">Cor da armadura</label>
            <input
              type="color"
              value={selections.armorColor}
              onChange={handleArmorColorChange}
              className="h-12 w-20 cursor-pointer rounded-2xl border border-slate-700 bg-slate-950 p-1"
            />
            <p className="text-sm text-slate-400">Use este seletor para tingir a camada de armadura.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Salvando...' : profileExists ? 'Atualizar Perfil' : 'Salvar Perfil'}
          </button>
          {feedback ? (
            <p className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100">
              {feedback}
            </p>
          ) : null}
          <div className="rounded-3xl bg-slate-950/90 p-4 text-sm text-slate-400">
            <p className="font-medium text-slate-200">JSON enviado ao Supabase</p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-[0.94rem] text-slate-300">
              {JSON.stringify(
                {
                  sentinel_name: sentinelName || '...nome...',
                  sentinel_class: playerClass,
                  sentinel_school: school,
                  character_json: {
                    body: selections.body,
                    face: selections.face,
                    torso: selections.torso,
                    armor: selections.armor,
                    armorColor: selections.armorColor,
                  },
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-700 bg-slate-900/90 p-6">
        <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Preview</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            As camadas são renderizadas em tela e o CSS `mix-blend-mode` aplica a tintura da armadura.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[360px] flex-1 rounded-[2rem] border border-slate-700 bg-slate-950/90 p-8 shadow-2xl">
          <div className="relative mx-auto h-[380px] w-[320px] overflow-hidden rounded-[2rem] bg-slate-900/80 p-4">
            {previewLayers.map((layer, index) => (
              <div
                key={layer.key}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${layer.className}`}
                style={{
                  ...layer.style,
                  zIndex: index + 1,
                }}
              />
            ))}
            <div className="absolute bottom-6 left-1/2 h-14 w-44 -translate-x-1/2 rounded-full bg-white/10 shadow-[0_20px_80px_rgba(15,23,42,0.4)]" />
          </div>

          <div className="mt-6 grid gap-3 rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-slate-100">Sentinela</span>
              <span>{sentinelName || 'sem nome'}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-slate-100">Classe</span>
              <span>{playerClass}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-slate-100">Escola</span>
              <span>{school}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
