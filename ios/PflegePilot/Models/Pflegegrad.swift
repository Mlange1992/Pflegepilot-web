import Foundation

enum Pflegegrad: Int, CaseIterable, Codable {
    case pg1 = 1, pg2 = 2, pg3 = 3, pg4 = 4, pg5 = 5

    var label: String { "Pflegegrad \(rawValue)" }
}

struct Leistung: Identifiable, Codable {
    let id: UUID
    let slug: String
    let name: String
    let paragraph: String
    let icon: String
    let shortDescription: String
    let description: String
    let frequency: Frequency
    let category: Category
    let perPflegegrad: [String: Int] // Cents
    let deadlineRule: String?
    let requiresAntrag: Bool
    let tip: String?
    let activeFrom: String?
    let activeTo: String?

    enum Frequency: String, Codable { case monthly, yearly, once }
    enum Category: String, Codable { case geld, sach, sonstig }

    init(
        slug: String,
        name: String,
        paragraph: String,
        icon: String,
        shortDescription: String,
        description: String,
        frequency: Frequency,
        category: Category,
        perPflegegrad: [String: Int],
        deadlineRule: String?,
        requiresAntrag: Bool,
        tip: String?,
        activeFrom: String?,
        activeTo: String?
    ) {
        self.id = UUID()
        self.slug = slug
        self.name = name
        self.paragraph = paragraph
        self.icon = icon
        self.shortDescription = shortDescription
        self.description = description
        self.frequency = frequency
        self.category = category
        self.perPflegegrad = perPflegegrad
        self.deadlineRule = deadlineRule
        self.requiresAntrag = requiresAntrag
        self.tip = tip
        self.activeFrom = activeFrom
        self.activeTo = activeTo
    }

    func betragCents(pflegegrad: Pflegegrad) -> Int {
        perPflegegrad[String(pflegegrad.rawValue)] ?? 0
    }

    func jahrBetragCents(pflegegrad: Pflegegrad) -> Int {
        let perPeriod = betragCents(pflegegrad: pflegegrad)
        switch frequency {
        case .monthly: return perPeriod * 12
        case .yearly, .once: return perPeriod
        }
    }

    var isCurrentlyActive: Bool {
        let now = Date()
        if let from = activeFrom, let date = ISO8601DateFormatter().date(from: from + "T00:00:00Z") {
            if date > now { return false }
        }
        if let to = activeTo, let date = ISO8601DateFormatter().date(from: to + "T00:00:00Z") {
            if date < now { return false }
        }
        return true
    }
}

struct BudgetItem: Identifiable, Codable {
    let id: UUID
    let userId: String
    let personId: UUID?
    let year: Int
    let totalCents: Int
    var usedCents: Int
    let expiresAt: Date?
    var status: String
    let benefitType: BudgetBenefitType

    struct BudgetBenefitType: Codable {
        let slug: String
        let name: String
        let icon: String?
        let paragraphSgb: String?
        let shortDescription: String?
        let deadlineRule: String?

        enum CodingKeys: String, CodingKey {
            case slug, name, icon
            case paragraphSgb = "paragraph_sgb"
            case shortDescription = "short_description"
            case deadlineRule = "deadline_rule"
        }
    }

    enum CodingKeys: String, CodingKey {
        case id, year, status
        case userId = "user_id"
        case personId = "person_id"
        case totalCents = "total_cents"
        case usedCents = "used_cents"
        case expiresAt = "expires_at"
        case benefitType = "benefit_types"
    }

    var remainingCents: Int { totalCents - usedCents }
    var percentUsed: Double { totalCents > 0 ? Double(usedCents) / Double(totalCents) : 0 }
    var isExceeded: Bool { usedCents > totalCents }
    var exceededCents: Int { max(0, usedCents - totalCents) }

    var isExpiringSoon: Bool {
        guard let exp = expiresAt else { return false }
        return exp.timeIntervalSinceNow < 90 * 24 * 3600
    }
    var daysUntilExpiry: Int? {
        guard let exp = expiresAt else { return nil }
        return Calendar.current.dateComponents([.day], from: Date(), to: exp).day
    }
}

struct BenefitTypeRecord: Codable {
    let id: UUID
    let slug: String
    let name: String
    let icon: String?
    let frequency: String?
    let deadlineRule: String?
    let activeFrom: String?
    let activeTo: String?
    let perPflegegrad: [String: Int]?

    enum CodingKeys: String, CodingKey {
        case id, slug, name, icon, frequency
        case deadlineRule = "deadline_rule"
        case activeFrom = "active_from"
        case activeTo = "active_to"
        case perPflegegrad = "per_pflegegrad"
    }
}

struct TransactionItem: Identifiable, Codable {
    let id: UUID
    let budgetId: UUID
    let amountCents: Int
    let description: String?
    let providerName: String?
    let date: String

    enum CodingKeys: String, CodingKey {
        case id, description, date
        case budgetId = "budget_id"
        case amountCents = "amount_cents"
        case providerName = "provider_name"
    }
}

struct Pflegebeduerftiger: Identifiable, Codable {
    var id: UUID
    let userId: String
    var name: String
    var pflegegrad: Int?
    var bundesland: String
    var nutztPflegedienst: Bool

    enum CodingKeys: String, CodingKey {
        case id, name, pflegegrad, bundesland
        case userId = "user_id"
        case nutztPflegedienst = "nutzt_pflegedienst"
    }
}

struct Profile: Codable {
    let id: String
    var displayName: String?
    var pflegegrad: Int?
    var bundesland: String
    var nutztPflegedienst: Bool
    var isPremium: Bool = false  // Spalte noch in DB, App ist 100% kostenlos

    enum CodingKeys: String, CodingKey {
        case id, bundesland
        case displayName = "display_name"
        case pflegegrad
        case nutztPflegedienst = "nutzt_pflegedienst"
        case isPremium = "is_premium"
    }
}
