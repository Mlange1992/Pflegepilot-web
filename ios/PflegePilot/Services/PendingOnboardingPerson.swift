import Foundation

enum PendingOnboardingPerson {
    private static let nameKey = "pending_person_name"
    private static let pflegegradKey = "pending_pflegegrad"

    static func save(name: String, pflegegrad: Int?) {
        UserDefaults.standard.set(name, forKey: nameKey)
        UserDefaults.standard.set(pflegegrad ?? 0, forKey: pflegegradKey)
    }

    static func clear() {
        UserDefaults.standard.removeObject(forKey: nameKey)
        UserDefaults.standard.removeObject(forKey: pflegegradKey)
    }

    static func createIfNeeded(userId: String) async {
        let pendingName = UserDefaults.standard.string(forKey: nameKey) ?? ""
        let pendingPG = UserDefaults.standard.integer(forKey: pflegegradKey)
        guard !pendingName.isEmpty || pendingPG > 0 else { return }

        let name = pendingName.isEmpty ? "Pflegebedürftige Person" : pendingName
        let pg: Int? = pendingPG > 0 ? pendingPG : nil

        do {
            let person = try await SupabaseService.shared.createPerson(
                userId: userId, name: name, pflegegrad: pg,
                bundesland: "", nutztPflegedienst: false
            )

            if let pg = pg {
                let year = Calendar.current.component(.year, from: Date())
                try await SupabaseService.shared.createBudgetsIfNeeded(
                    userId: userId, personId: person.id, pflegegrad: pg, year: year
                )
            }

            clear()
        } catch {
            print("PendingOnboardingPerson.createIfNeeded fehlgeschlagen — Eingaben bleiben für nächsten Versuch erhalten:", error)
        }
    }
}
