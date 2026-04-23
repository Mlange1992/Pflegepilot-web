import SwiftUI
import UIKit

struct AffiliateCardView: View {
    let partner: AffiliatePartner
    var onTap: (() -> Void)? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Image(systemName: partner.icon)
                    .font(.title2)
                    .foregroundColor(.green)
                    .frame(width: 36, height: 36)
                    .background(Color.green.opacity(0.12))
                    .cornerRadius(10)

                Text(partner.name)
                    .font(.headline)
                    .fontWeight(.bold)
            }

            Text(partner.beschreibung)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .lineSpacing(4)
                .fixedSize(horizontal: false, vertical: true)

            Button(action: {
                onTap?()
                if let url = URL(string: partner.linkURL) {
                    UIApplication.shared.open(url)
                }
            }) {
                Text(partner.buttonText)
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.green)
                    .cornerRadius(12)
            }
            .accessibilityLabel(partner.buttonText)

            // Rechtspflicht nach UWG – NICHT entfernen!
            HStack {
                Spacer()
                Text(partner.hinweis)
                    .font(.caption2)
                    .foregroundColor(.gray)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemBackground))
                .shadow(color: .black.opacity(0.06), radius: 8, y: 4)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.green.opacity(0.15), lineWidth: 1)
        )
    }
}
