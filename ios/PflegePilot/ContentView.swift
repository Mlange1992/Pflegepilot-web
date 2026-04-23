import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authService: AuthService
    @AppStorage("isGuestMode") private var isGuestMode = false

    var body: some View {
        Group {
            if authService.isCheckingSession {
                // Kurzer Moment während Session geprüft wird – kein Onboarding-Flash
                Color(.systemBackground).ignoresSafeArea()
            } else if authService.isAuthenticated || isGuestMode {
                MainTabView()
            } else {
                OnboardingView()
            }
        }
    }
}
