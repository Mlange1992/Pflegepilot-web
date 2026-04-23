export const metadata = { title: 'Datenschutz – PflegePilot' }

export default function DatenschutzPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-sm text-gray-600">
      <h1 className="text-3xl font-extrabold text-gray-900">Datenschutzerklärung</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung ist: [Dein Name], [Adresse], [E-Mail].
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">2. Welche Daten wir erheben</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>E-Mail-Adresse (bei Registrierung / Anmeldung)</li>
          <li>Pflegegrad, Bundesland, Wohnsituation (Profil-Setup)</li>
          <li>Budget-Nutzungsdaten und Buchungen (Dashboard)</li>
          <li>Technische Nutzungsdaten (IP-Adresse, Browser, Betriebssystem)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">3. Zweck der Datenverarbeitung</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Bereitstellung des Dienstes (Budgetübersicht, Fristenmanagement)</li>
          <li>Authentifizierung und Kontoverwaltung</li>
          <li>Versand von Fristen-Erinnerungen per E-Mail (nur nach Zustimmung)</li>
          <li>Anzeige von Affiliate-Empfehlungen passend zum Pflegebedarf (als „Anzeige" gekennzeichnet)</li>
        </ul>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">4. Weitergabe an Dritte</h2>
        <p>
          Wir geben Ihre Daten nur an Dritte weiter, soweit dies zur Vertragserfüllung notwendig ist:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Supabase Inc.</strong> (Datenbankhosting, USA) – Datenverarbeitung auf Basis von
            Standardvertragsklauseln gemäß Art. 46 DSGVO.
          </li>
          <li>
            <strong>Resend Inc.</strong> (E-Mail-Versand, USA) – nur für Transaktions-E-Mails.
          </li>
        </ul>
        <p className="text-sm text-gray-500">
          PflegePilot erhebt keine Zahlungsdaten. Die App ist vollständig kostenlos — es gibt kein Abo und keine In-App-Käufe.
          Affiliate-Links führen zu externen Anbietern; die Datenverarbeitung dort unterliegt deren eigenen Datenschutzrichtlinien.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">5. Speicherdauer</h2>
        <p>
          Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt oder
          Sie Ihr Konto löschen. Gesetzliche Aufbewahrungsfristen bleiben unberührt.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">6. Ihre Rechte</h2>
        <p>Sie haben das Recht auf:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte wenden Sie sich an:{' '}
          <a href="mailto:datenschutz@pflegepilot.de" className="text-primary-600 underline">
            datenschutz@pflegepilot.de
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">7. Cookies</h2>
        <p>
          Wir verwenden ausschließlich technisch notwendige Cookies für die Authentifizierung
          (Session-Cookies von Supabase). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">8. Beschwerderecht</h2>
        <p>
          Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
          In Bayern ist dies das Bayerische Landesamt für Datenschutzaufsicht (BayLDA),
          Promenade 18, 91522 Ansbach.
        </p>
      </section>

      <p className="text-xs text-gray-400 pt-4 border-t">
        Stand: März 2026. Bitte ersetze die Platzhalter [in eckigen Klammern] vor dem Launch.
      </p>
    </div>
  )
}
