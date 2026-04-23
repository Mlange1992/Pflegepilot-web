import Foundation

/// Lokaler Speicher für Personen im Gastmodus (UserDefaults, kein Supabase).
enum GuestPersonStore {
    private static let key = "guest_persons"

    static func load() -> [Pflegebeduerftiger] {
        guard let data = UserDefaults.standard.data(forKey: key),
              let persons = try? JSONDecoder().decode([Pflegebeduerftiger].self, from: data)
        else { return [] }
        return persons
    }

    static func add(_ person: Pflegebeduerftiger) {
        var all = load()
        all.append(person)
        save(all)
    }

    static func update(_ person: Pflegebeduerftiger) {
        var all = load()
        if let idx = all.firstIndex(where: { $0.id == person.id }) {
            all[idx] = person
        }
        save(all)
    }

    static func remove(id: UUID) {
        var all = load()
        all.removeAll { $0.id == id }
        save(all)
    }

    static func clear() {
        UserDefaults.standard.removeObject(forKey: key)
    }

    private static func save(_ persons: [Pflegebeduerftiger]) {
        if let data = try? JSONEncoder().encode(persons) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }
}
