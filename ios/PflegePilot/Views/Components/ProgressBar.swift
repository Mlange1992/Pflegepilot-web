import SwiftUI

struct ProgressBar: View {
    let value: Double // 0.0 – 1.0

    private var barColor: Color {
        if value >= 0.9 { return Color(hex: "EF4444") }
        if value >= 0.7 { return Color(hex: "F59E0B") }
        return Color(hex: "10B981")
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color(.systemGray5))
                    .frame(height: 8)

                RoundedRectangle(cornerRadius: 4)
                    .fill(barColor)
                    .frame(width: geo.size.width * min(value, 1.0), height: 8)
                    .animation(.easeInOut(duration: 0.5), value: value)
            }
        }
        .frame(height: 8)
    }
}
