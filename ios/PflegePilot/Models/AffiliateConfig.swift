import Foundation

struct AffiliatePartner: Identifiable {
    let id: String
    let kategorie: String       // Budget-Topf dem er zugeordnet ist
    let name: String
    let linkURL: String         // Tracking-Link vom Netzwerk
    let buttonText: String
    let beschreibung: String
    let hinweis: String = "Anzeige"  // Rechtlich verpflichtend!
    let icon: String            // SF Symbol Name
    let bedingung: BedingungTyp

    enum BedingungTyp {
        case immer
        case abPflegegrad(Int)
        case topfUngenutzt
        case nachPflegegradErmittlung
    }
}

struct AffiliateConfig {

    static let pflegehilfsmittel = AffiliatePartner(
        id: "hilfsmittel",
        kategorie: "pflegehilfsmittel",
        name: "Kostenlose Pflegebox",
        linkURL: "HIER_TRADETRACKER_LINK",
        buttonText: "Kostenlose Pflegebox bestellen",
        beschreibung: "Dir stehen 42 EUR pro Monat für Pflegehilfsmittel zu. Handschuhe, Desinfektionsmittel, Bettschutz — die Pflegekasse übernimmt die Kosten.",
        icon: "cross.case.fill",
        bedingung: .immer
    )

    static let treppenlift = AffiliatePartner(
        id: "treppenlift",
        kategorie: "wohnraumanpassung",
        name: "Treppenlift-Vergleich",
        linkURL: "HIER_ADCELL_LINK",
        buttonText: "Treppenlift-Angebote vergleichen",
        beschreibung: "Die Pflegekasse bezuschusst Wohnraumanpassungen mit bis zu 4.000 EUR. Vergleiche kostenlos Angebote von Treppenlift-Anbietern in deiner Nähe.",
        icon: "arrow.up.right",
        bedingung: .abPflegegrad(1)
    )

    static let hausnotruf = AffiliatePartner(
        id: "hausnotruf",
        kategorie: "hausnotruf",
        name: "Hausnotruf einrichten",
        linkURL: "HIER_AFFILIATE_LINK",
        buttonText: "Kostenlosen Hausnotruf beantragen",
        beschreibung: "Die Pflegekasse übernimmt die Kosten für ein Hausnotrufsystem (ca. 25 EUR/Monat). Sicherheit rund um die Uhr.",
        icon: "phone.badge.checkmark",
        bedingung: .abPflegegrad(1)
    )

    static let versicherung = AffiliatePartner(
        id: "versicherung",
        kategorie: "vorsorge",
        name: "Pflegezusatzversicherung",
        linkURL: "HIER_AWIN_LINK",
        buttonText: "Pflegezusatzversicherung vergleichen",
        beschreibung: "Die gesetzliche Pflegeversicherung deckt nicht alle Kosten. Sichere dich und deine Familie zusätzlich ab.",
        icon: "shield.checkered",
        bedingung: .nachPflegegradErmittlung
    )

    static let betreuung24h = AffiliatePartner(
        id: "betreuung24h",
        kategorie: "betreuung",
        name: "24h-Betreuung",
        linkURL: "HIER_AFFILIATE_LINK",
        buttonText: "24h-Betreuung kostenlos vergleichen",
        beschreibung: "Vergleiche Angebote für die Rund-um-die-Uhr-Betreuung zu Hause. Kostenlos und unverbindlich.",
        icon: "house.and.flag",
        bedingung: .abPflegegrad(4)
    )

    static let pflegekurse = AffiliatePartner(
        id: "pflegekurse",
        kategorie: "kurse",
        name: "Kostenlose Pflegekurse",
        linkURL: "HIER_ADCELL_LINK",
        buttonText: "Kostenlosen Pflegekurs starten",
        beschreibung: "Die Pflegekasse zahlt Pflegekurse für Angehörige vollständig. Lerne Techniken für den Pflegealltag — bequem online.",
        icon: "graduationcap.fill",
        bedingung: .nachPflegegradErmittlung
    )

    static let allePartner: [AffiliatePartner] = [
        pflegehilfsmittel, treppenlift, hausnotruf,
        versicherung, betreuung24h, pflegekurse
    ]

    static func partnerFuer(budgetTyp: String) -> AffiliatePartner? {
        allePartner.first { $0.kategorie == budgetTyp }
    }

    private static let slugZuKategorie: [String: String] = [
        "pflegehilfsmittel":      "pflegehilfsmittel",
        "wohnumfeldverbesserung": "wohnraumanpassung",
        "pflegesachleistungen":   "hausnotruf",
        "entlastungsbetrag":      "kurse",
        "entlastungsbudget":      "kurse",
        "verhinderungspflege":    "kurse",
        "kurzzeitpflege":         "betreuung",
        "pflegegeld":             "vorsorge",
    ]

    static func partnerFuerBudgetSlug(_ slug: String) -> AffiliatePartner? {
        guard let kategorie = slugZuKategorie[slug] else { return nil }
        return allePartner.first { $0.kategorie == kategorie }
    }

    static func partnerFuerArtikel(_ artikelId: String) -> AffiliatePartner? {
        let mapping: [String: AffiliatePartner] = [
            "entlastungsbetrag":           pflegehilfsmittel,
            "verhinderungspflege":         betreuung24h,
            "kurzzeitpflege":              betreuung24h,
            "jahresbudget":                betreuung24h,
            "pflegegrad-beantragen":       versicherung,
            "md-begutachtung-fehler":      pflegekurse,
            "widerspruch":                 pflegekurse,
            "pflegegeld-kombination":      hausnotruf,
            "dipa":                        pflegekurse,
            "beratungsbesuche":            hausnotruf,
            "steuer":                      versicherung,
            "tagespflege":                 betreuung24h,
            "rentenversicherung-angehoerige": versicherung,
            "hoeherinstufung":             pflegekurse,
            "pflegeheim-kosten":           versicherung,
            "demenz-pflegegrad":           pflegekurse,
        ]
        return mapping[artikelId]
    }

    static func partnerNachErmittlung() -> [AffiliatePartner] {
        allePartner.filter {
            if case .nachPflegegradErmittlung = $0.bedingung { return true }
            return false
        }
    }

    static func partnerFuerPflegegrad(_ grad: Int) -> [AffiliatePartner] {
        allePartner.filter {
            switch $0.bedingung {
            case .immer: return true
            case .abPflegegrad(let minGrad): return grad >= minGrad
            case .topfUngenutzt: return true
            case .nachPflegegradErmittlung: return false
            }
        }
    }
}
