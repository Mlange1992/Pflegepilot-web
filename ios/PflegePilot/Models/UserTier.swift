import Foundation

enum UserTier {
    case guest    // Nicht registriert – nur diese Session
    case free     // Registriert – alle Features kostenlos

    // MARK: - Feature Gates (alle Features kostenlos)

    var canCreatePDF: Bool          { self != .guest }
    var canSaveData: Bool           { self != .guest }
    var showsAds: Bool              { false }
    var maxPersons: Int             { self == .guest ? 0 : Int.max }
    var hasPushNotifications: Bool  { self != .guest }

    // MARK: - Display

    var label: String {
        switch self {
        case .guest: return "Gast"
        case .free:  return "Kostenlos"
        }
    }

    var icon: String {
        switch self {
        case .guest: return "person.slash"
        case .free:  return "person.fill.checkmark"
        }
    }
}
