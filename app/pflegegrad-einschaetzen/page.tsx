'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NBA_MODULES, SCALE_OPTIONS } from '@/lib/nba/data'
import type { NBAQuestion } from '@/lib/nba/data'

export default function PflegegradEinschaetzenPage() {
  const router = useRouter()
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const currentModule = NBA_MODULES[currentModuleIndex]
  const totalQuestions = NBA_MODULES.reduce((sum, m) => sum + m.questions.length, 0)
  const answeredTotal = Object.keys(answers).length

  const moduleAnswered = currentModule.questions.every(q => answers[q.id] !== undefined)
  const isLastModule = currentModuleIndex === NBA_MODULES.length - 1

  const questionsAnsweredInModule = currentModule.questions.filter(q => answers[q.id] !== undefined).length
  const moduleProgress = questionsAnsweredInModule / currentModule.questions.length

  const overallProgress = answeredTotal / totalQuestions

  const setAnswer = (id: string, value: number) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleWeiter = () => {
    if (isLastModule) {
      sessionStorage.setItem('nba_answers', JSON.stringify(answers))
      router.push('/nba-ergebnis')
    } else {
      setCurrentModuleIndex(i => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleZurueck = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(i => i - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-gray-200/60 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          type="button"
          onClick={currentModuleIndex > 0 ? handleZurueck : undefined}
          className="text-sm text-gray-500 hover:text-primary-700 font-medium transition-colors"
        >
          {currentModuleIndex > 0 ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Zurück
            </span>
          ) : (
            <Link href="/check" className="hover:text-primary-700 transition-colors">← Zurück</Link>
          )}
        </button>
        <span className="text-xs font-semibold text-primary-700">{Math.round(overallProgress * 100)}% abgeschlossen</span>
      </header>

      {/* Gesamt-Fortschritt */}
      <div className="glass border-b border-gray-200/60 px-4 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full transition-all duration-500 shadow-glow-primary"
              style={{ width: `${overallProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-7">
        {/* Modul-Header */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold text-primary-700 uppercase tracking-[0.15em] bg-primary-50 ring-1 ring-primary-100 px-2.5 py-1 rounded-full">
              Modul {currentModuleIndex + 1} / {NBA_MODULES.length}
            </span>
            <span className="text-xs text-gray-400">
              {questionsAnsweredInModule}/{currentModule.questions.length} beantwortet
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>{currentModule.icon}</span>
            {currentModule.title}
          </h2>
          <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">{currentModule.description}</p>

          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-400 rounded-full transition-all duration-300"
              style={{ width: `${moduleProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Fragen */}
        <div className="space-y-4">
          {currentModule.questions.map((q: NBAQuestion) => {
            const options = SCALE_OPTIONS[q.scale]
            const selected = answers[q.id]
            return (
              <div key={q.id} className="card p-5">
                <p className="text-[15px] font-semibold text-gray-900 mb-1 leading-snug">{q.text}</p>
                {q.hint && (
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">{q.hint}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {options.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswer(q.id, opt.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all text-left leading-tight ${
                        selected === opt.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-soft'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Modul-Navigation Chips */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {NBA_MODULES.map((mod, idx) => {
            const done = mod.questions.every(q => answers[q.id] !== undefined)
            const active = idx === currentModuleIndex
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  setCurrentModuleIndex(idx)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-primary-600 text-white shadow-glow-primary scale-110'
                    : done
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 glass border-t border-gray-200/60 px-4 py-4">
        <div className="max-w-lg mx-auto space-y-2">
          {!moduleAnswered && (
            <p className="text-xs text-gray-400 text-center">
              Bitte alle {currentModule.questions.length} Fragen in diesem Modul beantworten
            </p>
          )}
          <button
            type="button"
            disabled={!moduleAnswered}
            onClick={handleWeiter}
            className={`w-full font-semibold py-4 rounded-2xl transition-all ${
              moduleAnswered
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-glow-primary active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLastModule ? 'Ergebnis anzeigen →' : `Weiter zu Modul ${currentModuleIndex + 2} →`}
          </button>
        </div>
      </div>
    </div>
  )
}
