import SwiftUI

struct QuickCheckResultView: View {
    let pflegegrad: Pflegegrad
    let genutzteLeistungen: [String]
    let nutztPflegedienst: Bool

    @State private var showAuth = false

    private var engine: BenefitEngine { BenefitEngine.shared }

    var totalCents: Int { engine.calculateTotalJahrCents(pflegegrad: pflegegrad) }
    var usedCents: Int { engine.estimateUsedCents(pflegegrad: pflegegrad, genutzeSlugs: genutzteLeistungen) }
    var verfallenCents: Int { max(0, totalCents - usedCents) }
    var benefits: [Leistung] { engine.calculateBenefits(pflegegrad: pflegegrad) }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Header Card
                VStack(spacing: 12) {
                    Text("Mit \(pflegegrad.label) stehen Ihrer Familie")
                        .foregroundColor(.white.opacity(0.9))
                        .multilineTextAlignment(.center)

                    Text(totalCents.formatEuro)
                        .font(.system(size: 48, weight: .black))
                        .foregroundColor(.white)

                    Text("pro Jahr zu")
                        .font(.title3)
                        .foregroundColor(.white.opacity(0.9))

                    Text("Sie nutzen aktuell ca. \(usedCents.formatEuro).")
                        .foregroundColor(.white.opacity(0.8))
                }
                .padding(28)
                .frame(maxWidth: .infinity)
                .background(Color(hex: "0891B2"))

                // Verfall-Box
                if verfallenCents > 0 {
                    HStack(spacing: 12) {
                        Text("⚠️")
                            .font(.title2)
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Sie lassen \(verfallenCents.formatEuro) verfallen.")
                                .font(.headline)
                                .foregroundColor(Color(hex: "DC2626"))
                            Text("Dieses Geld verfällt, wenn Sie es nicht abrufen.")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                    }
                    .padding()
                    .background(Color(hex: "FEF2F2"))
                }

                // Leistungsliste
                VStack(alignment: .leading, spacing: 12) {
                    Text("Ihre Leistungen im Überblick")
                        .font(.title3.bold())
                        .padding(.horizontal)
                        .padding(.top, 20)

                    ForEach(benefits) { leistung in
                        LeistungRow(
                            leistung: leistung,
                            pflegegrad: pflegegrad,
                            genutzt: genutzteLeistungen.contains(leistung.slug)
                        )
                    }
                }

                // CTA
                VStack(spacing: 16) {
                    Text("Nie wieder Geld verfallen lassen")
                        .font(.title2.bold())
                        .multilineTextAlignment(.center)

                    Text("Kostenlos registrieren und das Dashboard freischalten — wir erinnern Sie 90, 30 und 7 Tage vor dem Verfall.")
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)

                    Button {
                        showAuth = true
                    } label: {
                        Text("Jetzt kostenlos registrieren →")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(Color(hex: "0891B2"))
                            .cornerRadius(14)
                    }

                    Text("PflegePilot ersetzt keine Rechtsberatung.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(24)
                .background(Color(.systemGray6))
                .cornerRadius(16)
                .padding()
            }
        }
        .navigationTitle("Ihr Ergebnis")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $showAuth) {
            AuthView()
        }
    }
}

struct LeistungRow: View {
    let leistung: Leistung
    let pflegegrad: Pflegegrad
    let genutzt: Bool

    var body: some View {
        HStack(spacing: 12) {
            Text(leistung.icon)
                .font(.title2)
                .frame(width: 44)

            VStack(alignment: .leading, spacing: 2) {
                Text(leistung.name)
                    .font(.subheadline.bold())
                Text(leistung.shortDescription)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 2) {
                Text(leistung.jahrBetragCents(pflegegrad: pflegegrad).formatEuroKompakt)
                    .font(.subheadline.bold())
                Text("/ Jahr")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(genutzt ? Color(hex: "10B981") : Color(.systemGray5), lineWidth: 1.5)
        )
        .cornerRadius(12)
        .padding(.horizontal)
    }
}
