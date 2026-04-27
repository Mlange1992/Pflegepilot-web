import SwiftUI

// MARK: - Onboarding Coordinator

struct OnboardingView: View {
    @AppStorage("isGuestMode") private var isGuestMode = false

    @State private var step: OnboardingStep = .screen1

    enum OnboardingStep {
        case screen1, screen2, screen3
        case choice, personSetup, nbaTest, nbaResult, personName
        case auth
    }

    @State private var nbaResult: NBAResult?
    @State private var pendingPersonName = ""
    @State private var pendingPflegegrad: Int?
    @State private var stepBeforeAuth: OnboardingStep = .choice
    @State private var authStartWithLogin = false

    var body: some View {
        ZStack(alignment: .topLeading) {
            switch step {
            case .screen1:
                OnboardingScreen1(onContinue: { step = .screen2 })

            case .screen2:
                OnboardingScreen2(onContinue: { step = .screen3 })

            case .screen3:
                OnboardingScreen3(
                    onStart: { step = .choice },
                    onLogin: {
                        authStartWithLogin = true
                        stepBeforeAuth = .screen3
                        step = .auth
                    },
                    onGuest: { isGuestMode = true }
                )

            case .choice:
                PflegegradChoiceView(
                    onHasPflegegrad: { step = .personSetup },
                    onNeedsPflegegrad: { step = .nbaTest }
                )

            case .personSetup:
                PersonSetupView { name, pg in
                    pendingPersonName = name
                    pendingPflegegrad = pg
                    savePending()
                    stepBeforeAuth = .personSetup
                    authStartWithLogin = false
                    step = .auth
                }

            case .nbaTest:
                NBATestView(onResult: { result in
                    nbaResult = result
                    pendingPflegegrad = result.pflegegrad
                    step = .nbaResult
                })

            case .nbaResult:
                if let result = nbaResult {
                    NBAResultView(
                        result: result,
                        onUseResult: { pg in
                            pendingPflegegrad = pg
                            step = .personName
                        },
                        onCompleted: { _ in
                            step = .personName
                        }
                    )
                }

            case .personName:
                PersonNameStep(pflegegrad: pendingPflegegrad) { name in
                    pendingPersonName = name
                    savePending()
                    stepBeforeAuth = .personName
                    authStartWithLogin = false
                    step = .auth
                }

            case .auth:
                AuthView(startWithLogin: authStartWithLogin)
            }

            // Zurück-Button (ab Screen 2)
            if step != .screen1 {
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { goBack() }
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(backButtonColor)
                        .frame(width: 40, height: 40)
                        .background(backButtonBackground)
                        .clipShape(Circle())
                }
                .padding(.leading, 16)
                .padding(.top, 52)
            }
        }
        .animation(.easeInOut(duration: 0.25), value: step)
    }

    var backButtonColor: Color {
        step == .screen2 ? .white : Color(hex: "0891B2")
    }

    var backButtonBackground: Color {
        step == .screen2 ? Color.white.opacity(0.25) : Color(hex: "0891B2").opacity(0.1)
    }

    func goBack() {
        switch step {
        case .screen2:     step = .screen1
        case .screen3:     step = .screen2
        case .choice:      step = .screen3
        case .personSetup: step = .choice
        case .nbaTest:     step = .choice
        case .nbaResult:   step = .nbaTest
        case .personName:  step = nbaResult != nil ? .nbaResult : .choice
        case .auth:        step = stepBeforeAuth
        case .screen1:     break
        }
    }

    func savePending() {
        PendingOnboardingPerson.save(name: pendingPersonName, pflegegrad: pendingPflegegrad)
    }
}

// MARK: - Screen 1: Hook

struct OnboardingScreen1: View {
    let onContinue: () -> Void

    var body: some View {
        ZStack {
            Color(hex: "0891B2").ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                VStack(spacing: 24) {
                    Text("💶")
                        .font(.system(size: 90))

                    Text("Pflegeleistungen\nvollständig nutzen")
                        .font(.system(size: 32, weight: .black))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)

                    VStack(spacing: 4) {
                        Text("Bis zu 3.539 € Jahresbudget")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(Color(hex: "FDE68A"))
                        Text("Behalten Sie den Überblick")
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.85))
                    }

                    Text("Viele Pflegefamilien nutzen ihre Ansprüche nicht vollständig — oft aus Unkenntnis der Fristen und Leistungen.")
                        .font(.body)
                        .foregroundColor(.white.opacity(0.85))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }

                Spacer()

                VStack(spacing: 12) {
                    HStack(spacing: 0) {
                        statBubble(value: "3.539 €", label: "Jahresbudget\n§ 42a SGB XI")
                        Divider().frame(height: 44).background(Color.white.opacity(0.3))
                        statBubble(value: "131 €", label: "Entlastungs-\nbetrag/Monat")
                        Divider().frame(height: 44).background(Color.white.opacity(0.3))
                        statBubble(value: "100%", label: "kostenlos\nkein Abo")
                    }
                    .background(Color.white.opacity(0.15))
                    .cornerRadius(14)
                    .padding(.horizontal)

                    Button(action: onContinue) {
                        Text("Weiter →")
                            .font(.headline)
                            .foregroundColor(Color(hex: "0891B2"))
                            .frame(maxWidth: .infinity)
                            .frame(height: 56)
                            .background(Color.white)
                            .cornerRadius(14)
                    }
                    .padding(.horizontal)

                    Text("Kostenlos · Kein Abo · Beträge laut SGB XI 2026")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.7))
                        .padding(.bottom, 32)
                }
            }
        }
    }

    @ViewBuilder
    func statBubble(value: String, label: String) -> some View {
        VStack(spacing: 4) {
            Text(value).font(.headline.bold()).foregroundColor(.white)
            Text(label).font(.caption2).foregroundColor(.white.opacity(0.8)).multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
    }
}

// MARK: - Screen 2: Features

struct OnboardingScreen2: View {
    let onContinue: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Spacer()

            VStack(spacing: 28) {
                VStack(spacing: 10) {
                    Image(systemName: "house.and.flag.fill")
                        .font(.system(size: 52))
                        .foregroundColor(Color(hex: "0891B2"))
                    Text("PflegePilot")
                        .font(.largeTitle.bold())
                    Text("Pflegegrad ermitteln, Anträge stellen,\nBudgets tracken — alles komplett kostenlos.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.horizontal)

                HStack(spacing: 16) {
                    featureBox(
                        icon: "checklist",
                        color: Color(hex: "0891B2"),
                        titel: "Pflegegrad-Check",
                        text: "NBA-Selbsttest\nmit 64 Kriterien"
                    )
                    featureBox(
                        icon: "eurosign.circle.fill",
                        color: Color(hex: "16A34A"),
                        titel: "Budget-Tracker",
                        text: "Alle Töpfe auf\neinen Blick"
                    )
                    featureBox(
                        icon: "bell.badge.fill",
                        color: Color(hex: "F59E0B"),
                        titel: "Fristen-Alarm",
                        text: "Kein Budget\nmehr verlieren"
                    )
                }
                .padding(.horizontal)

                VStack(alignment: .leading, spacing: 10) {
                    checkRow("PDF-Anträge: Erstantrag, Widerspruch & mehr")
                    checkRow("Checkliste zur MD-Begutachtung")
                    checkRow("Mehrere Personen verwalten")
                    checkRow("Ratgeber zu Pflegeleistungen und SGB XI")
                }
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(14)
                .shadow(color: .black.opacity(0.06), radius: 6, y: 2)
                .padding(.horizontal)
            }

            Spacer()

            Button(action: onContinue) {
                Text("Weiter →")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(Color(hex: "0891B2"))
                    .cornerRadius(14)
            }
            .padding(.horizontal)
            .padding(.bottom, 32)
        }
        .background(Color(.systemGroupedBackground).ignoresSafeArea())
    }

    @ViewBuilder
    func featureBox(icon: String, color: Color, titel: String, text: String) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
                .frame(width: 48, height: 48)
                .background(color.opacity(0.12))
                .cornerRadius(12)
            Text(titel)
                .font(.caption.bold())
                .multilineTextAlignment(.center)
            Text(text)
                .font(.caption2)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(Color(.systemBackground))
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.05), radius: 4, y: 2)
    }

    @ViewBuilder
    func checkRow(_ text: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(Color(hex: "0891B2"))
            Text(text)
                .font(.subheadline)
        }
    }
}

// MARK: - Screen 3: Start

struct OnboardingScreen3: View {
    let onStart: () -> Void
    let onLogin: () -> Void
    let onGuest: () -> Void

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                VStack(spacing: 8) {
                    Text("Wie möchten Sie\nstarten?")
                        .font(.largeTitle.bold())
                        .multilineTextAlignment(.center)
                    Text("Beide Optionen sind vollständig kostenlos.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 52)
                .padding(.horizontal)

                VStack(spacing: 14) {
                    // ── Option 1: Mit Account ─────────────────────────
                    Button(action: onStart) {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(spacing: 10) {
                                Image(systemName: "icloud.fill")
                                    .font(.title2)
                                    .foregroundColor(Color(hex: "0891B2"))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Mit kostenlosem Account")
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    Text("Empfohlen")
                                        .font(.caption.bold())
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 2)
                                        .background(Color(hex: "16A34A"))
                                        .cornerRadius(6)
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundColor(Color(hex: "0891B2"))
                            }
                            Divider()
                            VStack(alignment: .leading, spacing: 8) {
                                featureRow(icon: "checkmark.circle.fill", color: Color(hex: "16A34A"),
                                           text: "Daten sicher online gespeichert")
                                featureRow(icon: "checkmark.circle.fill", color: Color(hex: "16A34A"),
                                           text: "Auch auf pflege-pilot.com abrufbar")
                                featureRow(icon: "checkmark.circle.fill", color: Color(hex: "16A34A"),
                                           text: "Kein Datenverlust bei Handywechsel")
                                featureRow(icon: "checkmark.circle.fill", color: Color(hex: "16A34A"),
                                           text: "Kein Abo · Keine Kreditkarte")
                            }
                        }
                        .padding()
                        .background(Color(.systemBackground))
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color(hex: "0891B2"), lineWidth: 2)
                        )
                        .shadow(color: Color(hex: "0891B2").opacity(0.12), radius: 8, y: 3)
                    }

                    // ── Option 2: Ohne Account ────────────────────────
                    Button(action: onGuest) {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(spacing: 10) {
                                Image(systemName: "lock.shield.fill")
                                    .font(.title2)
                                    .foregroundColor(.secondary)
                                Text("Nur auf diesem Gerät")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.secondary)
                            }
                            Divider()
                            VStack(alignment: .leading, spacing: 8) {
                                featureRow(icon: "checkmark.circle.fill", color: Color(.systemGray3),
                                           text: "Maximaler Datenschutz — keine E-Mail nötig")
                                featureRow(icon: "checkmark.circle.fill", color: Color(.systemGray3),
                                           text: "Daten verlassen nie das Gerät")
                                featureRow(icon: "exclamationmark.triangle.fill", color: Color(hex: "F59E0B"),
                                           text: "Daten weg bei Verlust oder Reset des Geräts")
                                featureRow(icon: "exclamationmark.triangle.fill", color: Color(hex: "F59E0B"),
                                           text: "Kein Zugriff über die Website möglich")
                            }
                        }
                        .padding()
                        .background(Color(.systemBackground))
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color(.systemGray4), lineWidth: 1)
                        )
                    }
                }
                .padding(.horizontal)
                .padding(.top, 28)

                // ── Login-Hinweis für bestehende Nutzer ──────────────
                VStack(spacing: 6) {
                    Text("Bereits einen Account?")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    Button(action: onLogin) {
                        Text("Anmelden")
                            .font(.subheadline.bold())
                            .foregroundColor(Color(hex: "0891B2"))
                            .underline()
                    }
                }
                .padding(.top, 24)
                .padding(.horizontal)

                Text("Kein Abo · Kein In-App-Kauf · Keine versteckten Kosten")
                    .font(.caption2)
                    .foregroundColor(Color(.systemGray3))
                    .multilineTextAlignment(.center)
                    .padding(.top, 20)
                    .padding(.bottom, 40)
            }
        }
        .background(Color(.systemGroupedBackground).ignoresSafeArea())
    }

    @ViewBuilder
    func featureRow(icon: String, color: Color, text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundColor(color)
                .frame(width: 16)
                .padding(.top, 2)
            Text(text)
                .font(.subheadline)
                .foregroundColor(.primary)
                .fixedSize(horizontal: false, vertical: true)
            Spacer()
        }
    }
}

// MARK: - Pflegegrad Choice

struct PflegegradChoiceView: View {
    let onHasPflegegrad: () -> Void
    let onNeedsPflegegrad: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 12) {
                Image(systemName: "questionmark.circle.fill")
                    .font(.system(size: 56))
                    .foregroundColor(Color(hex: "0891B2"))
                Text("Haben Sie bereits\neinen Pflegegrad?")
                    .font(.title.bold())
                    .multilineTextAlignment(.center)
                Text("Das bestimmt wie wir Ihnen am besten helfen können.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, 60)
            .padding(.horizontal)

            Spacer()

            VStack(spacing: 16) {
                Button(action: onHasPflegegrad) {
                    HStack(spacing: 16) {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.title2)
                            .foregroundColor(Color(hex: "0891B2"))
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Ja, ich habe bereits einen Pflegegrad")
                                .font(.headline)
                            Text("Direkt zum persönlichen Budget-Dashboard")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        Image(systemName: "chevron.right").foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(16)
                    .shadow(color: .black.opacity(0.07), radius: 8, y: 2)
                }

                Button(action: onNeedsPflegegrad) {
                    HStack(spacing: 16) {
                        Image(systemName: "doc.text.magnifyingglass")
                            .font(.title2)
                            .foregroundColor(.white)
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Nein, noch kein Pflegegrad")
                                .font(.headline)
                            Text("Pflegegrad ermitteln + Antrag als PDF erstellen")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.8))
                        }
                        Spacer()
                        Image(systemName: "chevron.right").foregroundColor(.white.opacity(0.7))
                    }
                    .padding()
                    .background(Color(hex: "0891B2"))
                    .foregroundColor(.white)
                    .cornerRadius(16)
                    .shadow(color: Color(hex: "0891B2").opacity(0.4), radius: 8, y: 4)
                }

                Text("ℹ️ Deine Antworten bleiben auf deinem Gerät. Keine Daten werden übertragen.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding()
            .padding(.bottom, 32)
        }
        .background(Color(.systemGroupedBackground).ignoresSafeArea())
    }
}

// MARK: - Path A: Person & Pflegegrad einrichten

struct PersonSetupView: View {
    let onContinue: (String, Int?) -> Void

    @State private var name = ""
    @State private var selectedPG: Int? = nil

    var isValid: Bool {
        name.trimmingCharacters(in: .whitespaces).count >= 2 && selectedPG != nil
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                VStack(spacing: 12) {
                    Image(systemName: "person.fill.checkmark")
                        .font(.system(size: 56))
                        .foregroundColor(Color(hex: "0891B2"))
                    Text("Für wen verwalten\nSie die Pflege?")
                        .font(.title.bold())
                        .multilineTextAlignment(.center)
                    Text("Wir richten Ihr persönliches Budget-Dashboard ein.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 60)
                .padding(.horizontal)

                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Name der pflegebedürftigen Person")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)
                        TextField("z. B. Erna Müller", text: $name)
                            .textFieldStyle(.roundedBorder)
                    }

                    VStack(alignment: .leading, spacing: 10) {
                        Text("Aktueller Pflegegrad")
                            .font(.caption.bold())
                            .foregroundColor(.secondary)
                        HStack(spacing: 8) {
                            ForEach(1...5, id: \.self) { pg in
                                Button {
                                    selectedPG = pg
                                } label: {
                                    Text("\(pg)")
                                        .font(.title2.bold())
                                        .foregroundColor(selectedPG == pg ? .white : Color(hex: "0891B2"))
                                        .frame(maxWidth: .infinity)
                                        .frame(height: 54)
                                        .background(
                                            selectedPG == pg
                                            ? Color(hex: "0891B2")
                                            : Color(hex: "0891B2").opacity(0.1)
                                        )
                                        .cornerRadius(12)
                                }
                            }
                        }
                        if let pg = selectedPG {
                            Text(pflegegradHint(pg))
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .transition(.opacity)
                        }
                    }

                    Button {
                        onContinue(name.trimmingCharacters(in: .whitespaces), selectedPG)
                    } label: {
                        Text("Weiter zur Anmeldung →")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(isValid ? Color(hex: "0891B2") : Color.gray)
                            .cornerRadius(14)
                    }
                    .disabled(!isValid)
                }
                .padding()
                .padding(.top, 32)
                .padding(.bottom, 32)
            }
        }
        .background(Color(.systemGroupedBackground).ignoresSafeArea())
        .animation(.easeInOut(duration: 0.2), value: selectedPG)
    }

    func pflegegradHint(_ pg: Int) -> String {
        switch pg {
        case 1: return "Geringe Beeinträchtigungen der Selbstständigkeit"
        case 2: return "Erhebliche Beeinträchtigungen der Selbstständigkeit"
        case 3: return "Schwere Beeinträchtigungen der Selbstständigkeit"
        case 4: return "Schwerste Beeinträchtigungen der Selbstständigkeit"
        case 5: return "Schwerste Beeinträchtigungen mit besonderen Anforderungen"
        default: return ""
        }
    }
}

// MARK: - Path B: Name nach NBA-Test

struct PersonNameStep: View {
    let pflegegrad: Int?
    let onContinue: (String) -> Void

    @State private var name = ""

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 16) {
                if let pg = pflegegrad {
                    VStack(spacing: 6) {
                        Text("Geschätzter Pflegegrad")
                            .font(.caption.bold())
                            .foregroundColor(Color(hex: "0891B2"))
                        Text("\(pg)")
                            .font(.system(size: 72, weight: .black))
                            .foregroundColor(Color(hex: "0891B2"))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 20)
                    .background(Color(hex: "0891B2").opacity(0.08))
                    .cornerRadius(20)
                    .padding(.horizontal)
                }

                Text("Fast geschafft!")
                    .font(.title.bold())

                Text("Wie heißt die pflegebedürftige Person?\nDer Name erscheint in Ihrem Dashboard.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }
            .padding(.top, 60)

            Spacer()

            VStack(spacing: 14) {
                TextField("z. B. Erna Müller", text: $name)
                    .textFieldStyle(.roundedBorder)

                Button {
                    onContinue(name.trimmingCharacters(in: .whitespaces))
                } label: {
                    Text("Weiter zur Anmeldung →")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(Color(hex: "0891B2"))
                        .cornerRadius(14)
                }

                if name.trimmingCharacters(in: .whitespaces).isEmpty {
                    Button {
                        onContinue("Pflegebedürftige Person")
                    } label: {
                        Text("Ohne Namen überspringen")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding()
            .padding(.bottom, 32)
        }
        .background(Color(.systemGroupedBackground).ignoresSafeArea())
    }
}

// MARK: - Stat View (Legacy)

struct StatView: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title2.bold())
                .foregroundColor(Color(hex: "F59E0B"))
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
    }
}
