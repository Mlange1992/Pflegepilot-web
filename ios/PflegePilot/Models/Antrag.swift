import Foundation

enum AntragTyp: String, CaseIterable, Codable {
    case erstantrag       = "Erstantrag"
    case hoeherstufung    = "Höherstufung"
    case widerspruch      = "Widerspruch"
    case vhp              = "Verhinderungspflege (VHP)"
    case entlastungsbetrag = "Entlastungsbetrag"

    var icon: String {
        switch self {
        case .erstantrag:        return "doc.badge.plus"
        case .hoeherstufung:     return "arrow.up.circle"
        case .widerspruch:       return "exclamationmark.bubble"
        case .vhp:               return "person.2.circle"
        case .entlastungsbetrag: return "eurosign.circle"
        }
    }
}

struct AntragData: Codable {
    // Antrag-Typ
    var antragTyp: AntragTyp = .erstantrag
    // Antragsteller
    var vorname: String = ""
    var nachname: String = ""
    var geburtsdatum: Date = Calendar.current.date(byAdding: .year, value: -70, to: Date()) ?? Date()
    var strasse: String = ""
    var hausnummer: String = ""
    var plz: String = ""
    var ort: String = ""
    var telefon: String = ""
    var email: String = ""

    // Pflegekasse
    var pflegekasse: String = ""
    var versicherungsnummer: String = ""

    // Pflegebedürftige Person (falls abweichend vom Antragsteller)
    var antragFuerAnderen: Bool = false
    var pflegebeduerftiger: String = ""  // Name der pflegebedürftigen Person

    // NBA-Ergebnis (optional, vorausgefüllt)
    var geschaetzterPflegegrad: Int? = nil
    var nbaGesamtpunkte: Double? = nil

    // Begründung
    var begruendung: String = ""

    var isValid: Bool {
        !vorname.isEmpty && !nachname.isEmpty &&
        !strasse.isEmpty && !plz.isEmpty && !ort.isEmpty &&
        !pflegekasse.isEmpty && !versicherungsnummer.isEmpty
    }

    static let pflegekassen = [
        // AOK (regional)
        "AOK Baden-Württemberg",
        "AOK Bayern",
        "AOK Bremen/Bremerhaven",
        "AOK Hessen",
        "AOK Niedersachsen",
        "AOK Nordost",
        "AOK NordWest",
        "AOK Plus (Sachsen & Thüringen)",
        "AOK Rheinland/Hamburg",
        "AOK Rheinland-Pfalz/Saarland",
        "AOK Sachsen-Anhalt",
        // Ersatzkassen
        "Techniker Krankenkasse (TK)",
        "Barmer",
        "DAK-Gesundheit",
        "KKH – Kaufmännische Krankenkasse",
        "hkk – Handelskrankenkasse",
        "HEK – Hanseatische Krankenkasse",
        // IKK
        "IKK classic",
        "IKK gesund plus",
        "IKK Brandenburg und Berlin",
        "IKK Südwest",
        // BKK
        "BKK VBU",
        "BKK Mobil Oil",
        "BKK ProVita",
        "BKK firmus",
        "BKK Linde",
        "BKK EWE",
        "BKK Rieker·RICOSTA·Weisser",
        "BKK Scheufelen",
        "BKK Wirtschaft & Finanzen",
        "BKK ZF & Partner",
        "Audi BKK",
        "Bahn-BKK",
        "Bosch BKK",
        "Continentale Betriebskrankenkasse",
        "Debeka BKK",
        "energie-BKK",
        "Heimat Krankenkasse",
        "mhplus Krankenkasse",
        "Merck BKK",
        "Novitas BKK",
        "Pronova BKK",
        "R+V Betriebskrankenkasse",
        "Salus BKK",
        "Siemens-Betriebskrankenkasse (SBK)",
        "SKD BKK",
        "Südzucker BKK",
        "Techniker Krankenkasse BKK",
        "Viactiv Krankenkasse",
        "WMF Betriebskrankenkasse",
        // Knappschaft & Sonstige
        "KNAPPSCHAFT",
        "Landwirtschaftliche Krankenkasse (LKK)",
        "SVLFG – Sozialversicherung für Landwirtschaft",
        // Sonstige
        "Sonstige / Nicht in der Liste"
    ]
}

// MARK: - Gespeicherter Antrag (Supabase)

struct SavedAntrag: Identifiable {
    let id: UUID
    let createdAt: Date
    var title: String
    var pflegegrad: Int?
    var antragData: AntragData
}

// MARK: - Codable Helpers für AntragData (Date als ISO8601 String)

extension JSONEncoder {
    static var antragEncoder: JSONEncoder {
        let e = JSONEncoder()
        e.dateEncodingStrategy = .iso8601
        return e
    }
}

extension JSONDecoder {
    static var antragDecoder: JSONDecoder {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }
}
