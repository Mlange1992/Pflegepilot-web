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

    /// Fristen-Erinnerungen für Budgets mit Verfallsdatum:
    /// - 90 / 30 / 7 Tage vor Ablauf um 09:00
    /// - 1 Tag nach Ablauf um 09:00 (Verfallen-Hinweis), falls noch Restbudget
    /// Plus monatliche Hilfsmittel-Erinnerung am 25.
    func scheduleReminders(for budgets: [BudgetItem]) async {
        let center = UNUserNotificationCenter.current()
        let cal = Calendar.current

        // Alte Budget-Reminders dieses Schemas wegräumen (Prefix-Match)
        let pending = await center.pendingNotificationRequests()
        let toRemove = pending
            .map(\.identifier)
            .filter { $0.hasPrefix("frist_") || $0.hasPrefix("verfallen_") }
        if !toRemove.isEmpty {
            center.removePendingNotificationRequests(withIdentifiers: toRemove)
        }

        for budget in budgets {
            guard let expiresAt = budget.expiresAt,
                  budget.remainingCents > 0 else { continue }

            // ── 90 / 30 / 7 Tage VOR Ablauf, jeweils um 09:00 ──
            for days in [90, 30, 7] {
                guard let base = cal.date(byAdding: .day, value: -days, to: expiresAt),
                      let trigger = cal.date(bySettingHour: 9, minute: 0, second: 0, of: base),
                      trigger > Date() else { continue }

                let content = UNMutableNotificationContent()
                content.title = "Frist läuft ab: \(budget.benefitType.name)"
                content.body = "Noch \(days) Tage — \(budget.remainingCents.formatEuro) verfügbar. Jetzt nutzen!"
                content.sound = .default
                content.badge = 1

                let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: trigger)
                let request = UNNotificationRequest(
                    identifier: "frist_\(budget.id)_\(days)d",
                    content: content,
                    trigger: UNCalendarNotificationTrigger(dateMatching: comps, repeats: false)
                )
                try? await center.add(request)
            }

            // ── 1 Tag NACH Ablauf um 09:00: Verfallen-Hinweis ──
            if let base = cal.date(byAdding: .day, value: 1, to: expiresAt),
               let trigger = cal.date(bySettingHour: 9, minute: 0, second: 0, of: base),
               trigger > Date() {

                let content = UNMutableNotificationContent()
                content.title = "Budget verfallen: \(budget.benefitType.name)"
                content.body = "Etwa \(budget.remainingCents.formatEuro) wurden nicht genutzt. Tipp: nächstes Jahr früher planen oder Antrag auf Höherstufung prüfen."
                content.sound = .default
                content.badge = 1

                let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: trigger)
                let request = UNNotificationRequest(
                    identifier: "verfallen_\(budget.id)",
                    content: content,
                    trigger: UNCalendarNotificationTrigger(dateMatching: comps, repeats: false)
                )
                try? await center.add(request)
            }
        }

        let hasHilfsmittel = budgets.contains { $0.benefitType.slug == "pflegehilfsmittel" }
        await scheduleMonthlyHilfsmittelReminder(active: hasHilfsmittel)
    }

    /// Wiederkehrende Erinnerung am 25. jeden Monats: Pflegehilfsmittel bestellen.
    /// Viele Berechtigte haben keinen Dauerauftrag — der Anspruch verfällt monatlich.
    private func scheduleMonthlyHilfsmittelReminder(active: Bool) async {
        let center = UNUserNotificationCenter.current()
        let id = "hilfsmittel_monthly"
        center.removePendingNotificationRequests(withIdentifiers: [id])
        guard active else { return }

        let content = UNMutableNotificationContent()
        content.title = "Pflegehilfsmittel für diesen Monat?"
        content.body = "Ihr monatliches Budget von 42 € (§ 40 SGB XI) für Handschuhe, Bettschutz & Co. — verfällt am Monatsende."
        content.sound = .default

        var comps = DateComponents()
        comps.day = 25
        comps.hour = 9
        comps.minute = 0

        let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
        let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)
        try? await center.add(request)
    }

    func schedulePendingReminders() async {
        // Wird aufgerufen nach Permission-Erteilung
        // Budgets werden vom Dashboard nachgereicht via scheduleReminders(for:)
    }

    func clearAllReminders() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
    }
}
