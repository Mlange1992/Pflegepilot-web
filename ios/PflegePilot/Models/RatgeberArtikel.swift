import Foundation

struct RatgeberArtikel: Identifiable {
    let id: String
    let titel: String
    let kurztext: String
    let inhalt: String
    let icon: String
    let affiliatePartner: AffiliatePartner?
    let tags: [String]
}

struct RatgeberConfig {
    static let artikel: [RatgeberArtikel] = [

        // MARK: 1 - Entlastungsbetrag
        RatgeberArtikel(
            id: "entlastungsbetrag",
            titel: "Entlastungsbetrag: 131 EUR/Monat die viele verschenken",
            kurztext: "Jeder mit Pflegegrad hat Anspruch — aber viele wissen es nicht.",
            inhalt: """
            ## Was ist der Entlastungsbetrag?

            Der Entlastungsbetrag ist eine monatliche Leistung von 131 EUR, die ALLEN Pflegegraden (1–5) zusteht. Er ist zweckgebunden für:

            - Angebote zur Unterstützung im Alltag (z.B. Betreuungsgruppen)
            - Haushaltsnahe Dienstleistungen (Putzhilfe, Einkaufsservice)
            - Tages- oder Nachtpflege (Aufstockung)
            - Kurzzeitpflege (Aufstockung)

            ## Achtung: Verfall-Frist!

            Nicht genutzte Beträge können ins Folgejahr übertragen werden — aber nur bis zum 30. Juni! Danach verfallen sie. PflegePilot erinnert dich rechtzeitig.

            ## So beantragst du ihn

            Der Entlastungsbetrag muss nicht separat beantragt werden. Er steht dir automatisch zu. Du musst aber Rechnungen bei der Pflegekasse einreichen. Der Anbieter muss durch das Bundesland anerkannt sein.

            ## Häufige Missverständnisse

            Viele glauben, der Betrag verfalle automatisch am Jahresende. Das stimmt nicht — er läuft bis zum 30. Juni des Folgejahres weiter. Nutze PflegePilot um deinen Restbetrag immer im Blick zu behalten.

            ## Tipp

            Wenn du noch keinen anerkannten Anbieter kennst: Dein Pflegestützpunkt hilft dir kostenlos bei der Suche.
            """,
            icon: "eurosign.circle.fill",
            affiliatePartner: nil,
            tags: ["entlastung", "budget", "frist", "131eur"]
        ),

        // MARK: 2 - Verhinderungspflege
        RatgeberArtikel(
            id: "verhinderungspflege",
            titel: "Verhinderungspflege: Wenn die Pflegeperson ausfällt",
            kurztext: "Urlaub, Krankheit, Auszeit — die Pflegekasse zahlt bis zu 6 Wochen.",
            inhalt: """
            ## Wichtige Neuregelung ab 01.07.2025

            Seit dem 1. Juli 2025 gilt das neue Gemeinsame Entlastungsbudget nach § 42a SGB XI. Verhinderungspflege (§ 39) und Kurzzeitpflege (§ 42) wurden in einem gemeinsamen Jahresbudget von 3.539 EUR zusammengeführt. Das Budget kann flexibel für beide Leistungsarten genutzt werden.

            Die folgenden Informationen gelten für Leistungsfälle vor dem 01.07.2025 bzw. als Erklärung der Leistungsart.

            ## Was ist Verhinderungspflege?

            Verhinderungspflege greift, wenn die Pflegeperson (z.B. Ehepartner, Kind) vorübergehend ausfällt — wegen Urlaub, Krankheit oder einer anderen Verhinderung.

            Die Pflegekasse übernimmt die Kosten für eine Ersatzpflegeperson bis zu 1.612 EUR im Jahr, für maximal 6 Wochen.

            ## Wer hat Anspruch?

            Pflegebedürftige ab Pflegegrad 2, wenn sie mindestens 6 Monate zu Hause gepflegt wurden.

            ## Was kann genutzt werden?

            - Professioneller Pflegedienst
            - Nachbarn, Bekannte (nicht nahe Verwandte ersten Grades)
            - Pflegehilfen (z.B. über Agenturen)

            ## Das gemeinsame Budget

            Seit 2015 können nicht verbrauchte Mittel aus der Kurzzeitpflege (bis zu 806 EUR = 50% von 1.612 EUR) auf die Verhinderungspflege übertragen werden. Damit erhöht sich dein verfügbares Budget auf maximal 2.418 EUR.

            Umgekehrt gilt das auch: Nicht verbrauchte Verhinderungspflege kann auf die Kurzzeitpflege übertragen werden.

            ## Wie beantragst du es?

            Einfach bei der Pflegekasse anrufen und mitteilen, dass du Verhinderungspflege in Anspruch nehmen möchtest. Du bekommst ein Formular — oder PflegePilot erstellt dir einen Antrag als PDF.
            """,
            icon: "person.2.fill",
            affiliatePartner: nil,
            tags: ["verhinderungspflege", "urlaub", "budget", "1612eur"]
        ),

        // MARK: 3 - Kurzzeitpflege
        RatgeberArtikel(
            id: "kurzzeitpflege",
            titel: "Kurzzeitpflege: Vorübergehend ins Pflegeheim",
            kurztext: "Wenn häusliche Pflege nicht mehr geht — vorübergehend ins Pflegeheim.",
            inhalt: """
            ## Wichtige Neuregelung ab 01.07.2025

            Seit dem 1. Juli 2025 gilt das neue Gemeinsame Entlastungsbudget nach § 42a SGB XI. Kurzzeitpflege (§ 42) und Verhinderungspflege (§ 39) wurden in einem gemeinsamen Jahresbudget von 3.539 EUR zusammengeführt. Das Budget kann flexibel für beide Leistungsarten genutzt werden.

            ## Was ist Kurzzeitpflege?

            Kurzzeitpflege ermöglicht eine vorübergehende vollstationäre Unterbringung im Pflegeheim — z.B. nach einem Krankenhausaufenthalt, bei Überlastung der Pflegeperson oder in Urlaub/Krankheitszeit.

            Die Pflegekasse übernimmt bis zu 1.774 EUR pro Kalenderjahr aus dem gemeinsamen Budget, für maximal 8 Wochen.

            ## Wer hat Anspruch?

            Alle Pflegebedürftigen ab Pflegegrad 2.

            ## Das kombinierte Budget mit Verhinderungspflege

            Nicht genutzte Mittel aus der Verhinderungspflege (bis zu 806 EUR) können auf die Kurzzeitpflege übertragen werden. So entsteht ein maximales Budget von bis zu 3.386 EUR für Kurzzeitpflege.

            Das "gemeinsame Jahresbudget" von 3.539 EUR (1.774 + 1.765 angepasst) ermöglicht eine flexible Nutzung.

            ## Tipp zur Beantragung

            Plane frühzeitig — gute Kurzzeitpflegeplätze sind oft ausgebucht. Pflegestützpunkte helfen bei der Suche kostenlos weiter.

            ## Was wird nicht bezahlt?

            Die Pflegekasse zahlt nur den pflegebedingten Aufwand, nicht Unterkunft und Verpflegung. Diese Kosten trägst du selbst (ca. 25–50 EUR/Tag je nach Einrichtung).
            """,
            icon: "building.2.fill",
            affiliatePartner: nil,
            tags: ["kurzzeitpflege", "stationär", "budget", "1774eur"]
        ),

        // MARK: 4 - Gemeinsames Entlastungsbudget §42a
        RatgeberArtikel(
            id: "jahresbudget",
            titel: "3.539 EUR Jahresbudget: Das neue Entlastungsbudget ab Juli 2025",
            kurztext: "Seit 01.07.2025: VHP und KZP in einem gemeinsamen Topf — mehr Flexibilität.",
            inhalt: """
            ## Das neue Gemeinsame Entlastungsbudget (§ 42a SGB XI)

            Seit dem 1. Juli 2025 gibt es das Gemeinsame Entlastungsbudget nach § 42a SGB XI. Verhinderungspflege (§ 39) und Kurzzeitpflege (§ 42) wurden zu einem einheitlichen Jahresbudget zusammengeführt:

            3.539 EUR pro Kalenderjahr — frei aufgeteilt auf Verhinderungs- und Kurzzeitpflege.

            ## So funktioniert das neue Budget

            Statt zwei getrennten Töpfen gibt es einen gemeinsamen Betrag:
            - Maximal 3.539 EUR pro Jahr insgesamt
            - Frei verwendbar für Verhinderungspflege UND/ODER Kurzzeitpflege
            - Kein festes Kontingent mehr für VHP oder KZP einzeln

            Damit erhöht sich das tatsächlich verfügbare Budget gegenüber dem alten System (max. 3.386 EUR mit Übertragungsregeln) leicht.

            ## Beispiel

            Du nutzt 2.000 EUR für Verhinderungspflege (Pflegevertretung im Urlaub) und 1.000 EUR für Kurzzeitpflege nach dem Krankenhausaufenthalt. Gesamtverbrauch: 3.000 EUR. Noch verfügbar: 539 EUR.

            ## Das alte System (vor 01.07.2025) — nur zur Information

            Vor der Reform gab es zwei getrennte Töpfe:
            - Verhinderungspflege: 1.612 EUR/Jahr
            - Kurzzeitpflege: 1.774 EUR/Jahr
            - Kombiniert (mit Übertragungsregeln): maximal 3.386 EUR gesamt

            ## Wichtig: Verfällt am 31.12.!

            Das Jahresbudget verfällt am 31. Dezember — anders als der Entlastungsbetrag gibt es keine Übertragung ins Folgejahr. PflegePilot zeigt dir den Restbetrag und warnt rechtzeitig.
            """,
            icon: "arrow.left.arrow.right",
            affiliatePartner: nil,
            tags: ["budget", "jahresbudget", "vhp", "kzp", "kombination", "42a"]
        ),

        // MARK: 5 - Pflegehilfsmittel
        RatgeberArtikel(
            id: "pflegehilfsmittel",
            titel: "Pflegehilfsmittel: 42 EUR/Monat — kaum jemand nutzt sie",
            kurztext: "Handschuhe, Desinfektionsmittel, Bettschutz — alles auf Kosten der Pflegekasse.",
            inhalt: """
            ## Was sind Pflegehilfsmittel?

            Pflegehilfsmittel nach § 40 SGB XI sind zum Verbrauch bestimmte Produkte, die die häusliche Pflege erleichtern. Die Pflegekasse erstattet bis zu 42 EUR pro Monat (ab 2024, vorher 40 EUR).

            ## Was ist abgedeckt?

            - Einmalhandschuhe
            - Desinfektionsmittel (Hände und Flächen)
            - Bettschutzeinlagen (wiederverwendbar)
            - Fingerlinge
            - Mundschutz

            ## Wie beantragst du es?

            Es gibt spezielle Anbieter (z.B. Pflegehilfsmittel-Boxen), die die Abrechnung direkt mit der Pflegekasse übernehmen. Du bekommst die Produkte kostenlos nach Hause geliefert.

            Einfach online beantragen, Pflegekasse angeben — fertig!

            ## Achtung: Zeitlich begrenzt

            Das Budget verfällt nicht, wächst aber auch nicht an. Du erhältst monatlich 42 EUR. Nicht genutzte Monate "ansparen" geht nicht.

            ## Tipp

            Nutze die Pflegebox-Anbieter — die rechnen direkt mit der Pflegekasse ab. Kein Formular, keine Vorleistung.
            """,
            icon: "cross.case.fill",
            affiliatePartner: AffiliateConfig.pflegehilfsmittel,
            tags: ["pflegehilfsmittel", "hilfsmittel", "42eur", "monatlich"]
        ),

        // MARK: 6 - Pflegegrad beantragen
        RatgeberArtikel(
            id: "pflegegrad-beantragen",
            titel: "Pflegegrad beantragen: Schritt für Schritt",
            kurztext: "Wer wann wie einen Antrag stellt — einfach erklärt.",
            inhalt: """
            ## Wer kann einen Pflegegrad beantragen?

            Jede Person, die aufgrund körperlicher, geistiger oder psychischer Erkrankungen bei Alltagsaktivitäten dauerhaft (mindestens 6 Monate) Hilfe benötigt.

            ## Schritt 1: Antrag stellen

            Ruf einfach bei deiner Pflegekasse an und sage: "Ich möchte einen Antrag auf Pflegegrad stellen." Das ist alles. Ab diesem Tag gilt dein Antragsdatum — auch wenn die Begutachtung erst später stattfindet.

            PflegePilot erstellt dir einen Muster-Erstantrag als PDF.

            ## Schritt 2: Vorbereitung auf den MD-Termin

            Die Pflegekasse beauftragt den Medizinischen Dienst (MD). Ein Gutachter kommt zu dir nach Hause.

            Nutze PflegePilots NBA-Selbsttest und Checkliste zur Vorbereitung.

            ## Schritt 3: Begutachtung

            Der Gutachter bewertet 6 Lebensbereiche (Module). Wichtig: Zeige den schlechten Tag! Viele stellen sich besser dar als sie sind — und bekommen dann zu wenig Pflegegrad.

            ## Schritt 4: Bescheid abwarten

            Innerhalb von 25 Arbeitstagen erhältst du den Bescheid. Bist du nicht einverstanden, kannst du Widerspruch einlegen.

            ## Wichtig: Antragsdatum zählt!

            Alle Leistungen werden ab dem Antragsdatum rückwirkend gezahlt — nicht erst ab dem Bescheid.
            """,
            icon: "doc.badge.plus",
            affiliatePartner: nil,
            tags: ["pflegegrad", "antrag", "erstantrag", "beantragen"]
        ),

        // MARK: 7 - MD-Begutachtung Fehler
        RatgeberArtikel(
            id: "md-begutachtung-fehler",
            titel: "MD-Begutachtung: Die 10 häufigsten Fehler",
            kurztext: "Diese Fehler kosten Pflegegrad-Punkte — und damit bares Geld.",
            inhalt: """
            ## Fehler 1: Den besten Tag zeigen

            Der häufigste Fehler überhaupt. Der Gutachter kommt, und plötzlich geht alles. "Ich will mich nicht beklagen." — Aber genau das kostet Punkte.

            ## Fehler 2: "Geht schon" sagen

            Auf die Frage "Schaffen Sie das alleine?" mit "Geht schon" zu antworten, bedeutet für den Gutachter: selbständig. Besser: "Mit Mühe und Schmerzen."

            ## Fehler 3: Kein Pflegetagebuch

            Ohne Dokumentation ist es schwer zu beweisen, wie oft und wie viel Hilfe nötig ist. Führe 2 Wochen vorher ein Tagebuch.

            ## Fehler 4: Pflegeperson ist nicht dabei

            Die Pflegeperson weiß oft mehr über den Alltag als die pflegebedürftige Person selbst. Immer dabei sein!

            ## Fehler 5: Ab der Haustür beginnt die Begutachtung

            Der Gutachter beobachtet schon den Weg zur Tür und wie die Person auf dem Sofa sitzt.

            ## Fehler 6: Hilfsmittel nicht vorzeigen

            Rollator, Rollstuhl, Toilettenstuhl — alles zeigen! Auch wenn es gerade "nicht nötig" scheint.

            ## Fehler 7: Medikamente nicht aufgelistet

            Eine aktuelle Medikamentenliste ist Pflicht. Fehlt sie, wirkt die Situation weniger komplex.

            ## Fehler 8: Schlechte Tage nicht erwähnen

            An guten Tagen alles kein Problem, an schlechten gar nichts? Sage das! Variabilität gehört ins Bild.

            ## Fehler 9: Widerspruch vergessen

            Zu niedriger Pflegegrad? Innerhalb von einem Monat Widerspruch einlegen — kostenlos und fast immer erfolgreich.

            ## Fehler 10: Selbsteinschätzung zu optimistisch

            Nutz den PflegePilot-Selbsttest VORHER — und vergleiche danach mit dem MD-Ergebnis.
            """,
            icon: "exclamationmark.triangle.fill",
            affiliatePartner: nil,
            tags: ["md", "begutachtung", "fehler", "tipps", "gutachter"]
        ),

        // MARK: 8 - Widerspruch
        RatgeberArtikel(
            id: "widerspruch",
            titel: "Widerspruch gegen Pflegegrad: So geht es",
            kurztext: "Zu niedrig eingestuft? In vielen Fällen lohnt sich der Widerspruch.",
            inhalt: """
            ## Wann lohnt sich ein Widerspruch?

            Wenn der zugestellte Pflegegrad niedriger ist als erwartet, hast du das Recht auf Widerspruch. Laut Statistik werden über 30% aller Widersprüche zugunsten der Antragsteller entschieden.

            ## Frist: 1 Monat!

            Du hast genau einen Monat nach Zustellung des Bescheids Zeit, Widerspruch einzulegen. Danach wird der Bescheid bestandskräftig.

            ## Schritt 1: Gutachten anfordern

            Verlange das MD-Gutachten. Du hast ein Recht darauf. Prüfe, welche Module wie bewertet wurden.

            ## Schritt 2: Begründung schreiben

            Erkläre konkret, warum du die Bewertung für falsch hältst. Neue Arztberichte, Krankenhausberichte oder ein eigenes Pflegetagebuch helfen.

            ## Schritt 3: Widerspruch einreichen

            Der Widerspruch muss schriftlich und begründet an die Pflegekasse. PflegePilot erstellt dir einen Muster-Widerspruch als PDF.

            ## Wenn der Widerspruch abgelehnt wird

            Du kannst beim Sozialgericht Klage einreichen — kostenlos und ohne Anwalt. In vielen Fällen lohnt es sich.

            ## Tipp

            Pflegestützpunkte helfen bei Widerspruch kostenlos. VdK und Sozialverbände bieten ebenfalls kostenlose Beratung.
            """,
            icon: "arrow.uturn.backward.circle.fill",
            affiliatePartner: nil,
            tags: ["widerspruch", "bescheid", "pflegegrad", "klage"]
        ),

        // MARK: 9 - Pflegegeld + Sachleistungen kombinieren
        RatgeberArtikel(
            id: "pflegegeld-kombination",
            titel: "Pflegegeld und Sachleistungen kombinieren",
            kurztext: "§ 38 SGB XI erlaubt beides — für mehr Flexibilität.",
            inhalt: """
            ## Was ist Pflegegeld?

            Pflegegeld (§ 37 SGB XI) ist eine monatliche Zahlung an die pflegebedürftige Person. Das Geld kann frei eingesetzt werden — z.B. als "Dankeschön" für pflegende Angehörige.

            Beträge je Pflegegrad (Stand 2025):
            - PG 2: 347 EUR/Monat
            - PG 3: 599 EUR/Monat
            - PG 4: 799 EUR/Monat
            - PG 5: 990 EUR/Monat

            ## Was sind Sachleistungen?

            Sachleistungen (§ 36 SGB XI) sind Pflegedienstleistungen, die direkt mit der Pflegekasse abgerechnet werden. Ein ambulanter Pflegedienst erbringt die Leistungen.

            ## Kombinationsleistung (§ 38 SGB XI)

            Das Beste aus beiden Welten: Wenn du nicht den vollen Sachleistungsbetrag nutzt, erhältst du anteilig Pflegegeld.

            Beispiel PG 3: Sachleistungsbetrag 1.496 EUR. Du nutzt 748 EUR (50%) durch den Pflegedienst. → Du erhältst zusätzlich 50% des Pflegegelds = 300 EUR.

            ## Wann macht das Sinn?

            Wenn du sowohl auf Familienunterstützung als auch professionellen Pflegedienst setzt. Die Kombination ist für die meisten Familien die beste Lösung.
            """,
            icon: "arrow.triangle.2.circlepath",
            affiliatePartner: nil,
            tags: ["pflegegeld", "sachleistungen", "kombination", "pflegedienst"]
        ),

        // MARK: 10 - Hausnotruf
        RatgeberArtikel(
            id: "hausnotruf",
            titel: "Hausnotruf: Kostenlos über die Pflegekasse",
            kurztext: "25 EUR/Monat zahlt die Pflegekasse — Sicherheit rund um die Uhr.",
            inhalt: """
            ## Was ist ein Hausnotruf?

            Ein Hausnotruf ist ein Gerät (meist ein Knopf am Handgelenk oder als Halskette), mit dem man im Notfall sofort eine Zentrale erreicht. Diese schickt Hilfe oder ruft Angehörige an.

            ## Wer zahlt?

            Die Pflegekasse übernimmt die Kosten für Hausnotruf nach § 40 SGB XI als Pflegehilfsmittel. Das umfasst Miete, Anschluss und Wartung — typisch ca. 25–30 EUR/Monat.

            Voraussetzung: Pflegegrad 1–5, häusliche Pflege.

            ## Wie beantragen?

            Direkt bei der Pflegekasse beantragen — eine ärztliche Verordnung ist für den Hausnotruf nicht erforderlich. Die Pflegekasse genehmigt auf Antrag. Viele Anbieter unterstützen beim Antrag kostenlos.

            ## Welche Anbieter gibt es?

            - ASB, DRK, Malteser, Johanniter (oft über regionale Büros)
            - Telekom, Vitakt, MEIN ALARMKNOPF
            - Preise und Reaktionszeiten vergleichen!

            ## Tipp

            Auch wer noch keinen Pflegegrad hat, kann einen Hausnotruf auf eigene Kosten nutzen — und nach Pflegegrad-Feststellung rückwirkend erstattet bekommen.
            """,
            icon: "phone.badge.checkmark",
            affiliatePartner: AffiliateConfig.hausnotruf,
            tags: ["hausnotruf", "notfall", "hilfsmittel", "pflegekasse"]
        ),

        // MARK: 11 - Wohnraumanpassung
        RatgeberArtikel(
            id: "wohnraumanpassung",
            titel: "Wohnraumanpassung: Bis 4.180 EUR Zuschuss",
            kurztext: "Treppenlift, bodengleiche Dusche, Handläufe — die Pflegekasse bezahlt.",
            inhalt: """
            ## Was ist Wohnraumanpassung?

            Maßnahmen zur Wohnraumanpassung nach § 40 Abs. 4 SGB XI verbessern das Wohnumfeld so, dass Pflege zu Hause möglich oder leichter wird. Die Pflegekasse zahlt bis zu 4.180 EUR pro Maßnahme (Stand 2025/2026).

            ## Was wird gefördert?

            - Bodengleiche Dusche (barrierefreie Duschkabine)
            - Haltegriffe an Wand und WC
            - Treppenlift oder Plattformhublift
            - Türverbreiterung für Rollstuhl
            - Rampen statt Stufen
            - Pflegebett mit Bettgitter

            ## Mehrfachförderung möglich

            Wenn mehrere Personen in einem Haushalt pflegebedürftig sind, kann jede Person bis zu 4.180 EUR erhalten. Maximum 16.720 EUR pro Haushalt.

            ## Wie beantragen?

            Vor dem Umbau bei der Pflegekasse beantragen! Im Nachhinein gibt es keinen Zuschuss. Hole drei Angebote ein und reiche sie mit dem Antrag ein.

            ## Zusätzliche Förderung

            KfW-Kredite (Programm 159) bieten zinsgünstige Darlehen für barrierefreies Wohnen. Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA) fördert ebenfalls.
            """,
            icon: "house.badge.shield.fill",
            affiliatePartner: AffiliateConfig.treppenlift,
            tags: ["wohnraumanpassung", "treppenlift", "barrierefrei", "4000eur"]
        ),

        // MARK: 12 - DiPA
        RatgeberArtikel(
            id: "dipa",
            titel: "DiPA-Budget 2024+: Digitale Pflegeanwendungen",
            kurztext: "Neue Leistung kaum bekannt — bis zu 50 EUR/Monat für Pflege-Apps.",
            inhalt: """
            ## Was sind DiPAs?

            Digitale Pflegeanwendungen (DiPAs) sind Apps oder Softwareanwendungen, die vom Bundesinstitut für Arzneimittel und Medizinprodukte (BfArM) zugelassen wurden. Sie unterstützen bei der Pflege zu Hause.

            ## Wer kann DiPAs nutzen?

            Pflegebedürftige ab Pflegegrad 1 sowie deren pflegende Angehörige.

            ## Was bezahlt die Pflegekasse?

            Die Pflegekasse erstattet die Kosten für zugelassene DiPAs nach § 40a SGB XI — derzeit bis zu ca. 50 EUR/Monat je nach Anwendung. Wichtig: DiPAs haben ein eigenes Budget, das NICHT aus dem Entlastungsbetrag (§ 45b) stammt. Beides kann parallel genutzt werden.

            ## Welche DiPAs gibt es?

            Das BfArM führt ein öffentliches Verzeichnis aller zugelassenen DiPAs unter bfarm.de/dipa. Aktuell sind es noch wenige, aber die Liste wächst. Typische Bereiche:
            - Gedächtnistraining für Demenzkranke
            - Sturzprävention und Balance-Training
            - Kommunikationsunterstützung

            ## Wie beantragen?

            Der Arzt oder Pflegedienst stellt eine Verordnung aus. Diese wird bei der Pflegekasse eingereicht. Der DiPA-Anbieter begleitet den Prozess meist kostenlos.

            ## Tipp

            PflegePilot informiert dich über neue zugelassene DiPAs, sobald sie verfügbar sind.
            """,
            icon: "iphone.and.arrow.left.and.right",
            affiliatePartner: nil,
            tags: ["dipa", "digital", "app", "modern", "2024"]
        ),

        // MARK: 13 - Beratungsbesuche
        RatgeberArtikel(
            id: "beratungsbesuche",
            titel: "Beratungsbesuche: Pflichttermine nicht vergessen!",
            kurztext: "Bei Pflegegrad 2–5 gibt es Fristen — Versäumen kostet das Pflegegeld!",
            inhalt: """
            ## Was sind Beratungsbesuche?

            Wer Pflegegeld erhält, muss regelmäßig Beratungsbesuche durch einen zugelassenen Pflegedienst nachweisen (§ 37 Abs. 3 SGB XI). Diese Besuche dienen der Qualitätssicherung.

            ## Wie oft?

            - Pflegegrad 2 + 3: Alle 6 Monate (2× pro Jahr)
            - Pflegegrad 4 + 5: Alle 3 Monate (4× pro Jahr)

            ## Was passiert wenn man vergisst?

            Die Pflegekasse kann das Pflegegeld kürzen oder sogar streichen, wenn der Nachweis fehlt!

            ## Wie wird der Besuch durchgeführt?

            Ein zugelassener Pflegedienst kommt nach Hause, schaut sich die Pflegesituation an und erstellt einen kurzen Bericht für die Pflegekasse. Das dauert ca. 20–30 Minuten.

            Kosten: Die Pflegekasse übernimmt die Kosten direkt.

            ## PflegePilot erinnert dich!

            In PflegePilot kannst du die nächste Frist eintragen. Push-Benachrichtigungen erinnern dich rechtzeitig — damit du kein Pflegegeld verlierst.
            """,
            icon: "calendar.badge.clock",
            affiliatePartner: nil,
            tags: ["beratungsbesuch", "pflegegeld", "frist", "pflicht"]
        ),

        // MARK: 14 - Steuer
        RatgeberArtikel(
            id: "steuer",
            titel: "Pflege von der Steuer absetzen",
            kurztext: "Außergewöhnliche Belastungen, Steuerbonus — was wirklich geht.",
            inhalt: """
            ## Pflegekosten als außergewöhnliche Belastungen

            Pflegekosten können in der Steuererklärung als außergewöhnliche Belastungen (§ 33 EStG) geltend gemacht werden — aber erst wenn sie eine zumutbare Eigenbelastung übersteigen. Diese hängt vom Einkommen ab.

            Typisch absetzbar:
            - Heimunterbringung (stationäre Pflege)
            - Ambulante Pflegekosten, die nicht von der Pflegekasse übernommen werden
            - Pflegehilfsmittel (Eigenanteil)

            ## Haushaltsnahe Dienstleistungen (§ 35a EStG)

            Für ambulante Pflegedienste und haushaltsnahe Dienstleistungen gibt es einen direkten Steuerbonus von 20% der Kosten, maximal 4.000 EUR pro Jahr — unabhängig von der zumutbaren Belastung!

            Das lohnt sich fast immer.

            ## Pauschbetrag für pflegende Angehörige

            Wer jemanden unentgeltlich pflegt (mindestens Pflegegrad 2), kann den Pflegepauschbetrag abziehen:
            - Pflegegrad 2: 600 EUR/Jahr
            - Pflegegrad 3: 1.100 EUR/Jahr
            - Pflegegrad 4 + 5 oder hilflos: 1.800 EUR/Jahr

            ## Tipp

            Beauftrage einen Steuerberater mit Erfahrung im Pflegesteuerrecht — die sparen oft mehr als sie kosten.
            """,
            icon: "eurosign.circle",
            affiliatePartner: nil,
            tags: ["steuer", "steuererklärung", "absetzen", "kosten"]
        ),

        // MARK: 15 - Pflegekurse
        RatgeberArtikel(
            id: "pflegekurse",
            titel: "Pflegekurse: Kostenlos für pflegende Angehörige",
            kurztext: "Die Pflegekasse zahlt — online und vor Ort, bequem und kostenlos.",
            inhalt: """
            ## Warum Pflegekurse?

            Pflege zu Hause ist körperlich und seelisch anspruchsvoll. Pflegekurse vermitteln praktische Techniken, die die Pflege erleichtern und Verletzungen vermeiden.

            ## Was bezahlt die Pflegekasse?

            Pflegekurse für Angehörige und Ehrenamtliche sind nach § 45 SGB XI kostenlos. Die Pflegekasse trägt alle Kosten.

            ## Was wird angeboten?

            - Pflegetechniken (Umbetten, Waschen, Lagewechsel)
            - Demenz und Umgang mit Verhaltensauffälligkeiten
            - Entlastung der Pflegeperson (Selbstfürsorge)
            - Erste Hilfe und Notfallmanagement
            - Online-Kurse (besonders beliebt seit COVID)

            ## Wo finde ich Kurse?

            - Pflegekasse direkt anfragen
            - VdK, AWO, Caritas, Diakonie
            - Online-Anbieter wie "Töchter & Söhne" (kostenlos, digital)
            - Pflegestützpunkte in deiner Gemeinde

            ## Für wen?

            Nicht nur für Pflegegrad-Inhaber! Auch wenn du erst pflegend tätig wirst und noch keinen Pflegegrad hast, können die Kurse kostenlos sein.

            ## Zertifikat

            Viele Kurse bieten ein Zertifikat — nützlich für den Antrag auf Pflegegeld oder Verhinderungspflege.
            """,
            icon: "graduationcap.fill",
            affiliatePartner: AffiliateConfig.pflegekurse,
            tags: ["pflegekurs", "angehörige", "kostenlos", "schulung"]
        ),

        // MARK: 16 - Tagespflege
        RatgeberArtikel(
            id: "tagespflege",
            titel: "Tagespflege: Tagsüber versorgt, abends zu Hause",
            kurztext: "§ 41 SGB XI — eigenes Budget zusätzlich zu den Sachleistungen.",
            inhalt: """
            ## Was ist Tagespflege?

            Tagespflege (§ 41 SGB XI) bedeutet: Die pflegebedürftige Person verbringt den Tag in einer Pflegeeinrichtung und kommt abends wieder nach Hause. Typischerweise Mo–Fr, mit Fahrdienst, Mahlzeiten und Betreuungsprogramm.

            ## Wer hat Anspruch?

            Alle Pflegebedürftigen ab Pflegegrad 2. Das Budget steht neben dem Sachleistungsbudget (§ 36) und kann zusätzlich genutzt werden!

            ## Was zahlt die Pflegekasse?

            Das Tagespflegebudget (§ 41 SGB XI) entspricht dem ambulanten Sachleistungsbetrag (§ 36) — NICHT den Beträgen der vollstationären Pflege:
            - PG 2: bis 795 EUR/Monat
            - PG 3: bis 1.496 EUR/Monat
            - PG 4: bis 1.858 EUR/Monat
            - PG 5: bis 2.299 EUR/Monat
            (Stand 2025; Quelle: § 41 Abs. 2 SGB XI)

            ## Wichtig: Doppeltes Budget möglich!

            Das Tagespflegebudget wird ZUSÄTZLICH zum Sachleistungsbudget gewährt — du kannst also beide Töpfe voll ausschöpfen. Das verdoppelt effektiv das verfügbare ambulante Pflegebudget (gilt seit dem PSG II, ab 01.01.2017).

            Nicht genutztes Sachleistungs- oder Tagespflegebudget kann außerdem auf das Gemeinsame Entlastungsbudget (§ 42a) angerechnet werden.

            ## Was kostet der Eigenanteil?

            Neben dem Pflegekassenanteil bleiben Kosten für Unterkunft und Verpflegung (ca. 15–25 EUR/Tag). Diese können teilweise über den Entlastungsbetrag gedeckt werden.

            ## So findest du einen Platz

            Tagespflegeplätze sind gefragt — frühzeitig anmelden! Pflegestützpunkte und das lokale Sozialamt helfen bei der Suche.
            """,
            icon: "sun.max.fill",
            affiliatePartner: nil,
            tags: ["tagespflege", "budget", "doppelbudget", "tagesbetreuung"]
        ),

        // MARK: 17 - Pflegezusatzversicherung
        RatgeberArtikel(
            id: "pflegezusatzversicherung",
            titel: "Pflegezusatzversicherung: Warum jetzt?",
            kurztext: "Die Pflegekasse deckt nur einen Bruchteil ab — private Vorsorge schließt die Lücke.",
            inhalt: """
            ## Die Pflegelücke ist real

            Die gesetzliche Pflegeversicherung ist eine Teilkaskoversicherung — sie zahlt Fixbeträge, deckt aber nicht alle Kosten. Im Pflegeheim bleibt nach Pflegekassen-Leistung ein monatlicher Eigenanteil von durchschnittlich 2.000–3.000 EUR übrig (Stand 2025).

            Wer keine Rücklagen hat, muss Sozialhilfe beantragen oder Kinder werden herangezogen.

            ## Was ist eine Pflegezusatzversicherung?

            Eine private Pflegezusatzversicherung zahlt eine zusätzliche Rente im Pflegefall — unabhängig von den gesetzlichen Leistungen. Es gibt drei Hauptarten:

            - Pflegetagegeld: Täglicher Betrag je nach Pflegegrad (sehr flexibel)
            - Pflegekostenversicherung: Erstattung tatsächlicher Pflegekosten bis zu einem Limit
            - Pflegetagegeld-Kombiprodukte: Mischform aus beidem

            ## Staatliche Förderung ("Pflege-Bahr")

            Der Staat fördert bestimmte Pflegetagegeld-Verträge mit 60 EUR/Jahr Zuschuss (Pflege-Bahr nach § 126 SGB XI). Voraussetzung: mind. 10 EUR/Monat Eigenanteil, kein Gesundheitsvorbehalt.

            ## Wann einsteigen?

            Je früher, desto günstiger. Ein 40-jähriger zahlt ca. 20–40 EUR/Monat für sinnvollen Schutz. Wer bereits pflegebedürftig ist, wird meist nicht mehr angenommen oder zahlt hohe Aufschläge.

            ## Worauf achten?

            - Wie lange besteht die Wartezeit?
            - Ist Pflegegrad 1 mitversichert?
            - Wie hoch ist das Tagegeld bei Pflegegrad 4/5?
            - Gibt es eine Dynamisierung (Inflationsanpassung)?

            ## Tipp: Auch für pflegende Angehörige

            Wer selbst jemanden pflegt und deshalb weniger arbeitet, baut weniger Rente auf. Eine Berufsunfähigkeits- oder Pflegeversicherung auf die eigene Person schützt auch die pflegende Generation.
            """,
            icon: "shield.checkered",
            affiliatePartner: AffiliateConfig.versicherung,
            tags: ["pflegezusatzversicherung", "vorsorge", "pflegelücke", "privatversicherung"]
        ),

        // MARK: 18 - Rentenversicherung pflegende Angehörige
        RatgeberArtikel(
            id: "rentenversicherung-angehoerige",
            titel: "Rente für pflegende Angehörige: Die Pflegekasse zahlt!",
            kurztext: "Wer zuhause pflegt, bekommt Rentenpunkte — automatisch, kostenlos.",
            inhalt: """
            ## Ein oft übersehener Vorteil

            Wer eine pflegebedürftige Person zu Hause pflegt, erhält Rentenversicherungsbeiträge von der Pflegekasse — ohne eigene Kosten (§ 44 SGB XI).

            ## Voraussetzungen

            - Die pflegende Person pflegt nicht erwerbsmäßig (kein bezahlter Pflegedienst)
            - Die pflegebedürftige Person hat mindestens Pflegegrad 2
            - Der Pflegeaufwand beträgt mindestens 10 Stunden pro Woche, verteilt auf mindestens 2 Tage
            - Die pflegende Person ist nicht mehr als 30 Stunden/Woche erwerbstätig

            ## Wie viele Rentenpunkte gibt es?

            Die Pflegekasse zahlt Beiträge zur gesetzlichen Rentenversicherung. Die Höhe hängt vom Pflegegrad ab:
            - PG 2: ca. 160 EUR/Monat Beitrag (≈ 0,33 Rentenpunkte/Jahr)
            - PG 3: ca. 271 EUR/Monat Beitrag
            - PG 4: ca. 374 EUR/Monat Beitrag
            - PG 5: ca. 442 EUR/Monat Beitrag

            Über 10 Jahre Pflege summiert sich das auf deutlich spürbare Rentenansprüche.

            ## Wie beantragen?

            Die Pflegekasse der pflegebedürftigen Person stellt auf Antrag ein Formular aus. Der Nachweis wird beim Rentenversicherungsträger eingereicht. Es reicht ein einmaliger Antrag — die Beiträge laufen dann automatisch.

            ## Tipp: Pflegegeldempfänger

            Wer Pflegegeld erhält und selbst pflegt, hat automatisch Anspruch auf Rentenleistungen. Die Meldung erfolgt durch die Pflegekasse.

            ## Was ist mit der Arbeitslosenversicherung?

            Seit 2017 können pflegende Angehörige auch Ansprüche auf Arbeitslosenversicherungsschutz erwerben — wenn sie ihre Arbeit wegen der Pflege aufgegeben haben. Beim Arbeitsamt nachfragen!
            """,
            icon: "person.crop.circle.badge.checkmark",
            affiliatePartner: nil,
            tags: ["rente", "angehörige", "pflegekasse", "rentenversicherung", "beiträge"]
        ),

        // MARK: 19 - Pflegegrad erhöhen
        RatgeberArtikel(
            id: "hoeherinstufung",
            titel: "Pflegegrad erhöhen: Wann und wie du neu beantragst",
            kurztext: "Wenn der Zustand schlechter wird, steht dir mehr zu — nutze es.",
            inhalt: """
            ## Wann kommt eine Höherstufung in Frage?

            Ein Pflegegrad ist keine lebenslange Feststellung. Wenn sich der Gesundheitszustand deutlich verschlechtert, kann und sollte ein neuer Antrag auf Höherstufung gestellt werden.

            Typische Auslöser:
            - Fortgeschrittene Demenz oder kognitive Einschränkungen
            - Neue Diagnosen (z.B. Schlaganfall, schwere Herzinsuffizienz)
            - Deutlich gestiegener Pflegeaufwand im Alltag
            - Häufige Krankenhausaufenthalte

            ## Schritt 1: Jetzt sofort anrufen

            Ruf die Pflegekasse an und sage: "Ich möchte einen Antrag auf Höherstufung stellen." Das Antragsdatum zählt — auch wenn die Begutachtung erst Wochen später stattfindet.

            ## Schritt 2: Pflegetagebuch führen

            Dokumentiere 2–3 Wochen lang täglich, welche Hilfe nötig ist:
            - Morgenroutine (Aufstehen, Waschen, Anziehen)
            - Mahlzeiten (Hilfe nötig? Wie viel?)
            - Medikamente (Wer gibt sie?)
            - Mobilität (Gehhilfe, Rollstuhl?)
            - Nächte (Aufstehen nötig? Wie oft?)

            ## Schritt 3: Arztberichte sammeln

            Aktuelle Atteste, Krankenhausentlassungsberichte und Facharztbriefe belegen die Verschlechterung objektiv.

            ## Was passiert bei der Begutachtung?

            Das NBA-Verfahren (Neues Begutachtungsassessment) bewertet 6 Module:
            1. Mobilität
            2. Kognitive und kommunikative Fähigkeiten
            3. Verhaltensauffälligkeiten
            4. Selbstversorgung
            5. Umgang mit krankheitsbedingten Anforderungen
            6. Gestaltung des Alltagslebens

            Je mehr Einschränkungen in mehr Modulen, desto höher der Pflegegrad.

            ## Tipp: Schlechten Tag zeigen!

            Zeige dem Gutachter die eingeschränkten Tage — nicht den besten Tag. Pflegeperson sollte immer dabei sein.

            ## Was wenn abgelehnt?

            Widerspruch einlegen! Innerhalb eines Monats, schriftlich begründet. Statistisch lohnt es sich.
            """,
            icon: "arrow.up.circle.fill",
            affiliatePartner: nil,
            tags: ["höherstufung", "pflegegrad", "antrag", "verschlechterung", "nba"]
        ),

        // MARK: 20 - Pflegeheim Kosten
        RatgeberArtikel(
            id: "pflegeheim-kosten",
            titel: "Pflegeheim: Was zahlt die Kasse, was zahle ich?",
            kurztext: "Stationäre Pflege kostet 3.000–5.000 EUR/Monat — so verteilen sich die Kosten.",
            inhalt: """
            ## Die Kostenpakete im Überblick

            Ein Pflegeheim berechnet vier Posten:
            1. Pflegekosten (bezahlt die Pflegekasse anteilig)
            2. Unterkunft und Verpflegung (Eigenanteil)
            3. Investitionskosten (Eigenanteil, je nach Bundesland)
            4. Ausbildungsumlage (kleiner Betrag)

            ## Was zahlt die Pflegekasse?

            Die Pflegekasse zahlt einen pauschalen Betrag je Pflegegrad (§ 43 SGB XI, Stand 2025):
            - PG 2: 805 EUR/Monat
            - PG 3: 1.319 EUR/Monat
            - PG 4: 1.855 EUR/Monat
            - PG 5: 2.095 EUR/Monat

            Hinweis: PG 1 hat keinen Anspruch auf § 43-Leistungen in vollstationärer Pflege, nur auf den Entlastungsbetrag.

            ## Der "einheitliche Eigenanteil" seit Oktober 2022

            Seit Oktober 2022 gilt ein gestaffelter Beitragsbonus: Je länger jemand im Pflegeheim ist, desto mehr zahlt die Pflegekasse vom reinen Pflegekostenanteil (die Zuschläge wurden mit dem PUEG zum 01.01.2024 erhöht):
            - 1.–12. Monat: 15% Zuschlag
            - 13.–24. Monat: 30% Zuschlag
            - 25.–36. Monat: 50% Zuschlag
            - Ab 37. Monat: 75% Zuschlag

            Damit sinkt der Eigenanteil für Langzeitbewohner erheblich.

            ## Wer zahlt, wenn das Geld nicht reicht?

            Ist das eigene Einkommen und Vermögen zu gering, springt das Sozialamt ein (Hilfe zur Pflege). Kinder werden nur bei sehr hohem Einkommen (über 100.000 EUR/Jahr netto) herangezogen.

            ## Wie finanzieren?

            - Eigenanteil durch Pflegegeld oder Rente
            - Verwertung von Immobilien (oder Wohnrecht behalten)
            - Private Pflegezusatzversicherung schließt die Lücke
            - Sozialhilfe als letztes Netz

            ## Frühzeitig planen!

            Ein guter Pflegeheimplatz hat oft lange Wartelisten — frühzeitig anmelden, auch wenn die Pflege noch zu Hause funktioniert.
            """,
            icon: "building.fill",
            affiliatePartner: nil,
            tags: ["pflegeheim", "stationär", "eigenanteil", "kosten", "vollpflege"]
        ),

        // MARK: 21 - Demenz und Pflegegrad
        RatgeberArtikel(
            id: "demenz-pflegegrad",
            titel: "Demenz: Welcher Pflegegrad steht zu?",
            kurztext: "Kognitive Einschränkungen zählen stark — oft mehr als körperliche.",
            inhalt: """
            ## Demenz und das neue Begutachtungsverfahren

            Seit 2017 berücksichtigt das NBA-Verfahren kognitive und psychische Einschränkungen deutlich stärker. Gerade Demenzkranke erhalten dadurch oft höhere Pflegegrade als früher.

            ## Warum bekommen Demenzkranke oft höhere Pflegegrade?

            Das NBA bewertet Selbstständigkeit in 6 Modulen. Die Module 2 und 3 betreffen direkt kognitive Einschränkungen:

            - Modul 2: Kognitive und kommunikative Fähigkeiten (Orientierung, Gedächtnis, Entscheidungsfähigkeit)
            - Modul 3: Verhaltensweisen und psychische Problemlagen (Unruhe, Weglauftendenz, aggressives Verhalten)

            Diese Module haben zusammen höhere Gewichtung als rein körperliche Defizite.

            ## Typische Pflegegrade bei Demenz

            - Leichte Demenz (z.B. Orientierungslosigkeit, braucht Erinnerungen): PG 2–3
            - Mittelschwere Demenz (läuft weg, erkennt Angehörige nicht mehr): PG 3–4
            - Schwere Demenz (kaum kommunikationsfähig, bettlägerig): PG 4–5

            ## Worauf bei der Begutachtung achten?

            - Beschreibe konkrete Situationen: "Meine Mutter findet nachts die Toilette nicht mehr."
            - Nenne Häufigkeit: "Passiert 4–5 Mal pro Woche."
            - Erwähne Sicherheitsrisiken: Herd anlassen, Weglaufen, Stürze
            - Pflegetagebuch über kognitive Auffälligkeiten führen

            ## Demenz ändert sich — Höherstufung beantragen!

            Demenz verschlechtert sich häufig über Monate. Wer vor zwei Jahren PG 2 hatte, braucht heute vielleicht PG 4. Antrag auf Höherstufung stellen!

            ## Besondere Herausforderung für Angehörige

            Demenzpflege ist eine der belastendsten Pflegesituationen. Pflegekurse speziell für Demenz, Selbsthilfegruppen (z.B. Deutsche Alzheimer Gesellschaft) und Tagesbetreuung helfen.

            ## Tipp: Betreuungsleistungen nutzen

            Demenzkranke profitieren besonders vom Entlastungsbetrag (131 EUR/Monat) für Betreuungsgruppen — dort sind sie gut aufgehoben und Angehörige können Pause machen.
            """,
            icon: "brain.head.profile",
            affiliatePartner: nil,
            tags: ["demenz", "pflegegrad", "kognitiv", "alzheimer", "nba"]
        ),
    ]
}
