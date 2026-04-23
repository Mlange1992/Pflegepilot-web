import SwiftUI
import AuthenticationServices
import CryptoKit

struct AuthView: View {
    @EnvironmentObject var authService: AuthService

    init(startWithLogin: Bool = false) {
        _isRegister = State(initialValue: !startWithLogin)
    }

    @State private var currentNonce: String?
    @State private var localError: String?

    @State private var email = ""
    @State private var password = ""
    @State private var isRegister: Bool
    @State private var confirmationSent = false
    @State private var showConfirmationAlert = false

    // Einwilligungen (Registrierung)
    @State private var consentAGB = false
    @State private var consentDatenschutz = false
    @State private var consentGesundheitsdaten = false

    // Magic Link
    @State private var showMagicLink = false
    @State private var magicLinkSent = false

    // Legal sheets
    @State private var showNutzungsbedingungen = false
    @State private var showDatenschutz = false

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {

                // ── Logo ────────────────────────────────────────────
                VStack(spacing: 6) {
                    Image(systemName: "house.and.flag.fill")
                        .font(.system(size: 48))
                        .foregroundColor(Color(hex: "0891B2"))
                    Text("PflegePilot")
                        .font(.largeTitle.bold())
                    Text(isRegister ? "Kostenlosen Account erstellen" : "Willkommen zurück")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 56)
                .padding(.bottom, 32)

                // ── Login / Registrieren Toggle ──────────────────────
                Picker("", selection: $isRegister) {
                    Text("Konto erstellen").tag(true)
                    Text("Anmelden").tag(false)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                .padding(.bottom, 24)

                // ── E-Mail-Formular ──────────────────────────────────
                VStack(spacing: 12) {
                    TextField("E-Mail-Adresse", text: $email)
                        .textFieldStyle(.roundedBorder)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .autocorrectionDisabled()

                    SecureField(isRegister ? "Passwort erstellen" : "Passwort", text: $password)
                        .textFieldStyle(.roundedBorder)

                    if isRegister && !password.isEmpty {
                        VStack(alignment: .leading, spacing: 6) {
                            PasswordRequirementRow(label: "Mindestens 8 Zeichen", met: password.count >= 8)
                            PasswordRequirementRow(label: "Mindestens 1 Großbuchstabe (A–Z)", met: password.contains(where: \.isUppercase))
                            PasswordRequirementRow(label: "Mindestens 1 Zahl (0–9)", met: password.contains(where: \.isNumber))
                        }
                        .padding(.horizontal, 4)
                        .transition(.opacity.combined(with: .move(edge: .top)))
                    }

                    if confirmationSent {
                        HStack(spacing: 8) {
                            Image(systemName: "envelope.badge.checkmark")
                                .foregroundColor(Color(hex: "0891B2"))
                            Text("Bestätigungs-E-Mail gesendet! Bitte den Link in der E-Mail öffnen.")
                                .font(.caption)
                        }
                        .padding(10)
                        .background(Color(hex: "0891B2").opacity(0.08))
                        .cornerRadius(10)
                    }

                    if isRegister {
                        VStack(spacing: 10) {
                            VStack(alignment: .leading, spacing: 3) {
                                Toggle(isOn: $consentAGB) {
                                    Text("Ich akzeptiere die **Nutzungsbedingungen** (AGB)")
                                        .font(.caption)
                                }
                                .toggleStyle(CheckboxToggleStyle())
                                Button("Nutzungsbedingungen lesen →") {
                                    showNutzungsbedingungen = true
                                }
                                .font(.caption)
                                .foregroundColor(Color(hex: "0891B2"))
                                .padding(.leading, 26)
                            }

                            VStack(alignment: .leading, spacing: 3) {
                                Toggle(isOn: $consentDatenschutz) {
                                    Text("Ich habe die **Datenschutzerklärung** gelesen und stimme zu")
                                        .font(.caption)
                                }
                                .toggleStyle(CheckboxToggleStyle())
                                Button("Datenschutzerklärung lesen →") {
                                    showDatenschutz = true
                                }
                                .font(.caption)
                                .foregroundColor(Color(hex: "0891B2"))
                                .padding(.leading, 26)
                            }

                            Toggle(isOn: $consentGesundheitsdaten) {
                                Text("Ich willige in die Verarbeitung meiner **Gesundheitsdaten** (Pflegegrad-Daten) gemäß DSGVO Art. 9 ein")
                                    .font(.caption)
                            }
                            .toggleStyle(CheckboxToggleStyle())
                        }
                        .padding(.top, 4)
                    }

                    // ── Fehlermeldung ────────────────────────────────
                    if let error = localError ?? authService.authError {
                        Text(error)
                            .font(.caption)
                            .foregroundColor(.red)
                            .multilineTextAlignment(.center)
                    }

                    Button {
                        Task { await submitEmailPassword() }
                    } label: {
                        Group {
                            if authService.isLoading {
                                ProgressView().tint(.white)
                            } else {
                                Text(isRegister ? "Kostenlosen Account erstellen →" : "Anmelden →")
                                    .font(.headline).foregroundColor(.white)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(canSubmitEmail ? Color(hex: "0891B2") : Color.gray)
                        .cornerRadius(12)
                    }
                    .disabled(!canSubmitEmail || authService.isLoading)

                    // ── Magic Link ───────────────────────────────────
                    if !showMagicLink {
                        Button {
                            withAnimation { showMagicLink = true }
                        } label: {
                            Text("Passwort vergessen? Per Magic Link anmelden")
                                .font(.caption)
                                .foregroundColor(Color(hex: "0891B2"))
                        }
                    } else if magicLinkSent {
                        HStack(spacing: 6) {
                            Image(systemName: "envelope.badge.checkmark")
                                .foregroundColor(Color(hex: "0891B2"))
                            Text("Magic Link gesendet! Prüfe deine E-Mails.")
                                .font(.caption)
                        }
                        .padding(10)
                        .background(Color(hex: "0891B2").opacity(0.08))
                        .cornerRadius(10)
                    } else {
                        HStack(spacing: 8) {
                            TextField("E-Mail für Magic Link", text: $email)
                                .textFieldStyle(.roundedBorder)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                            Button {
                                Task { await sendMagicLink() }
                            } label: {
                                Text("Senden")
                                    .font(.subheadline.bold())
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 14)
                                    .frame(height: 36)
                                    .background(Color(hex: "0891B2"))
                                    .cornerRadius(8)
                            }
                        }
                    }
                }
                .padding(.horizontal)
                .animation(.easeInOut(duration: 0.2), value: isRegister)

                // ── Trenner ──────────────────────────────────────────
                HStack {
                    Rectangle().frame(height: 1).foregroundColor(Color(.systemGray5))
                    Text("oder").font(.caption).foregroundColor(.secondary).padding(.horizontal, 8)
                    Rectangle().frame(height: 1).foregroundColor(Color(.systemGray5))
                }
                .padding(.horizontal)
                .padding(.vertical, 20)

                // ── Sign in with Apple ────────────────────────────────
                SignInWithAppleButton(.signIn) { request in
                    let nonce = randomNonce()
                    currentNonce = nonce
                    request.requestedScopes = [.email, .fullName]
                    request.nonce = sha256(nonce)
                } onCompletion: { result in
                    Task { await handleAppleResult(result) }
                }
                .signInWithAppleButtonStyle(.black)
                .frame(maxWidth: .infinity)
                .frame(height: 50)
                .cornerRadius(12)
                .padding(.horizontal)

                // ── Google ───────────────────────────────────────────
                Button {
                    Task {
                        do { try await authService.signInWithGoogle() }
                        catch { localError = "Google Anmeldung fehlgeschlagen: \(error.localizedDescription)" }
                    }
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "globe").font(.body.bold())
                        Text("Mit Google fortfahren").font(.subheadline.bold())
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Color(.systemGray6))
                    .foregroundColor(.primary)
                    .cornerRadius(12)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(.systemGray4), lineWidth: 1))
                }
                .padding(.horizontal)

                Text("Kostenlos · Kein Abo · Keine Kreditkarte")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .padding(.top, 20)
                    .padding(.bottom, 40)
            }
        }
        .alert("E-Mail bestätigen", isPresented: $showConfirmationAlert) {
            Button("OK") {
                withAnimation { isRegister = false }
            }
        } message: {
            Text("Wir haben eine Bestätigungs-E-Mail an \(email) gesendet. Bitte öffnen Sie den Link darin und melden Sie sich danach hier an.")
        }
        .sheet(isPresented: $showNutzungsbedingungen) {
            LegalTextView(titel: "Nutzungsbedingungen", text: LegalTexts.nutzungsbedingungen)
        }
        .sheet(isPresented: $showDatenschutz) {
            LegalTextView(titel: "Datenschutzerklärung", text: LegalTexts.datenschutz)
        }
    }

    // MARK: - Computed

    var passwordValid: Bool {
        password.count >= 8 &&
        password.contains(where: \.isUppercase) &&
        password.contains(where: \.isNumber)
    }

    var canSubmitEmail: Bool {
        let base = email.contains("@") && (isRegister ? passwordValid : password.count >= 1)
        if isRegister { return base && consentAGB && consentDatenschutz && consentGesundheitsdaten }
        return base
    }

    // MARK: - Actions

    func handleAppleResult(_ result: Result<ASAuthorization, Error>) async {
        switch result {
        case .success(let authorization):
            guard let appleCredential = authorization.credential as? ASAuthorizationAppleIDCredential,
                  let tokenData = appleCredential.identityToken,
                  let idToken = String(data: tokenData, encoding: .utf8),
                  let nonce = currentNonce else {
                localError = "Apple Anmeldung fehlgeschlagen."
                return
            }
            do {
                try await authService.signInWithApple(idToken: idToken, nonce: nonce)
            } catch {
                localError = "Apple Anmeldung fehlgeschlagen. Bitte erneut versuchen."
            }
        case .failure:
            // Nutzer hat abgebrochen – kein Fehler anzeigen
            break
        }
    }

    func submitEmailPassword() async {
        localError = nil
        do {
            if !isRegister {
                try await authService.signIn(email: email, password: password)
            } else {
                let needsConfirmation = try await authService.signUp(email: email, password: password)
                if needsConfirmation {
                    showConfirmationAlert = true
                }
            }
        } catch {
            localError = isRegister
                ? "Registrierung fehlgeschlagen. E-Mail möglicherweise bereits registriert."
                : "E-Mail oder Passwort falsch."
        }
    }

    func sendMagicLink() async {
        guard email.contains("@") else { return }
        do {
            try await authService.signInWithMagicLink(email: email)
            withAnimation { magicLinkSent = true }
        } catch {
            localError = "Senden fehlgeschlagen."
        }
    }

    // MARK: - Nonce Helpers

    private func randomNonce(length: Int = 32) -> String {
        let charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._"
        var result = ""
        var remaining = length
        while remaining > 0 {
            let randoms = (0..<16).map { _ in UInt8.random(in: 0...255) }
            randoms.forEach { random in
                guard remaining > 0, random < charset.count else { return }
                result.append(charset[charset.index(charset.startIndex, offsetBy: Int(random))])
                remaining -= 1
            }
        }
        return result
    }

    private func sha256(_ input: String) -> String {
        let hashed = SHA256.hash(data: Data(input.utf8))
        return hashed.compactMap { String(format: "%02x", $0) }.joined()
    }
}

// MARK: - PasswordRequirementRow

private struct PasswordRequirementRow: View {
    let label: String
    let met: Bool

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: met ? "checkmark.circle.fill" : "circle")
                .font(.caption)
                .foregroundColor(met ? .green : Color(.systemGray3))
            Text(label)
                .font(.caption)
                .foregroundColor(met ? .primary : .secondary)
        }
    }
}

// MARK: - CheckboxToggleStyle

struct CheckboxToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        Button {
            configuration.isOn.toggle()
        } label: {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: configuration.isOn ? "checkmark.square.fill" : "square")
                    .foregroundColor(configuration.isOn ? Color(hex: "0891B2") : .secondary)
                    .font(.body)
                configuration.label
                    .multilineTextAlignment(.leading)
                    .foregroundColor(.primary)
            }
        }
        .buttonStyle(.plain)
    }
}

