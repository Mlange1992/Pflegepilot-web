import SwiftUI
import MessageUI

struct AntragFormView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authService: AuthService

    var person: Pflegebeduerftiger?
    var nbaResult: NBAResult?
    var onCompleted: ((Bool) -> Void)? = nil

    @State private var antrag = AntragData()
    @State private var pdfData: Data?
    @State private var showShareSheet = false
    @State private var isGenerating = false
    @State private var showSaveDialog = false

    // PDF-Erstellung ist jetzt für alle kostenlos
    var canCreatePDF: Bool { true }

    var body: some View {
        NavigationStack {
            Form {
                // ── Antrag-Typ ───────────────────────────────────
                Section("Art des Antrags") {
                    Picker("Antrag-Typ", selection: $antrag.antragTyp) {
                        ForEach(AntragTyp.allCases, id: \.self) { typ in
                            Label(typ.rawValue, systemImage: typ.icon).tag(typ)
                        }
                    }
                    .pickerStyle(.menu)
                }

                // ── Pflegekasse ──────────────────────────────────
                Section {
                    Picker("Pflegekasse *", selection: $antrag.pflegekasse) {
                        Text("Bitte auswählen").tag("")
                        ForEach(AntragData.pflegekassen, id: \.self) { k in
                            Text(k).tag(k)
                        }
                    }
                    TextField("Versicherungsnummer *", text: $antrag.versicherungsnummer)
                        .autocapitalization(.allCharacters)
                } header: {
                    Text("Pflegekasse (Pflichtfelder)")
                } footer: {
                    Text("Die Versicherungsnummer finden Sie auf Ihrer Krankenversicherungskarte.")
                }

                // ── Persönliche Daten ────────────────────────────
                Section("Persönliche Daten") {
                    Toggle("Antrag für eine andere Person", isOn: $antrag.antragFuerAnderen)

                    if antrag.antragFuerAnderen {
                        TextField("Name der pflegebedürftigen Person *", text: $antrag.pflegebeduerftiger)
                        Divider()
                        Text("Ihre Daten (Antragsteller)")
                            .font(.caption).foregroundColor(.secondary)
                    }

                    HStack(spacing: 8) {
                        TextField("Vorname *", text: $antrag.vorname)
                        TextField("Nachname *", text: $antrag.nachname)
                    }

                    DatePicker("Geburtsdatum *", selection: $antrag.geburtsdatum,
                               in: ...Date(), displayedComponents: .date)
                }

                // ── Adresse ──────────────────────────────────────
                Section("Adresse") {
                    HStack(spacing: 8) {
                        TextField("Straße *", text: $antrag.strasse)
                            .frame(maxWidth: .infinity)
                        TextField("Nr.", text: $antrag.hausnummer)
                            .frame(width: 60)
                    }
                    HStack(spacing: 8) {
                        TextField("PLZ *", text: $antrag.plz)
                            .keyboardType(.numberPad)
                            .frame(width: 80)
                        TextField("Ort *", text: $antrag.ort)
                            .frame(maxWidth: .infinity)
                    }
                    TextField("Telefon", text: $antrag.telefon)
                        .keyboardType(.phonePad)
                    TextField("E-Mail", text: $antrag.email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                }

                // ── NBA-Ergebnis ─────────────────────────────────
                if let pg = antrag.geschaetzterPflegegrad {
                    Section("Selbsttest-Ergebnis") {
                        HStack {
                            Image(systemName: "checkmark.seal.fill")
                                .foregroundColor(Color(hex: "0891B2"))
                            Text("Geschätzter Pflegegrad \(pg)")
                            Spacer()
                            Text("wird in PDF aufgenommen")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }

                // ── Begründung ───────────────────────────────────
                Section {
                    TextEditor(text: $antrag.begruendung)
                        .frame(minHeight: 100)
                        .overlay(
                            Group {
                                if antrag.begruendung.isEmpty {
                                    Text("Beschreiben Sie kurz die Pflegesituation…")
                                        .foregroundColor(.secondary)
                                        .font(.body)
                                        .padding(.top, 8)
                                        .padding(.leading, 4)
                                        .allowsHitTesting(false)
                                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                                }
                            }
                        )
                } header: {
                    Text("Begründung (optional)")
                } footer: {
                    Text("Leer lassen für Standardtext.")
                }

                // ── Aktionen ─────────────────────────────────────
                Section {
                    if canCreatePDF {
                        Button {
                            generateAndShare()
                        } label: {
                            HStack {
                                if isGenerating {
                                    ProgressView().tint(.white)
                                } else {
                                    Image(systemName: "doc.badge.arrow.up")
                                    Text("PDF erstellen & senden")
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 44)
                            .foregroundColor(.white)
                            .background(antrag.isValid ? Color(hex: "0891B2") : Color.gray)
                            .cornerRadius(10)
                        }
                        .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                        .disabled(!antrag.isValid || isGenerating)
                        }

                    if !antrag.isValid && canCreatePDF {
                        Text("Bitte alle Pflichtfelder (*) ausfüllen.")
                            .font(.caption)
                            .foregroundColor(.red)
                    }
                }
            }
            .navigationTitle(antrag.antragTyp.rawValue)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }
                }
            }
            .sheet(isPresented: $showShareSheet, onDismiss: {
                if pdfData != nil && onCompleted != nil {
                    showSaveDialog = true
                }
            }) {
                if let data = pdfData {
                    ShareSheet(activityItems: [
                        PDFItem(data: data, filename: "Pflegegrad-Antrag.pdf")
                    ])
                }
            }
            .confirmationDialog(
                "Antworten im Profil speichern?",
                isPresented: $showSaveDialog,
                titleVisibility: .visible
            ) {
                Button("Ja, speichern") {
                    dismiss()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                        onCompleted?(true)
                    }
                }
                Button("Nicht jetzt", role: .cancel) {
                    dismiss()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                        onCompleted?(false)
                    }
                }
            } message: {
                Text("Ihre Testantworten werden gespeichert, damit Sie beim nächsten Antrag nur Änderungen vornehmen müssen.")
            }
            .onAppear { prefill() }
        }
    }

    func prefill() {
        if let p = person {
            antrag.pflegebeduerftiger = p.name
            antrag.geschaetzterPflegegrad = p.pflegegrad
        }
        if let r = nbaResult {
            antrag.geschaetzterPflegegrad = r.pflegegrad
            antrag.nbaGesamtpunkte = r.totalScore
        }
        antrag.email = authService.userEmail ?? ""
    }

    func generateAndShare() {
        isGenerating = true
        // UIMarkupTextPrintFormatter + UIGraphics require main thread — no Task.detached
        let antragCopy = antrag
        pdfData = AntragPDFService.shared.generatePDF(antrag: antragCopy)
        isGenerating = false
        showShareSheet = true
        Task {
            if let userId = authService.currentUserId {
                let name = antragCopy.antragFuerAnderen ? antragCopy.pflegebeduerftiger : "\(antragCopy.vorname) \(antragCopy.nachname)"
                let title = "\(antragCopy.antragTyp.rawValue) – \(name.trimmingCharacters(in: .whitespaces))"
                try? await SupabaseService.shared.saveAntrag(userId: userId, antrag: antragCopy, title: title)
            }
        }
    }
}

// MARK: - PDF Share Item (für richtigen Dateinamen)

class PDFItem: NSObject, UIActivityItemSource {
    let data: Data
    let filename: String

    init(data: Data, filename: String) {
        self.data = data
        self.filename = filename
    }

    func activityViewControllerPlaceholderItem(_ activityViewController: UIActivityViewController) -> Any {
        return data
    }

    func activityViewController(_ activityViewController: UIActivityViewController,
                                 itemForActivityType activityType: UIActivity.ActivityType?) -> Any? {
        // Temporäre Datei mit richtigem Namen
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(filename)
        try? data.write(to: url)
        return url
    }

    func activityViewController(_ activityViewController: UIActivityViewController,
                                 subjectForActivityType activityType: UIActivity.ActivityType?) -> String {
        return "Pflegegrad-Antrag"
    }
}

// MARK: - Share Sheet

struct ShareSheet: UIViewControllerRepresentable {
    let activityItems: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}
