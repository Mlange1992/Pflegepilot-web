export const metadata = { title: 'Impressum – PflegePilot' }

export default function ImpressumPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Impressum</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-gray-800">Angaben gemäß § 5 TMG</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          [Dein Vor- und Nachname]<br />
          [Straße Hausnummer]<br />
          [PLZ Ort]<br />
          Deutschland
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-gray-800">Kontakt</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          E-Mail: <a href="mailto:hallo@pflegepilot.de" className="text-primary-600 underline">hallo@pflegepilot.de</a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-gray-800">Haftungsausschluss</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr. PflegePilot
          ersetzt keine individuelle Rechtsberatung. Die dargestellten Leistungsbeträge basieren
          auf den gesetzlichen Regelungen des SGB XI (Stand 2026) und können sich jederzeit ändern.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-gray-800">Streitschlichtung</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer"
             className="text-primary-600 underline">
            https://ec.europa.eu/consumers/odr/
          </a>.
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <p className="text-xs text-gray-400 pt-4 border-t">
        Bitte ersetze die Platzhalter [in eckigen Klammern] mit deinen echten Angaben vor dem Launch.
      </p>
    </div>
  )
}
