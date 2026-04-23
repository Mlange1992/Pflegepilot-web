import Foundation
import UserNotifications

@MainActor
class NotificationService: ObservableObject {
    static let shared = NotificationService()

    @Published var isAuthorized = false

    func requestPermission() async {
        let center = UNUserNotificationCenter.current()
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .badge, .sound])
            isAuthorized = granted
            if granted { await schedulePendingReminders() }
        } catch {
            print("Notification-Fehler:", error)
        }
    }

    func checkStatus() async {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        isAuthorized = settings.authorizationStatus == .authorized
    }

    /// Lokale Fristen-Erinnerungen für alle ablaufenden Budgets planen
    func scheduleReminders(for budgets: [BudgetItem]) async {
        let center = UNUserNotificationCenter.current()
        // Bestehende Fristen-Notifications entfernen
        center.removePendingNotificationRequests(withIdentifiers:
            budgets.map { "frist_\($0.id)" }
        )

        for budget in budgets {
            guard let expiresAt = budget.expiresAt,
                  budget.remainingCents > 0 else { continue }

            let reminderDays = [90, 30, 7]
            for days in reminderDays {
                guard let triggerDate = Calendar.current.date(byAdding: .day, value: -days, to: expiresAt),
                      triggerDate > Date() else { continue }

                let content = UNMutableNotificationContent()
                content.title = "Frist läuft ab: \(budget.benefitType.name)"
                content.body = "Noch \(days) Tage — \(budget.remainingCents.formatEuro) verfügbar. Jetzt nutzen!"
                content.sound = .default
                content.badge = 1

                let comps = Calendar.current.dateComponents([.year, .month, .day, .hour], from: triggerDate)
                let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: false)
                let request = UNNotificationRequest(
                    identifier: "frist_\(budget.id)_\(days)d",
                    content: content,
                    trigger: trigger
                )
                try? await center.add(request)
            }
        }
    }

    func schedulePendingReminders() async {
        // Wird aufgerufen nach Permission-Erteilung
        // Budgets werden vom Dashboard nachgereicht via scheduleReminders(for:)
    }

    func clearAllReminders() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
    }
}
