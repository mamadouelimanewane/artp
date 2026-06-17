import jsPDF from "jspdf";

export interface ReportData {
  period: string;
  kpis: { label: string; value: string; trend: string }[];
  operators: { name: string; download: number; upload: number; latency: number; blindSpots: number; score: number }[];
  recommendations: { priority: string; text: string }[];
}

export function generateArtpPdf(data: ReportData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 20;

  // PAGE 1 — En-tete + KPIs
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageW, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ARTP — Autorité de Régulation des Télécommunications", margin, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Rapport Qualité de Service — " + data.period, margin, 28);
  doc.setFontSize(9);
  doc.text("Confidentiel — Usage interne", margin, 38);

  // KPIs
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Indicateurs clés de performance", margin, 60);

  let y = 72;
  data.kpis.forEach((kpi, i) => {
    const x = margin + (i % 2) * 85;
    if (i % 2 === 0 && i > 0) y += 28;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, 78, 22, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 4, y + 8);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(kpi.value, x + 4, y + 18);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.trend, x + 50, y + 18);
  });

  // PAGE 2 — Tableau operateurs
  doc.addPage();
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageW, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Conformité QoS par Opérateur", margin, 14);

  const cols = ["Opérateur", "Download", "Upload", "Latence", "Zones blanches", "Score"];
  const colWidths = [35, 28, 28, 28, 38, 20];
  let tx = margin;
  let ty = 35;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, ty - 6, 170, 10, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  cols.forEach((col, i) => {
    doc.text(col, tx + 2, ty);
    tx += colWidths[i];
  });

  ty += 8;
  data.operators.forEach((op) => {
    tx = margin;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const row = [
      op.name.toUpperCase(),
      op.download.toFixed(1) + " Mbps",
      op.upload.toFixed(1) + " Mbps",
      op.latency.toFixed(0) + " ms",
      op.blindSpots.toString(),
      op.score + "%",
    ];
    const isCompliant = op.download >= 5 && op.latency <= 100;
    if (!isCompliant) {
      doc.setFillColor(254, 242, 242);
      doc.rect(margin, ty - 5, 170, 9, "F");
    }
    row.forEach((val, i) => {
      doc.text(val, tx + 2, ty);
      tx += colWidths[i];
    });
    if (!isCompliant) {
      doc.setTextColor(220, 38, 38);
      doc.text("Non conforme", 155, ty);
    }
    ty += 10;
    doc.setTextColor(51, 65, 85);
  });

  // Seuils
  ty += 5;
  doc.setFillColor(239, 246, 255);
  doc.rect(margin, ty, 170, 18, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("Seuils minimaux ARTP réglementaires:", margin + 3, ty + 7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Débit descendant >= 5 Mbps  |  Débit montant >= 1 Mbps  |  Latence <= 100 ms  |  Disponibilité >= 99%",
    margin + 3,
    ty + 14
  );

  // PAGE 3 — Recommandations
  doc.addPage();
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageW, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Recommandations & Plan d'action", margin, 14);

  ty = 35;
  const priorityColors: Record<string, [number, number, number]> = {
    haute: [220, 38, 38],
    moyenne: [234, 88, 12],
    basse: [22, 163, 74],
  };

  data.recommendations.forEach((rec, i) => {
    const color = priorityColors[rec.priority] ?? [100, 116, 139];
    doc.setFillColor(...color);
    doc.roundedRect(margin, ty, 170, 24, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`Priorité ${rec.priority.toUpperCase()} — Action ${i + 1}`, margin + 4, ty + 8);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(rec.text, 160);
    doc.text(lines[0], margin + 4, ty + 16);
    ty += 30;
  });

  // Pied de page sur toutes les pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 282, pageW, 15, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(
      "ARTP — Autorité de Régulation des Télécommunications et des Postes du Sénégal",
      margin,
      290
    );
    doc.text(
      `Page ${p}/${totalPages} — Généré le ${new Date().toLocaleDateString("fr-FR")}`,
      pageW - margin,
      290,
      { align: "right" }
    );
  }

  doc.save(`rapport-artp-${data.period.replace(/\s/g, "-").toLowerCase()}.pdf`);
}
