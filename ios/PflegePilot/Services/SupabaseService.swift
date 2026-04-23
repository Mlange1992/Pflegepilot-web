import Foundation
import Supabase

class SupabaseService: ObservableObject {
    static let shared = SupabaseService()

    let client: SupabaseClient

    init() {
        client = SupabaseClient(
            supabaseURL: URL(string: "https://ndpadgwntgdoykyljwiv.supabase.co")!,
            supabaseKey: "sb_publishable_wpehu3FnYLkFt0cb-KZjvg_Uc2hFOfQ"
        )
    }

    // Profil laden
    func loadProfile(userId: String) async throws -> Profile {
        let response: [Profile] = try await client
            .from("profiles")
            .select()
            .eq("id", value: userId)
            .limit(1)
            .execute()
            .value
        guard let profile = response.first else {
            throw NSError(domain: "PflegePilot", code: 404, userInfo: [NSLocalizedDescriptionKey: "Profil nicht gefunden"])
        }
        return profile
    }

    // Profil aktualisieren
    func updateProfile(userId: String, pflegegrad: Int, bundesland: String, nutztPflegedienst: Bool) async throws {
        struct ProfileUpdate: Encodable {
            let pflegegrad: Int
            let bundesland: String
            let nutzt_pflegedienst: Bool
        }
        try await client
            .from("profiles")
            .update(ProfileUpdate(pflegegrad: pflegegrad, bundesland: bundesland, nutzt_pflegedienst: nutztPflegedienst))
            .eq("id", value: userId)
            .execute()
    }

    // Profil anlegen oder aktualisieren (upsert)
    func upsertProfile(userId: String, pflegegrad: Int, bundesland: String, nutztPflegedienst: Bool) async throws {
        struct ProfileUpsert: Encodable {
            let id: String
            let pflegegrad: Int
            let bundesland: String
            let nutzt_pflegedienst: Bool
        }
        try await client
            .from("profiles")
            .upsert(ProfileUpsert(id: userId, pflegegrad: pflegegrad, bundesland: bundesland, nutzt_pflegedienst: nutztPflegedienst))
            .execute()
    }

    // Pflegebedürftige laden
    func loadPersons(userId: String) async throws -> [Pflegebeduerftiger] {
        let response: [Pflegebeduerftiger] = try await client
            .from("pflegebeduerftiger")
            .select()
            .eq("user_id", value: userId)
            .order("created_at", ascending: true)
            .execute()
            .value
        return response
    }

    // Person anlegen
    func createPerson(userId: String, name: String, pflegegrad: Int?, bundesland: String, nutztPflegedienst: Bool) async throws -> Pflegebeduerftiger {
        struct PersonInsert: Encodable {
            let user_id: String
            let name: String
            let pflegegrad: Int?
            let bundesland: String
            let nutzt_pflegedienst: Bool
        }
        let response: [Pflegebeduerftiger] = try await client
            .from("pflegebeduerftiger")
            .insert(PersonInsert(user_id: userId, name: name, pflegegrad: pflegegrad, bundesland: bundesland, nutzt_pflegedienst: nutztPflegedienst))
            .select()
            .execute()
            .value
        guard let person = response.first else {
            throw NSError(domain: "PflegePilot", code: 500, userInfo: [NSLocalizedDescriptionKey: "Person konnte nicht erstellt werden"])
        }
        return person
    }

    // Person aktualisieren
    func updatePerson(_ person: Pflegebeduerftiger) async throws {
        struct PersonUpdate: Encodable {
            let name: String
            let pflegegrad: Int?
            let bundesland: String
            let nutzt_pflegedienst: Bool
        }
        try await client
            .from("pflegebeduerftiger")
            .update(PersonUpdate(name: person.name, pflegegrad: person.pflegegrad, bundesland: person.bundesland, nutzt_pflegedienst: person.nutztPflegedienst))
            .eq("id", value: person.id.uuidString)
            .execute()
    }

    // Person löschen
    func deletePerson(id: UUID) async throws {
        try await client
            .from("pflegebeduerftiger")
            .delete()
            .eq("id", value: id.uuidString)
            .execute()
    }

    // Budgets laden (typisiert)
    func loadBudgets(userId: String, personId: UUID, year: Int) async throws -> [BudgetItem] {
        let items: [BudgetItem] = try await client
            .from("budgets")
            .select("*, benefit_types(slug, name, icon, paragraph_sgb, short_description, deadline_rule)")
            .eq("user_id", value: userId)
            .eq("person_id", value: personId.uuidString)
            .eq("year", value: year)
            .order("created_at", ascending: true)
            .execute()
            .value
        return items
    }

    // Budgets für eine Person anlegen – bei Pflegegrad-Änderung neu berechnen
    // Beträge kommen aus BenefitEngine (lokal, korrekt pflegegradabhängig),
    // benefit_type_id wird per Slug-Lookup aus der DB geholt.
    func createBudgetsIfNeeded(userId: String, personId: UUID, pflegegrad: Int, year: Int) async throws {
        guard let pgEnum = Pflegegrad(rawValue: pflegegrad) else { return }

        let existing: [BudgetItem] = try await loadBudgets(userId: userId, personId: personId, year: year)

        // Lokale Leistungen als Quelle der Wahrheit für Beträge
        let activeLeistungen = BenefitEngine.shared.leistungen.filter { $0.isCurrentlyActive }

        if !existing.isEmpty {
            // Slug-genaue Prüfung: Anzahl und jeder einzelne Betrag müssen stimmen
            let slugToExpected: [String: Int] = Dictionary(
                uniqueKeysWithValues: activeLeistungen
                    .filter { $0.jahrBetragCents(pflegegrad: pgEnum) > 0 }
                    .map { ($0.slug, $0.jahrBetragCents(pflegegrad: pgEnum)) }
            )
            let allMatch = existing.count == slugToExpected.count &&
                existing.allSatisfy { slugToExpected[$0.benefitType.slug] == $0.totalCents }
            if allMatch { return }

            for budget in existing {
                try await client.from("budgets").delete().eq("id", value: budget.id.uuidString).execute()
            }
        }

        // benefit_type_id per Slug aus DB holen
        let benefitTypes: [BenefitTypeRecord] = try await client
            .from("benefit_types")
            .select()
            .execute()
            .value
        let slugToId: [String: String] = Dictionary(uniqueKeysWithValues: benefitTypes.map { ($0.slug, $0.id.uuidString) })

        let cal = Calendar.current
        struct BudgetInsert: Encodable {
            let user_id: String
            let person_id: String
            let benefit_type_id: String
            let year: Int
            let total_cents: Int
            let expires_at: String?
            let status: String
        }

        var inserts: [BudgetInsert] = []
        for l in activeLeistungen {
            let totalCents = l.jahrBetragCents(pflegegrad: pgEnum)
            guard totalCents > 0, let btId = slugToId[l.slug] else { continue }

            let expiresAt: String?
            if l.deadlineRule == "jahresende" {
                var comp = DateComponents(); comp.year = year; comp.month = 12; comp.day = 31
                expiresAt = cal.date(from: comp).map { ISO8601DateFormatter().string(from: $0) }
            } else if l.deadlineRule == "verfaellt_30_juni_folgejahr" {
                var comp = DateComponents(); comp.year = year + 1; comp.month = 6; comp.day = 30
                expiresAt = cal.date(from: comp).map { ISO8601DateFormatter().string(from: $0) }
            } else {
                expiresAt = nil
            }

            inserts.append(BudgetInsert(
                user_id: userId,
                person_id: personId.uuidString,
                benefit_type_id: btId,
                year: year,
                total_cents: totalCents,
                expires_at: expiresAt,
                status: "active"
            ))
        }

        if !inserts.isEmpty {
            try await client.from("budgets").upsert(inserts).execute()
        }
    }

    // Transaktion hinzufügen
    func addTransaction(budgetId: UUID, amountCents: Int, description: String?, providerName: String?, date: Date) async throws {
        struct TransactionInsert: Encodable {
            let budget_id: String
            let amount_cents: Int
            let description: String?
            let provider_name: String?
            let date: String
        }
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
        try await client
            .from("transactions")
            .insert(TransactionInsert(
                budget_id: budgetId.uuidString,
                amount_cents: amountCents,
                description: description,
                provider_name: providerName,
                date: df.string(from: date)
            ))
            .execute()

        // used_cents atomar über Transaktions-Summe aktualisieren (kein Read-Modify-Write)
        struct UsedCentsRow: Decodable { let amount_cents: Int }
        let txRows: [UsedCentsRow] = try await client
            .from("transactions")
            .select("amount_cents")
            .eq("budget_id", value: budgetId.uuidString)
            .execute()
            .value
        let newTotal = txRows.reduce(0) { $0 + $1.amount_cents }
        struct UsedUpdate: Encodable { let used_cents: Int }
        try await client
            .from("budgets")
            .update(UsedUpdate(used_cents: newTotal))
            .eq("id", value: budgetId.uuidString)
            .execute()
    }

    // MARK: - Anträge

    func saveAntrag(userId: String, antrag: AntragData, title: String) async throws {
        let jsonData = try JSONEncoder.antragEncoder.encode(antrag)
        let jsonString = String(data: jsonData, encoding: .utf8) ?? "{}"
        struct Insert: Encodable {
            let user_id: String
            let title: String
            let pflegegrad: Int?
            let antrag_json: String
        }
        try await client
            .from("antraege")
            .insert(Insert(user_id: userId, title: title,
                           pflegegrad: antrag.geschaetzterPflegegrad,
                           antrag_json: jsonString))
            .execute()
    }

    func loadAntraege(userId: String) async throws -> [SavedAntrag] {
        struct AntragRow: Decodable {
            let id: UUID
            let created_at: Date
            let title: String
            let pflegegrad: Int?
            let antrag_json: String
        }
        let rows: [AntragRow] = try await client
            .from("antraege")
            .select()
            .eq("user_id", value: userId)
            .order("created_at", ascending: false)
            .execute()
            .value
        return rows.compactMap { row in
            guard let data = row.antrag_json.data(using: .utf8),
                  let antragData = try? JSONDecoder.antragDecoder.decode(AntragData.self, from: data)
            else { return nil }
            return SavedAntrag(id: row.id, createdAt: row.created_at,
                               title: row.title, pflegegrad: row.pflegegrad,
                               antragData: antragData)
        }
    }

    func deleteAntrag(id: UUID) async throws {
        try await client
            .from("antraege")
            .delete()
            .eq("id", value: id.uuidString)
            .execute()
    }

    // Alle Nutzerdaten löschen (DSGVO Art. 17) – Budgets/Transaktionen kaskadieren via FK
    func deleteAllUserData(userId: String) async throws {
        try await client.from("pflegebeduerftiger").delete().eq("user_id", value: userId).execute()
        try await client.from("antraege").delete().eq("user_id", value: userId).execute()
        try await client.from("profiles").delete().eq("id", value: userId).execute()
    }

    // Transaktionen für ein Budget laden
    func loadTransactions(budgetId: UUID) async throws -> [TransactionItem] {
        let items: [TransactionItem] = try await client
            .from("transactions")
            .select()
            .eq("budget_id", value: budgetId.uuidString)
            .order("date", ascending: false)
            .execute()
            .value
        return items
    }
}
