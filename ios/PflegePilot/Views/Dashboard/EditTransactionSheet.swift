import SwiftUI

struct EditTransactionSheet: View {
    @Environment(\.dismiss) var dismiss

    let tx: TransactionItem
    let isGuest: Bool
    let budgetId: UUID
    let personId: UUID
    let slug: String
    let year: Int
    var onSaved: () -> Void

    @State private var amountText: String = ""
    @State private var description: String = ""
    @State private var providerName: String = ""
    @State private var date: Date = Date()
    @State private var isSaving = false
    @State private var isDeleting = false
    @State private var errorMessage: String?
    @State private var confirmingDelete = false

    private var amountCents: Int? {
        let clean = amountText
            .replacingOccurrences(of: ",", with: ".")
            .replacingOccurrences(of: "€", with: "")
            .trimmingCharacters(in: .whitespaces)
        guard let val = Double(clean), val > 0 else { return nil }
        return Int(val * 100)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Buchung bearbeiten") {
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
                                Text("Änderungen speichern")
                                    .font(.headline).foregroundColor(.white)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(amountCents != nil ? Color(hex: "0891B2") : Color.gray)
                        .cornerRadius(10)
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .disabled(amountCents == nil || isSaving || isDeleting)
                }

                Section {
                    if !confirmingDelete {
                        Button(role: .destructive) {
                            confirmingDelete = true
                        } label: {
                            Label("Buchung löschen", systemImage: "trash")
                                .frame(maxWidth: .infinity)
                        }
                        .disabled(isSaving || isDeleting)
                    } else {
                        VStack(spacing: 8) {
                            Text("Wirklich löschen?")
                                .font(.subheadline.bold())
                                .foregroundColor(.red)
                            HStack(spacing: 8) {
                                Button(role: .destructive) {
                                    Task { await delete() }
                                } label: {
                                    Group {
                                        if isDeleting {
                                            ProgressView().tint(.white)
                                        } else {
                                            Text("Ja, löschen")
                                                .font(.subheadline.bold())
                                                .foregroundColor(.white)
                                        }
                                    }
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 40)
                                    .background(Color.red)
                                    .cornerRadius(8)
                                }
                                .disabled(isDeleting)

                                Button {
                                    confirmingDelete = false
                                } label: {
                                    Text("Abbrechen")
                                        .font(.subheadline)
                                        .foregroundColor(.primary)
                                        .frame(maxWidth: .infinity)
                                        .frame(height: 40)
                                        .background(Color(.systemGray5))
                                        .cornerRadius(8)
                                }
                                .disabled(isDeleting)
                            }
                        }
                        .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    }
                }
            }
            .navigationTitle("Buchung")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
            .onAppear {
                amountText = String(format: "%.2f", Double(tx.amountCents) / 100.0)
                    .replacingOccurrences(of: ".", with: ",")
                description = tx.description ?? ""
                providerName = tx.providerName ?? ""
                let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
                date = df.date(from: tx.date) ?? Date()
            }
        }
    }

    func save() async {
        guard let cents = amountCents else { return }
        isSaving = true
        errorMessage = nil
        if isGuest {
            let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
            let updated = GuestTransaction(
                id: tx.id,
                amountCents: cents,
                description: description.isEmpty ? nil : description,
                providerName: providerName.isEmpty ? nil : providerName,
                date: df.string(from: date)
            )
            GuestTransactionStore.update(updated, personId: personId, slug: slug, year: year)
            onSaved()
            dismiss()
        } else {
            do {
                try await SupabaseService.shared.updateTransaction(
                    transactionId: tx.id,
                    budgetId: budgetId,
                    amountCents: cents,
                    description: description.isEmpty ? nil : description,
                    providerName: providerName.isEmpty ? nil : providerName,
                    date: date
                )
                onSaved()
                dismiss()
            } catch {
                errorMessage = "Speichern fehlgeschlagen: \(error.localizedDescription)"
            }
        }
        isSaving = false
    }

    func delete() async {
        isDeleting = true
        errorMessage = nil
        if isGuest {
            GuestTransactionStore.delete(id: tx.id, personId: personId, slug: slug, year: year)
            onSaved()
            dismiss()
        } else {
            do {
                try await SupabaseService.shared.deleteTransaction(
                    transactionId: tx.id,
                    budgetId: budgetId
                )
                onSaved()
                dismiss()
            } catch {
                errorMessage = "Löschen fehlgeschlagen: \(error.localizedDescription)"
                isDeleting = false
                return
            }
        }
        isDeleting = false
    }
}
