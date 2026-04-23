import SwiftUI

// Hilfreich für einfache Euro-Anzeigen
struct EuroText: View {
    let cents: Int
    var font: Font = .body
    var color: Color = .primary

    var body: some View {
        Text(cents.formatEuro)
            .font(font)
            .foregroundColor(color)
    }
}
