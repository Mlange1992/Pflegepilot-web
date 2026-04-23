import SwiftUI

// MARK: - Ratgeber Liste

struct RatgeberView: View {
    @State private var suche = ""

    var gefilterteArtikel: [RatgeberArtikel] {
        if suche.isEmpty { return RatgeberConfig.artikel }
        return RatgeberConfig.artikel.filter {
            $0.titel.localizedCaseInsensitiveContains(suche) ||
            $0.kurztext.localizedCaseInsensitiveContains(suche) ||
            $0.tags.contains { $0.localizedCaseInsensitiveContains(suche) }
        }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(gefilterteArtikel) { artikel in
                    NavigationLink(destination: RatgeberDetailView(artikel: artikel)) {
                        HStack(spacing: 14) {
                            Image(systemName: artikel.icon)
                                .font(.title2)
                                .foregroundColor(Color(hex: "0891B2"))
                                .frame(width: 44, height: 44)
                                .background(Color(hex: "0891B2").opacity(0.1))
                                .cornerRadius(10)

                            VStack(alignment: .leading, spacing: 4) {
                                Text(artikel.titel)
                                    .font(.subheadline.bold())
                                    .lineLimit(2)
                                Text(artikel.kurztext)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                    .lineLimit(2)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .searchable(text: $suche, prompt: "Ratgeber durchsuchen…")
            .navigationTitle("Ratgeber")
        }
    }
}

// MARK: - Ratgeber Detail

struct RatgeberDetailView: View {
    let artikel: RatgeberArtikel

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {

                // Header
                HStack(spacing: 14) {
                    Image(systemName: artikel.icon)
                        .font(.system(size: 36))
                        .foregroundColor(Color(hex: "0891B2"))
                        .frame(width: 60, height: 60)
                        .background(Color(hex: "0891B2").opacity(0.1))
                        .cornerRadius(14)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(artikel.titel)
                            .font(.title3.bold())
                        Text(artikel.kurztext)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "0891B2").opacity(0.08))
                .cornerRadius(16)

                // Inhalt (Markdown-ähnlich parsen)
                MarkdownTextView(markdown: artikel.inhalt)
                    .padding(.horizontal)


                Spacer(minLength: 32)
            }
            .padding(.top, 8)
        }
        .navigationTitle(artikel.titel)
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Einfacher Markdown-Renderer

struct MarkdownTextView: View {
    let markdown: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach(Array(zeilen.enumerated()), id: \.offset) { _, zeile in
                if zeile.hasPrefix("## ") {
                    Text(zeile.dropFirst(3))
                        .font(.headline)
                        .padding(.top, 4)
                } else if zeile.hasPrefix("- ") {
                    HStack(alignment: .top, spacing: 8) {
                        Text("•").foregroundColor(Color(hex: "0891B2"))
                        Text(zeile.dropFirst(2))
                            .font(.body)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                } else if !zeile.trimmingCharacters(in: .whitespaces).isEmpty {
                    Text(zeile)
                        .font(.body)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
    }

    private var zeilen: [String] {
        markdown.components(separatedBy: "\n")
    }
}
