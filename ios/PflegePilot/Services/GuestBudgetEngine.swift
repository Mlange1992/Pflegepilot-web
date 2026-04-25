import Foundation

// MARK: - Guest Transaction Store (UserDefaults)

struct GuestTransaction: Codable, Identifiable {
    let id: UUID
    let amountCents: Int
    let description: String?
    let providerName: String?
    let date: String // "yyyy-MM-dd"
}

enum GuestTransactionStore {
    private static func key(personId: UUID, slug: String, year: Int) -> String {
        "guest_tx_\(personId.uuidString)_\(slug)_\(year)"
    }

    static func load(personId: UUID, slug: String, year: Int) -> [GuestTransaction] {
        let k = key(personId: personId, slug: slug, year: year)
        guard let data = UserDefaults.standard.data(forKey: k),
              let items = try? JSONDecoder().decode([GuestTransaction].self, from: data)
        else { return [] }
        return items
    }

    static func add(_ tx: GuestTransaction, personId: UUID, slug: String, year: Int) {
        let k = key(personId: personId, slug: slug, year: year)
        var items = load(personId: personId, slug: slug, year: year)
        items.append(tx)
        if let data = try? JSONEncoder().encode(items) {
            UserDefaults.standard.set(data, forKey: k)
        }
    }

    static func update(_ tx: GuestTransaction, personId: UUID, slug: String, year: Int) {
        let k = key(personId: personId, slug: slug, year: year)
        var items = load(personId: personId, slug: slug, year: year)
        if let idx = items.firstIndex(where: { $0.id == tx.id }) {
            items[idx] = tx
            if let data = try? JSONEncoder().encode(items) {
                UserDefaults.standard.set(data, forKey: k)
            }
        }
    }

    static func delete(id: UUID, personId: UUID, slug: String, year: Int) {
        let k = key(personId: personId, slug: slug, year: year)
        let items = load(personId: personId, slug: slug, year: year)
            .filter { $0.id != id }
        if let data = try? JSONEncoder().encode(items) {
            UserDefaults.standard.set(data, forKey: k)
        }
    }

    static func totalUsed(personId: UUID, slug: String, year: Int) -> Int {
        load(personId: personId, slug: slug, year: year).reduce(0) { $0 + $1.amountCents }
    }
}

// MARK: - Guest Budget Engine

enum GuestBudgetEngine {
    static func makeBudgets(pflegegrad: Int, year: Int, personId: UUID) -> [BudgetItem] {
        guard let pgEnum = Pflegegrad(rawValue: pflegegrad) else { return [] }
        return BenefitEngine.shared.leistungen
            .filter { $0.jahrBetragCents(pflegegrad: pgEnum) > 0 && $0.isCurrentlyActive }
            .map { l in
                let totalCents = l.jahrBetragCents(pflegegrad: pgEnum)
                let usedCents = GuestTransactionStore.totalUsed(personId: personId, slug: l.slug, year: year)

                var expiresAt: Date? = nil
                if l.deadlineRule == "verfaellt_30_juni_folgejahr" {
                    var comps = DateComponents()
                    comps.year = year + 1; comps.month = 6; comps.day = 30
                    expiresAt = Calendar.current.date(from: comps)
                } else if l.deadlineRule == "jahresende" {
                    var comps = DateComponents()
                    comps.year = year; comps.month = 12; comps.day = 31
                    expiresAt = Calendar.current.date(from: comps)
                }

                return BudgetItem(
                    id: UUID(),
                    userId: "guest",
                    personId: personId,
                    year: year,
                    totalCents: totalCents,
                    usedCents: usedCents,
                    expiresAt: expiresAt,
                    status: "active",
                    benefitType: BudgetItem.BudgetBenefitType(
                        slug: l.slug,
                        name: l.name,
                        icon: l.icon,
                        paragraphSgb: l.paragraph,
                        shortDescription: l.shortDescription,
                        deadlineRule: l.deadlineRule
                    )
                )
            }
    }
}
