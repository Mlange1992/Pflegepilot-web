import Foundation

struct ChecklistItem: Identifiable {
    let id = UUID()
    let kategorie: String
    let text: String
    let wichtig: Bool
}

struct ChecklistGenerator {

    static func erstelle(fuer result: NBAResult) -> [ChecklistItem] {
        var items: [ChecklistItem] = []

        let m1 = result.moduleScores[1] ?? 0   // Mobilität (%)
        let m2 = result.moduleScores[2] ?? 0   // Kognition (%)
        let m3 = result.moduleScores[3] ?? 0   // Psyche (%)
        let m4 = result.moduleScores[4] ?? 0   // Selbstversorgung (%)
        let m5 = result.moduleScores[5] ?? 0   // Krankheitsbewältigung (%)

        // MARK: - Dokumente (immer)
        items += [
            .init(kategorie: "Dokumente", text: "Personalausweis oder Reisepass bereitlegen", wichtig: true),
            .init(kategorie: "Dokumente", text: "Versichertenkarte der Krankenkasse", wichtig: true),
            .init(kategorie: "Dokumente", text: "Aktuelle Medikamentenliste (vom Hausarzt)", wichtig: true),
            .init(kategorie: "Dokumente", text: "Arztbriefe und Befunde der letzten 12 Monate", wichtig: true),
            .init(kategorie: "Dokumente", text: "Bisherige Pflegegrad-Bescheide (falls vorhanden)", wichtig: false),
            .init(kategorie: "Dokumente", text: "Pflegetagebuch (falls geführt)", wichtig: true),
        ]

        // MARK: - Vorbereitung (immer)
        items += [
            .init(kategorie: "Vorbereitung", text: "Pflegetagebuch mindestens 2 Wochen vor dem Termin führen", wichtig: true),
            .init(kategorie: "Vorbereitung", text: "Pflegeperson sollte beim Termin anwesend sein", wichtig: true),
            .init(kategorie: "Vorbereitung", text: "Typischen Tagesablauf notieren — was klappt, was nicht", wichtig: true),
        ]

        // MARK: - Mobilität (Modul 1)
        if m1 > 30 {
            items += [
                .init(kategorie: "Vorbereitung", text: "Mobilitäts-Einschränkungen dokumentieren: Wann stürzt die Person? Wie oft? Hilfsmittel?", wichtig: true),
                .init(kategorie: "Am Termin", text: "Dem Gutachter zeigen wie die Person TATSÄCHLICH geht — nicht den besten Tag darstellen!", wichtig: true),
            ]
        }

        // MARK: - Kognition & Psyche (Modul 2 + 3)
        if m2 > 30 || m3 > 30 {
            items += [
                .init(kategorie: "Vorbereitung", text: "Beispiele für Verwirrtheit/Orientierungslosigkeit notieren (wann, wie oft, was genau)", wichtig: true),
                .init(kategorie: "Am Termin", text: "Verhaltensauffälligkeiten ehrlich schildern — auch nächtliche Unruhe, Aggression, Ängste", wichtig: true),
            ]
        }

        // MARK: - Selbstversorgung (Modul 4)
        if m4 > 30 {
            items += [
                .init(kategorie: "Vorbereitung", text: "Genau notieren bei welchen Körperpflege-Aufgaben Hilfe nötig ist (Waschen, Anziehen, Toilette, Essen)", wichtig: true),
            ]
        }

        // MARK: - Krankheitsbewältigung (Modul 5)
        if m5 > 30 {
            items += [
                .init(kategorie: "Dokumente", text: "Alle Hilfsmittel-Verordnungen und Therapie-Pläne mitbringen", wichtig: true),
            ]
        }

        // MARK: - Am Termin (immer)
        items += [
            .init(kategorie: "Am Termin", text: "WICHTIG: Zeigen Sie den schlechten Tag, nicht den guten! Viele stellen sich besser dar als sie sind.", wichtig: true),
            .init(kategorie: "Am Termin", text: "Der Gutachter beobachtet ab der Haustür — auch der Weg zum Sofa zählt als Mobilität", wichtig: true),
            .init(kategorie: "Am Termin", text: "Fragen ehrlich beantworten. 'Geht schon' ist der häufigste Fehler!", wichtig: true),
        ]

        // MARK: - Nach dem Termin (immer)
        items += [
            .init(kategorie: "Nach dem Termin", text: "Gutachten anfordern und mit PflegePilot-Ergebnis vergleichen. Bei Abweichung: Widerspruch prüfen.", wichtig: true),
        ]

        return items
    }
}
