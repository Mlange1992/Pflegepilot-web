import Foundation

class BenefitEngine {
    static let shared = BenefitEngine()

    var leistungen: [Leistung] = []

    init() {
        loadLeistungen()
    }

    private func loadLeistungen() {
        // Hartcodierte Leistungen (gespiegelt aus leistungen-2026.json)
        leistungen = [
            Leistung(
                slug: "entlastungsbetrag",
                name: "Entlastungsbetrag",
                paragraph: "§ 45b SGB XI",
                icon: "💰",
                shortDescription: "Monatliches Budget für Alltagsentlastung",
                description: "Für Angebote wie Haushaltshilfe, Betreuung oder Alltagsbegleitung. Nur zugelassene Anbieter.",
                frequency: .monthly,
                category: .sach,
                perPflegegrad: ["1": 13100, "2": 13100, "3": 13100, "4": 13100, "5": 13100],
                deadlineRule: "verfaellt_30_juni_folgejahr",
                requiresAntrag: false,
                tip: "Nicht genutzte Beträge verfallen am 30.06. des Folgejahres!",
                activeFrom: nil,
                activeTo: nil
            ),
            Leistung(
                slug: "pflegegeld",
                name: "Pflegegeld",
                paragraph: "§ 37 SGB XI",
                icon: "🏠",
                shortDescription: "Monatliche Geldleistung bei häuslicher Pflege",
                description: "Für Pflegebedürftige ab PG 2, die zu Hause von Angehörigen gepflegt werden.",
                frequency: .monthly,
                category: .geld,
                perPflegegrad: ["1": 0, "2": 34700, "3": 59900, "4": 79900, "5": 99000],
                deadlineRule: nil,
                requiresAntrag: true,
                tip: nil,
                activeFrom: nil,
                activeTo: nil
            ),
            Leistung(
                slug: "pflegesachleistungen",
                name: "Pflegesachleistungen",
                paragraph: "§ 36 SGB XI",
                icon: "👩‍⚕️",
                shortDescription: "Budget für ambulante Pflegedienste",
                description: "Für professionelle Pflege durch ambulante Pflegedienste.",
                frequency: .monthly,
                category: .sach,
                perPflegegrad: ["1": 0, "2": 79500, "3": 149600, "4": 185800, "5": 229900],
                deadlineRule: nil,
                requiresAntrag: true,
                tip: "40% ungenutzter Sachleistungen können umgewandelt werden!",
                activeFrom: nil,
                activeTo: nil
            ),
            Leistung(
                slug: "entlastungsbudget",
                name: "Gemeinsames Entlastungsbudget",
                paragraph: "§ 42a SGB XI",
                icon: "🔀",
                shortDescription: "Frei aufteilbar für VP und KZP",
                description: "Ab 01.07.2025: Verhinderungs- und Kurzzeitpflege als gemeinsames Budget.",
                frequency: .yearly,
                category: .sach,
                perPflegegrad: ["1": 0, "2": 353900, "3": 353900, "4": 353900, "5": 353900],
                deadlineRule: "jahresende",
                requiresAntrag: false,
                tip: "70% der Berechtigten nutzen dies NIE — verfällt am 31.12.!",
                activeFrom: "2025-07-01",
                activeTo: nil
            ),
            Leistung(
                slug: "pflegehilfsmittel",
                name: "Pflegehilfsmittel",
                paragraph: "§ 40 Abs. 2 SGB XI",
                icon: "🧤",
                shortDescription: "Monatlich 42 € für Verbrauchsmaterial",
                description: "Handschuhe, Bettschutz, Desinfektionsmittel. Viele Anbieter liefern direkt.",
                frequency: .monthly,
                category: .sach,
                perPflegegrad: ["1": 4200, "2": 4200, "3": 4200, "4": 4200, "5": 4200],
                deadlineRule: nil,
                requiresAntrag: true,
                tip: "Einmal beantragen, dann automatisch monatlich.",
                activeFrom: nil,
                activeTo: nil
            ),
            Leistung(
                slug: "wohnumfeldverbesserung",
                name: "Wohnumfeldverbesserung",
                paragraph: "§ 40 Abs. 4 SGB XI",
                icon: "🏗️",
                shortDescription: "Einmalig bis 4.180 € für barrierefreien Umbau",
                description: "Für barrierefreies Bad, Rampen, Türverbreiterung.",
                frequency: .once,
                category: .sonstig,
                perPflegegrad: ["1": 418000, "2": 418000, "3": 418000, "4": 418000, "5": 418000],
                deadlineRule: nil,
                requiresAntrag: true,
                tip: nil,
                activeFrom: nil,
                activeTo: nil
            )
        ]
    }

    func calculateBenefits(pflegegrad: Pflegegrad) -> [Leistung] {
        leistungen
            .filter { $0.isCurrentlyActive }
            .filter { $0.jahrBetragCents(pflegegrad: pflegegrad) > 0 }
    }

    func calculateTotalJahrCents(pflegegrad: Pflegegrad) -> Int {
        calculateBenefits(pflegegrad: pflegegrad)
            .reduce(0) { $0 + $1.jahrBetragCents(pflegegrad: pflegegrad) }
    }

    func estimateUsedCents(pflegegrad: Pflegegrad, genutzeSlugs: [String]) -> Int {
        calculateBenefits(pflegegrad: pflegegrad)
            .filter { genutzeSlugs.contains($0.slug) }
            .reduce(0) { $0 + $1.jahrBetragCents(pflegegrad: pflegegrad) }
    }
}

// Formatierung
private let _euroFormatter: NumberFormatter = {
    let f = NumberFormatter()
    f.numberStyle = .currency
    f.currencyCode = "EUR"
    f.currencySymbol = "€"
    f.locale = Locale(identifier: "de_DE")
    return f
}()

extension Int {
    var formatEuro: String {
        let euros = Double(self) / 100.0
        return _euroFormatter.string(from: NSNumber(value: euros)) ?? "\(euros) €"
    }

    var formatEuroKompakt: String {
        let euros = Double(self) / 100.0
        _euroFormatter.minimumFractionDigits = self % 100 == 0 ? 0 : 2
        _euroFormatter.maximumFractionDigits = self % 100 == 0 ? 0 : 2
        let result = _euroFormatter.string(from: NSNumber(value: euros)) ?? "\(euros) €"
        _euroFormatter.minimumFractionDigits = 2
        _euroFormatter.maximumFractionDigits = 2
        return result
    }
}
