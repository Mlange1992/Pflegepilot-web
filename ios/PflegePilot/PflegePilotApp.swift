import SwiftUI

@main
struct PflegePilotApp: App {
    @StateObject private var authService = AuthService()
    @AppStorage("appearanceMode") private var appearanceMode = "system"

    var preferredColorScheme: ColorScheme? {
        switch appearanceMode {
        case "light": return .light
        case "dark":  return .dark
        default:      return nil
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authService)
                .environmentObject(NotificationService.shared)
                .preferredColorScheme(preferredColorScheme)
                .onOpenURL { url in
                    Task { await authService.handleMagicLink(url: url) }
                }
                .task {
                    await NotificationService.shared.checkStatus()
                    if !NotificationService.shared.isAuthorized {
                        try? await Task.sleep(for: .seconds(3))
                        await NotificationService.shared.requestPermission()
                    }
                }
        }
    }
}
