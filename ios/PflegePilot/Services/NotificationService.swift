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

    /// Slugs, die Jahres-Verfallfristen haben und Frist-Notifications bekommen sollen.
    /// Explizite Whitelist schützt vor unbeabsichtigten Notifications bei künftigen Slugs.
    private static let fristNotificationSlugs: Set<String> = [
        "entlastungsbetrag",
        "entlastungsbudget",
    ]

    /// Fristen-Erinnerungen (90/30/7 Tage vor Ablauf) + monatliche Hilfsmittel-Erinnerung
    func scheduleReminders(for budgets: [BudgetItem]) async {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers:
            budgets.map { "frist_\($0.id)" }
        )

        for budget in budgets {
            guard Self.fristNotificationSlugs.contains(budget.benefitType.slug),
                  let expiresAt = budget.expiresAt,
                  budget.remainingCents > 0 else { continue }

            for days in [90, 30, 7] {
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
