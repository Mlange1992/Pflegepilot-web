import Foundation

struct NBAResult {
    let moduleScores: [Int: Double]   // Modul-ID → Prozent (0–100)
    let totalScore: Double            // 0–100
    let pflegegrad: Int?              // nil = kein Pflegegrad
    let pflegegradLabel: String
    let modul2Score: Double
    let modul3Score: Double
}

class NBAEngine {
    static let shared = NBAEngine()

    /// Berechnet das Ergebnis aus den Antworten [FrageID: Punkte (0-3)]
    func calculate(answers: [String: Int]) -> NBAResult {

        // ─── Modul-Rohpunkte summieren ───────────────────────────
        var rawScores: [Int: Int] = [:]
        var maxRaw: [Int: Int] = [:]

        for module in nbaModules {
            let raw = module.questions.reduce(0) { $0 + (answers[$1.id] ?? 0) }
            let max = module.questions.count * 3
            rawScores[module.id] = raw
            maxRaw[module.id] = max
        }

        // ─── Prozentsatz pro Modul ────────────────────────────────
        func pct(_ moduleId: Int) -> Double {
            guard let raw = rawScores[moduleId], let max = maxRaw[moduleId], max > 0 else { return 0 }
            return Double(raw) / Double(max) * 100.0
        }

        let m1 = pct(1)
        let m2 = pct(2)
        let m3 = pct(3)
        let m4 = pct(4)
        let m5 = pct(5)
        let m6 = pct(6)

        // ─── Modul 2 + 3: Der HÖHERE Wert zählt (gem. NBA-Logik) ─
        let m23 = max(m2, m3)

        // ─── Gewichteter Gesamtscore ──────────────────────────────
        let total = m1 * 0.10 + m23 * 0.15 + m4 * 0.40 + m5 * 0.20 + m6 * 0.15

        // ─── Pflegegrad bestimmen ─────────────────────────────────
        let pflegegrad: Int?
        let label: String
        switch total {
        case ..<12.5:
            pflegegrad = nil
            label = "Kein Pflegegrad"
        case 12.5..<27:
            pflegegrad = 1
            label = "Pflegegrad 1"
        case 27..<47.5:
            pflegegrad = 2
            label = "Pflegegrad 2"
        case 47.5..<70:
            pflegegrad = 3
            label = "Pflegegrad 3"
        case 70..<90:
            pflegegrad = 4
            label = "Pflegegrad 4"
        default:
            pflegegrad = 5
            label = "Pflegegrad 5"
        }

        return NBAResult(
            moduleScores: [1: m1, 2: m2, 3: m3, 4: m4, 5: m5, 6: m6],
            totalScore: total,
            pflegegrad: pflegegrad,
            pflegegradLabel: label,
            modul2Score: m2,
            modul3Score: m3
        )
    }

    var totalQuestions: Int {
        nbaModules.reduce(0) { $0 + $1.questions.count }
    }
}
