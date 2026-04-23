import SwiftUI

struct QuickCheckView: View {
    @State private var currentStep = 0
    @State private var selectedPflegegrad: Pflegegrad? = nil
    @State private var keinPflegegrad = false
    @State private var wohnsituation = "zuhause"
    @State private var bundesland = "BY"
    @State private var genutzteLeistungen: Set<String> = []
    @State private var nutztPflegedienst = false
    @State private var showResult = false
    @State private var showNBATest = false
    @AppStorage("quickCheckDone") var quickCheckDone = false

    let bundeslaender = [
        ("BW", "Baden-Württemberg"), ("BY", "Bayern"), ("BE", "Berlin"),
        ("BB", "Brandenburg"), ("HB", "Bremen"), ("HH", "Hamburg"),
        ("HE", "Hessen"), ("MV", "Mecklenburg-Vorpommern"), ("NI", "Niedersachsen"),
        ("NW", "Nordrhein-Westfalen"), ("RP", "Rheinland-Pfalz"), ("SL", "Saarland"),
        ("SN", "Sachsen"), ("ST", "Sachsen-Anhalt"), ("SH", "Schleswig-Holstein"),
        ("TH", "Thüringen")
    ]

    let quickCheckLeistungen = [
        ("pflegegeld", "Pflegegeld"),
        ("pflegesachleistungen", "Ambulanter Pflegedienst"),
        ("entlastungsbetrag", "Entlastungsbetrag"),
        ("entlastungsbudget", "Verhinderungs-/Kurzzeitpflege"),
        ("pflegehilfsmittel", "Pflegehilfsmittel (40€/Mo)")
    ]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Fortschrittsbalken
                ProgressView(value: Double(currentStep + 1), total: 5)
                    .tint(Color(hex: "0891B2"))
                    .padding(.horizontal)
                    .padding(.top, 8)

                Text("Schritt \(currentStep + 1) von 5")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.top, 4)

                // Fragen
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        switch currentStep {
                        case 0: step1
                        case 1: step2
                        case 2: step3
                        case 3: step4
                        case 4: step5
                        default: EmptyView()
                        }
                    }
                    .padding()
                }

                Spacer()

                // Weiter-Button
                Button {
                    if currentStep < 4 {
                        withAnimation { currentStep += 1 }
                    } else {
                        quickCheckDone = true
                        showResult = true
                    }
                } label: {
                    Text(currentStep < 4 ? "Weiter →" : "Ergebnis anzeigen →")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(canProceed ? Color(hex: "0891B2") : Color.gray)
                        .cornerRadius(14)
                }
                .disabled(!canProceed)
                .padding()
            }
            .navigationTitle("Pflege-Quick-Check")
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(isPresented: $showResult) {
                QuickCheckResultView(
                    pflegegrad: selectedPflegegrad ?? .pg2,
                    genutzteLeistungen: Array(genutzteLeistungen),
                    nutztPflegedienst: nutztPflegedienst
                )
            }
        }
    }

    var canProceed: Bool {
        switch currentStep {
        case 0: return selectedPflegegrad != nil || keinPflegegrad
        case 1: return true
        case 2: return true
        case 3: return true
        case 4: return true
        default: return false
        }
    }

    // Frage 1: Pflegegrad
    var step1: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Hat die Person bereits einen Pflegegrad?")
                .font(.title2.bold())

            ForEach(Pflegegrad.allCases, id: \.self) { pg in
                Button {
                    selectedPflegegrad = pg
                    keinPflegegrad = false
                } label: {
                    HStack {
                        Text(pg.label)
                            .foregroundColor(selectedPflegegrad == pg ? .white : .primary)
                        Spacer()
                        if selectedPflegegrad == pg {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.white)
                        }
                    }
                    .padding()
                    .background(selectedPflegegrad == pg ? Color(hex: "0891B2") : Color(.systemGray6))
                    .cornerRadius(12)
                }
            }

            Button {
                keinPflegegrad = true
                selectedPflegegrad = nil
            } label: {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Noch kein Pflegegrad")
                            .foregroundColor(keinPflegegrad ? .white : .primary)
                        Text("oder unsicher")
                            .font(.caption)
                            .foregroundColor(keinPflegegrad ? .white.opacity(0.8) : .secondary)
                    }
                    Spacer()
                }
                .padding()
                .background(keinPflegegrad ? Color(hex: "0891B2") : Color(.systemGray6))
                .cornerRadius(12)
            }

            if keinPflegegrad {
                Button {
                    showNBATest = true
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "checkmark.shield.fill")
                            .font(.title3)
                            .foregroundColor(Color(hex: "0891B2"))
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Pflegegrad jetzt ermitteln")
                                .font(.subheadline.bold())
                                .foregroundColor(.primary)
                            Text("Kostenloser NBA-Selbsttest · direkt in der App")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color(hex: "0891B2").opacity(0.08))
                    .cornerRadius(12)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "0891B2").opacity(0.3), lineWidth: 1))
                }
                .sheet(isPresented: $showNBATest) {
                    NBATestView(onResult: { result in
                        if let pg = result.pflegegrad {
                            selectedPflegegrad = Pflegegrad(rawValue: pg)
                            keinPflegegrad = false
                        }
                    })
                }
            }
        }
    }

    // Frage 2: Wohnsituation
    var step2: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Wird die Person zu Hause versorgt?")
                .font(.title2.bold())

            ForEach([("zuhause", "Ja, zu Hause"), ("wg", "In einer Pflege-WG"), ("heim", "Im Pflegeheim")], id: \.0) { value, label in
                Button {
                    wohnsituation = value
                } label: {
                    HStack {
                        Text(label)
                            .foregroundColor(wohnsituation == value ? .white : .primary)
                        Spacer()
                        if wohnsituation == value {
                            Image(systemName: "checkmark.circle.fill").foregroundColor(.white)
                        }
                    }
                    .padding()
                    .background(wohnsituation == value ? Color(hex: "0891B2") : Color(.systemGray6))
                    .cornerRadius(12)
                }
            }
        }
    }

    // Frage 3: Bundesland
    var step3: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("In welchem Bundesland?")
                .font(.title2.bold())

            Picker("Bundesland", selection: $bundesland) {
                ForEach(bundeslaender, id: \.0) { code, name in
                    Text(name).tag(code)
                }
            }
            .pickerStyle(.wheel)
            .frame(height: 150)
        }
    }

    // Frage 4: Genutzte Leistungen
    var step4: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Welche Leistungen werden aktuell genutzt?")
                .font(.title2.bold())
            Text("Mehrfachauswahl möglich")
                .font(.subheadline)
                .foregroundColor(.secondary)

            ForEach(quickCheckLeistungen, id: \.0) { slug, label in
                Button {
                    if genutzteLeistungen.contains(slug) {
                        genutzteLeistungen.remove(slug)
                    } else {
                        genutzteLeistungen.insert(slug)
                    }
                } label: {
                    HStack {
                        Image(systemName: genutzteLeistungen.contains(slug) ? "checkmark.square.fill" : "square")
                            .foregroundColor(genutzteLeistungen.contains(slug) ? Color(hex: "0891B2") : .secondary)
                        Text(label)
                            .foregroundColor(.primary)
                        Spacer()
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                }
            }

            Button {
                genutzteLeistungen.removeAll()
            } label: {
                Text("Keine / Weiß nicht")
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
            }
        }
    }

    // Frage 5: Pflegedienst
    var step5: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Nutzen Sie einen ambulanten Pflegedienst?")
                .font(.title2.bold())

            ForEach([(true, "Ja"), (false, "Nein")], id: \.0) { value, label in
                Button {
                    nutztPflegedienst = value
                } label: {
                    HStack {
                        Text(label)
                            .foregroundColor(nutztPflegedienst == value ? .white : .primary)
                        Spacer()
                        if nutztPflegedienst == value {
                            Image(systemName: "checkmark.circle.fill").foregroundColor(.white)
                        }
                    }
                    .padding()
                    .background(nutztPflegedienst == value ? Color(hex: "0891B2") : Color(.systemGray6))
                    .cornerRadius(12)
                }
            }
        }
    }
}
