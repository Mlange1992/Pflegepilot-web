import SwiftUI

struct ChecklistView: View {
    let result: NBAResult
    @Environment(\.dismiss) var dismiss

    private var items: [ChecklistItem] { ChecklistGenerator.erstelle(fuer: result) }
    @State private var checked: Set<String> = []

    private var kategorien: [String] {
        var seen: [String] = []
        for item in items {
            if !seen.contains(item.kategorie) { seen.append(item.kategorie) }
        }
        return seen
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {

                    // Header
                    VStack(spacing: 6) {
                        Image(systemName: "checklist")
                            .font(.system(size: 40))
                            .foregroundColor(Color(hex: "0891B2"))
                        Text("MD-Termin Checkliste")
                            .font(.title2.bold())
                        Text("Personalisiert basierend auf deinem Selbsttest")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top)

                    // WhatsApp-Share
                    Button(action: shareViaWhatsApp) {
                        Label("Per WhatsApp teilen", systemImage: "square.and.arrow.up")
                            .font(.subheadline.bold())
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color(hex: "25D366"))
                            .cornerRadius(12)
                    }
                    .padding(.horizontal)

                    // Kategorien
                    ForEach(kategorien, id: \.self) { kategorie in
                        VStack(alignment: .leading, spacing: 10) {
                            Text(kategorie)
                                .font(.headline)
                                .padding(.horizontal)
                                .padding(.top, 4)

                            ForEach(items.filter { $0.kategorie == kategorie }) { item in
                                ChecklistRow(
                                    item: item,
                                    isChecked: checked.contains(item.id.uuidString),
                                    onToggle: { toggle(item) }
                                )
                                .padding(.horizontal)
                            }
                        }
                        .padding(.vertical, 8)
                        .background(Color(.systemBackground))
                        .cornerRadius(14)
                        .shadow(color: .black.opacity(0.05), radius: 6, y: 2)
                        .padding(.horizontal)
                    }

                    // Disclaimer
                    Text(LegalTexts.checklisteDisclaimer)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding()
                }
                .padding(.bottom, 32)
            }
            .background(Color(.systemGroupedBackground).ignoresSafeArea())
            .navigationTitle("Checkliste")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
            .onAppear { loadChecked() }
        }
    }

    private func toggle(_ item: ChecklistItem) {
        let key = item.id.uuidString
        if checked.contains(key) {
            checked.remove(key)
        } else {
            checked.insert(key)
        }
        saveChecked()
    }

    private var checklistKey: String {
        "checklist_checked_\(Int(result.totalScore * 10))"
    }

    private func saveChecked() {
        UserDefaults.standard.set(Array(checked), forKey: checklistKey)
    }

    private func loadChecked() {
        let saved = UserDefaults.standard.stringArray(forKey: checklistKey) ?? []
        checked = Set(saved)
    }

    private func shareViaWhatsApp() {
        let text = buildShareText()
        guard let encoded = text.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "whatsapp://send?text=\(encoded)") else { return }
        if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else {
            // Fallback: iOS Share Sheet
            let av = UIActivityViewController(activityItems: [text], applicationActivities: nil)
            if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let vc = scene.windows.first?.rootViewController {
                vc.present(av, animated: true)
            }
        }
    }

    private func buildShareText() -> String {
        var lines = ["✅ MD-Termin Checkliste (PflegePilot)\n"]
        for kategorie in kategorien {
            lines.append("📌 \(kategorie)")
            for item in items.filter({ $0.kategorie == kategorie }) {
                let check = checked.contains(item.id.uuidString) ? "☑" : "☐"
                lines.append("\(check) \(item.text)")
            }
            lines.append("")
        }
        lines.append("Erstellt mit PflegePilot — pflege-pilot.com")
        return lines.joined(separator: "\n")
    }
}

// MARK: - Zeile

struct ChecklistRow: View {
    let item: ChecklistItem
    let isChecked: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: isChecked ? "checkmark.square.fill" : "square")
                    .font(.title3)
                    .foregroundColor(isChecked ? Color(hex: "0891B2") : Color(.systemGray3))

                VStack(alignment: .leading, spacing: 3) {
                    Text(item.text)
                        .font(.subheadline)
                        .foregroundColor(isChecked ? .secondary : .primary)
                        .strikethrough(isChecked)
                        .multilineTextAlignment(.leading)

                    if item.wichtig && !isChecked {
                        Label("Wichtig", systemImage: "exclamationmark.circle.fill")
                            .font(.caption2)
                            .foregroundColor(.orange)
                    }
                }

                Spacer()
            }
            .padding(.vertical, 6)
        }
        .buttonStyle(.plain)
    }
}
