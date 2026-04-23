import Foundation
import Supabase

@MainActor
class AuthService: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isCheckingSession = true   // Verhindert Onboarding-Flash beim Start
    @Published var currentUserId: String?
    @Published var userEmail: String?
    @Published var isLoading = false
    @Published var authError: String?

    private let supabase = SupabaseService.shared.client

    init() {
        Task { await checkSession() }
    }

    // MARK: - Session

    func checkSession() async {
        defer { isCheckingSession = false }
        do {
            let session = try await supabase.auth.session
            isAuthenticated = true
            currentUserId = session.user.id.uuidString
            userEmail = session.user.email
        } catch {
            isAuthenticated = false
        }
    }

    // MARK: - E-Mail + Passwort

    func signIn(email: String, password: String) async throws {
        isLoading = true
        authError = nil
        defer { isLoading = false }
        let session = try await supabase.auth.signIn(email: email, password: password)
        isAuthenticated = true
        currentUserId = session.user.id.uuidString
        userEmail = session.user.email
    }

    @discardableResult
    func signUp(email: String, password: String) async throws -> Bool {
        isLoading = true
        authError = nil
        defer { isLoading = false }
        let response = try await supabase.auth.signUp(
            email: email,
            password: password,
            redirectTo: URL(string: "pflegepilot://auth/callback")
        )
        if let session = response.session {
            isAuthenticated = true
            currentUserId = session.user.id.uuidString
            userEmail = session.user.email
            return false
        }
        return true
    }

    // MARK: - Sign in with Apple (nativ)

    func signInWithApple(idToken: String, nonce: String) async throws {
        isLoading = true
        authError = nil
        defer { isLoading = false }
        let session = try await supabase.auth.signInWithIdToken(
            credentials: .init(provider: .apple, idToken: idToken, nonce: nonce)
        )
        isAuthenticated = true
        currentUserId = session.user.id.uuidString
        userEmail = session.user.email
    }

    // MARK: - Google OAuth (In-App-Browser via ASWebAuthenticationSession)

    func signInWithGoogle() async throws {
        isLoading = true
        authError = nil
        defer { isLoading = false }
        try await supabase.auth.signInWithOAuth(
            provider: .google,
            redirectTo: URL(string: "pflegepilot://auth/callback")
        )
    }

    // MARK: - Magic Link (Fallback)

    func signInWithMagicLink(email: String) async throws {
        try await supabase.auth.signInWithOTP(
            email: email,
            redirectTo: URL(string: "pflegepilot://auth/callback")
        )
    }

    func handleMagicLink(url: URL) async {
        do {
            try await supabase.auth.session(from: url)
            let session = try await supabase.auth.session
            isAuthenticated = true
            currentUserId = session.user.id.uuidString
            userEmail = session.user.email
        } catch {
            print("Magic Link Fehler: \(error)")
        }
    }

    // MARK: - Sign Out

    func signOut() async throws {
        try await supabase.auth.signOut()
        isAuthenticated = false
        currentUserId = nil
        userEmail = nil
    }

    // MARK: - Account löschen (DSGVO Art. 17)

    func deleteAccount() async throws {
        guard let userId = currentUserId else { return }
        try await SupabaseService.shared.deleteAllUserData(userId: userId)
        try await signOut()
    }
}
