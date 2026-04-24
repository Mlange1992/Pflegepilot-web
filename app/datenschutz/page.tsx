export const metadata = { title: 'Datenschutz – PflegePilot' }

export default function DatenschutzPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-sm text-gray-600">
      <h1 className="text-3xl font-extrabold text-gray-900">Datenschutzerklärung</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung im Sinne der DSGVO ist:<br />
          <strong>Markus Lange</strong><br />
          Seestraße 17, 73116 Wäschenbeuren<br />
          E-Mail: <a href="mailto:info@pflege-pilot.com" className="text-primary-600 underline">info@pflege-pilot.com</a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">2. Welche Daten wir erheben</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>E-Mail-Adresse (bei Registrierung / Anmeldung)</li>
          <li>Pflegegrad, Bundesland, Wohnsituation (Profil-Setup)</li>
          <li>Budget-Nutzungsdaten und Buchungen (Dashboard)</li>
          <li>Technische Nutzungsdaten (IP-Adresse, Browser, Betriebssystem) — Server-Logs werden 7–14 Tage gespeichert und danach automatisch gelöscht.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">3. Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO)</h2>
        <p>
          Angaben zum Pflegegrad, zur Wohnsituation sowie ggf. zu Diagnosen oder Gesundheitszustand
          stellen besondere Kategorien personenbezogener Daten im Sinne von Art. 9 DSGVO dar.
          Die Verarbeitung dieser Daten erfolgt ausschließlich auf Grundlage Ihrer ausdrücklichen
          Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO, die Sie bei der Registrierung erteilen.
          Sie können diese Einwilligung jederzeit widerrufen; in diesem Fall löschen wir alle
          entsprechenden Daten aus Ihrem Konto.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">4. Zweck der Datenverarbeitung</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Bereitstellung des Dienstes (Budgetübersicht, Fristenmanagement)</li>
          <li>Authentifizierung und Kontoverwaltung</li>
          <li>Versand von Fristen-Erinnerungen per E-Mail (nur nach Zustimmung)</li>
        </ul>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung),
          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, Server-Logs),
          Art. 9 Abs. 2 lit. a DSGVO (Einwilligung für Gesundheitsdaten).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">5. Hosting</h2>
        <p>
          Diese Website wird gehostet von <strong>Cloudflare, Inc.</strong>, 101 Townsend St,
          San Francisco, CA 94107, USA (Cloudflare Pages). Cloudflare verarbeitet dabei
          technische Verbindungsdaten (IP-Adresse, Zeitstempel). Rechtsgrundlage für die
          Übermittlung in die USA: EU-US Data Privacy Framework (Art. 45 DSGVO) sowie
          Standardvertragsklauseln gemäß Art. 46 DSGVO. Es besteht ein
          Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">6. Weitergabe an Dritte</h2>
        <p>
          Wir geben Ihre Daten nur an Dritte weiter, soweit dies zur Vertragserfüllung notwendig ist:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Supabase Inc.</strong> (Datenbankhosting, USA) — Rechtsgrundlage:
            EU-US Data Privacy Framework (Art. 45 DSGVO, Primäroption) sowie
            Standardvertragsklauseln gemäß Art. 46 DSGVO. Es besteht ein
            Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
          </li>
          <li>
            <strong>Resend Inc.</strong> (E-Mail-Versand, USA) — nur für Transaktions-E-Mails
            (Bestätigung, Fristen-Erinnerungen). Es besteht ein Auftragsverarbeitungsvertrag
            nach Art. 28 DSGVO. Rechtsgrundlage: Standardvertragsklauseln gemäß Art. 46 DSGVO.
          </li>
        </ul>
        <p>
          Die Nutzung von PflegePilot ist für Endnutzer kostenfrei. Es gibt keine Abos oder
          In-App-Käufe. Künftig werden Partnerangebote als Affiliate-Links eingebunden,
          die gesondert als „Anzeige" gekennzeichnet werden.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">7. Authentifizierung über Drittanbieter</h2>
        <p>
          Neben der E-Mail/Passwort-Anmeldung bieten wir folgende OAuth-Optionen an:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Sign in with Apple</strong> — Anbieter: Apple Inc., One Apple Park Way,
            Cupertino, CA 95014, USA. Bei der Anmeldung übermittelt Apple eine Nutzer-ID sowie
            — nach Ihrer Wahl — Ihre E-Mail-Adresse oder eine Apple-interne Relay-Adresse
            (Hide My Email). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
          </li>
          <li>
            <strong>Sign in with Google</strong> — Anbieter: Google Ireland Limited, Gordon House,
            Barrow Street, Dublin 4, Irland. Bei der Anmeldung übermittelt Google Ihre
            E-Mail-Adresse, Ihren Namen und eine Google-Nutzer-ID. Rechtsgrundlage:
            Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
          </li>
        </ul>
        <p>
          Die Nutzung dieser Dienste unterliegt zusätzlich den Datenschutzrichtlinien von Apple
          bzw. Google. Wir empfangen und speichern nur die für die Kontoanmeldung notwendigen Daten.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">8. Affiliate-Partnerprogramme (geplant)</h2>
        <p>
          PflegePilot plant, künftig Empfehlungen zu Partnerprodukten (z.B. Pflegehilfsmittel-Anbieter,
          anerkannte Pflegedienste) als Affiliate-Links einzubinden. Bei Klick auf einen solchen Link
          werden Sie zum externen Anbieter weitergeleitet, der ggf. eigene Tracking-Technologien einsetzt.
          Affiliate-Links werden stets als „Anzeige" gekennzeichnet. Eine Übersicht aktiver Partner
          wird an dieser Stelle veröffentlicht, sobald solche aktiviert werden.
        </p>
        <p className="font-medium">Aktuell: keine aktiven Affiliate-Partner.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">9. Cookies</h2>
        <p>
          Wir verwenden ausschließlich technisch notwendige Cookies für die Authentifizierung
          (Session-Cookies von Supabase). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">10. Speicherdauer</h2>
        <p>
          Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt oder
          Sie Ihr Konto löschen. Server-Logs werden nach 7–14 Tagen automatisch gelöscht.
          Gesetzliche Aufbewahrungsfristen bleiben unberührt.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">11. Ihre Rechte</h2>
        <p>Sie haben das Recht auf:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte wenden Sie sich an:{' '}
          <a href="mailto:info@pflege-pilot.com" className="text-primary-600 underline">
            info@pflege-pilot.com
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">12. Beschwerderecht</h2>
        <p>
          Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
          Zuständig ist der <strong>Landesbeauftragte für den Datenschutz und die Informationsfreiheit
          Baden-Württemberg (LfDI)</strong>, Lautenschlagerstraße 20, 70173 Stuttgart,{' '}
          <a href="mailto:poststelle@lfdi.bwl.de" className="text-primary-600 underline">
            poststelle@lfdi.bwl.de
          </a>
          , Tel. +49 711 615541-0.
        </p>
      </section>

      <p className="text-xs text-gray-400 pt-4 border-t">
        Stand: April 2026
      </p>
    </div>
  )
}
