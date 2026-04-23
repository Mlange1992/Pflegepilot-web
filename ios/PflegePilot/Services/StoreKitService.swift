import Foundation

// App ist komplett kostenlos — StoreKit wurde entfernt.
// Diese Datei ist ein leerer Stub für Kompatibilität während der Migration.
@MainActor
class StoreKitService: ObservableObject {
    static let shared = StoreKitService()
    @Published var isPremium: Bool = false  // immer false, App ist kostenlos
}
