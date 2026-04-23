import SwiftUI

struct NBAResultView: View {
    let result: NBAResult
    var onUseResult: (Int?) -> Void
    var onCompleted: ((Bool) -> Void)? = nil

    @State private var showAntrag = false
    @State private var showCheckliste = false

    var pflegegradColor: Color {
        switch result.pflegegrad {
        case 1: return Color(hex: "84CC16")
        case 2: return Color(hex: "0891B2")
        case 3: return Color(hex: "F59E0B")
        case 4: return Color(hex: "EF4444")
        case 5: return Color(hex: "7C3AED")
        default: return Color.secondary
        }
    }

    var moduleNames: [Int: String] = [
        1: "Mobilität",
        2: "Kognition",
        3: "Psyche",
        4: "Selbstversorgung",
        5: "Krankheitsbewältigung",
        6: "Alltagsgestaltung"
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {

                // ── Ergebnis-Hero ────────────────────────────────
                VStack(spacing: 12) {
                    if let pg = result.pflegegrad {
                        Text("\(pg)")
                            .font(.system(size: 80, weight: .black))
                            .foregroundColor(pflegegradColor)
                        Text("Geschätzter \(result.pflegegradLabel)")
                            .font(.title2.bold())
                        Text("Gesamtpunktzahl: \(String(format: "%.1f", result.totalScore)) von 100")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    } else {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 60))
                            .foregroundColor(Color(hex: "84CC16"))
                        Text("Kein Pflegegrad erforderlich")
                            .font(.title2.bold())
                        Text("Punktzahl: \(String(format: "%.1f", result.totalScore)) — unter 12,5 Punkten")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(24)
                .frame(maxWidth: .infinity)
                .background(pflegegradColor.opacity(0.08))
                .cornerRadius(20)
                .padding(.horizontal)

                // ── Rechtlicher Disclaimer (nicht ausblendbar) ───
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        Image(systemName: "info.circle.fill")
                            .foregroundColor(.orange)
                        Text("Wichtiger Hinweis")
                            .font(.caption.bold())
                    }
                    Text(LegalTexts.pflegegradDisclaimer)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding()
                .background(Color.orange.opacity(0.08))
                .cornerRadius(12)
                .padding(.horizontal)

                // ── Modul-Übersicht ───────────────────────────────
                VStack(alignment: .leading, spacing: 12) {
                    Text("Auswertung nach Modulen")
                        .font(.headline)
                        .padding(.horizontal)

                    ForEach([1, 2, 3, 4, 5, 6], id: \.self) { moduleId in
                        if let score = result.moduleScores[moduleId] {
                            let module = nbaModules.first { $0.id == moduleId }
                            HStack(spacing: 12) {
                                Image(systemName: module?.icon ?? "circle")
                                    .frame(width: 24)
                                    .foregroundColor(Color(hex: "0891B2"))
                                VStack(alignment: .leading, spacing: 3) {
                                    HStack {
                                        Text(moduleNames[moduleId] ?? "Modul \(moduleId)")
                                            .font(.subheadline.bold())
                                        Spacer()
                                        Text("\(Int(score.rounded()))%")
                                            .font(.subheadline.bold())
                                            .foregroundColor(scoreColor(score))
                                    }
                                    GeometryReader { geo in
                                        ZStack(alignment: .leading) {
                                            RoundedRectangle(cornerRadius: 4)
                                                .fill(Color(.systemGray5))
                                                .frame(height: 6)
                                            RoundedRectangle(cornerRadius: 4)
                                                .fill(scoreColor(score))
                                                .frame(width: geo.size.width * score / 100, height: 6)
                                        }
                                    }
                                    .frame(height: 6)

                                    if moduleId == 3 && result.modul3Score <= result.modul2Score {
                                        Text("Modul 2 wird für die Berechnung verwendet")
                                            .font(.caption2).foregroundColor(.secondary)
                                    }
                                    if moduleId == 2 && result.modul2Score < result.modul3Score {
                                        Text("Modul 3 wird für die Berechnung verwendet")
                                            .font(.caption2).foregroundColor(.secondary)
                                    }
                                }
                            }
                            .padding()
                            .background(Color(.systemBackground))
                            .cornerRadius(12)
                            .shadow(color: .black.opacity(0.04), radius: 2, y: 1)
                            .padding(.horizontal)
                        }
                    }
                }

                // ── Aktions-Buttons ───────────────────────────────
                VStack(spacing: 12) {
                    if result.pflegegrad != nil {
                        Button { showAntrag = true } label: {
                            Label("Antrag auf Pflegegrad stellen", systemImage: "doc.badge.plus")
                                .font(.headline).foregroundColor(.white)
                                .frame(maxWidth: .infinity).frame(height: 54)
                                .background(Color(hex: "0891B2")).cornerRadius(14)
                        }

                        Button { showCheckliste = true } label: {
                            Label("Checkliste für MD-Termin erstellen", systemImage: "checklist")
                                .font(.subheadline.bold())
                                .foregroundColor(Color(hex: "0891B2"))
                                .frame(maxWidth: .infinity).frame(height: 44)
                                .background(Color(hex: "0891B2").opacity(0.1))
                                .cornerRadius(12)
                        }

                        Button { onUseResult(result.pflegegrad) } label: {
                            Text("Nur Ergebnis übernehmen")
                                .font(.subheadline).foregroundColor(.secondary)
                                .frame(maxWidth: .infinity).frame(height: 44)
                        }
                    } else {
                        Button { onUseResult(nil) } label: {
                            Text("Zurück zum Dashboard")
                                .font(.headline).foregroundColor(.white)
                                .frame(maxWidth: .infinity).frame(height: 54)
                                .background(Color(hex: "0891B2")).cornerRadius(14)
                        }
                    }
                }
                .padding(.horizontal)

                // ── Affiliate-Karten nach Ermittlung ─────────────
                VStack(alignment: .leading, spacing: 12) {
                    Text("Das könnte jetzt wichtig sein")
                        .font(.headline)
                        .padding(.horizontal)

                    ForEach(AffiliateConfig.partnerNachErmittlung()) { partner in
                        AffiliateCardView(partner: partner) {
                            // Klick optional an Supabase senden (anonymisiert)
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.bottom, 30)
            }
            .padding(.top, 20)
        }
        .navigationTitle("Testergebnis")
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(true)
        .sheet(isPresented: $showAntrag) {
            AntragFormView(nbaResult: result, onCompleted: onCompleted)
        }
        .sheet(isPresented: $showCheckliste) {
            ChecklistView(result: result)
        }
    }

    func scoreColor(_ score: Double) -> Color {
        switch score {
        case ..<25: return Color(hex: "84CC16")
        case ..<50: return Color(hex: "0891B2")
        case ..<75: return Color(hex: "F59E0B")
        default: return Color(hex: "EF4444")
        }
    }
}
