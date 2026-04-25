import SwiftUI

private struct ExpenseTemplate {
    let label: String
    let description: String
    let providerHint: String
}

private let expenseTemplates: [String: [ExpenseTemplate]] = [
    "entlastungsbetrag": [
        ExpenseTemplate(label: "Haushaltshilfe", description: "Haushaltshilfe", providerHint: "Anbieter"),
        ExpenseTemplate(label: "Einkaufshilfe", description: "Einkaufsbegleitung", providerHint: "Anbieter"),
        ExpenseTemplate(label: "Fahrdienst", description: "Fahrdienst / Transport", providerHint: "Fahrdienst"),
        ExpenseTemplate(label: "Alltagsbegleitung", description: "Alltagsbegleitung", providerHint: "Anbieter"),
        ExpenseTemplate(label: "Betreuungsgruppe", description: "Betreuungsgruppe", providerHint: "Einrichtung"),
        ExpenseTemplate(label: "Mahlzeitendienst", description: "Essen auf Rädern / Mahlzeitendienst", providerHint: "Dienst"),
    ],
    "pflegesachleistungen": [
        ExpenseTemplate(label: "Grundpflege", description: "Grundpflege", providerHint: "Pflegedienst"),
        ExpenseTemplate(label: "Körperpflege", description: "Körperpflege / Waschen", providerHint: "Pflegedienst"),
        ExpenseTemplate(label: "Behandlungspflege", description: "Behandlungspflege", providerHint: "Pflegedienst"),
        ExpenseTemplate(label: "Wundversorgung", description: "Wundversorgung", providerHint: "Pflegedienst"),
    ],
    "entlastungsbudget": [
        ExpenseTemplate(label: "Verhinderungspflege", description: "Verhinderungspflege", providerHint: "Pflegeperson / Einrichtung"),
        ExpenseTemplate(label: "Kurzzeitpflege", description: "Kurzzeitpflege", providerHint: "Pflegeheim"),
        ExpenseTemplate(label: "Tagespflege", description: "Tagespflege", providerHint: "Tagespflegeeinrichtung"),
    ],
    "pflegehilfsmittel": [
        ExpenseTemplate(label: "Einmalhandschuhe", description: "Einmalhandschuhe", providerHint: "Sanitätshaus"),
        ExpenseTemplate(label: "Bettschutzeinlagen", description: "Bettschutzeinlagen / Matratzenschutz", providerHint: "Sanitätshaus"),
        ExpenseTemplate(label: "Desinfektionsmittel", description: "Desinfektionsmittel", providerHint: "Sanitätshaus"),
        ExpenseTemplate(label: "Mundschutz", description: "Mundschutz / Masken", providerHint: "Sanitätshaus"),
    ],
    "wohnumfeldverbesserung": [
        ExpenseTemplate(label: "Badumbau", description: "Barrierefreier Badumbau", providerHint: "Handwerker"),
        ExpenseTemplate(label: "Haltegriffe", description: "Haltegriffe / Stützgriffe", providerHint: "Sanitätshaus / Handwerker"),
        ExpenseTemplate(label: "Rampe", description: "Rollstuhlrampe", providerHint: "Handwerker"),
        ExpenseTemplate(label: "Türverbreiterung", description: "Türverbreiterung", providerHint: "Handwerker"),
        ExpenseTemplate(label: "Treppenlift", description: "Treppenlift", providerHint: "Anbieter"),
    ],
]

struct TransactionSheet: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss
    let budget: BudgetItem
    var onAdded: () -> Void

    private var isGuest: Bool { authService.currentUserId == nil }

    private var guestPersonId: UUID { budget.personId ?? UUID() }
    private var guestSlug: String { budget.benefitType.slug }

    @State private var amountText = ""
    @State private var description = ""
    @State private var providerName = ""
    @State private var date = Date()
    @State private var isSaving = false
    @State private var errorMessage: String?
    @State private var transactions: [TransactionItem] = []
    @State private var isLoadingHistory = false
    @State private var selectedTemplate: String? = nil
    @State private var editingTx: TransactionItem? = nil

    private var templates: [ExpenseTemplate] {
        expenseTemplates[budget.benefitType.slug] ?? []
    }

    var amountCents: Int? {
        let clean = amountText.replacingOccurrences(of: ",", with: ".").replacingOccurrences(of: "€", with: "").trimmingCharacters(in: .whitespaces)
        guard let val = Double(clean), val > 0 else { return nil }
        return Int(val * 100)
    }

    var body: some View {
        NavigationStack {
            Form {
                // ── Gast-Hinweis ─────────────────────────────────
                if isGuest {
                    Section {
                        Label("Daten nur auf diesem Gerät gespeichert.", systemImage: "iphone")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                // ── Budget-Status ────────────────────────────────
                Section {
                    HStack {
                        Text(budget.benefitType.icon ?? "💶")
                            .font(.title2)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(budget.benefitType.name)
                                .font(.subheadline.bold())
                            Text("\(budget.remainingCents.formatEuro) noch verfügbar")
                                .font(.caption)
                                .foregroundColor(budget.remainingCents > 0 ? .green : .red)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("\(Int(budget.percentUsed * 100))% genutzt")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                            ProgressView(value: budget.percentUsed)
                                .tint(progressColor)
                                .frame(width: 80)
                        }
                    }
                }

                // ── Neue Buchung ─────────────────────────────────
                if !templates.isEmpty {
                    Section("Was wurde genutzt?") {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(templates, id: \.label) { template in
                                    Button {
                                        if selectedTemplate == template.label {
                                            selectedTemplate = nil
                                            description = ""
                                            providerName = ""
                                        } else {
                                            selectedTemplate = template.label
                                            description = template.description
                                            if providerName.isEmpty {
                                                providerName = template.providerHint
                                            }
                                        }
                                    } label: {
                                        Text(template.label)
                                            .font(.subheadline)
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 8)
                                            .background(selectedTemplate == template.label
                                                        ? Color(hex: "0891B2")
                                                        : Color(.systemGray5))
                                            .foregroundColor(selectedTemplate == template.label ? .white : .primary)
                                            .cornerRadius(20)
                                    }
                                }
                                Button {
                                    selectedTemplate = "eigene"
                                    description = ""
                                    providerName = ""
                                } label: {
                                    Text("Sonstiges")
                                        .font(.subheadline)
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 8)
                                        .background(selectedTemplate == "eigene"
                                                    ? Color(hex: "0891B2")
                                                    : Color(.systemGray5))
                                        .foregroundColor(selectedTemplate == "eigene" ? .white : .primary)
                                        .cornerRadius(20)
                                }
                            }
                            .padding(.vertical, 4)
                        }
                        .listRowInsets(EdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12))
                    }
                }

                Section("Ausgabe erfassen") {
                        HStack {
                            Text("Betrag")
                            Spacer()
                            TextField("0,00 €", text: $amountText)
                                .keyboardType(.decimalPad)
                                .multilineTextAlignment(.trailing)
                                .frame(width: 120)
                        }

                        TextField("Beschreibung", text: $description)

                        TextField("Anbieter / Pflegedienst", text: $providerName)

                        DatePicker("Datum", selection: $date, displayedComponents: .date)
                    }

                    if let error = errorMessage {
                        Section {
                            Text(error).foregroundColor(.red).font(.caption)
                        }
                    }

                    Section {
                        Button {
                            Task { await save() }
                        } label: {
                            Group {
                                if isSaving {
                                    ProgressView().tint(.white)
                                } else {
                                    Text("Buchung speichern")
                                        .font(.headline).foregroundColor(.white)
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 44)
                            .background(amountCents != nil ? Color(hex: "0891B2") : Color.gray)
                            .cornerRadius(10)
                        }
                        .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                        .disabled(amountCents == nil || isSaving)
                    }

                // ── Bisherige Buchungen ──────────────────────────
                if !transactions.isEmpty {
                    Section("Bisherige Buchungen") {
                        ForEach(transactions) { tx in
                            Button {
                                editingTx = tx
                            } label: {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(tx.description ?? tx.providerName ?? "Ausgabe")
                                            .font(.subheadline)
                                            .foregroundColor(.primary)
                                        Text(tx.date)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                    Spacer()
                                    Text("–\(tx.amountCents.formatEuro)")
                                        .font(.subheadline.bold())
                                        .foregroundColor(.red)
                                    Image(systemName: "chevron.right")
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                Button(role: .destructive) {
                                    Task { await deleteTransaction(tx) }
                                } label: {
                                    Label("Löschen", systemImage: "trash")
                                }
                                Button {
                                    editingTx = tx
                                } label: {
                                    Label("Bearbeiten", systemImage: "pencil")
                                }
                                .tint(.blue)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Ausgabe buchen")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
            .task { await loadHistory() }
            .sheet(item: $editingTx) { tx in
                EditTransactionSheet(
                    tx: tx,
                    isGuest: isGuest,
                    budgetId: budget.id,
                    personId: guestPersonId,
                    slug: guestSlug,
                    year: budget.year
                ) {
                    Task {
                        await loadHistory()
                        onAdded()
                    }
                }
            }
        }
    }

    func deleteTransaction(_ tx: TransactionItem) async {
        if isGuest {
            GuestTransactionStore.delete(id: tx.id, personId: guestPersonId, slug: guestSlug, year: budget.year)
            await loadHistory()
            onAdded()
        } else {
            do {
                try await SupabaseService.shared.deleteTransaction(
                    transactionId: tx.id,
                    budgetId: budget.id
                )
                await loadHistory()
                onAdded()
            } catch {
                errorMessage = "Löschen fehlgeschlagen: \(error.localizedDescription)"
            }
        }
    }

    var progressColor: Color {
        if budget.percentUsed < 0.6 { return .green }
        if budget.percentUsed < 0.85 { return .orange }
        return .red
    }

    func save() async {
        guard let cents = amountCents else { return }
        guard cents <= budget.remainingCents else {
            errorMessage = "Betrag übersteigt verbleibendes Budget (\(budget.remainingCents.formatEuro))."
            return
        }
        isSaving = true
        errorMessage = nil
        if isGuest {
            let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
            let tx = GuestTransaction(
                id: UUID(),
                amountCents: cents,
                description: description.isEmpty ? nil : description,
                providerName: providerName.isEmpty ? nil : providerName,
                date: df.string(from: date)
            )
            GuestTransactionStore.add(tx, personId: guestPersonId, slug: guestSlug, year: budget.year)
            onAdded()
            dismiss()
        } else {
            do {
                try await SupabaseService.shared.addTransaction(
                    budgetId: budget.id,
                    amountCents: cents,
                    description: description.isEmpty ? nil : description,
                    providerName: providerName.isEmpty ? nil : providerName,
                    date: date
                )
                onAdded()
                dismiss()
            } catch {
                errorMessage = "Speichern fehlgeschlagen: \(error.localizedDescription)"
            }
        }
        isSaving = false
    }

    func loadHistory() async {
        isLoadingHistory = true
        if isGuest {
            let guestTxs = GuestTransactionStore.load(personId: guestPersonId, slug: guestSlug, year: budget.year)
            transactions = guestTxs.map {
                TransactionItem(id: $0.id, budgetId: budget.id, amountCents: $0.amountCents,
                                description: $0.description, providerName: $0.providerName, date: $0.date)
            }
        } else {
            transactions = (try? await SupabaseService.shared.loadTransactions(budgetId: budget.id)) ?? []
        }
        isLoadingHistory = false
    }
}
