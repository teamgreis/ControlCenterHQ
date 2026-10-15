import SwiftUI
import UIKit

struct ExportView: View {
    @EnvironmentObject var auth: AuthService
    @State private var exporting: String? = nil
    @State private var result: String? = nil
    @State private var error: String? = nil

    struct ExportItem: Identifiable {
        let id: String
        let title: String
        let subtitle: String
        let icon: String
        let color: Color
        let path: String
        let filename: String
    }

    let exports: [ExportItem] = [
        ExportItem(id: "logs", title: "Audit-Logs", subtitle: "Alle Systemereignisse als CSV",
                   icon: "doc.text.fill", color: .blue, path: "/api/export/logs", filename: "atlas_logs.csv"),
        ExportItem(id: "incidents", title: "Einsätze", subtitle: "Alle Einsätze als CSV",
                   icon: "exclamationmark.triangle.fill", color: .orange, path: "/api/export/incidents", filename: "atlas_incidents.csv"),
        ExportItem(id: "fleet", title: "Flotte", subtitle: "Alle Fahrzeuge als CSV",
                   icon: "car.fill", color: .green, path: "/api/export/fleet", filename: "atlas_fleet.csv"),
    ]

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 16) {
                    // Info
                    HStack {
                        Image(systemName: "info.circle").foregroundColor(.blue)
                        Text("Exports werden als CSV-Dateien erstellt und können geteilt werden.")
                            .font(.system(size: 13))
                            .foregroundColor(.gray)
                    }
                    .padding()
                    .background(Color.blue.opacity(0.08))
                    .cornerRadius(10)
                    .padding(.horizontal)

                    // Result / Error banner
                    if let res = result {
                        HStack {
                            Image(systemName: "checkmark.circle.fill").foregroundColor(.green)
                            Text(res).font(.system(size: 13)).foregroundColor(.green)
                            Spacer()
                            Button { self.result = nil } label: {
                                Image(systemName: "xmark").foregroundColor(.gray)
                            }
                        }
                        .padding()
                        .background(Color.green.opacity(0.08))
                        .cornerRadius(10)
                        .padding(.horizontal)
                    }

                    if let err = error {
                        HStack {
                            Image(systemName: "exclamationmark.triangle").foregroundColor(.red)
                            Text(err).font(.system(size: 13)).foregroundColor(.red)
                            Spacer()
                            Button { self.error = nil } label: {
                                Image(systemName: "xmark").foregroundColor(.gray)
                            }
                        }
                        .padding()
                        .background(Color.red.opacity(0.08))
                        .cornerRadius(10)
                        .padding(.horizontal)
                    }

                    // Export cards
                    ForEach(exports) { item in
                        ExportCard(item: item, loading: exporting == item.id) {
                            doExport(item)
                        }
                        .padding(.horizontal)
                    }

                    Spacer()
                }
                .padding(.top)
            }
            .navigationTitle("Daten-Export")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    func doExport(_ item: ExportItem) {
        exporting = item.id
        error = nil
        result = nil
        Task {
            do {
                let csvData = try await NetworkService.shared.getRaw(path: item.path, token: auth.token)
                let url = FileManager.default.temporaryDirectory.appendingPathComponent(item.filename)
                try csvData.write(to: url)
                await MainActor.run {
                    exporting = nil
                    // Share sheet
                    let av = UIActivityViewController(activityItems: [url], applicationActivities: nil)
                    if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                       let root = scene.windows.first?.rootViewController {
                        root.present(av, animated: true)
                    }
                }
            } catch {
                await MainActor.run {
                    exporting = nil
                    self.error = "Export fehlgeschlagen: \(error.localizedDescription)"
                }
            }
        }
    }
}

struct ExportCard: View {
    let item: ExportView.ExportItem
    let loading: Bool
    let onExport: () -> Void

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(item.color.opacity(0.15))
                    .frame(width: 48, height: 48)
                Image(systemName: item.icon)
                    .foregroundColor(item.color)
                    .font(.system(size: 22))
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(item.title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                Text(item.subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
            Spacer()
            Button(action: onExport) {
                if loading {
                    ProgressView().scaleEffect(0.8).tint(.blue)
                        .frame(width: 32, height: 32)
                } else {
                    Image(systemName: "square.and.arrow.up")
                        .foregroundColor(.blue)
                        .font(.system(size: 18))
                }
            }
            .disabled(loading)
        }
        .padding()
        .background(Color(white: 0.08))
        .cornerRadius(12)
    }
}
