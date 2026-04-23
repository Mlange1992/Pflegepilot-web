import SwiftUI

struct NBATestView: View {
    @Environment(\.dismiss) var dismiss
    var onResult: (NBAResult) -> Void
    var onCompleted: ((Bool) -> Void)? = nil

    @AppStorage("nbaTest_moduleIndex") private var currentModuleIndex = 0
    @State private var answers: [String: Int] = [:]
    @State private var showResult = false
    @State private var result: NBAResult?

    private let answersKey = "nbaTest_answers"

    var currentModule: NBAModule { nbaModules[currentModuleIndex] }
    var isLast: Bool { currentModuleIndex == nbaModules.count - 1 }

    var answeredInCurrentModule: Int {
        currentModule.questions.filter { answers[$0.id] != nil }.count
    }
    var allAnsweredInModule: Bool {
        answeredInCurrentModule == currentModule.questions.count
    }

    var totalAnswered: Int { answers.count }
    var totalQuestions: Int { NBAEngine.shared.totalQuestions }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // ── Fortschritt-Hinweis ─────────────────────────
                if currentModuleIndex > 0 {
                    HStack(spacing: 8) {
                        Image(systemName: "clock.arrow.circlepath")
                            .foregroundColor(Color(hex: "0891B2"))
                        Text("Du setzt einen laufenden Test fort (Modul \(currentModuleIndex + 1) von \(nbaModules.count))")
                            .font(.caption)
                        Spacer()
                        Button("Neu starten") { resetProgress() }
                            .font(.caption.bold())
                            .foregroundColor(.red)
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 6)
                    .background(Color(hex: "0891B2").opacity(0.06))
                }

                // ── Datenschutz-Hinweis ─────────────────────────
                HStack(spacing: 6) {
                    Image(systemName: "lock.shield.fill")
                        .font(.caption)
                        .foregroundColor(Color(hex: "0891B2"))
                    Text("Deine Antworten bleiben auf deinem Gerät. Keine Daten werden übertragen.")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top, 8)
                .padding(.bottom, 4)

                // ── Fortschrittsbalken ──────────────────────────
                VStack(spacing: 4) {
                    ProgressView(value: Double(totalAnswered), total: Double(totalQuestions))
                        .tint(Color(hex: "0891B2"))
                        .padding(.horizontal)
                    Text("\(totalAnswered) von \(totalQuestions) Fragen beantwortet")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.bottom, 12)

                // ── Modul-Header ────────────────────────────────
                HStack(spacing: 10) {
                    Image(systemName: currentModule.icon)
                        .font(.title2)
                        .foregroundColor(Color(hex: "0891B2"))
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Modul \(currentModule.id) von \(nbaModules.count)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(currentModule.title)
                            .font(.headline)
                    }
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.bottom, 4)

                Text(currentModule.description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding(.horizontal)
                    .padding(.bottom, 12)

                Divider()

                // ── Fragen ──────────────────────────────────────
                ScrollViewReader { proxy in
                    ScrollView {
                        VStack(spacing: 20) {
                            Color.clear.frame(height: 0).id("top")
                            ForEach(Array(currentModule.questions.enumerated()), id: \.element.id) { idx, question in
                                NBAQuestionCard(
                                    index: idx + 1,
                                    question: question,
                                    selected: answers[question.id],
                                    onSelect: { value in
                                        answers[question.id] = value
                                        saveAnswers()
                                    }
                                )
                            }
                        }
                        .padding()
                    }
                    .onChange(of: currentModuleIndex) {
                        proxy.scrollTo("top", anchor: .top)
                    }
                }

                Divider()

                // ── Navigation ──────────────────────────────────
                HStack(spacing: 12) {
                    if currentModuleIndex > 0 {
                        Button {
                            withAnimation { currentModuleIndex -= 1 }
                        } label: {
                            Text("← Zurück")
                                .font(.subheadline)
                                .frame(height: 50)
                                .frame(maxWidth: .infinity)
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                        }
                    }

                    Button {
                        if isLast {
                            let r = NBAEngine.shared.calculate(answers: answers)
                            result = r
                            showResult = true
                        } else {
                            withAnimation { currentModuleIndex += 1 }
                        }
                    } label: {
                        Text(isLast ? "Auswertung →" : "Weiter →")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(height: 50)
                            .frame(maxWidth: .infinity)
                            .background(allAnsweredInModule ? Color(hex: "0891B2") : Color.gray)
                            .cornerRadius(12)
                    }
                    .disabled(!allAnsweredInModule)
                }
                .padding()
            }
            .navigationTitle("Pflegegrad-Selbsttest")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }
                }
            }
            .navigationDestination(isPresented: $showResult) {
                if let r = result {
                    NBAResultView(
                        result: r,
                        onUseResult: { pg in
                            resetProgress()
                            onResult(r)
                            dismiss()
                        },
                        onCompleted: { shouldSave in
                            if !shouldSave { resetProgress() }
                            onResult(r)
                            onCompleted?(shouldSave)
                        }
                    )
                }
            }
            .onAppear { loadAnswers() }
        }
    }

    private func loadAnswers() {
        if let data = UserDefaults.standard.data(forKey: answersKey),
           let decoded = try? JSONDecoder().decode([String: Int].self, from: data) {
            answers = decoded
        }
    }

    private func saveAnswers() {
        if let data = try? JSONEncoder().encode(answers) {
            UserDefaults.standard.set(data, forKey: answersKey)
        }
    }

    private func resetProgress() {
        currentModuleIndex = 0
        answers = [:]
        UserDefaults.standard.removeObject(forKey: answersKey)
    }
}

// MARK: - Einzelne Frage-Karte

struct NBAQuestionCard: View {
    let index: Int
    let question: NBAQuestion
    let selected: Int?
    let onSelect: (Int) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("\(index). \(question.text)")
                .font(.subheadline.bold())

            if let hint = question.hint {
                Text(hint)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            VStack(spacing: 6) {
                ForEach(question.scale.options, id: \.value) { option in
                    Button {
                        onSelect(option.value)
                    } label: {
                        HStack {
                            Image(systemName: selected == option.value
                                  ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(selected == option.value
                                                 ? Color(hex: "0891B2") : .secondary)
                            Text(option.label)
                                .font(.subheadline)
                                .foregroundColor(.primary)
                            Spacer()
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(selected == option.value
                                    ? Color(hex: "0891B2").opacity(0.1)
                                    : Color(.systemGray6))
                        .cornerRadius(8)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.05), radius: 3, y: 1)
    }
}
