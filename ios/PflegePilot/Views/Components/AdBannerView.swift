import SwiftUI

/// Affiliate-Hinweis-Banner — ersetzt den alten Premium/Ad-Banner
/// Wird nirgends aktiv eingebunden (Affiliate-Links direkt in Budget-Töpfen)
struct AffiliateTeaserBanner: View {
    let partnerName: String
    let beschreibung: String
    let url: String

    var body: some View {
        Link(destination: URL(string: url) ?? URL(string: "https://pflege-pilot.com")!) {
            HStack(spacing: 10) {
                Image(systemName: "info.circle.fill")
                    .foregroundColor(Color(hex: "0891B2"))
                    .font(.caption)
                VStack(alignment: .leading, spacing: 1) {
                    HStack(spacing: 4) {
                        Text(partnerName)
                            .font(.caption.bold())
                            .foregroundColor(.primary)
                        Text("Anzeige")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .padding(.horizontal, 5)
                            .padding(.vertical, 1)
                            .background(Color(.systemGray5))
                            .cornerRadius(4)
                    }
                    Text(beschreibung)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(Color(hex: "0891B2").opacity(0.06))
            .cornerRadius(10)
        }
    }
}
