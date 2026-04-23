import UIKit

class AntragPDFService {
    static let shared = AntragPDFService()

    func generatePDF(antrag: AntragData) -> Data {
        let html = buildHTML(antrag: antrag)
        let formatter = UIMarkupTextPrintFormatter(markupText: html)
        let renderer = UIPrintPageRenderer()
        renderer.addPrintFormatter(formatter, startingAtPageAt: 0)

        let pageSize = CGSize(width: 595.2, height: 841.8) // A4
        let margin: CGFloat = 56
        let printableRect = CGRect(x: margin, y: margin,
                                   width: pageSize.width - 2 * margin,
                                   height: pageSize.height - 2 * margin)
        let paperRect = CGRect(origin: .zero, size: pageSize)
        renderer.setValue(NSValue(cgRect: paperRect), forKey: "paperRect")
        renderer.setValue(NSValue(cgRect: printableRect), forKey: "printableRect")

        let pdfData = NSMutableData()
        UIGraphicsBeginPDFContextToData(pdfData, paperRect, nil)
        for i in 0 ..< renderer.numberOfPages {
            UIGraphicsBeginPDFPage()
            renderer.drawPage(at: i, in: UIGraphicsGetPDFContextBounds())
        }
        UIGraphicsEndPDFContext()
        return pdfData as Data
    }

    // MARK: - HTML dispatch

    private func buildHTML(antrag: AntragData) -> String {
        switch antrag.antragTyp {
        case .erstantrag:        return buildErstantrag(antrag: antrag)
        case .hoeherstufung:     return buildHoeherstufung(antrag: antrag)
        case .widerspruch:       return buildWiderspruch(antrag: antrag)
        case .vhp:               return buildVHP(antrag: antrag)
        case .entlastungsbetrag: return buildEntlastungsbetrag(antrag: antrag)
        }
    }

    // MARK: - Shared CSS & Helpers

    private func css() -> String {
        return """
        <style>
            body { font-family: Helvetica, Arial, sans-serif; font-size: 11pt; color: #1a1a1a; margin: 0; padding: 0; }
            .header-box { border: 2px solid #0891B2; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; }
            .header-box h1 { font-size: 15pt; color: #0891B2; margin: 0 0 4px 0; }
            .header-box p { margin: 0; font-size: 10pt; color: #555; }
            .section { margin-bottom: 16px; }
            .section-header { background-color: #e0f4f8; color: #0e6a82; font-weight: bold; font-size: 11pt; padding: 5px 8px; border-left: 4px solid #0891B2; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 3px 6px; vertical-align: top; font-size: 10.5pt; }
            td.label { font-weight: bold; width: 45%; color: #444; }
            .hint { font-size: 9pt; color: #777; font-style: italic; margin: 6px 0 0 0; }
            .textbox { border: 1px solid #ccc; border-radius: 4px; padding: 10px; background: #fafafa; font-size: 10.5pt; line-height: 1.5; }
            .legal { border-top: 1px solid #ccc; padding-top: 10px; font-size: 9pt; color: #666; margin-top: 10px; }
            .sig-row { display: flex; gap: 40px; margin-top: 30px; }
            .sig-field { flex: 1; border-top: 1px solid #333; padding-top: 4px; font-size: 9pt; color: #555; }
            .footer { margin-top: 20px; font-size: 8pt; color: #aaa; text-align: center; }
            ul { padding-left: 20px; margin: 4px 0; font-size: 10.5pt; }
        </style>
        """
    }

    private func formatDate(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "dd.MM.yyyy"
        return df.string(from: date)
    }

    private func personSection(antrag: AntragData) -> String {
        let vollname = "\(antrag.vorname) \(antrag.nachname)"
        let pflegebeduerftiger = antrag.antragFuerAnderen
            ? "<tr><td class=\"label\">Pflegebedürftige Person:</td><td>\(antrag.pflegebeduerftiger)</td></tr>"
            : ""
        let antragstellerLabel = antrag.antragFuerAnderen ? "Antragsteller (bevollmächtigte Person):" : "Name:"
        let telefon = antrag.telefon.isEmpty ? "" : "<tr><td class=\"label\">Telefon:</td><td>\(antrag.telefon)</td></tr>"
        let email = antrag.email.isEmpty ? "" : "<tr><td class=\"label\">E-Mail:</td><td>\(antrag.email)</td></tr>"
        return """
        <div class="section">
            <div class="section-header">Antragsteller / Pflegebedürftige Person</div>
            <table>
                \(pflegebeduerftiger)
                <tr><td class="label">\(antragstellerLabel)</td><td>\(vollname)</td></tr>
                <tr><td class="label">Geburtsdatum:</td><td>\(formatDate(antrag.geburtsdatum))</td></tr>
                <tr><td class="label">Adresse:</td><td>\(antrag.strasse) \(antrag.hausnummer), \(antrag.plz) \(antrag.ort)</td></tr>
                \(telefon)
                \(email)
            </table>
        </div>
        """
    }

    private func pflegekasseSection(antrag: AntragData) -> String {
        return """
        <div class="section">
            <div class="section-header">An die Pflegekasse</div>
            <table>
                <tr><td class="label">Pflegekasse:</td><td>\(antrag.pflegekasse)</td></tr>
                <tr><td class="label">Versicherungsnummer:</td><td>\(antrag.versicherungsnummer)</td></tr>
            </table>
        </div>
        """
    }

    private func nbaSection(antrag: AntragData) -> String {
        guard let pg = antrag.geschaetzterPflegegrad else { return "" }
        let punkte = antrag.nbaGesamtpunkte.map { String(format: "%.1f", $0) } ?? "–"
        return """
        <div class="section">
            <div class="section-header">Ergebnis NBA-Selbsttest (informativ)</div>
            <table>
                <tr><td class="label">Geschätzter Pflegegrad:</td><td><strong>Pflegegrad \(pg)</strong></td></tr>
                <tr><td class="label">Gesamtpunktzahl:</td><td>\(punkte) von 100</td></tr>
            </table>
            <p class="hint">Diese Angabe basiert auf einem Selbsttest und hat keine rechtliche Bindung. Der offizielle Pflegegrad wird durch den Medizinischen Dienst (MDK) festgestellt.</p>
        </div>
        """
    }

    private func signatureAndFooter() -> String {
        return """
        <div class="sig-row">
            <div class="sig-field">Ort, Datum</div>
            <div class="sig-field">Unterschrift</div>
        </div>
        <div class="footer">
            Erstellt mit PflegePilot (pflege-pilot.com) &bull; Dieses Dokument dient als Mustervorlage. Es stellt keine Rechtsberatung dar. Alle Angaben ohne Gewähr.
        </div>
        """
    }

    private func wrapper(title: String, subtitle: String, body: String) -> String {
        return """
        <!DOCTYPE html>
        <html lang="de">
        <head><meta charset="UTF-8">\(css())</head>
        <body>
        <div class="header-box">
            <h1>\(title)</h1>
            <p>\(subtitle) &nbsp;|&nbsp; Erstellt am \(formatDate(Date())) mit PflegePilot</p>
        </div>
        \(body)
        </body>
        </html>
        """
    }

    // MARK: - Erstantrag

    private func buildErstantrag(antrag: AntragData) -> String {
        let begruendung = antrag.begruendung.isEmpty
            ? "Die antragstellende Person benötigt aufgrund von gesundheitlichen Einschränkungen regelmäßige Unterstützung bei den Aktivitäten des täglichen Lebens. Es wird daher um Begutachtung und Feststellung des Pflegegrades gebeten."
            : antrag.begruendung

        let body = """
        \(pflegekasseSection(antrag: antrag))
        \(personSection(antrag: antrag))
        \(nbaSection(antrag: antrag))
        <div class="section">
            <div class="section-header">Begründung / Beschreibung der Pflegesituation</div>
            <div class="textbox">\(begruendung)</div>
        </div>
        <div class="section">
            <div class="section-header">Beizufügende Unterlagen (Empfehlung)</div>
            <ul>
                <li>Ärztliche Atteste / Befundberichte</li>
                <li>Entlassungsbericht Krankenhaus (falls vorhanden)</li>
                <li>Medikamentenliste</li>
            </ul>
        </div>
        <div class="legal">Mit dem Antrag erkläre ich, dass ich mit der Weitergabe der erforderlichen Daten an den Medizinischen Dienst (MDK) zur Begutachtung einverstanden bin. Alle Angaben wurden nach bestem Wissen und Gewissen gemacht.</div>
        \(signatureAndFooter())
        """
        return wrapper(title: "Antrag auf Feststellung von Pflegebedürftigkeit", subtitle: "gem. § 18 SGB XI", body: body)
    }

    // MARK: - Höherstufung

    private func buildHoeherstufung(antrag: AntragData) -> String {
        let begruendung = antrag.begruendung.isEmpty
            ? "Der Gesundheitszustand der pflegebedürftigen Person hat sich seit der letzten Begutachtung erheblich verschlechtert. Der Pflegeaufwand ist deutlich gestiegen. Ich beantrage daher eine erneute Begutachtung und Höherstufung des Pflegegrades."
            : antrag.begruendung

        let body = """
        \(pflegekasseSection(antrag: antrag))
        \(personSection(antrag: antrag))
        \(nbaSection(antrag: antrag))
        <div class="section">
            <div class="section-header">Begründung der Höherstufung</div>
            <div class="textbox">\(begruendung)</div>
        </div>
        <div class="section">
            <div class="section-header">Beizufügende Unterlagen (Empfehlung)</div>
            <ul>
                <li>Aktuelle ärztliche Atteste / neue Diagnosen</li>
                <li>Bescheid des aktuellen Pflegegrades</li>
                <li>Medikamentenliste (aktuell)</li>
                <li>Pflegetagebuch (empfohlen)</li>
            </ul>
        </div>
        <div class="legal">Ich erkläre, dass alle Angaben der Wahrheit entsprechen und ich mit der erneuten Begutachtung durch den Medizinischen Dienst einverstanden bin.</div>
        \(signatureAndFooter())
        """
        return wrapper(title: "Antrag auf Höherstufung des Pflegegrades", subtitle: "gem. § 18 SGB XI", body: body)
    }

    // MARK: - Widerspruch

    private func buildWiderspruch(antrag: AntragData) -> String {
        let begruendung = antrag.begruendung.isEmpty
            ? "Gegen den Bescheid der Pflegekasse lege ich hiermit fristgerecht Widerspruch ein. Der festgestellte Pflegegrad spiegelt den tatsächlichen Pflegeaufwand nicht korrekt wider. Die Begutachtung durch den Medizinischen Dienst war unvollständig. Ich bitte um eine erneute Prüfung und Begutachtung."
            : antrag.begruendung

        let body = """
        \(pflegekasseSection(antrag: antrag))
        \(personSection(antrag: antrag))
        <div class="section">
            <div class="section-header">Widerspruchsgegenstand</div>
            <table>
                <tr><td class="label">Widerspruch gegen:</td><td>Bescheid über die Feststellung des Pflegegrades</td></tr>
                <tr><td class="label">Einspruchsfrist:</td><td>Innerhalb von einem Monat nach Zustellung des Bescheids</td></tr>
            </table>
        </div>
        <div class="section">
            <div class="section-header">Begründung des Widerspruchs</div>
            <div class="textbox">\(begruendung)</div>
        </div>
        <div class="section">
            <div class="section-header">Beizufügende Unterlagen (Empfehlung)</div>
            <ul>
                <li>Kopie des Ablehnungs- / Einstufungsbescheids</li>
                <li>Aktuelle ärztliche Atteste und Befundberichte</li>
                <li>Pflegetagebuch (dokumentierter Pflegeaufwand)</li>
                <li>Zeugenaussagen (Angehörige, Pflegepersonen)</li>
            </ul>
        </div>
        <p class="hint">Tipp: Fordern Sie das Gutachten des Medizinischen Dienstes schriftlich an (§ 18 Abs. 4 SGB XI) und beziehen Sie sich konkret auf Fehler.</p>
        <div class="legal">Ich lege hiermit ausdrücklich Widerspruch gegen den oben genannten Bescheid ein und bitte um schriftliche Bestätigung des Eingangs dieses Widerspruchs.</div>
        \(signatureAndFooter())
        """
        return wrapper(title: "Widerspruch gegen Pflegegrad-Bescheid", subtitle: "gem. § 84 SGB X i.V.m. § 18 SGB XI", body: body)
    }

    // MARK: - VHP

    private func buildVHP(antrag: AntragData) -> String {
        let begruendung = antrag.begruendung.isEmpty
            ? "Die Pflegeperson ist vorübergehend an der Pflege verhindert (z.B. durch Urlaub, Krankheit oder sonstige Gründe). Für diesen Zeitraum bitte ich um Übernahme der Kosten für eine Ersatzpflegekraft gemäß § 39 SGB XI."
            : antrag.begruendung

        let body = """
        \(pflegekasseSection(antrag: antrag))
        \(personSection(antrag: antrag))
        <div class="section">
            <div class="section-header">Angaben zur Verhinderungspflege</div>
            <table>
                <tr><td class="label">Gesetzliche Grundlage:</td><td>§ 39 SGB XI</td></tr>
                <tr><td class="label">Maximalbetrag 2025:</td><td>bis zu 1.685 EUR/Jahr (zzgl. bis zu 1.854 EUR aus ungenutzter Kurzzeitpflege)</td></tr>
                <tr><td class="label">Mindestpflegedauer:</td><td>Pflegeperson muss mind. 6 Monate häuslich gepflegt haben</td></tr>
            </table>
        </div>
        <div class="section">
            <div class="section-header">Beschreibung / Begründung</div>
            <div class="textbox">\(begruendung)</div>
        </div>
        <div class="section">
            <div class="section-header">Beizufügende Unterlagen (Empfehlung)</div>
            <ul>
                <li>Rechnungen / Quittungen der Ersatzpflegekraft</li>
                <li>Nachweis über Verhinderungszeitraum (Datum von/bis)</li>
                <li>Nachweis der Verwandtschaft (bei Verwandten als Ersatzpflegekraft)</li>
            </ul>
        </div>
        <div class="legal">Ich erkläre, dass die Angaben zur Verhinderung der Pflegeperson wahrheitsgemäß sind und alle einzureichenden Unterlagen beigefügt werden.</div>
        \(signatureAndFooter())
        """
        return wrapper(title: "Antrag auf Verhinderungspflege", subtitle: "gem. § 39 SGB XI", body: body)
    }

    // MARK: - Entlastungsbetrag

    private func buildEntlastungsbetrag(antrag: AntragData) -> String {
        let begruendung = antrag.begruendung.isEmpty
            ? "Ich beantrage die Erstattung von Aufwendungen für Angebote zur Unterstützung im Alltag gemäß § 45b SGB XI. Die in Anspruch genommenen Leistungen sind durch einen anerkannten Anbieter erbracht worden. Belege sind beigefügt."
            : antrag.begruendung

        let body = """
        \(pflegekasseSection(antrag: antrag))
        \(personSection(antrag: antrag))
        <div class="section">
            <div class="section-header">Angaben zum Entlastungsbetrag</div>
            <table>
                <tr><td class="label">Gesetzliche Grundlage:</td><td>§ 45b SGB XI</td></tr>
                <tr><td class="label">Betrag:</td><td>131 EUR/Monat (alle Pflegegrade 1–5)</td></tr>
                <tr><td class="label">Verfall-Frist:</td><td>30. Juni des Folgejahres (nicht genutzte Beträge)</td></tr>
                <tr><td class="label">Verwendung:</td><td>Anerkannte Angebote zur Unterstützung im Alltag</td></tr>
            </table>
        </div>
        <div class="section">
            <div class="section-header">Beschreibung der Leistungen</div>
            <div class="textbox">\(begruendung)</div>
        </div>
        <div class="section">
            <div class="section-header">Beizufügende Unterlagen (Empfehlung)</div>
            <ul>
                <li>Rechnungen des anerkannten Anbieters (mit Datum, Leistung, Betrag)</li>
                <li>Nachweis der Anerkennung des Anbieters durch das Bundesland</li>
                <li>Zahlungsbelege (falls bereits bezahlt)</li>
            </ul>
        </div>
        <div class="legal">Ich erkläre, dass die abgerechneten Leistungen durch einen nach Landesrecht anerkannten Anbieter erbracht wurden und die Angaben der Wahrheit entsprechen.</div>
        \(signatureAndFooter())
        """
        return wrapper(title: "Antrag auf Erstattung des Entlastungsbetrags", subtitle: "gem. § 45b SGB XI", body: body)
    }
}
