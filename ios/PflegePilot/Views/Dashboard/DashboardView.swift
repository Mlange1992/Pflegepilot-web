import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authService: AuthService
    @AppStorage("isGuestMode") private var isGuestMode = false

    var body: some View {
        TabView {
            DashboardView()
                .tabItem { Label("Budgets", systemImage: "chart.bar.fill") }
            RatgeberView()
                .tabItem { Label("Ratgeber", systemImage: "book.fill") }
            ProfileSettingsView()
                .tabItem { Label("Profil", systemImage: "person.fill") }
        }
        .tint(Color(hex: "0891B2"))
    }
}

// MARK: - Übersicht (alle Personen auf einen Blick)

struct UebersichtView: View {
    @EnvironmentObject var authService: AuthService
    @State private var summaries: [PersonSummary] = []
    @State private var isLoading = true

    struct PersonSummary: Identifiable {
        let id: UUID
        let person: Pflegebeduerftiger
        let budgets: [BudgetItem]
        var total: Int   { budgets.reduce(0) { $0 + $1.totalCents } }
        var used: Int    { budgets.reduce(0) { $0 + $1.usedCents } }
        var remaining: Int { total - used }
        var nextExpiry: BudgetItem? {
            budgets
                .filter { $0.expiresAt != nil && $0.remainingCents > 0 }
                .sorted { $0.expiresAt! < $1.expiresAt! }
                .first
        }
    }

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    ProgressView("Lade Übersicht…")
                } else if summaries.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "person.2.slash").font(.system(size: 48)).foregroundColor(.secondary)
                        Text("Noch keine Personen angelegt")
                            .font(.headline).foregroundColor(.secondary)
                    }
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            ForEach(summaries) { s in
                                PersonSummaryCard(summary: s)
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Übersicht")
            .task { await load() }
            .refreshable { await load() }
        }
    }

    func load() async {
        guard let userId = authService.currentUserId else { return }
        isLoading = true

        // Person aus Onboarding automatisch anlegen (einmalig nach Registrierung)
        await createPendingPersonIfNeeded(userId: userId)

        let year = Calendar.current.component(.year, from: Date())
        do {
            let persons = try await SupabaseService.shared.loadPersons(userId: userId)
            var result: [PersonSummary] = []
            for person in persons {
                guard let pg = person.pflegegrad else {
                    result.append(PersonSummary(id: person.id, person: person, budgets: []))
                    continue
                }
                let budgets = try await SupabaseService.shared.loadBudgets(userId: userId, personId: person.id, year: year)
                result.append(PersonSummary(id: person.id, person: person, budgets: budgets))
            }
            summaries = result
        } catch {
            print("Übersicht Fehler:", error)
        }
        isLoading = false
    }

    func createPendingPersonIfNeeded(userId: String) async {
        await PendingOnboardingPerson.createIfNeeded(userId: userId)
    }
}

struct PersonSummaryCard: View {
    let summary: UebersichtView.PersonSummary

    var percentUsed: Double {
        summary.total > 0 ? Double(summary.used) / Double(summary.total) : 0
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {

            // ── Name + Pflegegrad ────────────────────────────────
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(summary.person.name).font(.title3.bold())
                    if let pg = summary.person.pflegegrad {
                        Text("Pflegegrad \(pg)")
                            .font(.subheadline)
                            .foregroundColor(Color(hex: "0891B2"))
                    } else {
                        Text("Kein Pflegegrad eingetragen")
                            .font(.subheadline).foregroundColor(.orange)
                    }
                }
                Spacer()
                if let pg = summary.person.pflegegrad {
                    Text("\(pg)")
                        .font(.system(size: 36, weight: .black))
                        .foregroundColor(Color(hex: "0891B2").opacity(0.2))
                }
            }

            if !summary.budgets.isEmpty {
                // ── Fortschrittsbalken ───────────────────────────
                VStack(spacing: 4) {
                    ProgressView(value: percentUsed)
                        .tint(percentUsed > 0.9 ? .red : Color(hex: "0891B2"))
                    HStack {
                        Text("\(summary.used.formatEuroKompakt) genutzt")
                            .font(.caption).foregroundColor(.secondary)
                        Spacer()
                        Text("\(summary.remaining.formatEuroKompakt) verfügbar")
                            .font(.caption.bold())
                            .foregroundColor(Color(hex: "0891B2"))
                    }
                }

                // ── Stat-Zeile ───────────────────────────────────
                HStack(spacing: 0) {
                    summaryStatBox(label: "Jahresanspruch", value: summary.total.formatEuroKompakt)
                    Divider().frame(height: 32)
                    summaryStatBox(label: "Budgets", value: "\(summary.budgets.count)")
                    Divider().frame(height: 32)
                    summaryStatBox(label: "Genutzt", value: String(format: "%.0f%%", percentUsed * 100))
                }
                .background(Color(.systemGroupedBackground))
                .cornerRadius(10)

                // ── Nächste Frist ─────────────────────────────────
                if let next = summary.nextExpiry, let exp = next.expiresAt {
                    let days = Calendar.current.dateComponents([.day], from: Date(), to: exp).day ?? 0
                    HStack(spacing: 6) {
                        Image(systemName: "clock.badge.exclamationmark")
                            .foregroundColor(days <= 7 ? .red : days <= 30 ? .orange : .yellow)
                        Text("Nächste Frist: \(next.benefitType.name) – noch \(days) Tage")
                            .font(.caption).foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.07), radius: 8, y: 2)
    }

    @ViewBuilder
    func summaryStatBox(label: String, value: String) -> some View {
        VStack(spacing: 2) {
            Text(value).font(.subheadline.bold())
            Text(label).font(.caption2).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }
}

// MARK: - Dashboard

struct DashboardView: View {
    @EnvironmentObject var authService: AuthService
    @State private var persons: [Pflegebeduerftiger] = []
    @State private var selectedPersonId: UUID?
    @State private var isLoading = true
    @State private var showAddPerson = false
    @State private var showMigrationOffer = false
    @State private var pendingMigrationCount = 0

    var selectedPerson: Pflegebeduerftiger? {
        persons.first { $0.id == selectedPersonId } ?? persons.first
    }

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    ProgressView("Laden…")
                } else if persons.isEmpty {
                    AddFirstPersonView(onSaved: { Task { await loadPersons() } })
                } else {
                    VStack(spacing: 0) {
                        PersonPicker(
                            persons: persons,
                            selectedId: Binding(
                                get: { selectedPersonId ?? persons.first?.id },
                                set: { selectedPersonId = $0 }
                            ),
                            onAdd: { showAddPerson = true }
                        )
                        if let person = selectedPerson {
                            PersonDashboard(
                                person: person,
                                onPersonUpdated: { updated in
                                    if let idx = persons.firstIndex(where: { $0.id == updated.id }) {
                                        persons[idx] = updated
                                    }
                                },
                                onPersonDeleted: {
                                    Task { await loadPersons() }
                                }
                            )
                        }
                    }
                }
            }
            .navigationTitle("Mein Dashboard")
            .task { await loadPersons() }
            .confirmationDialog(
                "Offline-Daten importieren?",
                isPresented: $showMigrationOffer,
                titleVisibility: .visible
            ) {
                Button("Importieren") { Task { await migrateGuestData() } }
                Button("Nicht importieren", role: .cancel) {}
            } message: {
                Text("Sie haben \(pendingMigrationCount) Person(en) offline gespeichert. Möchten Sie diese in Ihren Account übernehmen? Die Daten bleiben auch lokal erhalten.")
            }
            .sheet(isPresented: $showAddPerson) {
                AddEditPersonSheet(person: nil) { _ in
                    Task { await loadPersons() }
                }
            }
        }
    }

    func loadPersons() async {
        isLoading = true
        if let userId = authService.currentUserId {
            await createPendingPersonIfNeeded(userId: userId)

            // Einmalig Migration anbieten, wenn Gast-Daten vorhanden
            let migrationKey = "migrationOffered_\(userId)"
            if !UserDefaults.standard.bool(forKey: migrationKey) {
                UserDefaults.standard.set(true, forKey: migrationKey)
                let guestPersons = GuestPersonStore.load()
                if !guestPersons.isEmpty {
                    pendingMigrationCount = guestPersons.count
                    showMigrationOffer = true
                }
            }

            do {
                persons = try await SupabaseService.shared.loadPersons(userId: userId)
            } catch {
                print("Fehler beim Laden der Personen:", error)
            }
        } else {
            persons = GuestPersonStore.load()
        }
        isLoading = false
    }

    func createPendingPersonIfNeeded(userId: String) async {
        await PendingOnboardingPerson.createIfNeeded(userId: userId)
    }

    func migrateGuestData() async {
        guard let userId = authService.currentUserId else { return }
        isLoading = true
        let year = Calendar.current.component(.year, from: Date())
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"

        for guestPerson in GuestPersonStore.load() {
            guard let created = try? await SupabaseService.shared.createPerson(
                userId: userId,
                name: guestPerson.name,
                pflegegrad: guestPerson.pflegegrad,
                bundesland: guestPerson.bundesland,
                nutztPflegedienst: guestPerson.nutztPflegedienst
            ) else { continue }

            guard let pg = guestPerson.pflegegrad else { continue }
            try? await SupabaseService.shared.createBudgetsIfNeeded(
                userId: userId, personId: created.id, pflegegrad: pg, year: year
            )

            let budgets = (try? await SupabaseService.shared.loadBudgets(
                userId: userId, personId: created.id, year: year
            )) ?? []

            for budget in budgets {
                let guestTxs = GuestTransactionStore.load(
                    personId: guestPerson.id, slug: budget.benefitType.slug, year: year
                )
                for tx in guestTxs {
                    try? await SupabaseService.shared.addTransaction(
                        budgetId: budget.id,
                        amountCents: tx.amountCents,
                        description: tx.description,
                        providerName: tx.providerName,
                        date: df.date(from: tx.date) ?? Date()
                    )
                }
            }
        }

        await loadPersons()
    }
}

// MARK: - Person Picker

struct PersonPicker: View {
    let persons: [Pflegebeduerftiger]
    @Binding var selectedId: UUID?
    let onAdd: () -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(persons) { person in
                    Button {
                        selectedId = person.id
                    } label: {
                        VStack(spacing: 2) {
                            Text(person.name)
                                .font(.subheadline.bold())
                            if let pg = person.pflegegrad {
                                Text("PG \(pg)")
                                    .font(.caption2)
                                    .opacity(0.8)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(selectedId == person.id ? Color(hex: "0891B2") : Color(.systemGray5))
                        .foregroundColor(selectedId == person.id ? .white : .primary)
                        .cornerRadius(20)
                    }
                }
                Button {
                    onAdd()
                } label: {
                    Image(systemName: "plus")
                        .font(.subheadline.bold())
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Color(.systemGray5))
                        .foregroundColor(Color(hex: "0891B2"))
                        .cornerRadius(20)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 10)
        }
        .background(Color(.systemGroupedBackground))
    }
}

// MARK: - Person Dashboard

struct PersonDashboard: View {
    @EnvironmentObject var authService: AuthService
    let person: Pflegebeduerftiger
    let onPersonUpdated: (Pflegebeduerftiger) -> Void
    var onPersonDeleted: (() -> Void)? = nil

    @State private var showEdit = false
    @State private var showAntrag = false
    @State private var budgets: [BudgetItem] = []
    @State private var isLoadingBudgets = true
    @State private var selectedBudget: BudgetItem?
    @State private var showShareSheet = false
    @State private var shareText = ""
    @State private var loadError: String?

    var pflegegrad: Pflegegrad? {
        guard let pg = person.pflegegrad else { return nil }
        return Pflegegrad(rawValue: pg)
    }

    var totalEntitlement: Int { budgets.reduce(0) { $0 + $1.totalCents } }
    var totalUsed: Int       { budgets.reduce(0) { $0 + $1.usedCents } }
    var totalRemaining: Int  { totalEntitlement - totalUsed }

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if let pg = pflegegrad {

                    // ── Header ───────────────────────────────────
                    VStack(spacing: 8) {
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(person.name).font(.title3.bold())
                                Text(pg.label).font(.subheadline).foregroundColor(.secondary)
                            }
                            Spacer()
                            Button { showEdit = true } label: {
                                Label("Bearbeiten", systemImage: "pencil")
                                    .font(.subheadline.bold())
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 7)
                                    .background(Color(hex: "0891B2").opacity(0.12))
                                    .foregroundColor(Color(hex: "0891B2"))
                                    .cornerRadius(8)
                            }
                        }

                        if !isLoadingBudgets {
                            HStack(spacing: 0) {
                                statBox(label: "Jahresanspruch", value: totalEntitlement.formatEuro)
                                Divider().frame(height: 40)
                                statBox(label: "Genutzt", value: totalUsed.formatEuro)
                                Divider().frame(height: 40)
                                statBox(label: "Verfügbar", value: totalRemaining.formatEuro, highlight: true)
                            }
                        }
                    }
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color(hex: "0891B2").opacity(0.08))
                    .cornerRadius(16)
                    .padding(.horizontal)

                    // ── Fristen ──────────────────────────────────
                    if !budgets.isEmpty {
                        FristenView(budgets: budgets)
                    }

                    // ── Antrag-Button ────────────────────────────
                    Button { showAntrag = true } label: {
                        Label("Antrag auf Pflegegrad stellen", systemImage: "doc.badge.plus")
                            .font(.subheadline.bold())
                            .frame(maxWidth: .infinity).frame(height: 44)
                            .background(Color(hex: "0891B2").opacity(0.12))
                            .foregroundColor(Color(hex: "0891B2"))
                            .cornerRadius(10)
                    }
                    .padding(.horizontal)

                    // ── Budget-Karten ────────────────────────────
                    HStack {
                        Text("Budgets " + String(Calendar.current.component(.year, from: Date())))
                            .font(.title3.bold())
                        Spacer()
                        Button {
                            shareText = buildShareText()
                            showShareSheet = true
                        } label: {
                            Image(systemName: "square.and.arrow.up")
                                .font(.subheadline.bold())
                                .foregroundColor(Color(hex: "0891B2"))
                        }
                    }
                    .padding(.horizontal)

                    if isLoadingBudgets {
                        ProgressView().padding()
                    } else if let err = loadError {
                        VStack(spacing: 8) {
                            Image(systemName: "exclamationmark.triangle")
                                .font(.title2).foregroundColor(.red)
                            Text(err)
                                .font(.footnote).foregroundColor(.red)
                                .multilineTextAlignment(.center)
                                .textSelection(.enabled)
                        }
                        .padding()
                    } else if budgets.isEmpty {
                        Text("Keine Budgets gefunden.")
                            .font(.subheadline).foregroundColor(.secondary).padding()
                    } else {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            ForEach(budgets) { budget in
                                BudgetCard(budget: budget)
                                    .onTapGesture { selectedBudget = budget }
                            }
                        }
                        .padding(.horizontal)

                    }

                } else {
                    VStack(spacing: 12) {
                        Image(systemName: "exclamationmark.circle")
                            .font(.system(size: 40)).foregroundColor(.orange)
                        Text("Pflegegrad fehlt").font(.headline)
                        Text("Bitte Pflegegrad für \(person.name) eintragen.")
                            .font(.subheadline).foregroundColor(.secondary).multilineTextAlignment(.center)
                        Button("Jetzt eintragen") { showEdit = true }
                            .buttonStyle(.borderedProminent).tint(Color(hex: "0891B2"))
                    }
                    .padding(30)
                }

                Text("PflegePilot ersetzt keine Rechtsberatung.")
                    .font(.caption).foregroundColor(.secondary).padding(.bottom)
            }
            .padding(.top, 8)
        }
        .task(id: "\(person.id)-\(person.pflegegrad ?? 0)") { await loadBudgets() }
        .sheet(isPresented: $showEdit) {
            AddEditPersonSheet(person: person, onSaved: { updated in onPersonUpdated(updated) }, onDeleted: onPersonDeleted)
        }
        .sheet(isPresented: $showAntrag) { AntragFormView(person: person) }
        .sheet(item: $selectedBudget) { budget in
            TransactionSheet(budget: budget) { Task { await loadBudgets() } }
        }
        .sheet(isPresented: $showShareSheet) {
            ShareSheet(activityItems: [shareText])
        }
    }

    func buildShareText() -> String {
        let name = person.name
        let pg = person.pflegegrad.map { "Pflegegrad \($0)" } ?? "Kein Pflegegrad"
        var lines = ["Pflege-Budget Update für \(name):", "", pg, ""]
        for budget in budgets {
            let remaining = budget.remainingCents.formatEuro
            let total = budget.totalCents.formatEuro
            lines.append("• \(budget.benefitType.name): \(remaining) von \(total) verfügbar")
        }
        lines += ["", "Erstellt mit PflegePilot — die kostenlose Pflege-Budget App", "https://pflege-pilot.com"]
        return lines.joined(separator: "\n")
    }

    func loadBudgets() async {
        guard let pg = person.pflegegrad else {
            isLoadingBudgets = false
            return
        }
        isLoadingBudgets = true
        loadError = nil
        let year = Calendar.current.component(.year, from: Date())
        if let userId = authService.currentUserId {
            // createBudgetsIfNeeded ist non-destruktiv (legt nur an wenn leer)
            do {
                try await SupabaseService.shared.createBudgetsIfNeeded(userId: userId, personId: person.id, pflegegrad: pg, year: year)
            } catch {
                print("createBudgetsIfNeeded warn:", error)
            }
            do {
                budgets = try await SupabaseService.shared.loadBudgets(userId: userId, personId: person.id, year: year)
                await NotificationService.shared.scheduleReminders(for: budgets)
            } catch let decErr as DecodingError {
                switch decErr {
                case .keyNotFound(let key, let ctx):
                    let path = ctx.codingPath.map { $0.stringValue }.joined(separator: ".")
                    loadError = "Decoding: Feld '\(key.stringValue)' fehlt (Pfad: \(path.isEmpty ? "<root>" : path))"
                case .valueNotFound(let type, let ctx):
                    let path = ctx.codingPath.map { $0.stringValue }.joined(separator: ".")
                    loadError = "Decoding: '\(path)' ist null, erwartet \(type)"
                case .typeMismatch(let type, let ctx):
                    let path = ctx.codingPath.map { $0.stringValue }.joined(separator: ".")
                    loadError = "Decoding: '\(path)' hat falschen Typ (erwartet \(type))"
                case .dataCorrupted(let ctx):
                    let path = ctx.codingPath.map { $0.stringValue }.joined(separator: ".")
                    loadError = "Decoding: '\(path)' korrupt — \(ctx.debugDescription)"
                @unknown default:
                    loadError = "Decoding-Fehler: \(decErr.localizedDescription)"
                }
                print("Budget-Decoding-Fehler:", decErr)
            } catch {
                loadError = "Budgets laden fehlgeschlagen: \(error.localizedDescription)"
                print("Budget-Fehler:", error)
            }
        } else {
            // Gastmodus: Budgets lokal aus BenefitEngine generieren
            budgets = GuestBudgetEngine.makeBudgets(pflegegrad: pg, year: year, personId: person.id)
        }
        isLoadingBudgets = false
    }

    @ViewBuilder
    func statBox(label: String, value: String, highlight: Bool = false) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.subheadline.bold())
                .foregroundColor(highlight ? Color(hex: "0891B2") : .primary)
            Text(label).font(.caption2).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Budget Card

struct BudgetCard: View {
    let budget: BudgetItem

    var color: Color {
        if budget.isExceeded { return .red }
        if budget.isExpiringSoon { return .orange }
        if budget.percentUsed > 0.9 { return .red }
        return Color(hex: "0891B2")
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(budget.benefitType.icon ?? "💶").font(.title2)
                Spacer()
                if budget.isExceeded {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .font(.caption).foregroundColor(.red)
                } else if budget.isExpiringSoon {
                    Image(systemName: "clock.badge.exclamationmark")
                        .font(.caption).foregroundColor(.orange)
                }
            }
            Text(budget.benefitType.name)
                .font(.caption.bold()).lineLimit(2)
            if budget.isExceeded {
                Text("−\(budget.exceededCents.formatEuro)")
                    .font(.subheadline.bold()).foregroundColor(.red)
                Text("über Budget")
                    .font(.caption2).foregroundColor(.red)
            } else {
                Text(budget.remainingCents.formatEuro)
                    .font(.subheadline.bold()).foregroundColor(color)
                Text("von \(budget.totalCents.formatEuro)")
                    .font(.caption2).foregroundColor(.secondary)
            }
            ProgressView(value: min(budget.percentUsed, 1.0)).tint(color)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(budget.isExceeded ? Color.red.opacity(0.5) : Color.clear, lineWidth: 1.5)
        )
        .shadow(color: .black.opacity(0.06), radius: 4, y: 2)
    }
}

// MARK: - Benefit Card

struct BenefitCardView: View {
    let leistung: Leistung
    let pflegegrad: Pflegegrad

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(leistung.icon).font(.title)
            Text(leistung.name)
                .font(.subheadline.bold())
                .lineLimit(2)
            Text(leistung.jahrBetragCents(pflegegrad: pflegegrad).formatEuroKompakt)
                .font(.footnote.bold())
                .foregroundColor(Color(hex: "0891B2"))
            Text(leistung.frequency == .monthly ? "/ Monat" : leistung.frequency == .yearly ? "/ Jahr" : "einmalig")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.06), radius: 4, y: 2)
    }
}

// MARK: - Add/Edit Person Sheet

struct AddEditPersonSheet: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss

    let person: Pflegebeduerftiger?
    let onSaved: (Pflegebeduerftiger) -> Void
    var onDeleted: (() -> Void)? = nil

    @State private var name: String
    @State private var pflegegrad: Int
    @State private var bundesland: String
    @State private var nutztPflegedienst: Bool
    @State private var isSaving = false
    @State private var showDeleteConfirm = false
    @State private var errorMessage: String?
    @State private var showNBATest = false
    @State private var pgFromTest: Int? = nil  // gesetzter PG aus NBA-Test

    let bundeslaender = [
        ("BW", "Baden-Württemberg"), ("BY", "Bayern"), ("BE", "Berlin"),
        ("BB", "Brandenburg"), ("HB", "Bremen"), ("HH", "Hamburg"),
        ("HE", "Hessen"), ("MV", "Mecklenburg-Vorpommern"), ("NI", "Niedersachsen"),
        ("NW", "Nordrhein-Westfalen"), ("RP", "Rheinland-Pfalz"), ("SL", "Saarland"),
        ("SN", "Sachsen"), ("ST", "Sachsen-Anhalt"), ("SH", "Schleswig-Holstein"),
        ("TH", "Thüringen")
    ]

    init(person: Pflegebeduerftiger?, onSaved: @escaping (Pflegebeduerftiger) -> Void, onDeleted: (() -> Void)? = nil) {
        self.person = person
        self.onSaved = onSaved
        self.onDeleted = onDeleted
        _name = State(initialValue: person?.name ?? "")
        _pflegegrad = State(initialValue: person?.pflegegrad ?? 2)
        _bundesland = State(initialValue: person?.bundesland ?? "BY")
        _nutztPflegedienst = State(initialValue: person?.nutztPflegedienst ?? false)
    }

    var isEditing: Bool { person != nil }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Name
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Name").font(.headline)
                        TextField("z.B. Mama, Papa, Oma …", text: $name)
                            .textFieldStyle(.roundedBorder)
                            .autocapitalization(.words)
                    }
                    .padding(.horizontal)

                    // Pflegegrad
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Pflegegrad").font(.headline)

                        // Wenn PG aus Test vorliegt: Banner anzeigen
                        if let tested = pgFromTest {
                            HStack {
                                Image(systemName: "checkmark.seal.fill")
                                    .foregroundColor(Color(hex: "0891B2"))
                                Text("Aus Selbsttest: Pflegegrad \(tested) (geschätzt)")
                                    .font(.subheadline)
                                Spacer()
                            }
                            .padding(10)
                            .background(Color(hex: "0891B2").opacity(0.1))
                            .cornerRadius(10)
                        }

                        // NBA-Test starten
                        Button {
                            showNBATest = true
                        } label: {
                            HStack {
                                Image(systemName: "list.clipboard")
                                Text(pgFromTest == nil ? "Pflegegrad jetzt ermitteln →" : "Test wiederholen →")
                                    .font(.subheadline.bold())
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 44)
                            .background(Color(hex: "0891B2").opacity(0.12))
                            .foregroundColor(Color(hex: "0891B2"))
                            .cornerRadius(10)
                        }

                        Text("– oder bereits bekannt –")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity, alignment: .center)

                        HStack(spacing: 8) {
                            ForEach(1...5, id: \.self) { pg in
                                Button {
                                    pflegegrad = pg
                                    pgFromTest = nil
                                } label: {
                                    Text("PG \(pg)")
                                        .font(.subheadline.bold())
                                        .frame(maxWidth: .infinity)
                                        .frame(height: 44)
                                        .background(pflegegrad == pg ? Color(hex: "0891B2") : Color(.systemGray6))
                                        .foregroundColor(pflegegrad == pg ? .white : .primary)
                                        .cornerRadius(10)
                                }
                            }
                        }
                    }
                    .padding(.horizontal)
                    .sheet(isPresented: $showNBATest) {
                        NBATestView(
                            onResult: { nbaResult in
                                if let pg = nbaResult.pflegegrad {
                                    pgFromTest = pg
                                    pflegegrad = pg
                                }
                            },
                            onCompleted: { _ in
                                showNBATest = false
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                                    dismiss()
                                }
                            }
                        )
                    }

                    // Bundesland
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Bundesland").font(.headline)
                            .padding(.horizontal)
                        Picker("Bundesland", selection: $bundesland) {
                            ForEach(bundeslaender, id: \.0) { code, bname in
                                Text(bname).tag(code)
                            }
                        }
                        .pickerStyle(.wheel)
                        .frame(height: 140)
                    }

                    // Pflegedienst
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Ambulanter Pflegedienst?").font(.headline)
                        HStack(spacing: 12) {
                            ForEach([(true, "Ja"), (false, "Nein")], id: \.0) { val, label in
                                Button {
                                    nutztPflegedienst = val
                                } label: {
                                    Text(label)
                                        .font(.subheadline.bold())
                                        .frame(maxWidth: .infinity)
                                        .frame(height: 44)
                                        .background(nutztPflegedienst == val ? Color(hex: "0891B2") : Color(.systemGray6))
                                        .foregroundColor(nutztPflegedienst == val ? .white : .primary)
                                        .cornerRadius(10)
                                }
                            }
                        }
                    }
                    .padding(.horizontal)

                    if let error = errorMessage {
                        Text(error).font(.caption).foregroundColor(.red).padding(.horizontal)
                    }

                    Button {
                        Task { await save() }
                    } label: {
                        Group {
                            if isSaving {
                                ProgressView().tint(.white)
                            } else {
                                Text(isEditing ? "Änderungen speichern" : "Person hinzufügen →")
                                    .font(.headline).foregroundColor(.white)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(name.trimmingCharacters(in: .whitespaces).isEmpty ? Color.gray : Color(hex: "0891B2"))
                        .cornerRadius(14)
                    }
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty || isSaving)
                    .padding(.horizontal)

                    if isEditing {
                        Button(role: .destructive) {
                            showDeleteConfirm = true
                        } label: {
                            Text("Person entfernen")
                                .frame(maxWidth: .infinity)
                                .frame(height: 44)
                        }
                        .padding(.horizontal)
                        .padding(.bottom, 20)
                    }
                }
                .padding(.top, 20)
            }
            .navigationTitle(isEditing ? "Person bearbeiten" : "Person hinzufügen")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }
                }
            }
            .confirmationDialog(
                "Person wirklich entfernen?",
                isPresented: $showDeleteConfirm,
                titleVisibility: .visible
            ) {
                Button("Entfernen", role: .destructive) { Task { await delete() } }
                Button("Abbrechen", role: .cancel) {}
            }
        }
    }

    func save() async {
        isSaving = true
        errorMessage = nil
        let trimmedName = name.trimmingCharacters(in: .whitespaces)

        if let userId = authService.currentUserId {
            // Online: Supabase
            do {
                if let existing = person {
                    var updated = existing
                    updated.name = trimmedName
                    updated.pflegegrad = pflegegrad
                    updated.bundesland = bundesland
                    updated.nutztPflegedienst = nutztPflegedienst
                    try await SupabaseService.shared.updatePerson(updated)
                    onSaved(updated)
                } else {
                    let created = try await SupabaseService.shared.createPerson(
                        userId: userId,
                        name: trimmedName,
                        pflegegrad: pflegegrad,
                        bundesland: bundesland,
                        nutztPflegedienst: nutztPflegedienst
                    )
                    onSaved(created)
                }
                dismiss()
            } catch {
                errorMessage = "Speichern fehlgeschlagen. Bitte erneut versuchen."
            }
        } else {
            // Gastmodus: lokal speichern
            if let existing = person {
                var updated = existing
                updated.name = trimmedName
                updated.pflegegrad = pflegegrad
                updated.bundesland = bundesland
                updated.nutztPflegedienst = nutztPflegedienst
                GuestPersonStore.update(updated)
                onSaved(updated)
            } else {
                let local = Pflegebeduerftiger(
                    id: UUID(),
                    userId: "guest",
                    name: trimmedName.isEmpty ? "Pflegebedürftige Person" : trimmedName,
                    pflegegrad: pflegegrad,
                    bundesland: bundesland,
                    nutztPflegedienst: nutztPflegedienst
                )
                GuestPersonStore.add(local)
                onSaved(local)
            }
            dismiss()
        }
        isSaving = false
    }

    func delete() async {
        guard let id = person?.id else { return }
        if authService.currentUserId != nil {
            do {
                try await SupabaseService.shared.deletePerson(id: id)
                dismiss()
                onDeleted?()
            } catch {
                errorMessage = "Löschen fehlgeschlagen."
            }
        } else {
            GuestPersonStore.remove(id: id)
            dismiss()
            onDeleted?()
        }
    }
}

// MARK: - Erste Person anlegen (leerer Zustand)

struct AddFirstPersonView: View {
    let onSaved: () -> Void
    @State private var showSheet = false

    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "person.2.fill")
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "0891B2"))
            Text("Erste Person anlegen")
                .font(.title2.bold())
            Text("Fügen Sie die pflegebedürftige Person hinzu,\nfür die Sie Leistungen verwalten möchten.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            Button {
                showSheet = true
            } label: {
                Text("Person hinzufügen →")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 54)
                    .background(Color(hex: "0891B2"))
                    .cornerRadius(14)
                    .padding(.horizontal)
            }
            Spacer()
        }
        .sheet(isPresented: $showSheet) {
            AddEditPersonSheet(person: nil) { _ in onSaved() }
        }
    }
}

// MARK: - Leistungen Tab

struct LeistungenListView: View {
    var body: some View {
        NavigationStack {
            List(BenefitEngine.shared.leistungen.filter { $0.isCurrentlyActive }) { leistung in
                NavigationLink(destination: LeistungDetailView(leistung: leistung)) {
                    HStack(spacing: 12) {
                        Text(leistung.icon).font(.title2).frame(width: 36)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(leistung.name).font(.subheadline.bold())
                            Text(leistung.paragraph).font(.caption).foregroundColor(Color(hex: "0891B2"))
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
            .navigationTitle("Alle Leistungen")
        }
    }
}

struct LeistungDetailView: View {
    let leistung: Leistung

    private let gesetzestexte: [String: String] = [
        "§ 37 SGB XI": "Pflegebedürftige, die zu Hause gepflegt werden, können anstelle der häuslichen Pflegehilfe ein Pflegegeld beantragen. Das Pflegegeld soll die Bereitschaft von Pflegepersonen fördern, nicht erwerbsmäßig zu pflegen. Es wird monatlich gezahlt und muss zweckentsprechend für die Sicherstellung der häuslichen Pflege verwendet werden.",
        "§ 36 SGB XI": "Pflegebedürftige haben Anspruch auf körperbezogene Pflegemaßnahmen und pflegerische Betreuungsmaßnahmen sowie auf Hilfen bei der Haushaltsführung als Sachleistung (häusliche Pflegehilfe). Der Anspruch umfasst pflegerische Maßnahmen in den in § 14 Abs. 2 genannten Bereichen.",
        "§ 45b SGB XI": "Pflegebedürftige in häuslicher Pflege haben Anspruch auf einen Entlastungsbetrag in Höhe von bis zu 131 Euro monatlich. Der Betrag ist zweckgebunden einzusetzen für Leistungen zur Entlastung pflegender Angehöriger sowie Förderung der Selbständigkeit und Selbstbestimmtheit der Pflegebedürftigen. Nicht genutzte Beträge verfallen am 30. Juni des Folgejahres.",
        "§ 42a SGB XI": "Seit dem 1. Juli 2025 haben Pflegebedürftige ab Pflegegrad 2 Anspruch auf ein gemeinsames Entlastungsbudget. Verhinderungspflege und Kurzzeitpflege wurden in einem Jahresbudget von 3.539 Euro zusammengeführt. Das Budget kann flexibel für beide Leistungsarten genutzt werden und verfällt am 31. Dezember des Kalenderjahres.",
        "§ 42 SGB XI": "Ab 01.07.2025 durch § 42a SGB XI (Gemeinsames Entlastungsbudget, 3.539 EUR/Jahr) abgelöst. Für Leistungsfälle, die vor dem 01.07.2025 begonnen haben, gilt noch das alte Recht: Anspruch auf Kurzzeitpflege in einer stationären Einrichtung, Kosten bis zu 1.774 Euro je Kalenderjahr.",
        "§ 39 SGB XI": "Ab 01.07.2025 durch § 42a SGB XI (Gemeinsames Entlastungsbudget, 3.539 EUR/Jahr) abgelöst. Für Leistungsfälle, die vor dem 01.07.2025 begonnen haben, gilt noch das alte Recht: Kosten für Verhinderungspflege bis zu 1.612 Euro im Kalenderjahr für bis zu sechs Wochen.",
        "§ 40 SGB XI": "Pflegebedürftige haben Anspruch auf Versorgung mit Pflegehilfsmitteln, die zur Erleichterung der Pflege oder zur Linderung der Beschwerden des Pflegebedürftigen beitragen. Zum Verbrauch bestimmte Pflegehilfsmittel werden bis zu 42 Euro monatlich erstattet.",
        "§ 40 Abs. 4 SGB XI": "Maßnahmen zur Verbesserung des individuellen Wohnumfeldes des Pflegebedürftigen können gefördert werden, wenn dadurch die häusliche Pflege ermöglicht oder erheblich erleichtert oder eine möglichst selbständige Lebensführung wiederhergestellt wird. Der Zuschuss je Maßnahme beträgt bis zu 4.180 Euro (Stand 2026).",
        "§ 41 SGB XI": "Pflegebedürftige können anstelle der häuslichen Pflegehilfe teilstationäre Pflege in Einrichtungen der Tages- oder Nachtpflege in Anspruch nehmen. Die Leistung ist kombinierbar mit häuslicher Pflege und wird nicht auf Sachleistungen oder Pflegegeld angerechnet (§ 38 SGB XI).",
        "§ 38 SGB XI": "Pflegebedürftige können gleichzeitig teilstationäre Pflege und häusliche Pflege in Anspruch nehmen (Kombinationsleistung). Die Sachleistung vermindert sich dann entsprechend dem Umfang der in Anspruch genommenen Tages- oder Nachtpflege.",
        "§ 45a SGB XI": "Angebote zur Unterstützung im Alltag umfassen Betreuungsangebote, die dazu dienen, Pflegebedürftigen Erleichterungen im Alltag zu bieten, sowie Angebote, die pflegende Angehörige entlasten und die häusliche Pflege ergänzen.",
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {

                // ── Header ───────────────────────────────────────
                HStack(spacing: 14) {
                    Text(leistung.icon).font(.system(size: 48))
                    VStack(alignment: .leading, spacing: 4) {
                        Text(leistung.name).font(.title2.bold())
                        Text(leistung.paragraph)
                            .font(.subheadline.bold())
                            .foregroundColor(Color(hex: "0891B2"))
                    }
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "0891B2").opacity(0.08))
                .cornerRadius(14)

                // ── Beschreibung ──────────────────────────────────
                VStack(alignment: .leading, spacing: 8) {
                    Text("Was ist das?").font(.headline)
                    Text(leistung.description).font(.body).fixedSize(horizontal: false, vertical: true)
                }
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(12)
                .shadow(color: .black.opacity(0.05), radius: 4, y: 1)

                // ── Beträge pro Pflegegrad ────────────────────────
                VStack(alignment: .leading, spacing: 8) {
                    Text("Betrag je Pflegegrad").font(.headline)
                    ForEach(Pflegegrad.allCases, id: \.self) { pg in
                        let cents = leistung.betragCents(pflegegrad: pg)
                        if cents > 0 {
                            HStack {
                                Text(pg.label).font(.subheadline)
                                Spacer()
                                Text(leistung.frequency == .monthly
                                     ? "\(cents.formatEuro) / Monat"
                                     : cents.formatEuro)
                                    .font(.subheadline.bold())
                                    .foregroundColor(Color(hex: "0891B2"))
                            }
                            .padding(.horizontal, 4)
                            Divider()
                        }
                    }
                }
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(12)
                .shadow(color: .black.opacity(0.05), radius: 4, y: 1)

                // ── Gesetzestext ──────────────────────────────────
                if let text = gesetzestexte[leistung.paragraph] {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack(spacing: 6) {
                            Image(systemName: "doc.text.fill")
                                .foregroundColor(Color(hex: "0891B2"))
                            Text("Gesetzestext \(leistung.paragraph)").font(.headline)
                        }
                        Text(text)
                            .font(.callout)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding()
                    .background(Color(.systemGroupedBackground))
                    .cornerRadius(12)
                }

                // ── Tipp ─────────────────────────────────────────
                if let tip = leistung.tip {
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: "lightbulb.fill").foregroundColor(.yellow)
                        Text(tip).font(.subheadline)
                    }
                    .padding()
                    .background(Color.yellow.opacity(0.1))
                    .cornerRadius(12)
                }
            }
            .padding()
        }
        .navigationTitle(leistung.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Profil Tab

struct ProfileSettingsView: View {
    @EnvironmentObject var authService: AuthService
    @AppStorage("isGuestMode") private var isGuestMode = false
    @State private var savedAntraege: [SavedAntrag] = []
    @State private var isLoadingAntraege = false
    @State private var selectedAntrag: SavedAntrag? = nil
    @State private var showImpressum = false
    @State private var showDatenschutz = false
    @State private var showNutzungsbedingungen = false
    @AppStorage("appearanceMode") private var appearanceMode = "system"
    @State private var showAuthSheet = false
    @State private var authStartsWithLogin = false
    @State private var showDeleteAccountConfirm = false
    @State private var isDeletingAccount = false

    var userTier: UserTier {
        authService.isAuthenticated ? .free : .guest
    }

    var body: some View {
        NavigationStack {
            List {
                // ── Konto ─────────────────────────────────────────────
                if let email = authService.userEmail {
                    Section("Konto") {
                        HStack {
                            Image(systemName: userTier.icon)
                                .foregroundColor(Color(hex: "0891B2"))
                            VStack(alignment: .leading, spacing: 2) {
                                Text(email).font(.subheadline)
                                Text(userTier.label)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                } else if isGuestMode {
                    Section("Konto") {
                        HStack {
                            Image(systemName: "person.slash")
                                .foregroundColor(.secondary)
                            Text("Gast-Modus (keine Datenspeicherung)")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        Button("Kostenlosen Account erstellen →") {
                            authStartsWithLogin = false
                            showAuthSheet = true
                        }
                        .foregroundColor(Color(hex: "0891B2"))
                        Button("Bereits registriert? Anmelden →") {
                            authStartsWithLogin = true
                            showAuthSheet = true
                        }
                        .foregroundColor(Color(hex: "0891B2"))
                    }
                }

                // ── Darstellung ──────────────────────────────────────
                Section("Darstellung") {
                    Picker("Erscheinungsbild", selection: $appearanceMode) {
                        Text("System").tag("system")
                        Text("Hell").tag("light")
                        Text("Dunkel").tag("dark")
                    }
                    .pickerStyle(.segmented)
                }

                // ── Rechtliches ───────────────────────────────────────
                Section("Rechtliches") {
                    Button { showImpressum = true } label: {
                        Label("Impressum", systemImage: "building.columns")
                            .foregroundColor(.primary)
                    }
                    Button { showDatenschutz = true } label: {
                        Label("Datenschutzerklärung", systemImage: "lock.shield")
                            .foregroundColor(.primary)
                    }
                    Button { showNutzungsbedingungen = true } label: {
                        Label("Nutzungsbedingungen", systemImage: "doc.text")
                            .foregroundColor(.primary)
                    }
                }
                Section {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Hinweis")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)
                        Text("Diese App ersetzt keine professionelle Pflegeberatung. Alle Beträge: Stand 2026. Empfehlungen können Affiliate-Links enthalten (als 'Anzeige' gekennzeichnet).")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Button("Mehr auf pflege-pilot.com") {
                            if let url = URL(string: "https://pflege-pilot.com") {
                                UIApplication.shared.open(url)
                            }
                        }
                        .font(.caption.bold())
                        .foregroundColor(Color(hex: "0891B2"))
                    }
                }

                // ── Gespeicherte Anträge ──────────────────────────────
                if authService.isAuthenticated {
                    Section {
                        if isLoadingAntraege {
                            HStack {
                                ProgressView()
                                Text("Lade Anträge…").font(.caption).foregroundColor(.secondary)
                            }
                        } else if savedAntraege.isEmpty {
                            Text("Noch keine Anträge gespeichert.")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        } else {
                            ForEach(savedAntraege) { antrag in
                                Button {
                                    selectedAntrag = antrag
                                } label: {
                                    HStack(spacing: 12) {
                                        Image(systemName: "doc.text.fill")
                                            .foregroundColor(Color(hex: "0891B2"))
                                        VStack(alignment: .leading, spacing: 3) {
                                            Text(antrag.title)
                                                .font(.subheadline)
                                                .foregroundColor(.primary)
                                            HStack(spacing: 6) {
                                                Text(antrag.createdAt.formatted(date: .abbreviated, time: .omitted))
                                                    .font(.caption)
                                                    .foregroundColor(.secondary)
                                                if let pg = antrag.pflegegrad {
                                                    Text("PG \(pg)")
                                                        .font(.caption.bold())
                                                        .foregroundColor(Color(hex: "0891B2"))
                                                }
                                            }
                                        }
                                        Spacer()
                                        Image(systemName: "chevron.right")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                }
                            }
                            .onDelete { indexSet in
                                for idx in indexSet {
                                    let antrag = savedAntraege[idx]
                                    Task { _ = try? await SupabaseService.shared.deleteAntrag(id: antrag.id) }
                                }
                                savedAntraege.remove(atOffsets: indexSet)
                            }
                        }
                    } header: {
                        Text("Meine Anträge")
                    } footer: {
                        Text("Anträge werden automatisch nach dem PDF-Versand gespeichert.")
                    }
                }

                // ── Abmelden / Konto löschen ──────────────────────────
                Section {
                    if authService.isAuthenticated {
                        Button("Abmelden", role: .destructive) {
                            Task { _ = try? await authService.signOut() }
                        }
                        Button(role: .destructive) {
                            showDeleteAccountConfirm = true
                        } label: {
                            if isDeletingAccount {
                                HStack {
                                    ProgressView()
                                    Text("Wird gelöscht…").foregroundColor(.red)
                                }
                            } else {
                                Text("Konto und alle Daten löschen")
                            }
                        }
                        .disabled(isDeletingAccount)
                    } else if isGuestMode {
                        Button("Gast-Modus beenden", role: .destructive) {
                            isGuestMode = false
                        }
                    }
                } footer: {
                    if authService.isAuthenticated {
                        Text("Beim Löschen werden alle Personen, Budgets und Anträge unwiderruflich entfernt (DSGVO Art. 17).")
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("Profil")
            .task { await loadAntraege() }
            .sheet(item: $selectedAntrag) { antrag in
                SavedAntragDetailView(savedAntrag: antrag)
            }
            .sheet(isPresented: $showImpressum) {
                LegalTextView(titel: "Impressum", text: LegalTexts.impressum)
            }
            .sheet(isPresented: $showDatenschutz) {
                LegalTextView(titel: "Datenschutzerklärung", text: LegalTexts.datenschutz)
            }
            .sheet(isPresented: $showNutzungsbedingungen) {
                LegalTextView(titel: "Nutzungsbedingungen", text: LegalTexts.nutzungsbedingungen)
            }
            .sheet(isPresented: $showAuthSheet, onDismiss: {
                if authService.isAuthenticated { isGuestMode = false }
            }) {
                AuthView(startWithLogin: authStartsWithLogin)
                    .environmentObject(authService)
            }
            .confirmationDialog(
                "Konto und alle Daten unwiderruflich löschen?",
                isPresented: $showDeleteAccountConfirm,
                titleVisibility: .visible
            ) {
                Button("Löschen", role: .destructive) {
                    Task {
                        isDeletingAccount = true
                        try? await authService.deleteAccount()
                        isDeletingAccount = false
                    }
                }
                Button("Abbrechen", role: .cancel) {}
            } message: {
                Text("Alle Personen, Budgets, Transaktionen und Anträge werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.")
            }
        }
    }

    func loadAntraege() async {
        guard let userId = authService.currentUserId else { return }
        isLoadingAntraege = true
        savedAntraege = (try? await SupabaseService.shared.loadAntraege(userId: userId)) ?? []
        isLoadingAntraege = false
    }
}

// MARK: - Saved Antrag Detail (re-generate PDF & share)

struct SavedAntragDetailView: View {
    let savedAntrag: SavedAntrag
    @Environment(\.dismiss) var dismiss
    @State private var pdfData: Data?
    @State private var showShareSheet = false
    @State private var isGenerating = false

    var body: some View {
        NavigationStack {
            Form {
                Section("Antrag") {
                    LabeledContent("Erstellt am", value: savedAntrag.createdAt.formatted(date: .long, time: .shortened))
                    if let pg = savedAntrag.pflegegrad {
                        LabeledContent("Pflegegrad", value: "PG \(pg)")
                    }
                    LabeledContent("Antragsteller", value: "\(savedAntrag.antragData.vorname) \(savedAntrag.antragData.nachname)")
                    LabeledContent("Pflegekasse", value: savedAntrag.antragData.pflegekasse)
                }

                Section {
                    Button {
                        // UIMarkupTextPrintFormatter + UIGraphics require main thread
                        isGenerating = true
                        pdfData = AntragPDFService.shared.generatePDF(antrag: savedAntrag.antragData)
                        isGenerating = false
                        showShareSheet = true
                    } label: {
                        HStack {
                            if isGenerating {
                                ProgressView().tint(.white)
                            } else {
                                Image(systemName: "doc.badge.arrow.up")
                                Text("PDF erneut erstellen & senden")
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .foregroundColor(.white)
                        .background(Color(hex: "0891B2"))
                        .cornerRadius(10)
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .disabled(isGenerating)
                }
            }
            .navigationTitle(savedAntrag.title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
            .sheet(isPresented: $showShareSheet) {
                if let data = pdfData {
                    ShareSheet(activityItems: [PDFItem(data: data, filename: "Pflegegrad-Antrag.pdf")])
                }
            }
        }
    }
}

// MARK: - Legal Text View

struct LegalTextView: View {
    let titel: String
    let text: String
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(text)
                    .font(.body)
                    .padding()
            }
            .navigationTitle(titel)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
        }
    }
}
