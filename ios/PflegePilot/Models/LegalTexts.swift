import Foundation

struct LegalTexts {

    // MARK: - Pflegegrad-Ergebnis
    static let pflegegradDisclaimer = """
    Hinweis: Diese Selbsteinschätzung dient ausschließlich zur Orientierung. \
    Sie ersetzt nicht die Begutachtung durch den Medizinischen Dienst (MD) oder \
    Medicproof. Das tatsächliche Ergebnis kann abweichen. Stellen Sie im Zweifel \
    immer einen Antrag bei Ihrer Pflegekasse. Aus der Nutzung dieser App können \
    keine Rechtsansprüche abgeleitet werden.
    """

    // MARK: - Budget-Tracker
    static let budgetDisclaimer = """
    Alle Leistungsbeträge entsprechen dem Stand 2026. Änderungen durch \
    künftige Gesetzgebung sind möglich. Aktuelle Beträge können bei Ihrer \
    Pflegekasse erfragt werden. PflegePilot übernimmt keine Gewähr für die \
    Richtigkeit der angezeigten Beträge.
    """

    // MARK: - PDF-Anträge (Fußzeile)
    static let pdfDisclaimer = """
    Dieses Dokument wurde mit PflegePilot erstellt und dient als Mustervorlage. \
    Es stellt keine Rechtsberatung dar. Bei Unsicherheiten wenden Sie sich an \
    eine Pflegeberatung oder einen Rechtsanwalt. Alle Angaben ohne Gewähr.
    """

    // MARK: - MD-Checkliste
    static let checklisteDisclaimer = """
    Diese Checkliste dient zur Vorbereitung und erhebt keinen Anspruch auf \
    Vollständigkeit. Jede Begutachtung ist individuell. Bei Fragen wenden Sie \
    sich an Ihren Pflegestützpunkt.
    """

    // MARK: - Affiliate-Kennzeichnung (Pflicht nach UWG)
    static let affiliateHinweis = "Anzeige"

    // MARK: - Impressum (§ 5 TMG)
    static let impressum = """
    Angaben gemäß § 5 TMG:

    Markus Lange
    Seestraße 17
    73116 Wäschenbeuren
    Deutschland

    Kontakt:
    E-Mail: info@pflege-pilot.com

    Verantwortlich für den Inhalt nach § 55 Abs. 2 MStV:
    Markus Lange (Anschrift wie oben)

    Hinweis zur Berufsbezeichnung:
    Der Betreiber ist kein zugelassener Rechtsanwalt, Steuerberater oder \
    Pflegeberater. PflegePilot bietet ausschließlich allgemeine \
    Informationen und Orientierungshilfen.

    Haftungsausschluss:
    PflegePilot bietet eine Orientierungshilfe zur Einschätzung des Pflegegrades \
    und eine Übersicht über Pflegeleistungen. Die App ersetzt keine professionelle \
    Pflegeberatung, keine rechtliche Beratung und keine Begutachtung durch den \
    Medizinischen Dienst (MD). Alle Angaben ohne Gewähr.

    Die Pflegegrad-Selbsteinschätzung basiert auf dem offiziellen NBA-Verfahren, \
    kann aber vom Ergebnis der tatsächlichen MD-Begutachtung abweichen.

    Affiliate-Hinweis:
    Diese App enthält Empfehlungen für Produkte und Dienstleistungen, die als \
    „Anzeige" gekennzeichnet sind. Für vermittelte Kunden erhält der Betreiber \
    eine Provision. Dem Nutzer entstehen dadurch keine Mehrkosten.
    """

    // MARK: - Datenschutzerklärung (DSGVO)
    static let datenschutz = """
    Datenschutzerklärung

    1. Verantwortlicher
    Markus Lange, Seestraße 17, 73116 Wäschenbeuren, info@pflege-pilot.com

    2. Welche Daten wir erheben
    Ohne Registrierung: KEINE personenbezogenen Daten. Der Pflegegrad-Rechner \
    läuft komplett lokal auf deinem Gerät.

    Mit Registrierung: E-Mail-Adresse, verschlüsseltes Passwort, Pflegedaten \
    (Pflegegrad, Budget-Einträge). Gespeichert auf Supabase-Servern in \
    Frankfurt (EU).

    3. Gesundheitsdaten (Art. 9 DSGVO)
    Pflegegrad-Daten sind besondere Kategorien personenbezogener Daten. Wir \
    verarbeiten diese nur mit deiner ausdrücklichen Einwilligung \
    (Art. 6 Abs. 1 lit. a, Art. 9 Abs. 2 lit. a DSGVO). Du kannst die \
    Einwilligung jederzeit widerrufen (Einstellungen › Profil › Konto löschen \
    oder E-Mail an info@pflege-pilot.com).

    Hinweis zur Verarbeitung von Daten Dritter: Wenn du Daten einer \
    pflegebedürftigen Person eingibst, die nicht du selbst bist, bist du für \
    die rechtmäßige Grundlage dieser Verarbeitung verantwortlich \
    (Art. 6 DSGVO). PflegePilot empfiehlt, die betroffene Person oder ihre \
    gesetzliche Betreuung zu informieren.

    4. Deine Rechte (Art. 15–22 DSGVO)
    Auskunft, Berichtigung, Löschung, Einschränkung, Datenportabilität, \
    Widerspruch. Wende dich an info@pflege-pilot.com.

    Beschwerderecht (Art. 77 DSGVO): Du hast das Recht, dich bei einer \
    Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für \
    Baden-Württemberg: Landesbeauftragter für den Datenschutz und die \
    Informationsfreiheit BW (www.lfd.bwl.de).

    5. Speicherdauer
    Deine Daten werden gespeichert, solange dein Account aktiv ist. Nach \
    Kontolöschung werden alle personenbezogenen Daten innerhalb von 30 Tagen \
    endgültig gelöscht. Konto löschen: Profil › Konto und Daten löschen.

    6. Datensicherheit und Auftragsverarbeitung
    – Alle Daten verschlüsselt übertragen (TLS)
    – Row Level Security in Supabase (nur eigene Daten sichtbar)
    – Server in EU (Frankfurt)
    – Auftragsverarbeiter: Supabase Inc., San Francisco, USA; \
      EU-Standardvertragsklauseln (SCC) abgeschlossen; \
      weitere Informationen: supabase.com/privacy

    7. Affiliate-Partner
    Wenn du auf eine als „Anzeige" gekennzeichnete Empfehlung klickst, wirst du \
    zur Website des Partners weitergeleitet. Dort gelten die \
    Datenschutzbestimmungen des jeweiligen Partners. PflegePilot übermittelt \
    dabei keine personenbezogenen Daten an den Partner und speichert keine \
    individuellen Klickdaten.

    8. Push-Benachrichtigungen
    Du kannst Push-Benachrichtigungen jederzeit in den iOS-Einstellungen oder in \
    der App deaktivieren.

    Stand: 2026
    """

    // MARK: - Nutzungsbedingungen
    static let nutzungsbedingungen = """
    Nutzungsbedingungen für PflegePilot

    1. Geltungsbereich
    Diese Nutzungsbedingungen gelten für die Nutzung der App „PflegePilot" \
    von Markus Lange.

    2. Leistungsbeschreibung
    PflegePilot bietet eine Orientierungshilfe zur Einschätzung des Pflegegrades, \
    eine Übersicht über Pflegeleistungen, ein Budget-Tracking-Tool und \
    Muster-Anträge als PDF. Die App ist vollständig kostenlos.

    3. Keine Rechtsberatung
    PflegePilot ersetzt KEINE professionelle Pflegeberatung, KEINE rechtliche \
    Beratung und KEINE Begutachtung durch den Medizinischen Dienst. Alle Angaben \
    in der App dienen ausschließlich zur Information und Orientierung.

    4. Keine Gewähr
    Die angezeigten Leistungsbeträge basieren auf dem Stand 2026. Der \
    Betreiber übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder \
    Aktualität der Angaben. Maßgeblich sind die Angaben Ihrer Pflegekasse.

    5. Haftungsausschluss
    Der Betreiber haftet nicht für leicht fahrlässig verursachte Schäden, die \
    durch die Nutzung der App entstehen — insbesondere nicht für finanzielle \
    Nachteile durch falsche Pflegegrad-Einschätzungen oder verpasste Fristen. \
    Die Nutzung erfolgt auf eigenes Risiko.

    Ausgenommen sind Schäden aus der Verletzung des Lebens, des Körpers oder \
    der Gesundheit sowie Schäden, die auf Vorsatz oder grober Fahrlässigkeit \
    des Betreibers beruhen (§ 307 BGB).

    6. Affiliate-Hinweis
    Die App enthält Empfehlungen für Produkte und Dienstleistungen Dritter, die \
    als „Anzeige" gekennzeichnet sind. Für erfolgreiche Vermittlungen erhält der \
    Betreiber eine Provision. Dem Nutzer entstehen dadurch keine Mehrkosten.

    7. Datenschutz
    Es gilt die separate Datenschutzerklärung.

    8. Änderungen
    Der Betreiber behält sich vor, diese Nutzungsbedingungen zu ändern. Bei \
    wesentlichen Änderungen werden registrierte Nutzer per E-Mail oder \
    In-App-Hinweis informiert. Die weitere Nutzung nach Inkrafttreten der \
    geänderten Bedingungen gilt als Zustimmung. Die aktuelle Version ist in der \
    App unter Profil › Nutzungsbedingungen einsehbar.

    Stand: 2026
    """
}
