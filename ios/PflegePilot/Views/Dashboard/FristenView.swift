import SwiftUI

struct FristenView: View {
    let budgets: [BudgetItem]

    var expiringBudgets: [BudgetItem] {
        budgets
            .filter { $0.expiresAt != nil }
            .sorted { ($0.expiresAt ?? .distantFuture) < ($1.expiresAt ?? .distantFuture) }
    }

    var body: some View {
        if expiringBudgets.isEmpty { EmptyView() } else {
            VStack(alignment: .leading, spacing: 10) {
                Text("Fristen")
                    .font(.title3.bold())
                    .padding(.horizontal)

                ForEach(expiringBudgets) { budget in
                    FristRow(budget: budget)
                }
            }
        }
    }
}

struct FristRow: View {
    let budget: BudgetItem

    var days: Int { budget.daysUntilExpiry ?? 999 }

    var urgencyColor: Color {
        if days <= 7  { return .red }
        if days <= 30 { return .orange }
        if days <= 90 { return Color(hex: "F59E0B") }
        return .secondary
    }

    var urgencyIcon: String {
        if days <= 7  { return "exclamationmark.triangle.fill" }
        if days <= 30 { return "clock.badge.exclamationmark" }
        return "clock"
    }

    var expiryText: String {
        guard let exp = budget.expiresAt else { return "" }
        let df = DateFormatter()
        df.dateStyle = .medium
        df.locale = Locale(identifier: "de_DE")
        return df.string(from: exp)
    }

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: urgencyIcon)
                .foregroundColor(urgencyColor)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(budget.benefitType.name)
                    .font(.subheadline.bold())
                Text("Verfällt: \(expiryText)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 2) {
                Text(days <= 0 ? "Abgelaufen" : "noch \(days) Tage")
                    .font(.caption.bold())
                    .foregroundColor(urgencyColor)
                Text(budget.remainingCents.formatEuro)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding(12)
        .background(urgencyColor.opacity(0.07))
        .cornerRadius(12)
        .padding(.horizontal)
    }
}
