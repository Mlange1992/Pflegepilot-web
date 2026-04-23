import Foundation

// MARK: - Antwort-Skalen

enum NBAScale {
    case selbstaendigkeit  // Module 1, 4, 6
    case faehigkeit        // Modul 2
    case haeufigkeit       // Modul 3
    case versorgung        // Modul 5

    var options: [(label: String, value: Int)] {
        switch self {
        case .selbstaendigkeit:
            return [
                ("Selbständig", 0),
                ("Überwiegend selbständig", 1),
                ("Überwiegend unselbständig", 2),
                ("Unselbständig", 3)
            ]
        case .faehigkeit:
            return [
                ("Vorhanden", 0),
                ("Größtenteils vorhanden", 1),
                ("In geringem Maße vorhanden", 2),
                ("Nicht vorhanden", 3)
            ]
        case .haeufigkeit:
            return [
                ("Nie oder sehr selten", 0),
                ("Selten (1–3× pro Woche)", 1),
                ("Häufig (4–5× pro Woche)", 2),
                ("Täglich oder mehrfach täglich", 3)
            ]
        case .versorgung:
            return [
                ("Entfällt / nicht erforderlich", 0),
                ("Selbständig möglich", 1),
                ("Hilfe erforderlich", 2),
                ("Vollständige Übernahme nötig", 3)
            ]
        }
    }
}

// MARK: - Frage

struct NBAQuestion: Identifiable {
    let id: String
    let text: String
    let hint: String?
    let scale: NBAScale
}

// MARK: - Modul

struct NBAModule: Identifiable {
    let id: Int
    let title: String
    let icon: String
    let description: String
    let weight: Double  // Gewichtung für Gesamtscore (0–1)
    let questions: [NBAQuestion]
}

// MARK: - Alle Module

let nbaModules: [NBAModule] = [

    // ─────────────────────────────────────────────
    // MODUL 1: Mobilität  (Gewicht 10%)
    // ─────────────────────────────────────────────
    NBAModule(id: 1, title: "Mobilität", icon: "figure.walk",
              description: "Wie gut kann sich die Person körperlich bewegen und ihre Position wechseln?",
              weight: 0.10, questions: [
        NBAQuestion(id: "m1_1", text: "Positionswechsel im Bett",
                    hint: "z.B. vom Rücken auf die Seite drehen, Oberkörper aufrichten",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m1_2", text: "Stabile Sitzposition halten",
                    hint: "Mindestens 10 Minuten aufrecht sitzen ohne Unterstützung",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m1_3", text: "Umsetzen",
                    hint: "z.B. vom Bett in den Rollstuhl oder auf einen Stuhl wechseln",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m1_4", text: "Fortbewegen innerhalb des Wohnbereichs",
                    hint: "Gehen oder Fahren im Wohnbereich, auch mit Hilfsmittel",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m1_5", text: "Treppensteigen",
                    hint: "Eine Etage (mindestens 4 Stufen) hinauf und hinunter",
                    scale: .selbstaendigkeit),
    ]),

    // ─────────────────────────────────────────────
    // MODUL 2: Kognition & Kommunikation  (Gewicht 15%, zusammen mit Modul 3)
    // ─────────────────────────────────────────────
    NBAModule(id: 2, title: "Kognition & Kommunikation", icon: "brain.head.profile",
              description: "Geistige Fähigkeiten, Gedächtnis und die Fähigkeit zur Kommunikation.",
              weight: 0.15, questions: [
        NBAQuestion(id: "m2_1", text: "Personen aus dem näheren Umfeld erkennen",
                    hint: "Erkennt Familienangehörige, Pflegepersonen etc.",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_2", text: "Örtliche Orientierung",
                    hint: "Weiß, wo sie sich befindet (Wohnung, Haus, Ort)",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_3", text: "Zeitliche Orientierung",
                    hint: "Weiß ungefähr, welcher Tag, Monat oder welches Jahr ist",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_4", text: "Erinnern an wesentliche Ereignisse",
                    hint: "Kann sich an Erlebnisse des eigenen Lebens und aktuelle Ereignisse erinnern",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_5", text: "Steuern mehrschrittiger Alltagshandlungen",
                    hint: "z.B. Kaffee kochen, Körperpflege in der richtigen Reihenfolge durchführen",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_6", text: "Treffen von Entscheidungen im Alltag",
                    hint: "z.B. auswählen, was gegessen oder angezogen wird",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_7", text: "Verstehen von Sachverhalten und Informationen",
                    hint: "Versteht Erklärungen und kann das Gehörte einordnen",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_8", text: "Erkennen von Risiken und Gefahren",
                    hint: "z.B. heiße Herdplatte, Verkehrsgefahr, offene Fenster",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_9", text: "Mitteilen elementarer Bedürfnisse",
                    hint: "Kann Hunger, Schmerz, Kälte o.ä. mitteilen",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_10", text: "Verstehen von Aufforderungen",
                    hint: "Versteht einfache Bitten und Anweisungen",
                    scale: .faehigkeit),
        NBAQuestion(id: "m2_11", text: "Beteiligen an einem Gespräch",
                    hint: "Kann sinnvoll an einem Gespräch teilnehmen und antworten",
                    scale: .faehigkeit),
    ]),

    // ─────────────────────────────────────────────
    // MODUL 3: Verhaltensweisen & psychische Problemlagen  (zusammen mit Modul 2)
    // ─────────────────────────────────────────────
    NBAModule(id: 3, title: "Verhalten & Psyche", icon: "heart.text.square",
              description: "Verhaltensauffälligkeiten und psychische Belastungen in den letzten zwei Wochen.",
              weight: 0.0, questions: [ // Gewichtung wird in Engine gemeinsam mit M2 berechnet
        NBAQuestion(id: "m3_1", text: "Motorische Verhaltensauffälligkeiten",
                    hint: "z.B. Nesteln, zielloses Herumlaufen, Hinlauftendenz",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_2", text: "Nächtliche Unruhe",
                    hint: "Schläft schlecht, steht nachts auf, ist nachts unruhig",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_3", text: "Selbstschädigendes Verhalten",
                    hint: "z.B. Kratzen, Beißen, Schlagen gegen den eigenen Körper",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_4", text: "Beschädigen von Gegenständen",
                    hint: "Wirft Dinge, zerstört Gegenstände",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_5", text: "Körperlich aggressives Verhalten gegenüber anderen",
                    hint: "Schlägt, kratzt oder beißt Pflegepersonen oder andere",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_6", text: "Verbale Aggression",
                    hint: "Beschimpft, droht, beleidigt andere",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_7", text: "Wahnvorstellungen",
                    hint: "z.B. Verfolgungsgedanken, Stimmen hören",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_8", text: "Ängste",
                    hint: "Ausgeprägte Ängste, Panikattacken",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_9", text: "Antriebslosigkeit / depressive Stimmung",
                    hint: "Apathisch, interesselos, zieht sich zurück",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_10", text: "Unangemessenes Verhalten in der Öffentlichkeit",
                    hint: "Sozial unangepasstes Verhalten außerhalb des häuslichen Umfelds",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_11", text: "Schlafstörungen / Umkehr des Schlaf-Wach-Rhythmus",
                    hint: "Schläft tagsüber viel, ist nachts wach",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_12", text: "Abwehr pflegerischer Maßnahmen",
                    hint: "Verweigert oder behindert Waschen, Ankleiden, Medikamentengabe oder andere Pflegemaßnahmen",
                    scale: .haeufigkeit),
        NBAQuestion(id: "m3_13", text: "Sonstige psychische Auffälligkeiten",
                    hint: "z.B. Stimmungsschwankungen, plötzliches Weinen, Suizidgedanken",
                    scale: .haeufigkeit),
    ]),

    // ─────────────────────────────────────────────
    // MODUL 4: Selbstversorgung  (Gewicht 40%)
    // ─────────────────────────────────────────────
    NBAModule(id: 4, title: "Selbstversorgung", icon: "shower.fill",
              description: "Körperpflege, An-/Auskleiden, Essen, Trinken und Toilettennutzung.",
              weight: 0.40, questions: [
        NBAQuestion(id: "m4_1", text: "Waschen des vorderen Oberkörpers",
                    hint: "Gesicht, Hals, Brust, Arme waschen",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_2", text: "Körperpflege im Bereich des Kopfes",
                    hint: "Kämmen, Rasieren, Zähneputzen / Zahnprothese",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_3", text: "Waschen des Intimbereichs",
                    hint: "Intimhygiene selbständig durchführen",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_4", text: "Duschen oder Baden inkl. Haarwaschen",
                    hint: "Gesamter Waschvorgang unter der Dusche oder in der Wanne",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_5", text: "An- und Auskleiden des Oberkörpers",
                    hint: "Hemd, Pullover, BH, Jacke selbst an- und ausziehen",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_6", text: "An- und Auskleiden des Unterkörpers",
                    hint: "Hose, Unterwäsche, Strümpfe, Schuhe",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_7", text: "Mundgerechtes Zubereiten der Nahrung",
                    hint: "Brot schneiden, Speisen zerkleinern, Getränke einschenken",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_8", text: "Essen",
                    hint: "Nahrungsaufnahme mit Löffel, Gabel, Messer",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_9", text: "Trinken",
                    hint: "Flüssigkeit aus Tasse oder Glas zu sich nehmen",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_10", text: "Benutzen einer Toilette oder eines Toilettenstuhls",
                    hint: "Toilette aufsuchen, Kleidung richten, Hygiene",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_11", text: "Umgang mit Harninkontinenz / Dauerkatheter",
                    hint: "Versorgung bei Harninkontinenz, Wechsel von Inkontinenzmaterial",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_12", text: "Umgang mit Stuhlinkontinenz / Stoma",
                    hint: "Versorgung bei Stuhlinkontinenz oder künstlichem Darmausgang",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m4_13", text: "Ernährung über Sonde oder parenteral",
                    hint: "Ernährung über Magensonde (PEG), Nasensonde oder intravenöse Ernährung",
                    scale: .selbstaendigkeit),
    ]),

    // ─────────────────────────────────────────────
    // MODUL 5: Krankheitsbewältigung  (Gewicht 20%)
    // ─────────────────────────────────────────────
    NBAModule(id: 5, title: "Krankheitsbewältigung", icon: "cross.case.fill",
              description: "Medizinische und therapeutische Maßnahmen, die regelmäßig durchgeführt werden müssen.",
              weight: 0.20, questions: [
        NBAQuestion(id: "m5_1", text: "Inhalieren / Absaugen",
                    hint: "z.B. Inhalationsgerät, Absaugung von Atemwegssekreten",
                    scale: .versorgung),
        NBAQuestion(id: "m5_2", text: "Messen von Vitalzeichen",
                    hint: "Blutdruck, Blutzucker, Temperatur, Puls regelmäßig messen",
                    scale: .versorgung),
        NBAQuestion(id: "m5_3", text: "Medikamentengabe",
                    hint: "Tabletten, Tropfen, Pflaster, Injektionen (z.B. Insulin)",
                    scale: .versorgung),
        NBAQuestion(id: "m5_4", text: "Verbandwechsel / Wundversorgung",
                    hint: "Wunden reinigen und verbinden, Stoma versorgen",
                    scale: .versorgung),
        NBAQuestion(id: "m5_5", text: "Schmerzmanagement",
                    hint: "Einnahme von Schmerzmitteln, Schmerzpflaster, Schmerzpumpe",
                    scale: .versorgung),
        NBAQuestion(id: "m5_6", text: "Therapiegeräte bedienen",
                    hint: "z.B. CPAP-Gerät, Dialyse, Infusionen",
                    scale: .versorgung),
        NBAQuestion(id: "m5_7", text: "Arztbesuche und Behördengänge",
                    hint: "Regelmäßige Arzttermine, Facharztkonsultationen selbst organisieren",
                    scale: .versorgung),
        NBAQuestion(id: "m5_8", text: "Umgang mit Hilfsmitteln",
                    hint: "z.B. Prothesen, Orthesen, Rollstuhl selbst anlegen/bedienen",
                    scale: .versorgung),
    ]),

    // ─────────────────────────────────────────────
    // MODUL 6: Alltagsgestaltung & soziale Kontakte  (Gewicht 15%)
    // ─────────────────────────────────────────────
    NBAModule(id: 6, title: "Alltagsgestaltung", icon: "sun.and.horizon",
              description: "Tagesstruktur, Freizeitgestaltung und soziale Teilhabe.",
              weight: 0.15, questions: [
        NBAQuestion(id: "m6_1", text: "Gestalten des Tagesablaufs",
                    hint: "Kann den Tag selbst strukturieren und auf Veränderungen reagieren",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m6_2", text: "Anpassen des Verhaltens an veränderte Situationen",
                    hint: "Reagiert flexibel auf unerwartete Ereignisse im Alltag",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m6_3", text: "Sich beschäftigen und Interessen nachgehen",
                    hint: "z.B. Lesen, Fernsehen, Hobby, Spaziergang",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m6_4", text: "Vornehmen zukunftsbezogener Planungen",
                    hint: "z.B. Einkauf planen, Termin merken, vorausdenken",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m6_5", text: "Interaktion mit Personen im direkten Umfeld",
                    hint: "Gespräche führen, auf andere eingehen, gemeinsame Aktivitäten",
                    scale: .selbstaendigkeit),
        NBAQuestion(id: "m6_6", text: "Kontaktpflege außerhalb des häuslichen Umfelds",
                    hint: "Freunde, Verwandte besuchen oder Vereine, Gruppen aufsuchen",
                    scale: .selbstaendigkeit),
    ]),
]
