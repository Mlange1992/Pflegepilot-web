import SwiftUI

// PflegePilot ist 100% kostenlos — kein Premium, kein Abo, kein StoreKit.
// Diese View wird nicht mehr angezeigt, bleibt aber für Compiler-Kompatibilität.
struct PremiumPaywallView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 60))
                    .foregroundColor(Color(hex: "0891B2"))
                Text("PflegePilot ist kostenlos")
                    .font(.title2.bold())
                Text("Alle Features sind für alle Nutzer dauerhaft kostenlos verfügbar. Kein Abo, kein In-App-Kauf.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                Button("Schließen") { dismiss() }
                    .buttonStyle(.borderedProminent)
            }
            .padding()
            .navigationTitle("Kostenlos")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
        }
    }
}
