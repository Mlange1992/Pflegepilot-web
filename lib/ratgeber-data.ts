export interface RatgeberArtikel {
  slug: string
  titel: string
  kurztext: string
  inhalt: string         // Markdown-formatiert
  icon: string           // Emoji
  tags: string[]
  meta: {
    title: string
    description: string
    keywords: string
  }
}

export const ratgeberArtikel: RatgeberArtikel[] = [
  {
    slug: 'entlastungsbetrag',
    titel: 'Entlastungsbetrag: 131 EUR/Monat die viele verschenken',
    kurztext: 'Jeder mit Pflegegrad hat Anspruch — aber über 80% nutzen ihn nicht.',
    icon: '💶',
    tags: ['entlastungsbetrag', 'budget', 'frist', '131 euro', 'pflegeleistungen'],
    meta: {
      title: 'Entlastungsbetrag 2025: 131 EUR/Monat beantragen | PflegePilot',
      description: 'Alles zum Entlastungsbetrag 131 EUR/Monat: Wer hat Anspruch? Wie beantragen? Bis wann? Verfall-Frist 30. Juni. Kostenlos prüfen mit PflegePilot.',
      keywords: 'Entlastungsbetrag, 131 Euro, Pflegegrad, Pflegekasse, Antrag, Verfall, SGB XI',
    },
    inhalt: `## Was ist der Entlastungsbetrag?

Der Entlastungsbetrag (§ 45b SGB XI) ist eine monatliche Leistung von **131 EUR**, die ALLEN Pflegegraden (1–5) zusteht. Er ist zweckgebunden für:

- Angebote zur Unterstützung im Alltag (z.B. Betreuungsgruppen, Tagesbetreuung)
- Haushaltsnahe Dienstleistungen (Putzhilfe, Einkaufsservice)
- Tages- oder Nachtpflege (als Aufstockung)
- Kurzzeitpflege (als Aufstockung)

## Wer hat Anspruch?

**Alle Pflegebedürftigen mit Pflegegrad 1 bis 5** — auch wenn sie keine anderen Pflegeleistungen beziehen. Der Betrag gilt für häuslich gepflegte Personen.

## Wie beantrage ich ihn?

Der Entlastungsbetrag muss nicht formell beantragt werden. Er steht dir automatisch zu. Du musst jedoch:

1. Einen **anerkannten Anbieter** nutzen (durch das Bundesland anerkannt)
2. Rechnungen bei der Pflegekasse einreichen
3. Oder: Der Anbieter rechnet direkt mit der Pflegekasse ab

Dein Pflegestützpunkt kennt anerkannte Anbieter in deiner Nähe.

## Achtung: Verfall-Frist 30. Juni!

Nicht genutzte Beträge können ins **Folgejahr übertragen** werden — aber nur bis zum **30. Juni des Folgejahres**. Danach sind sie weg.

Beispiel: Der Entlastungsbetrag von 2024 verfällt am 30. Juni 2025.

**PflegePilot** erinnert dich per Push automatisch vor dem Verfall.

## Häufige Missverständnisse

❌ "Ich kann das Geld bar auszahlen lassen" → Falsch, zweckgebunden
❌ "Es verfällt am 31. Dezember" → Falsch, erst am 30. Juni des Folgejahres
✅ "Jeder Pflegegrad hat Anspruch" → Richtig, auch Pflegegrad 1`,
  },

  {
    slug: 'verhinderungspflege',
    titel: 'Verhinderungspflege: 1.612 EUR wenn die Pflegeperson ausfällt',
    kurztext: 'Urlaub, Krankheit, Auszeit — die Pflegekasse zahlt bis zu 6 Wochen Ersatzpflege.',
    icon: '🔄',
    tags: ['verhinderungspflege', 'urlaub', 'pflegeperson', '1612 euro', 'SGB XI'],
    meta: {
      title: 'Verhinderungspflege 2025: 1.612 EUR beantragen | PflegePilot',
      description: 'Verhinderungspflege: Anspruch, Höhe, Beantragung. 1.612 EUR/Jahr wenn die Pflegeperson ausfällt. Kostenloser PDF-Antrag mit PflegePilot.',
      keywords: 'Verhinderungspflege, 1612 Euro, Pflegekasse, Antrag, Urlaub, Ersatzpflege',
    },
    inhalt: `## Was ist Verhinderungspflege?

Verhinderungspflege (§ 39 SGB XI) greift, wenn deine Pflegeperson — z.B. Ehepartner, Kind — vorübergehend **ausfällt oder verhindert ist** wegen:

- Urlaub
- Krankheit
- Berufliche Verpflichtung
- Sonstiger persönlicher Gründe

Die Pflegekasse übernimmt die Kosten für eine **Ersatzpflegeperson bis zu 1.612 EUR im Jahr**, für maximal **6 Wochen**.

## Wer hat Anspruch?

Pflegebedürftige **ab Pflegegrad 2**, wenn sie:
- mindestens 6 Monate zu Hause gepflegt wurden
- von einer nahestehenden Person gepflegt werden

## Was kann genutzt werden?

- Professioneller Pflegedienst
- Nachbarn, Bekannte (nicht nahe Verwandte 1. Grades ohne gleichzeitige Erwerbstätigkeit)
- Pflegehilfen oder -agenturen

## Ab 01.07.2025: Gemeinsames Entlastungsbudget

Ab dem 01. Juli 2025 werden Verhinderungspflege und Kurzzeitpflege zu einem **gemeinsamen Budget von 3.539 EUR** (§ 42a SGB XI) zusammengefasst. Das Budget kann frei für beide Leistungsarten genutzt werden.

## So beantragst du Verhinderungspflege

1. Bei der Pflegekasse anrufen: "Ich möchte Verhinderungspflege in Anspruch nehmen"
2. Formular ausfüllen (oder PDF-Antrag mit PflegePilot erstellen)
3. Rechnungen der Ersatzpflegeperson einreichen
4. Pflegekasse erstattet den Betrag

## Tipp

Plane frühzeitig! Besonders bei professionellen Pflegediensten gibt es oft Wartelisten. Melde die Verhinderungspflege **vor** dem Urlaubsantritt an.`,
  },

  {
    slug: 'kurzzeitpflege',
    titel: 'Kurzzeitpflege: 1.774 EUR für vorübergehende stationäre Pflege',
    kurztext: 'Nach dem Krankenhaus, bei Überlastung der Pflegeperson — die Pflegekasse zahlt bis zu 8 Wochen.',
    icon: '🏥',
    tags: ['kurzzeitpflege', 'stationär', 'pflegeheim', '1774 euro', 'SGB XI'],
    meta: {
      title: 'Kurzzeitpflege 2025: 1.774 EUR beantragen | PflegePilot',
      description: 'Kurzzeitpflege nach § 42 SGB XI: Anspruch, Höhe, Beantragung. 1.774 EUR/Jahr für bis zu 8 Wochen stationäre Pflege.',
      keywords: 'Kurzzeitpflege, 1774 Euro, Pflegekasse, Pflegeheim, stationär, Antrag',
    },
    inhalt: `## Was ist Kurzzeitpflege?

Kurzzeitpflege (§ 42 SGB XI) ermöglicht eine **vorübergehende vollstationäre Unterbringung** in einem Pflegeheim — wenn häusliche Pflege zeitweise nicht möglich ist, z.B.:

- Nach einem Krankenhausaufenthalt
- Bei Überlastung der Pflegeperson
- Während des Urlaubs der Pflegeperson

Die Pflegekasse übernimmt bis zu **1.774 EUR pro Kalenderjahr**, für maximal **8 Wochen**.

## Wer hat Anspruch?

Alle Pflegebedürftigen **ab Pflegegrad 2**.

## Ab 01.07.2025: Gemeinsames Entlastungsbudget

Ab dem 01. Juli 2025 werden Verhinderungspflege und Kurzzeitpflege zu einem **gemeinsamen Budget von 3.539 EUR** (§ 42a SGB XI) zusammengefasst. Das Budget kann frei für beide Leistungsarten genutzt werden.

## Was wird NICHT bezahlt?

Die Pflegekasse zahlt nur den **pflegebedingten Aufwand** — nicht Unterkunft und Verpflegung. Diese Kosten trägst du selbst (ca. 25–50 EUR/Tag je nach Einrichtung).

## Beantragung

1. Pflegeheim mit Kurzzeitpflegeplatz finden
2. Bei Pflegekasse beantragen (meist formlos per Telefon)
3. Einzugsformular und Kostenvoranschlag einreichen

**Tipp:** Gute Kurzzeitpflegeplätze sind oft belegt. Frühzeitig anfragen und mehrere Alternativen vorhalten!`,
  },

  {
    slug: 'pflegehilfsmittel',
    titel: 'Pflegehilfsmittel: 42 EUR/Monat kostenlos bestellen',
    kurztext: 'Handschuhe, Desinfektionsmittel, Bettschutz — die Pflegekasse zahlt monatlich 42 EUR.',
    icon: '🧤',
    tags: ['pflegehilfsmittel', 'hilfsmittel', '42 euro', 'pflegebox', 'monatlich'],
    meta: {
      title: 'Pflegehilfsmittel 2025: 42 EUR/Monat kostenlos beantragen | PflegePilot',
      description: 'Pflegehilfsmittel nach § 40 SGB XI: Handschuhe, Desinfektionsmittel, Bettschutz — 42 EUR/Monat auf Kosten der Pflegekasse. So beantragen.',
      keywords: 'Pflegehilfsmittel, 42 Euro, Pflegebox, Handschuhe, Desinfektionsmittel, Bettschutz, kostenlos',
    },
    inhalt: `## Was sind Pflegehilfsmittel?

Pflegehilfsmittel (§ 40 SGB XI) sind zum Verbrauch bestimmte Produkte, die die häusliche Pflege erleichtern. Die Pflegekasse erstattet bis zu **42 EUR pro Monat** (ab 2024, vorher 40 EUR).

## Was ist enthalten?

- Einmalhandschuhe (Nitril, Latex oder Vinyl)
- Händedesinfektionsmittel
- Flächendesinfektionsmittel
- Bettschutzeinlagen (wiederverwendbar)
- Fingerlinge
- Mundschutz (Typ II)

## Wie funktioniert das?

Es gibt spezialisierte **Pflegebox-Anbieter**, die:
1. Die Produkte direkt **kostenlos nach Hause liefern**
2. Direkt mit der Pflegekasse abrechnen
3. Keine Vorleistung von dir verlangen

Du musst nur online deinen Pflegegrad und deine Pflegekasse angeben — fertig.

## Achtung: Budget läuft monatlich

Das Budget von 42 EUR gilt monatlich. Nicht genutzte Monate können **nicht** angespart werden. Nutze es jeden Monat!

## Welche Anbieter gibt es?

- **PflegeBox.de** — große Auswahl, schnelle Lieferung
- **Pflegebox-Bestellen.de** — direktes Abrechnungsmodell
- **Apotheke vor Ort** — Einzelprodukte bis 42 EUR/Monat

Vergleiche Anbieter hinsichtlich Produktqualität und Lieferzeit.`,
  },

  {
    slug: 'pflegegrad-beantragen',
    titel: 'Pflegegrad beantragen: Schritt für Schritt erklärt',
    kurztext: 'Wer stellt wie einen Antrag? Was passiert danach? Alles einfach erklärt.',
    icon: '📄',
    tags: ['pflegegrad', 'antrag', 'erstantrag', 'medizinischer dienst', 'md'],
    meta: {
      title: 'Pflegegrad beantragen 2025: Schritt-für-Schritt-Anleitung | PflegePilot',
      description: 'Pflegegrad beantragen: Wer? Wie? Wann? Komplette Anleitung mit Muster-Antrag als PDF. Kostenloser Selbsttest auf PflegePilot.',
      keywords: 'Pflegegrad beantragen, Antrag Pflegekasse, Medizinischer Dienst, MD, NBA, Erstantrag',
    },
    inhalt: `## Wer kann einen Pflegegrad beantragen?

Jede Person, die aufgrund körperlicher, geistiger oder psychischer Erkrankungen bei Alltagsaktivitäten **dauerhaft (mindestens 6 Monate)** Hilfe benötigt.

## Schritt 1: Antrag stellen — sofort!

Ruf bei deiner Pflegekasse an und sage: **"Ich möchte einen Antrag auf Pflegegrad stellen."**

Das ist alles. Du brauchst nichts weiter zu sagen. Ab diesem **Antragsdatum** gilt dein Anspruch — auch wenn die Begutachtung erst Wochen später stattfindet.

Alle Leistungen werden rückwirkend ab Antragsdatum gezahlt!

## Schritt 2: Auf MD-Termin vorbereiten

Die Pflegekasse beauftragt den **Medizinischen Dienst (MD)**. Ein Gutachter kommt zu dir nach Hause (oder ins Pflegeheim).

Vorbereitung ist entscheidend:
- Pflegetagebuch führen (mindestens 2 Wochen)
- Alle Arztbriefe und Befunde bereithalten
- Medikamentenliste vorbereiten
- Pflegeperson beim Termin dabei haben

**PflegePilot erstellt dir eine personalisierte MD-Checkliste** basierend auf deinem Selbsttest.

## Schritt 3: NBA-Selbsttest machen

Mache vor dem MD-Termin den kostenlosen **NBA-Selbsttest auf PflegePilot** (ca. 10 Minuten). So weißt du:
- Welcher Pflegegrad wahrscheinlich ist
- Welche Module du besonders gut dokumentieren solltest

## Schritt 4: Begutachtung

Der Gutachter bewertet 6 Lebensbereiche (Module des NBA-Systems). Wichtig: **Zeige den schlechten Tag!** Viele stellen sich besser dar als sie sind — das kostet Punkte.

## Schritt 5: Bescheid abwarten

Innerhalb von **25 Arbeitstagen** erhältst du den Bescheid. Bist du nicht einverstanden, kannst du innerhalb von **4 Wochen Widerspruch** einlegen.

## Tipp: Antrag sofort stellen!

Warte nicht auf bessere Dokumentation. Je früher du den Antrag stellst, desto früher gilt das Antragsdatum — und desto früher werden Leistungen gezahlt.`,
  },

  {
    slug: 'md-begutachtung-fehler',
    titel: 'MD-Begutachtung: Die 10 häufigsten Fehler',
    kurztext: 'Diese Fehler kosten Pflegegrad-Punkte — und damit bares Geld.',
    icon: '⚠️',
    tags: ['begutachtung', 'md', 'gutachter', 'fehler', 'tipps', 'pflegegrad'],
    meta: {
      title: 'MD-Begutachtung: 10 Fehler die Punkte kosten 2025 | PflegePilot',
      description: 'Die 10 häufigsten Fehler bei der MD-Begutachtung. So maximieren Sie Ihren Pflegegrad. Tipps für den Gutachtertermin.',
      keywords: 'MD Begutachtung, Fehler, Gutachter, Pflegegrad erhöhen, Tipps, Selbstttest',
    },
    inhalt: `## Fehler 1: Den besten Tag zeigen

Der häufigste Fehler überhaupt. Der Gutachter kommt, und plötzlich klappt alles. "Ich will mich nicht beklagen" — aber genau das kostet Punkte.

**Richtig:** Zeige den typischen schwierigen Tag, nicht den Ausnahmetag.

## Fehler 2: "Geht schon" sagen

Auf die Frage "Schaffen Sie das alleine?" mit "Geht schon" zu antworten, bedeutet für den Gutachter: selbständig.

**Richtig:** "Mit großer Mühe", "mit Schmerzen", "dauert 3x so lange wie früher".

## Fehler 3: Kein Pflegetagebuch

Ohne Dokumentation ist es schwer zu beweisen, wie oft und wie viel Hilfe nötig ist.

**Richtig:** 2 Wochen vor dem Termin täglich notieren, was nicht alleine geht.

## Fehler 4: Pflegeperson ist nicht dabei

Die Pflegeperson weiß oft mehr über den tatsächlichen Alltag. Immer dabei sein!

## Fehler 5: Begutachtung beginnt an der Haustür

Der Gutachter beobachtet schon den Weg zur Tür, wie die Person sitzt und steht.

## Fehler 6: Hilfsmittel nicht vorzeigen

Rollator, Toilettenstuhl, Pflegebett, Rollstuhl — alles sichtbar platzieren!

## Fehler 7: Medikamentenliste fehlt

Eine vollständige, aktuelle Medikamentenliste ist essentiell — sie zeigt den medizinischen Bedarf.

## Fehler 8: Schlechte Tage nicht erwähnen

Sage explizit: "An guten Tagen klappt X. An schlechten Tagen klappt X nicht."

## Fehler 9: Widerspruch vergessen

Zu niedriger Pflegegrad? **Innerhalb von 4 Wochen Widerspruch einlegen** — kostenlos und oft erfolgreich.

## Fehler 10: Selbsteinschätzung zu optimistisch

Nutze PflegePilots NBA-Selbsttest **vor** dem Termin — und vergleiche danach mit dem MD-Ergebnis.`,
  },

  {
    slug: 'widerspruch-pflegegrad',
    titel: 'Widerspruch gegen Pflegegrad: So geht es richtig',
    kurztext: 'Über 30% aller Widersprüche sind erfolgreich. So legst du richtig Widerspruch ein.',
    icon: '⚖️',
    tags: ['widerspruch', 'bescheid', 'pflegegrad', 'widerspruchsfrist', 'klage'],
    meta: {
      title: 'Widerspruch Pflegegrad 2025: Anleitung & Muster | PflegePilot',
      description: 'Pflegegrad zu niedrig? So legst du Widerspruch ein. Frist, Begründung, kostenloser Muster-Widerspruch als PDF.',
      keywords: 'Widerspruch Pflegegrad, zu niedrig, Frist, Muster, Begründung, Sozialgericht',
    },
    inhalt: `## Wann lohnt sich ein Widerspruch?

Wenn der Pflegegrad **niedriger ist als erwartet**, oder du glaubst, dass der Gutachter Einschränkungen nicht richtig erfasst hat. Laut Statistik werden über **30% aller Widersprüche** zugunsten der Antragsteller entschieden.

## Frist: 4 Wochen!

Du hast genau **4 Wochen nach Zustellung** des Bescheids Zeit, Widerspruch einzulegen. Danach ist der Bescheid bestandskräftig.

Tipp: Datum der Zustellung notieren und Frist im Kalender eintragen.

## Schritt 1: Gutachten anfordern

Verlange das vollständige **MD-Gutachten** schriftlich bei der Pflegekasse. Das ist dein gesetzliches Recht. Prüfe, welche Module wie bewertet wurden.

## Schritt 2: Begründung entwickeln

Analysiere das Gutachten und sammle Gegenbeweise:
- Neue oder bisher nicht vorgelegte Arztbriefe
- Eigenes Pflegetagebuch
- Zeugenaussagen der Pflegeperson
- Fotos/Videos der Einschränkungen (z.B. Gangbild)

## Schritt 3: Schriftlicher Widerspruch

Der Widerspruch muss **schriftlich** und **begründet** an die Pflegekasse. Grundstruktur:

> "Ich lege hiermit fristgerecht Widerspruch gegen den Bescheid vom [DATUM] ein. Nach meiner Einschätzung wurden folgende Einschränkungen nicht ausreichend berücksichtigt: [konkrete Punkte]."

**PflegePilot erstellt dir einen Muster-Widerspruch als PDF.**

## Was dann?

- Pflegekasse prüft den Widerspruch
- Bei Ablehnung: Klage beim Sozialgericht (kostenlos, kein Anwalt nötig)
- Aufschiebende Wirkung: bisheriger Pflegegrad bleibt bestehen

## Kostenlose Hilfe

- **Pflegestützpunkte** — kostenlose Beratung
- **VdK, Sozialverbände** — kostenloser Widerspruchsservice
- **Verbraucherzentrale** — Erstberatung`,
  },

  {
    slug: 'pflegegeld-sachleistungen',
    titel: 'Pflegegeld und Sachleistungen kombinieren (§ 38 SGB XI)',
    kurztext: 'Das Beste aus beiden Welten: So kombinierst du Pflegegeld und Pflegedienst.',
    icon: '💰',
    tags: ['pflegegeld', 'sachleistungen', 'kombination', 'pflegedienst', 'SGB XI'],
    meta: {
      title: 'Pflegegeld + Sachleistungen kombinieren 2025 | PflegePilot',
      description: 'Kombinationsleistung § 38 SGB XI: Pflegegeld und ambulante Pflege kombinieren. Berechnung, Vorteile, Beantragung.',
      keywords: 'Pflegegeld, Sachleistungen, Kombinationsleistung, Pflegedienst, § 38 SGB XI',
    },
    inhalt: `## Pflegegeld (§ 37 SGB XI)

Pflegegeld ist eine monatliche Zahlung an die pflegebedürftige Person:

| Pflegegrad | Pflegegeld/Monat |
|-----------|-----------------|
| PG 2 | 347 EUR |
| PG 3 | 599 EUR |
| PG 4 | 799 EUR |
| PG 5 | 990 EUR |

Das Geld kann frei eingesetzt werden — z.B. als Anerkennung für pflegende Angehörige.

## Sachleistungen (§ 36 SGB XI)

Sachleistungen sind ambulante Pflegeleistungen durch einen zugelassenen Pflegedienst. Die Pflegekasse zahlt direkt an den Pflegedienst.

| Pflegegrad | Sachleistung/Monat |
|-----------|------------------|
| PG 2 | 795 EUR |
| PG 3 | 1.496 EUR |
| PG 4 | 1.858 EUR |
| PG 5 | 2.299 EUR |

## Kombinationsleistung (§ 38 SGB XI)

Das Beste aus beiden Welten! Wenn du **nicht den vollen Sachleistungsbetrag** nutzt, erhältst du **anteilig Pflegegeld**.

**Beispiel PG 3:**
- Sachleistungsanspruch: 1.496 EUR
- Genutzt durch Pflegedienst: 748 EUR (50%)
- → Pflegegeld: 50% von 599 EUR = 300 EUR/Monat

## Wann sinnvoll?

Die Kombinationsleistung ist ideal, wenn:
- Du sowohl Familienangehörige als auch einen Pflegedienst nutzt
- Du den Pflegedienst für spezielle Aufgaben nutzt (z.B. medizinische Versorgung, Baden)
- Du das Pflegegeld als zusätzliche Unterstützung für die Pflegeperson nutzen willst

## Beantragung

Einfach beim Pflegedienst und der Pflegekasse mitteilen, dass du die Kombinationsleistung nutzen möchtest. Der Pflegedienst rechnet direkt ab, die Pflegekasse zahlt den Pflegegeld-Anteil automatisch.`,
  },

  {
    slug: 'hausnotruf',
    titel: 'Hausnotruf kostenlos über die Pflegekasse: So geht es',
    kurztext: 'Die Pflegekasse zahlt bis zu 30 EUR/Monat — Sicherheit rund um die Uhr.',
    icon: '🆘',
    tags: ['hausnotruf', 'notfall', 'pflegekasse', 'hilfsmittel', 'sicherheit'],
    meta: {
      title: 'Hausnotruf 2025 kostenlos über Pflegekasse beantragen | PflegePilot',
      description: 'Hausnotruf auf Kosten der Pflegekasse: Anspruch, Beantragung, Anbieter-Vergleich. Pflegegrad 1-5 berechtigt.',
      keywords: 'Hausnotruf, Pflegekasse, kostenlos, beantragen, Anbieter, Notfall',
    },
    inhalt: `## Was ist ein Hausnotruf?

Ein Hausnotruf ist ein Gerät (meist ein Knopf am Handgelenk oder als Halskette), mit dem man im Notfall sofort eine Zentrale erreicht. Die Zentrale schickt Hilfe oder benachrichtigt Angehörige.

## Wer zahlt?

Die Pflegekasse übernimmt die Kosten als **Pflegehilfsmittel** nach § 40 SGB XI:
- Anschlussgebühr
- Monatliche Miete
- Wartung und Entstörung

Typische Kosten: **ca. 25–30 EUR/Monat** — vollständig übernommen.

**Voraussetzung:** Pflegegrad 1–5, häusliche Pflege.

## Beantragung

**Option 1: Über Hausarzt**
1. Hausarzt verschreibt Hausnotruf (Hilfsmittelverordnung)
2. Vorlage bei der Pflegekasse oder direkt beim Anbieter

**Option 2: Direkt beim Anbieter**
Viele Anbieter übernehmen den Antrag komplett:
1. Online oder telefonisch Anbieter kontaktieren
2. Pflegegrad und Krankenkasse angeben
3. Anbieter rechnet direkt mit der Kasse ab

## Empfohlene Anbieter

- **ASB, DRK, Malteser, Johanniter** — bewährte Wohlfahrtsorganisationen
- **Deutsche Telekom (Hausnotruf)** — deutschlandweiter Service
- **MEIN ALARMKNOPF** — modernes System mit App-Anbindung
- **GEOCARE** — GPS-fähig, auch außerhalb der Wohnung

## Tipp: Auch ohne Pflegegrad möglich

Auch wer noch keinen Pflegegrad hat, kann auf eigene Kosten einen Hausnotruf nutzen und nach Pflegegrad-Feststellung rückwirkend erstattet bekommen.`,
  },

  {
    slug: 'wohnraumanpassung',
    titel: 'Wohnraumanpassung: Bis zu 4.000 EUR Zuschuss von der Pflegekasse',
    kurztext: 'Treppenlift, bodengleiche Dusche, Handläufe — so beantragst du den Zuschuss.',
    icon: '🏠',
    tags: ['wohnraumanpassung', 'treppenlift', 'barrierefrei', 'zuschuss', '4000 euro'],
    meta: {
      title: 'Wohnraumanpassung 2025: 4.000 EUR Zuschuss beantragen | PflegePilot',
      description: 'Zuschuss für Treppenlift, barrierefreie Dusche, Handläufe: bis zu 4.000 EUR von der Pflegekasse nach § 40 SGB XI.',
      keywords: 'Wohnraumanpassung, Treppenlift, barrierefrei, Zuschuss, Pflegekasse, 4000 Euro',
    },
    inhalt: `## Was fördert die Pflegekasse?

Maßnahmen zur Wohnraumanpassung (§ 40 Abs. 4 SGB XI) machen die häusliche Pflege möglich oder erleichtern sie erheblich. Die Pflegekasse zahlt bis zu **4.000 EUR pro Maßnahme**.

## Was wird gefördert?

| Maßnahme | Typische Kosten | Förderung |
|----------|----------------|-----------|
| Bodengleiche Dusche | 2.000–6.000 EUR | bis 4.000 EUR |
| Treppenlift | 3.000–8.000 EUR | bis 4.000 EUR |
| Türverbreiterung | 1.000–3.000 EUR | bis 4.000 EUR |
| Haltegriffe | 200–800 EUR | bis 4.000 EUR |
| Pflegebett | 500–2.000 EUR | bis 4.000 EUR |
| Rampen | 500–2.000 EUR | bis 4.000 EUR |

## Mehrfachförderung möglich!

Bei **mehreren pflegebedürftigen Personen** im selben Haushalt kann jede Person bis zu 4.000 EUR erhalten. Maximum: **16.000 EUR pro Haushalt**.

## WICHTIG: Antrag VOR dem Umbau!

Die Pflegekasse zahlt nur, wenn du **vor** dem Umbau einen Antrag gestellt hast. Im Nachhinein gibt es keinen Zuschuss.

**Ablauf:**
1. Antrag bei der Pflegekasse einreichen
2. Drei Angebote von Fachbetrieben einholen
3. Genehmigung abwarten (meist 2–4 Wochen)
4. Umbau durchführen lassen
5. Rechnung einreichen → Erstattung

## Weitere Förderquellen

- **KfW-Kredit** (Programm 159): zinsgünstiger Kredit für barrierefreies Wohnen
- **Bundesamt für Bauwesen** (BfA): Förderprogramme für Barrierefreiheit
- **Landesförderprogramme**: je nach Bundesland unterschiedlich`,
  },

  {
    slug: 'dipa-digitale-pflegeanwendungen',
    titel: 'DiPA 2025: Digitale Pflegeanwendungen auf Kosten der Pflegekasse',
    kurztext: 'Neue Leistung kaum bekannt — Apps für Pflege und Demenz auf Kassenkosten.',
    icon: '📱',
    tags: ['dipa', 'digitale pflegeanwendungen', 'app', 'bfarm', 'modern', '2025'],
    meta: {
      title: 'DiPA 2025: Digitale Pflegeanwendungen Pflegekasse | PflegePilot',
      description: 'Digitale Pflegeanwendungen (DiPA) auf Kosten der Pflegekasse: Wer hat Anspruch? Welche Apps sind zugelassen? Wie beantragen?',
      keywords: 'DiPA, Digitale Pflegeanwendungen, Pflegekasse, App, BfArM, Demenz, Pflege',
    },
    inhalt: `## Was sind Digitale Pflegeanwendungen (DiPAs)?

DiPAs sind Apps oder Softwareanwendungen, die vom **Bundesinstitut für Arzneimittel und Medizinprodukte (BfArM)** zugelassen wurden. Sie unterstützen bei der häuslichen Pflege.

## Wer hat Anspruch?

Pflegebedürftige **ab Pflegegrad 1** sowie deren pflegende Angehörige.

## Was bezahlt die Pflegekasse?

Die Pflegekasse übernimmt bis zu **53 EUR/Monat** für zugelassene DiPAs (§ 40a SGB XI) — als **eigenes Budget**, unabhängig vom Entlastungsbetrag.

## Welche DiPAs gibt es?

Das BfArM führt ein **öffentliches DiPA-Verzeichnis** auf bfarm.de. Typische Bereiche:

- **Demenz & Kognition**: Gedächtnistraining, Orientierungshilfen
- **Sturzprävention**: Balance-Training, Bewegungsübungen
- **Kommunikation**: Unterstützte Kommunikation für Pflegebedürftige
- **Pflegeorganisation**: Koordination zwischen Pflegepersonen

## Wie beantragen?

1. DiPA aus dem BfArM-Verzeichnis auswählen
2. Arzt verschreibt die DiPA (Verordnung)
3. Bei Pflegekasse einreichen
4. Zugang zur App erhalten

Manche Anbieter übernehmen den Prozess komplett — frage direkt beim DiPA-Anbieter nach.

## Tipp

Die Liste zugelassener DiPAs wächst stetig. Schau regelmäßig auf bfarm.de/DiPA nach neuen Anwendungen.`,
  },

  {
    slug: 'beratungsbesuche-pflegegeld',
    titel: 'Beratungsbesuche: Diese Pflichttermine schützen dein Pflegegeld',
    kurztext: 'Pflegegrad 2–5: Versäumte Beratungsbesuche können das Pflegegeld kosten.',
    icon: '📅',
    tags: ['beratungsbesuch', 'pflegegeld', 'pflicht', 'frist', 'qualitätssicherung'],
    meta: {
      title: 'Beratungsbesuche Pflegegeld 2025: Pflicht & Fristen | PflegePilot',
      description: 'Beratungsbesuche bei Pflegegeld: Wie oft? Was passiert bei Versäumnis? Wer führt durch? Alle Infos für Pflegegrad 2–5.',
      keywords: 'Beratungsbesuch, Pflegegeld, Pflicht, Frist, § 37 SGB XI, Qualitätssicherung',
    },
    inhalt: `## Was sind Beratungsbesuche?

Wer **Pflegegeld** bezieht, muss regelmäßig Qualitätssicherungsbesuche durch einen zugelassenen Pflegedienst nachweisen (§ 37 Abs. 3 SGB XI).

Diese Besuche dienen der Sicherstellung einer guten Pflege — nicht der Kontrolle!

## Wie oft ist ein Besuch nötig?

| Pflegegrad | Häufigkeit |
|-----------|-----------|
| PG 2 | 2× pro Jahr (alle 6 Monate) |
| PG 3 | 2× pro Jahr (alle 6 Monate) |
| PG 4 | 4× pro Jahr (alle 3 Monate) |
| PG 5 | 4× pro Jahr (alle 3 Monate) |

## Was passiert wenn man vergisst?

Die Pflegekasse kann das Pflegegeld **kürzen oder einstellen**, wenn der Nachweis fehlt!

## Wie wird der Besuch durchgeführt?

1. Zugelassener Pflegedienst kommt nach Hause
2. Begutachtung der Pflegesituation (ca. 20–30 Minuten)
3. Bericht wird an die Pflegekasse übermittelt

**Kosten:** Vollständig übernommen von der Pflegekasse.

## Wie finde ich einen Anbieter?

- **Pflegekasse direkt** fragen (Liste zugelassener Dienste)
- **Pflegestützpunkt** in deiner Gemeinde
- **Online**: pflegedienst-suche.de oder similar

## Tipp: Erinnerung in PflegePilot eintragen

Trag die nächste Frist in PflegePilot ein — du bekommst eine Push-Benachrichtigung rechtzeitig, damit du kein Pflegegeld verlierst.`,
  },

  {
    slug: 'pflege-steuer-absetzen',
    titel: 'Pflege von der Steuer absetzen: Was wirklich geht',
    kurztext: 'Außergewöhnliche Belastungen, Steuerbonus 20% — so holst du das Maximum heraus.',
    icon: '📊',
    tags: ['steuer', 'steuererklärung', 'außergewöhnliche belastungen', 'pflegekosten', 'steuerbonus'],
    meta: {
      title: 'Pflegekosten Steuer 2025: Was kann ich absetzen? | PflegePilot',
      description: 'Pflegekosten von der Steuer absetzen: Außergewöhnliche Belastungen, Haushaltsbonus, Pflegepauschbetrag. Komplette Übersicht für 2025.',
      keywords: 'Pflege Steuer, absetzen, außergewöhnliche Belastungen, Pflegepauschbetrag, Steuerbonus',
    },
    inhalt: `## Haushaltsnahe Dienstleistungen (§ 35a EStG)

Für ambulante Pflegeleistungen und haushaltsnahe Dienstleistungen gibt es einen **direkten Steuerbonus von 20%** der Kosten, maximal **4.000 EUR pro Jahr** — unabhängig von der zumutbaren Eigenbelastung!

Das gilt für:
- Ambulante Pflegedienste (soweit nicht von Pflegekasse bezahlt)
- Haushaltshilfe, Reinigungsdienste
- Fahrdienste zu Arztterminen

**Wichtig:** Nur Arbeitskosten, nicht Materialkosten absetzbar. Zahlung per Überweisung (nicht bar)!

## Außergewöhnliche Belastungen (§ 33 EStG)

Pflegekosten als außergewöhnliche Belastungen — aber erst nach Abzug der **zumutbaren Eigenbelastung** (1–7% des Einkommens).

Absetzbar:
- Stationäre Pflegeheimkosten (abzüglich Haushaltsersparnis)
- Ambulante Pflege (Eigenanteil)
- Pflegehilfsmittel (Eigenanteil)

## Pflegepauschbetrag (§ 33b EStG)

Wer jemanden **unentgeltlich persönlich pflegt** (mindestens Pflegegrad 2), kann den Pauschbetrag abziehen — ohne Nachweis!

| Pflegegrad | Pauschbetrag/Jahr |
|-----------|------------------|
| PG 2 | 600 EUR |
| PG 3 | 1.100 EUR |
| PG 4 oder "hilflos" | 1.800 EUR |
| PG 5 | 1.800 EUR |

**Voraussetzung:** Pflege in der eigenen Wohnung oder in der Wohnung des Pflegebedürftigen, keine Zahlung für die Pflege.

## Tipp

Sammle alle Rechnungen im Jahr und beauftrage einen Steuerberater mit Erfahrung im Pflegesteuerrecht — oft sparen sie mehr als sie kosten.`,
  },

  {
    slug: 'pflegekurse-kostenlos',
    titel: 'Pflegekurse für Angehörige: Komplett kostenlos auf Kassenkosten',
    kurztext: 'Pflegekurse nach § 45 SGB XI: Online und vor Ort, vollständig von der Pflegekasse übernommen.',
    icon: '🎓',
    tags: ['pflegekurs', 'angehörige', 'kostenlos', 'online', 'schulung', 'weiterbildung'],
    meta: {
      title: 'Pflegekurse 2025: Kostenlos für Angehörige | PflegePilot',
      description: 'Pflegekurse nach § 45 SGB XI: Komplett kostenlos für pflegende Angehörige. Online, vor Ort, Zertifikat. Alle Infos.',
      keywords: 'Pflegekurs, Angehörige, kostenlos, § 45 SGB XI, online, Pflegekasse',
    },
    inhalt: `## Warum sind Pflegekurse wichtig?

Pflege zu Hause ist körperlich und seelisch anspruchsvoll. Pflegekurse vermitteln:

- Praktische Pflegetechniken (Umbetten, Waschen, Lagewechsel)
- Umgang mit Demenz und Verhaltensauffälligkeiten
- Selbstfürsorge für pflegende Angehörige
- Erste Hilfe und Notfallmanagement

## Was bezahlt die Pflegekasse?

Pflegekurse für Angehörige und Ehrenamtliche sind nach **§ 45 SGB XI vollständig kostenlos**. Die Pflegekasse trägt alle Kosten — ohne Antrag, ohne Formulare.

**Voraussetzung:** Pflegebedürftige Person muss anerkannten Pflegebedarf haben (nicht zwingend Pflegegrad!).

## Welche Kurse gibt es?

- Grundpflegekurs (Waschen, Umbetten, Mobilisation)
- Demenz-Spezial-Kurs
- Wundversorgung und medizinische Grundversorgung
- Entlastungskurs (Selbstfürsorge, Belastungsmanagement)
- Online-Kurse (besonders flexibel, oft selbst lernen)

## Wo finde ich Kurse?

1. **Pflegekasse direkt** anfragen — verpflichtet zu Kursen nach § 45 SGB XI
2. **VdK, AWO, Caritas, Diakonie** — regionale Kursangebote
3. **Online-Anbieter** (z.B. "Töchter & Söhne", "pflege.de") — bequem von zu Hause
4. **Pflegestützpunkte** — kostenlose Beratung und Kursempfehlung

## Für wen?

Auch wer noch keinen formellen Pflegegrad hat! Wenn eine pflegebedürftige Situation vorliegt, können Kurse oft schon vorher kostenlos sein. Einfach bei der Pflegekasse nachfragen.

## Zertifikat

Viele Kurse bieten ein **anerkanntes Zertifikat** — nützlich bei der Beantragung von Verhinderungspflege oder wenn du professionell in der Pflege tätig werden möchtest.`,
  },

  {
    slug: 'jahresbudget-vhp-kzp',
    titel: 'Das gemeinsame Jahresbudget: 3.539 EUR flexibel nutzen (ab 01.07.2025)',
    kurztext: 'Verhinderungspflege und Kurzzeitpflege werden zu einem Budget zusammengeführt.',
    icon: '💼',
    tags: ['jahresbudget', 'verhinderungspflege', 'kurzzeitpflege', 'kombination', 'budget', '§42a'],
    meta: {
      title: 'Gemeinsames Entlastungsbudget 2025: 3.539 EUR | PflegePilot',
      description: 'Ab 01.07.2025: Gemeinsames Budget für VHP + KZP nach § 42a SGB XI. 3.539 EUR frei aufteilbar. Vollständige Erklärung.',
      keywords: 'Verhinderungspflege, Kurzzeitpflege, Entlastungsbudget, §42a SGB XI, 3539 Euro',
    },
    inhalt: `## Das gemeinsame Entlastungsbudget ab 01.07.2025

Ab dem **01. Juli 2025** tritt § 42a SGB XI in Kraft: Verhinderungspflege und Kurzzeitpflege werden zu einem **gemeinsamen Jahresbudget von 3.539 EUR** zusammengefasst.

## Was ändert sich?

**Vorher (bis 30.06.2025):**
| Leistung | Betrag/Jahr |
|---------|------------|
| Verhinderungspflege (§ 39) | 1.612 EUR |
| Kurzzeitpflege (§ 42) | 1.774 EUR |
| Gesamt (mit Übertragung) | max. 3.386 EUR |

**Ab 01.07.2025 (§ 42a):**
- Ein gemeinsames Budget: **3.539 EUR**
- Frei aufteilbar auf Verhinderungs- und Kurzzeitpflege
- Keine separate Antragstellung mehr nötig

## Wer hat Anspruch?

Pflegebedürftige **ab Pflegegrad 2** in häuslicher Pflege.

## Wie wird das Budget genutzt?

Das Budget kann flexibel eingesetzt werden:
- **Nur Verhinderungspflege**: bis zu 3.539 EUR für Ersatzpflegepersonen
- **Nur Kurzzeitpflege**: bis zu 3.539 EUR für stationäre Kurzzeit-Unterbringung
- **Mischung**: nach eigenem Ermessen aufteilen

## WICHTIG: Kein Übertrag ins Folgejahr!

Das Budget verfällt am **31. Dezember** des Jahres. Eine Übertragung ist nicht möglich.

**PflegePilot** zeigt dein Restbudget und warnt automatisch, wenn das Jahresende naht.`,
  },

  {
    slug: 'tagespflege',
    titel: 'Tagespflege: Bis zu 2.299 EUR/Monat für teilstationäre Betreuung',
    kurztext: 'Tagespflege entlastet Angehörige und fördert die Selbständigkeit — auf Kosten der Pflegekasse.',
    icon: '☀️',
    tags: ['tagespflege', 'teilstationär', 'betreuung', '§41', 'entlastung'],
    meta: {
      title: 'Tagespflege 2025: Kosten & Beantragung | PflegePilot',
      description: 'Tagespflege nach § 41 SGB XI: Anspruch, Höhe, Beantragung. Bis zu 2.299 EUR/Monat für Pflegegrad 5. So funktioniert es.',
      keywords: 'Tagespflege, § 41 SGB XI, teilstationär, Pflegekasse, Betreuung, Pflegegrad',
    },
    inhalt: `## Was ist Tagespflege?

Tagespflege (§ 41 SGB XI) ist eine **teilstationäre Pflegeform**: Der Pflegebedürftige wird tagsüber in einer Einrichtung betreut und verbringt die Nächte zu Hause.

Typisch sind Betreuungszeiten von 8–17 Uhr, oft mit Fahrdienst inklusive.

## Wer hat Anspruch?

Pflegebedürftige **ab Pflegegrad 2** in häuslicher Pflege.

## Wie hoch ist die Leistung?

Die Tagespflege wird mit dem **gleichen Betrag** gefördert wie Pflegesachleistungen (§ 36):

| Pflegegrad | Betrag/Monat |
|-----------|-------------|
| PG 2 | 795 EUR |
| PG 3 | 1.496 EUR |
| PG 4 | 1.858 EUR |
| PG 5 | 2.299 EUR |

## Kombination mit anderen Leistungen

Tagespflege kann **zusätzlich** zu Pflegegeld und Pflegesachleistungen genutzt werden — die Budgets werden nicht verrechnet!

Das bedeutet: Du kannst parallel Pflegegeld + Pflegesachleistungen + Tagespflege beziehen.

## Was kostet Tagespflege?

Die Pflegekasse übernimmt den **pflegebedingten Anteil**. Kosten für Unterkunft, Verpflegung und Fahrdienst müssen selbst getragen werden (ca. 15–30 EUR/Tag Eigenanteil).

## Beantragung

1. Tagespflegeeinrichtung in der Nähe finden
2. Anmeldung bei der Einrichtung
3. Pflegekasse informieren — keine separate Genehmigung nötig
4. Einrichtung rechnet direkt mit der Pflegekasse ab

## Vorteile für die Familie

- Pflegende Angehörige können weiter arbeiten oder sich erholen
- Soziale Kontakte für den Pflegebedürftigen
- Professionelle Betreuung und Aktivierung`,
  },

  {
    slug: 'pflegezusatzversicherung',
    titel: 'Pflegezusatzversicherung: Absicherung der Pflegelücke',
    kurztext: 'Die gesetzliche Pflegeversicherung deckt nur einen Teil der Kosten — so schließt du die Lücke.',
    icon: '🛡️',
    tags: ['pflegezusatzversicherung', 'eigenanteil', 'pflegeheim', 'absicherung', 'vorsorge'],
    meta: {
      title: 'Pflegezusatzversicherung 2025: Sinnvoll? Vergleich | PflegePilot',
      description: 'Pflegezusatzversicherung: Wann sinnvoll? Welche Typen gibt es? Was kostet sie? Alles zur privaten Pflegeabsicherung 2025.',
      keywords: 'Pflegezusatzversicherung, Pflegetagegeld, Pflegekostenversicherung, Eigenanteil, Pflegeheim',
    },
    inhalt: `## Warum braucht man eine Zusatzversicherung?

Die gesetzliche Pflegeversicherung ist eine **Teilkaskoversicherung** — sie deckt nicht alle Kosten. Im Pflegeheim beträgt der Eigenanteil 2025 durchschnittlich **2.000–3.000 EUR pro Monat**.

## Die drei Typen der Pflegezusatzversicherung

### 1. Pflegetagegeldversicherung
- Zahlt einen **täglichen Geldbetrag** bei Pflegebedürftigkeit
- Frei verwendbar
- Beispiel: 50 EUR/Tag = 1.500 EUR/Monat extra

### 2. Pflegekostenversicherung
- Erstattet nachgewiesene **Pflegekosten** bis zu einem vereinbarten Betrag
- Direktabrechnung mit Einrichtungen möglich

### 3. Pflegerentenversicherung
- Kombiniert **Altersvorsorge und Pflegeabsicherung**
- Monatliche Rente im Pflegefall
- Meist teurer, aber umfangreicher

## Wann ist eine Zusatzversicherung sinnvoll?

- Je **früher** der Abschluss, desto günstiger die Beiträge
- Ab 40–50 Jahren wird die Absicherung kritisch wichtig
- Besonders sinnvoll, wenn kein großes Vermögen vorhanden
- Pflegefall in der Familie → Bewusstsein für Risiken vorhanden

## Staatliche Förderung: "Pflege-Bahr"

Der Staat fördert bestimmte Pflegezusatzversicherungen mit **5 EUR/Monat Zuschuss** (sogenannter "Pflege-Bahr"). Voraussetzungen:
- Mindestbeitrag 10 EUR/Monat
- Kein Gesundheits-Check erforderlich
- Zertifizierter Tarif

## Worauf beim Vergleich achten?

- Wartezeiten (oft 3–5 Jahre bis zur vollen Leistung)
- Dynamikanpassung (Inflation berücksichtigen)
- Beitragsstabilität im Alter
- Leistung bei allen Pflegegraden

## Tipp

Unabhängige Beratung bei einem **Verbraucherzentrale-Versicherungsberater** holen — nicht bei einem Versicherungsvertreter, der provisionsorientiert berät.`,
  },

  {
    slug: 'rentenversicherung-angehoerige',
    titel: 'Rentenversicherung für pflegende Angehörige: Die versteckte Leistung',
    kurztext: 'Wer jemanden pflegt, sammelt Rentenpunkte — vollständig kostenlos durch die Pflegekasse.',
    icon: '🏦',
    tags: ['rentenversicherung', 'pflegende angehörige', 'rentenpunkte', 'kostenlos', 'altersvorsorge'],
    meta: {
      title: 'Rentenversicherung pflegende Angehörige 2025 | PflegePilot',
      description: 'Pflegende Angehörige erhalten Rentenversicherungsbeiträge von der Pflegekasse. Wie viel? Ab wann? Was sind die Voraussetzungen?',
      keywords: 'Rentenversicherung, pflegende Angehörige, Rentenpunkte, Pflegekasse, kostenlos',
    },
    inhalt: `## Die versteckte Leistung: Rente für Pflegende

Wer eine nahestehende Person pflegt, hat Anspruch darauf, dass die **Pflegekasse Rentenversicherungsbeiträge** übernimmt (§ 44 SGB XI). Diese Leistung ist weitgehend unbekannt.

## Voraussetzungen

- Du pflegst eine Person mit **Pflegegrad 2–5** (nicht PG 1)
- Du pflegst **mindestens 10 Stunden pro Woche** (verteilt auf 2+ Tage)
- Du übst **keine oder eine Teilzeittätigkeit** aus (max. 30 Stunden/Woche)
- Du lebst **nicht im gleichen Haushalt** wie der Pflegebedürftige (kein muss, aber besonders wichtig bei Distanzpflege)

## Wie viel Rente entsteht?

Die Beiträge richten sich nach dem **Pflegegrad** und der **Pflegeintensität**. Beispielhafte Rentenpunkte:

| Pflegegrad | Ungefähre Rentenpunkte/Jahr |
|-----------|---------------------------|
| PG 2 | ca. 0,33 Punkte |
| PG 3 | ca. 0,67 Punkte |
| PG 4 | ca. 0,80 Punkte |
| PG 5 | ca. 1,00 Punkte |

(Stand 2025, Westdeutschland; ein Rentenpunkt = ca. 40 EUR/Monat Rente)

## Wie beantragen?

1. Formular bei der **Pflegekasse** des Pflegebedürftigen anfordern
2. Eigene Rentenversicherungsnummer angeben
3. Pflegekasse meldet die Beiträge automatisch an die Deutsche Rentenversicherung

**Keine Kosten für dich — die Pflegekasse zahlt alles!**

## Rückwirkend möglich?

Nein — die Anmeldung gilt nur **ab dem Zeitpunkt der Antragstellung**. Deshalb: so früh wie möglich anmelden!

## Tipp: Auch für Kinder möglich

Auch wenn Kinder ihre Eltern pflegen (z.B. Wochenend-Pflege), kann dieser Anspruch bestehen — unabhängig davon, ob man berufstätig ist.`,
  },

  {
    slug: 'hoeherinstufung',
    titel: 'Höherstufung des Pflegegrads: Wann und wie beantragen',
    kurztext: 'Verschlechtert sich der Gesundheitszustand, kann der Pflegegrad erhöht werden — oft rückwirkend.',
    icon: '⬆️',
    tags: ['höherstufung', 'pflegegrad', 'verschlechterung', 'antrag', 'rückwirkend'],
    meta: {
      title: 'Pflegegrad Höherstufung 2025: So beantragen | PflegePilot',
      description: 'Pflegegrad erhöhen lassen: Wann ist eine Höherstufung möglich? Wie beantragen? Was gilt rückwirkend? Alle Infos.',
      keywords: 'Höherstufung, Pflegegrad erhöhen, Verschlechterung, Antrag, rückwirkend, Pflegekasse',
    },
    inhalt: `## Wann ist eine Höherstufung möglich?

Eine Höherstufung des Pflegegrads ist möglich, wenn sich der **Gesundheitszustand dauerhaft verschlechtert** hat und der bisherige Pflegegrad die Situation nicht mehr korrekt widerspiegelt.

Typische Auslöser:
- Fortschreitende Demenz
- Schlaganfall oder andere akute Ereignisse
- Chronische Erkrankungen im Fortschritt
- Zunehmender Hilfebedarf im Alltag

## Wie beantragen?

1. Pflegekasse anrufen und Höherstufung beantragen
2. Ab diesem **Antragsdatum** gilt der neue Pflegegrad rückwirkend (wenn genehmigt)
3. MD-Begutachtung wird erneut durchgeführt
4. Bescheid innerhalb von 25 Arbeitstagen

**Tipp: Sofort anrufen** — nicht warten, bis alles dokumentiert ist. Das Antragsdatum ist entscheidend!

## Was ändert sich bei einer Höherstufung?

Alle Leistungen werden **automatisch** auf den neuen Pflegegrad angepasst:
- Pflegegeld steigt
- Sachleistungsbudget steigt
- Entlastungsbudget bleibt gleich (gilt für alle PG)

## Vorbereitung: Pflegetagebuch führen

Dokumentiere mindestens 2 Wochen den Tagesablauf:
- Welche Hilfen werden gebraucht?
- Wie lange dauern einzelne Pflegehandlungen?
- Welche Aktivitäten gehen nicht mehr alleine?

## Widerspruch bei Ablehnung

Wird die Höherstufung abgelehnt, kannst du innerhalb von **4 Wochen Widerspruch** einlegen. Ca. 30% aller Widersprüche sind erfolgreich.

## Tipp: Paralleler Antrag spart Zeit

Du kannst gleichzeitig mit dem Höherstufungsantrag auch Widerspruch gegen den aktuellen Bescheid einlegen — das sichert das Antragsdatum auf mehreren Wegen ab.`,
  },

  {
    slug: 'pflegeheim-kosten',
    titel: 'Pflegeheim-Kosten 2025: Was zahlt die Pflegekasse, was zahle ich selbst?',
    kurztext: 'Die Pflegekasse übernimmt einen Festbetrag — den Rest zahlt die Familie. So hoch ist der Eigenanteil.',
    icon: '🏥',
    tags: ['pflegeheim', 'eigenanteil', 'vollstationär', '§43', 'kosten', 'heimkosten'],
    meta: {
      title: 'Pflegeheim Kosten 2025: Eigenanteil & Pflegekasse | PflegePilot',
      description: 'Pflegeheim-Kosten 2025: Was zahlt die Pflegekasse? Wie hoch ist der Eigenanteil? Gibt es Sozialhilfe? Alle Infos zu § 43 SGB XI.',
      keywords: 'Pflegeheim Kosten, Eigenanteil, § 43 SGB XI, vollstationär, Sozialhilfe, Pflegekasse',
    },
    inhalt: `## Was zahlt die Pflegekasse?

Bei vollstationärer Pflege (§ 43 SGB XI) zahlt die Pflegekasse **feste Beträge** je Pflegegrad:

| Pflegegrad | Pflegekasse/Monat |
|-----------|------------------|
| PG 1 | 0 EUR (kein Anspruch auf vollstationäre Leistungen) |
| PG 2 | 805 EUR |
| PG 3 | 1.319 EUR |
| PG 4 | 1.855 EUR |
| PG 5 | 2.095 EUR |

(Stand 2025 nach PUEG-Erhöhung)

## Was kostet ein Pflegeheim wirklich?

Die tatsächlichen Kosten liegen oft bei **4.000–6.000 EUR/Monat**. Der Rest nach Abzug der Pflegekassenleistung ist der **Eigenanteil** der Familie.

Typische Zusammensetzung der Gesamtkosten:
- Pflegekosten: ca. 2.500–3.500 EUR
- Unterkunft & Verpflegung: ca. 800–1.200 EUR
- Investitionskosten: ca. 300–600 EUR

## Wer zahlt den Eigenanteil?

1. **Der Pflegebedürftige selbst** (aus Rente, Vermögen)
2. **Unterhaltspflichtige Kinder** (seit 2020: nur wenn Jahreseinkommen > 100.000 EUR)
3. **Sozialhilfe (Hilfe zur Pflege)** wenn Eigenmittel nicht ausreichen

## Entlastung durch einrichtungsinterne Eigenanteile

Seit 2022 gibt es einen **Pflegekassen-Zuschuss zum Eigenanteil** — je länger die Pflege dauert:

- **1. Jahr**: 15% des pflegebedingten Eigenanteils
- **2. Jahr**: 30%
- **3. Jahr**: 50%
- **Ab 4. Jahr**: 75%

## Was ist mit dem Entlastungsbetrag?

Auch im Pflegeheim haben Bewohner mit PG 1 Anspruch auf den **Entlastungsbetrag von 131 EUR/Monat** — für Aktivitäten und Betreuungsangebote.

## Sozialhilfe beantragen

Wenn das Geld nicht reicht, beim zuständigen **Sozialamt** Hilfe zur Pflege beantragen. Wichtig: frühzeitig, denn die Bearbeitung dauert.`,
  },

  {
    slug: 'demenz-pflegegrad',
    titel: 'Demenz und Pflegegrad: Warum Demenzkranke oft zu niedrig eingestuft sind',
    kurztext: 'Das NBA-System berücksichtigt kognitive Einschränkungen — aber nur wenn richtig dokumentiert.',
    icon: '🧠',
    tags: ['demenz', 'pflegegrad', 'kognition', 'nba', 'alzheimer', 'höherstufung'],
    meta: {
      title: 'Demenz Pflegegrad 2025: Richtig einstufen lassen | PflegePilot',
      description: 'Demenz und Pflegegrad: Warum Demenzkranke oft zu niedrig eingestuft werden. NBA-System, kognitive Einschränkungen, Dokumentation.',
      keywords: 'Demenz, Pflegegrad, Alzheimer, NBA, kognitive Einschränkungen, Höherstufung',
    },
    inhalt: `## Das Problem: Körperlich fit, kognitiv eingeschränkt

Viele Demenzkranke sind körperlich noch relativ gut beieinander — können sich waschen, essen, laufen. Das NBA-Begutachtungssystem erfasst aber **6 Lebensbereiche**, darunter explizit auch kognitive Fähigkeiten (Modul 2).

Trotzdem werden Demenzkranke häufig zu niedrig eingestuft, weil:
- Kognitive Einschränkungen am Gutachtertag nicht sichtbar sind
- Betroffene ihre Defizite kompensieren
- Pflegepersonen den "guten Tag" zeigen

## Das NBA-System und Demenz

Im Neuen Begutachtungsassessment (NBA) zählt Modul 2 "Kognitive und kommunikative Fähigkeiten" mit **15% Gewichtung**:

- Örtliche und zeitliche Orientierung
- Erkennen von Personen
- Steuerung von Handlungen
- Gedächtnis
- Umgang mit alltäglichen Anforderungen

## Typische Demenz-Einschränkungen dokumentieren

Für die Begutachtung wichtig:
- Wacht nachts auf, ist desorientiert
- Kann Herd nicht sicher bedienen
- Vergisst Medikamente zu nehmen
- Verlässt die Wohnung und findet nicht zurück
- Kann Termine nicht einhalten

## Modul 3: Verhaltensweisen

Auch Modul 3 "Verhaltensweisen und psychische Problemlagen" ist bei Demenz relevant:
- Aggressivität
- Angst und Panikattacken
- Antriebslosigkeit
- Schlafstörungen

## Pflegetagebuch speziell für Demenz

Notiere täglich:
1. Wie oft ist die Person desorientiert?
2. Wann braucht sie Hilfe (nicht nur körperliche)?
3. Sicherheitsrisiken (Herd vergessen, Stürze)
4. Nachtunruhe (Uhrzeit, Dauer)

## Tipps für die Begutachtung

- Gutachter über **schlechte Tage** informieren
- Zeige konkrete Beispiele von Hilfebedarf
- Lass die Pflegeperson sprechen, nicht nur den Betroffenen
- Reiche ärztliche Diagnosen und Berichte ein

## Welcher Pflegegrad ist bei Demenz realistisch?

- **Frühe Demenz**: oft PG 2 oder 3
- **Mittlere Demenz**: PG 3 oder 4
- **Schwere Demenz**: PG 4 oder 5

Bei PG 5 ("schwerste Beeinträchtigungen mit besonderen Anforderungen") ist Demenz mit ausgeprägten Verhaltensauffälligkeiten der häufigste Grund.`,
  },
]

export function getArtikelBySlug(slug: string): RatgeberArtikel | undefined {
  return ratgeberArtikel.find((a) => a.slug === slug)
}

export function getAllSlugs(): string[] {
  return ratgeberArtikel.map((a) => a.slug)
}
