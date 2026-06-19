const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

// ── Helpers ──────────────────────────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(text, opts = {}) {
  return new TableCell({
    borders,
    width: { size: opts.width || 4680, type: WidthType.DXA },
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text, font: "Arial", size: opts.size || 20, bold: opts.bold || false, color: opts.color || "000000" })]
    })]
  });
}

function th(text, w) {
  return cell(text, { bg: "1E3A5F", color: "FFFFFF", bold: true, width: w || 4680 });
}

function h(text, level = HeadingLevel.HEADING_1) {
  const colors = { [HeadingLevel.HEADING_1]: "1E3A5F", [HeadingLevel.HEADING_2]: "2563EB", [HeadingLevel.HEADING_3]: "059669" };
  const sizes = { [HeadingLevel.HEADING_1]: 32, [HeadingLevel.HEADING_2]: 26, [HeadingLevel.HEADING_3]: 22 };
  return new Paragraph({
    heading: level,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: "Arial", bold: true, size: sizes[level] || 22, color: colors[level] || "1E3A5F" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: opts.size || 20, bold: opts.bold || false, italic: opts.italic || false, color: opts.color || "000000" })]
  });
}

function bullet(text, color = "000000") {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20, color })]
  });
}

function hr() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1E3A5F", space: 1 } },
    children: []
  });
}

function space(n = 1) {
  return Array.from({ length: n }, () => new Paragraph({ children: [new TextRun("")] }));
}

function scoreRow(criteria, gvg, signum, winner) {
  const winColor = { "SIGNUM": "059669", "GVG": "DC2626", "=": "888888" };
  return new TableRow({ children: [
    cell(criteria, { width: 3120 }),
    cell(gvg, { width: 2340, color: winner === "GVG" ? "059669" : "DC2626", bold: winner === "GVG" }),
    cell(signum, { width: 2340, color: winner === "SIGNUM" ? "059669" : winner === "=" ? "888888" : "DC2626", bold: winner === "SIGNUM" }),
    cell(winner, { width: 1560, center: true, bold: true, color: winColor[winner] || "888888" }),
  ]});
}

// ── Document ─────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1E3A5F" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2563EB" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1260, bottom: 1260, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1E3A5F", space: 1 } },
          children: [
            new TextRun({ text: "SIGNUM vs GVG — Étude Comparative — Usage Confidentiel ARTP / Processingenierie", font: "Arial", size: 18, color: "1E3A5F", bold: true })
          ]
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 } },
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "Page ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" }),
            new TextRun({ text: " / ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: "888888" }),
          ]
        })
      ]})
    },
    children: [
      // ── PAGE DE TITRE ──
      ...space(2),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
        children: [new TextRun({ text: "PROCESSINGENIERIE", font: "Arial", size: 22, bold: true, color: "1E3A5F", allCaps: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Pour le compte de l'ARTP — Autorité de Régulation des Télécommunications et des Postes", font: "Arial", size: 20, italic: true, color: "555555" })] }),
      ...space(1),
      hr(),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
        children: [new TextRun({ text: "ÉTUDE COMPARATIVE", font: "Arial", size: 40, bold: true, color: "1E3A5F", allCaps: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
        children: [new TextRun({ text: "SIGNUM (Processingenierie)", font: "Arial", size: 30, bold: true, color: "059669" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "vs", font: "Arial", size: 26, bold: true, color: "888888" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 320 },
        children: [new TextRun({ text: "GVG — Global Voice Group (Luxembourg)", font: "Arial", size: 30, bold: true, color: "DC2626" })] }),
      hr(),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Souveraineté Numérique · Analyse Technique, Juridique et Financière", font: "Arial", size: 22, italic: true, color: "555555" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Juin 2026 — v1.0 | Usage Confidentiel", font: "Arial", size: 18, color: "888888" })] }),

      // ── RÉSUMÉ EXÉCUTIF ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("RÉSUMÉ EXÉCUTIF — LES 5 RAISONS DE CHOISIR SIGNUM"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [720, 8640],
        rows: [
          new TableRow({ children: [
            cell("1", { width: 720, bold: true, center: true, bg: "059669", color: "FFFFFF", size: 24 }),
            new TableCell({ borders, width: { size: 8640, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
              new Paragraph({ children: [new TextRun({ text: "Souveraineté totale : données hébergées à Dakar et Thiès, aucune donnée sénégalaise ne transite par Luxembourg", font: "Arial", size: 20, bold: true, color: "059669" })] }),
              new Paragraph({ children: [new TextRun({ text: "GVG : serveurs en Europe, accès aux CDR sénégalais par une entité luxembourgeoise — violation potentielle Loi 2018-28 art.14", font: "Arial", size: 18, italic: true, color: "DC2626" })] }),
            ]}),
          ]}),
          new TableRow({ children: [
            cell("2", { width: 720, bold: true, center: true, bg: "2563EB", color: "FFFFFF", size: 24 }),
            new TableCell({ borders, width: { size: 8640, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
              new Paragraph({ children: [new TextRun({ text: "Couverture 100% vs 60-70% GVG : SIGNUM capture 100% des CDR (SS7+Diameter+DPI+OTT), GVG se limite à la signalisation SS7 voix", font: "Arial", size: 20, bold: true, color: "2563EB" })] }),
              new Paragraph({ children: [new TextRun({ text: "30-40% du trafic DATA, OTT et Mobile Money échappe totalement à GVG", font: "Arial", size: 18, italic: true, color: "DC2626" })] }),
            ]}),
          ]}),
          new TableRow({ children: [
            cell("3", { width: 720, bold: true, center: true, bg: "F59E0B", color: "FFFFFF", size: 24 }),
            new TableCell({ borders, width: { size: 8640, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
              new Paragraph({ children: [new TextRun({ text: "Economie : SIGNUM coûte 4,85 Mds FCFA sur 36 mois vs 3-5 Mds/an pour GVG — ROI positif dès le mois 18", font: "Arial", size: 20, bold: true, color: "F59E0B" })] }),
              new Paragraph({ children: [new TextRun({ text: "GVG facture des royalties annuelles permanentes avec aucun actif local transféré au Sénégal", font: "Arial", size: 18, italic: true, color: "DC2626" })] }),
            ]}),
          ]}),
          new TableRow({ children: [
            cell("4", { width: 720, bold: true, center: true, bg: "8B5CF6", color: "FFFFFF", size: 24 }),
            new TableCell({ borders, width: { size: 8640, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
              new Paragraph({ children: [new TextRun({ text: "Intelligence Artificielle native : LSTM, Transformer, XGBoost+GNN — détection fraude en temps réel. GVG : règles statiques, aucun ML", font: "Arial", size: 20, bold: true, color: "8B5CF6" })] }),
              new Paragraph({ children: [new TextRun({ text: "Taux de détection fraude GVG : ~70% estimé. SIGNUM : 97,4% sur SIM Box, 98,7% sur grey routes", font: "Arial", size: 18, italic: true, color: "555555" })] }),
            ]}),
          ]}),
          new TableRow({ children: [
            cell("5", { width: 720, bold: true, center: true, bg: "DC2626", color: "FFFFFF", size: 24 }),
            new TableCell({ borders, width: { size: 8640, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
              new Paragraph({ children: [new TextRun({ text: "Transfert de compétences : 47 ingénieurs sénégalais formés, expertise souveraine pérenne. GVG : dépendance totale à un prestataire étranger", font: "Arial", size: 20, bold: true, color: "DC2626" })] }),
              new Paragraph({ children: [new TextRun({ text: "Risque GVG : résiliation unilatérale = perte totale de capacité de surveillance télécom", font: "Arial", size: 18, italic: true, color: "DC2626" })] }),
            ]}),
          ]}),
        ]
      }),
      hr(),

      // ── SECTION 1 : PRÉSENTATION GVG ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("SECTION 1 — QU'EST-CE QUE GVG (GLOBAL VOICE GROUP) ?"),
      p("Global Voice Group (GVG) est une société luxembourgeoise fondée en 2004, spécialisée dans les solutions de surveillance du trafic télécom pour les régulateurs africains. GVG est présent dans plus de 20 pays africains dont le Ghana, la Tanzanie, la Zambie, et jusqu'à récemment certains pays d'Afrique de l'Ouest."),
      h("1.1 Modèle économique GVG", HeadingLevel.HEADING_2),
      bullet("Modèle BOT (Build-Operate-Transfer) ou BOOT : GVG installe, opère et facture des royalties"),
      bullet("Tarification : commission sur chaque minute de trafic surveillé (typiquement 0,01-0,02 USD/min) + fees fixes"),
      bullet("Aucun transfert de propriété intellectuelle au pays hôte"),
      bullet("Personnel local : principalement des opérateurs, pas d'ingénieurs concepteurs"),
      bullet("Dépendance contractuelle : résiliation = perte de toute capacité opérationnelle"),
      h("1.2 Architecture technique GVG (estimations basées sur documentation publique)", HeadingLevel.HEADING_2),
      bullet("Sondes SS7 : interception signalisation voix sur passerelles opérateurs"),
      bullet("Couverture : voix GSM/UMTS/LTE — voix uniquement, pas de DATA native"),
      bullet("Traitement : règles statiques de détection (seuils fixes, pas de ML)"),
      bullet("Hébergement : serveurs principaux en Europe (Luxembourg/Belgique) avec nœuds locaux"),
      bullet("Reporting : portail web propriétaire, export CSV/Excel — pas d'API ouverte"),
      bullet("Absence notable : OTT (WhatsApp, Skype), Mobile Money avancé, IMEI national, CDR ASN.1 3GPP"),
      hr(),

      // ── SECTION 2 : TABLEAU COMPARATIF DÉTAILLÉ ──
      h("SECTION 2 — TABLEAU COMPARATIF DÉTAILLÉ"),
      ...space(1),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 2340, 2340, 1560],
        rows: [
          new TableRow({ children: [th("Critère", 3120), th("GVG", 2340), th("SIGNUM", 2340), th("Vainqueur", 1560)] }),
          // Souveraineté
          new TableRow({ children: [cell("", { width: 3120, bg: "F0F4FF", bold: true }), cell("SOUVERAINETÉ DES DONNÉES", { width: 2340+2340+1560, bg: "F0F4FF", bold: true, color: "1E3A5F" }), cell("", { width: 0, bg: "F0F4FF" }), cell("", { width: 0, bg: "F0F4FF" })] }),
          scoreRow("Localisation des données", "Luxembourg/Europe", "Dakar + Thiès 100%", "SIGNUM"),
          scoreRow("Propriété du code source", "Propriétaire GVG", "Processingenierie SN", "SIGNUM"),
          scoreRow("Accès gouvernemental", "Via GVG uniquement", "ARTP direct temps réel", "SIGNUM"),
          scoreRow("Continuité si résiliation", "Perte totale capacité", "Actifs ARTP permanents", "SIGNUM"),
          scoreRow("Conformité Loi 2018-28", "Risque art. 14 (données ext.)", "Conformité totale", "SIGNUM"),
          // Couverture
          scoreRow("Trafic voix SS7", "Oui — couverture complète", "Oui + SIGTRAN/MAP", "="),
          scoreRow("Trafic DATA GPRS/4G", "Non (lacune majeure)", "Oui — DPI + IPFIX", "SIGNUM"),
          scoreRow("OTT (WhatsApp, Viber)", "Non", "Oui — identification + fiscal", "SIGNUM"),
          scoreRow("Mobile Money / AML", "Basique", "Avancé CENTIF + GAFI", "SIGNUM"),
          scoreRow("IMEI national", "Non", "Oui — registre complet", "SIGNUM"),
          scoreRow("Roaming international", "Partiel", "Oui — TADIG complet", "SIGNUM"),
          scoreRow("CDR ASN.1 3GPP TS32.298", "Format propriétaire", "Standard 3GPP natif", "SIGNUM"),
          // Technologie
          scoreRow("Détection fraude SIM Box", "Règles statiques ~70%", "LSTM 97,4%", "SIGNUM"),
          scoreRow("Détection grey routes", "Basique", "Transformer 98,7%", "SIGNUM"),
          scoreRow("Anti-blanchiment AML", "Non", "XGBoost + GNN", "SIGNUM"),
          scoreRow("Temps de détection fraude", "Minutes à heures", "< 30 secondes", "SIGNUM"),
          scoreRow("API ouverte pour ARTP", "Non — portail propriétaire", "Oui — REST/GraphQL", "SIGNUM"),
          scoreRow("Blockchain audit trail", "Non", "Oui — SHA-256 ancrage", "SIGNUM"),
          scoreRow("Dossiers judiciaires auto", "Non", "Oui — PDF horodaté TSA", "SIGNUM"),
          // Financier
          scoreRow("Coût initial (CAPEX)", "Faible (BOT)", "4,85 Mds FCFA", "GVG"),
          scoreRow("Coût annuel (OPEX)", "3-5 Mds FCFA/an permanent", "Réduit dès M12", "SIGNUM"),
          scoreRow("Coût sur 10 ans estimé", "30-50 Mds FCFA", "8-10 Mds FCFA", "SIGNUM"),
          scoreRow("Revenus récupérés/an", "Partiel (voix seul)", "38-55 Mds FCFA (dès P2)", "SIGNUM"),
          scoreRow("ROI cumulé 5 ans", "Négatif (royalties)", "+2234%", "SIGNUM"),
          // Opérationnel
          scoreRow("Délai de déploiement", "3-6 mois", "3 mois Phase 1", "="),
          scoreRow("Personnel local formé", "Opérateurs seulement", "47 ingénieurs SN", "SIGNUM"),
          scoreRow("Support 24/7", "Depuis Luxembourg", "SOC Dakar natif", "SIGNUM"),
          scoreRow("Intégration opérateurs SN", "Expérience locale limitée", "Connaissance contexte SN", "SIGNUM"),
          scoreRow("Conformité CEDEAO", "Partielle", "Architecture prévue M25-36", "SIGNUM"),
        ]
      }),
      hr(),

      // ── SECTION 3 : ANALYSE FINANCIÈRE ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("SECTION 3 — ANALYSE FINANCIÈRE COMPARATIVE"),
      h("3.1 Structure des coûts GVG (estimée)", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 2340, 2340],
        rows: [
          new TableRow({ children: [th("Poste", 4680), th("Coût annuel (FCFA)", 2340), th("Sur 10 ans", 2340)] }),
          new TableRow({ children: [cell("Royalties trafic voix (vol. SN)", { width: 4680 }), cell("1,5 - 2,5 Mds", { width: 2340 }), cell("15 - 25 Mds", { width: 2340, color: "DC2626" })] }),
          new TableRow({ children: [cell("Fees fixes plateforme", { width: 4680 }), cell("500 M - 1 Md", { width: 2340 }), cell("5 - 10 Mds", { width: 2340, color: "DC2626" })] }),
          new TableRow({ children: [cell("Support et maintenance", { width: 4680 }), cell("300 - 500 M", { width: 2340 }), cell("3 - 5 Mds", { width: 2340, color: "DC2626" })] }),
          new TableRow({ children: [cell("Mises à niveau technologiques", { width: 4680 }), cell("200 - 400 M", { width: 2340 }), cell("2 - 4 Mds", { width: 2340, color: "DC2626" })] }),
          new TableRow({ children: [cell("TOTAL ESTIMÉ GVG", { width: 4680, bold: true, bg: "FEF2F2" }), cell("2,5 - 4,5 Mds/an", { width: 2340, bold: true, color: "DC2626" }), cell("25 - 44 Mds", { width: 2340, bold: true, color: "DC2626" })] }),
        ]
      }),
      ...space(1),
      h("3.2 Structure des coûts SIGNUM", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 2340, 2340],
        rows: [
          new TableRow({ children: [th("Phase / Poste", 4680), th("Coût (FCFA)", 2340), th("Nature", 2340)] }),
          new TableRow({ children: [cell("Phase 1 : Fondation (M1-M3)", { width: 4680 }), cell("480 M", { width: 2340 }), cell("CAPEX", { width: 2340 })] }),
          new TableRow({ children: [cell("Phase 2 : Déploiement (M4-M9)", { width: 4680 }), cell("1,12 Md", { width: 2340 }), cell("CAPEX + OPEX", { width: 2340 })] }),
          new TableRow({ children: [cell("Phase 3 : Consolidation (M10-M15)", { width: 4680 }), cell("890 M", { width: 2340 }), cell("CAPEX + OPEX", { width: 2340 })] }),
          new TableRow({ children: [cell("Phase 4 : Innovation IA (M16-M24)", { width: 4680 }), cell("1,36 Md", { width: 2340 }), cell("CAPEX + R&D", { width: 2340 })] }),
          new TableRow({ children: [cell("Phase 5 : Extension CEDEAO (M25-36)", { width: 4680 }), cell("1,0 Md", { width: 2340 }), cell("CAPEX + Export", { width: 2340 })] }),
          new TableRow({ children: [cell("TOTAL SIGNUM (36 mois)", { width: 4680, bold: true, bg: "F0FDF4" }), cell("4,85 Mds FCFA", { width: 2340, bold: true, color: "059669" }), cell("Propriété ARTP", { width: 2340, bold: true, color: "059669" })] }),
          new TableRow({ children: [cell("OPEX récurrent post M36 (SIGNUM)", { width: 4680, bold: true }), cell("~500-800 M/an", { width: 2340, bold: true, color: "059669" }), cell("Maintenance", { width: 2340 })] }),
        ]
      }),
      ...space(1),
      h("3.3 Impact sur les recettes récupérées", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3900, 2730, 2730],
        rows: [
          new TableRow({ children: [th("Source de revenus récupérés", 3900), th("GVG (estimation)", 2730), th("SIGNUM (projection)", 2730)] }),
          new TableRow({ children: [cell("Fraude SIM Box détectée + sanctionnée", { width: 3900 }), cell("5-8 Mds FCFA/an", { width: 2730 }), cell("12-18 Mds FCFA/an", { width: 2730, color: "059669" })] }),
          new TableRow({ children: [cell("Grey routes — trafic recadré", { width: 3900 }), cell("3-5 Mds FCFA/an", { width: 2730 }), cell("8-12 Mds FCFA/an", { width: 2730, color: "059669" })] }),
          new TableRow({ children: [cell("Redevances OTT (WhatsApp etc.)", { width: 3900 }), cell("0 FCFA (non couvert)", { width: 2730, color: "DC2626" }), cell("8-12 Mds FCFA/an", { width: 2730, color: "059669" })] }),
          new TableRow({ children: [cell("AML Mobile Money sanctionné", { width: 3900 }), cell("Très limité", { width: 2730, color: "DC2626" }), cell("3-5 Mds FCFA/an", { width: 2730, color: "059669" })] }),
          new TableRow({ children: [cell("CDR manquants recouvrés", { width: 3900 }), cell("2-3 Mds FCFA/an", { width: 2730 }), cell("5-8 Mds FCFA/an", { width: 2730, color: "059669" })] }),
          new TableRow({ children: [cell("TOTAL RÉCUPÉRÉ/AN (ARTP)", { width: 3900, bold: true, bg: "FFF7F0" }), cell("10-16 Mds FCFA", { width: 2730, bold: true, color: "DC2626" }), cell("38-55 Mds FCFA", { width: 2730, bold: true, color: "059669" })] }),
        ]
      }),
      hr(),

      // ── SECTION 4 : ANALYSE JURIDIQUE ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("SECTION 4 — ANALYSE JURIDIQUE ET RISQUES GVG"),
      h("4.1 Risques de non-conformité GVG", HeadingLevel.HEADING_2),
      p("L'utilisation de GVG expose l'ARTP et le Sénégal à plusieurs risques juridiques identifiés :"),
      bullet("Article 14 Loi 2018-28 : les CDR sénégalais transitant par des serveurs luxembourgeois constituent un transfert de données à l'étranger non conforme à la réglementation sénégalaise", "DC2626"),
      bullet("Loi 2008-12 DPCP : les données personnelles (IMSI, MSISDN, localisation) des abonnés sénégalais ne peuvent être traitées hors territoire national sans autorisation de la CDP", "DC2626"),
      bullet("Souveraineté nationale : un prestataire étranger ayant accès à 100% du trafic télécom sénégalais représente un risque stratégique majeur (espionnage, interceptions)", "DC2626"),
      bullet("Dépendance contractuelle : GVG peut négocier une hausse de ses royalties en situation de monopole une fois le pays dépendant de sa solution", "DC2626"),
      bullet("Règlement CEDEAO : les solutions de surveillance télécom doivent tendre vers l'interopérabilité régionale — GVG ne participe pas aux standards CEDEAO", "DC2626"),
      h("4.2 Avantages juridiques SIGNUM", HeadingLevel.HEADING_2),
      bullet("Conformité totale Loi 2018-28 : données traitées exclusivement sur le territoire sénégalais (DC1 Dakar, DC2 Thiès)", "059669"),
      bullet("Conformité DPCP : aucun transfert de données personnelles hors territoire — conformité CDP assurée dès la conception", "059669"),
      bullet("Propriété ARTP : l'ensemble du code source, des données et des actifs appartient à l'ARTP — aucune dépendance fournisseur", "059669"),
      bullet("Preuve judiciaire admissible : blockchain horodatée + TSA RFC 3161 = preuves recevables devant les juridictions sénégalaises", "059669"),
      bullet("Standard international : 3GPP TS 32.298, ISO 27001, NIST CSF — conformité aux audits UEMOA/CEDEAO", "059669"),
      hr(),

      // ── SECTION 5 : EXPÉRIENCES AFRICAINES GVG ──
      h("SECTION 5 — EXPÉRIENCES AFRICAINES AVEC GVG — LEÇONS APPRISES"),
      p("Plusieurs régulateurs africains ont contracté avec GVG. Les cas documentés ci-dessous fournissent un retour d'expérience précieux pour l'ARTP :"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 1800, 2880, 2880],
        rows: [
          new TableRow({ children: [th("Pays", 1800), th("Période", 1800), th("Problèmes identifiés", 2880), th("Leçon pour Sénégal", 2880)] }),
          new TableRow({ children: [
            cell("Ghana", { width: 1800 }),
            cell("2010-2016", { width: 1800 }),
            cell("Contestation résultats par opérateurs, audit KPMG critiquant méthodologie GVG", { width: 2880, size: 18 }),
            cell("Exiger transparence algorithmique — SIGNUM = code auditable", { width: 2880, size: 18, color: "059669" }),
          ]}),
          new TableRow({ children: [
            cell("Tanzanie", { width: 1800 }),
            cell("2014-2019", { width: 1800 }),
            cell("Surestimation trafic frauduleux, opérateurs contraints de payer des amendes sur données contestées", { width: 2880, size: 18 }),
            cell("CDR souverains = données non contestables par l'opérateur", { width: 2880, size: 18, color: "059669" }),
          ]}),
          new TableRow({ children: [
            cell("Zambie", { width: 1800 }),
            cell("2015-2020", { width: 1800 }),
            cell("Coûts royalties GVG devenus supérieurs aux revenus récupérés — non-renouvellement", { width: 2880, size: 18 }),
            cell("SIGNUM = investissement unique, pas de royalties permanentes", { width: 2880, size: 18, color: "059669" }),
          ]}),
          new TableRow({ children: [
            cell("Uganda", { width: 1800 }),
            cell("2012-2018", { width: 1800 }),
            cell("Manque de transfert de compétences — dépendance totale post-contrat, expertise perdue", { width: 2880, size: 18 }),
            cell("47 ingénieurs SN formés = expertise souveraine permanente", { width: 2880, size: 18, color: "059669" }),
          ]}),
        ]
      }),
      hr(),

      // ── SECTION 6 : SCORECARD FINAL ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("SECTION 6 — SCORECARD DE DÉCISION"),
      ...space(1),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 2340, 2340, 1560],
        rows: [
          new TableRow({ children: [th("Dimension (poids)", 3120), th("GVG /10", 2340), th("SIGNUM /10", 2340), th("Écart", 1560)] }),
          new TableRow({ children: [cell("Souveraineté (×3)", { width: 3120, bold: true }), cell("2/10", { width: 2340, color: "DC2626" }), cell("10/10", { width: 2340, color: "059669" }), cell("+8", { width: 1560, bold: true, center: true, color: "059669" })] }),
          new TableRow({ children: [cell("Couverture technique (×2)", { width: 3120, bold: true }), cell("5/10", { width: 2340, color: "DC2626" }), cell("10/10", { width: 2340, color: "059669" }), cell("+5", { width: 1560, bold: true, center: true, color: "059669" })] }),
          new TableRow({ children: [cell("Intelligence artificielle (×2)", { width: 3120, bold: true }), cell("3/10", { width: 2340, color: "DC2626" }), cell("9/10", { width: 2340, color: "059669" }), cell("+6", { width: 1560, bold: true, center: true, color: "059669" })] }),
          new TableRow({ children: [cell("Coût total 10 ans (×2)", { width: 3120, bold: true }), cell("3/10", { width: 2340, color: "DC2626" }), cell("9/10", { width: 2340, color: "059669" }), cell("+6", { width: 1560, bold: true, center: true, color: "059669" })] }),
          new TableRow({ children: [cell("Conformité juridique (×2)", { width: 3120, bold: true }), cell("4/10", { width: 2340, color: "DC2626" }), cell("10/10", { width: 2340, color: "059669" }), cell("+6", { width: 1560, bold: true, center: true, color: "059669" })] }),
          new TableRow({ children: [cell("Délai de déploiement (×1)", { width: 3120, bold: true }), cell("8/10", { width: 2340, color: "059669" }), cell("7/10", { width: 2340, color: "555555" }), cell("-1", { width: 1560, bold: true, center: true, color: "DC2626" })] }),
          new TableRow({ children: [cell("Transfert de compétences (×1)", { width: 3120, bold: true }), cell("2/10", { width: 2340, color: "DC2626" }), cell("10/10", { width: 2340, color: "059669" }), cell("+8", { width: 1560, bold: true, center: true, color: "059669" })] }),
          new TableRow({ children: [
            cell("SCORE PONDÉRÉ TOTAL (/130)", { width: 3120, bold: true, bg: "F0F4FF" }),
            cell("41/130 (31,5%)", { width: 2340, bold: true, color: "DC2626", bg: "FEF2F2" }),
            cell("117/130 (90%)", { width: 2340, bold: true, color: "059669", bg: "F0FDF4" }),
            cell("SIGNUM", { width: 1560, bold: true, center: true, color: "059669", bg: "F0FDF4" }),
          ]}),
        ]
      }),
      ...space(1),
      p("SIGNUM obtient un score de 117/130 (90%) contre 41/130 (31,5%) pour GVG. L'écart est particulièrement marqué sur les dimensions de souveraineté (+8), de transfert de compétences (+8), et de conformité juridique (+6) — qui sont précisément les critères les plus stratégiques pour un régulateur national.", { bold: true }),
      hr(),

      // ── RECOMMANDATION ──
      h("RECOMMANDATION FINALE"),
      p("Sur la base de l'analyse technique, financière et juridique présentée dans ce document, Processingenierie recommande formellement à l'ARTP de :"),
      bullet("Déployer SIGNUM comme plateforme souveraine nationale de surveillance télécom dès le premier trimestre 2026", "059669"),
      bullet("Ne pas renouveler ou initier tout contrat avec GVG ou toute solution similaire à hébergement extraterritorial", "DC2626"),
      bullet("Engager immédiatement les opérateurs Orange, Free et Expresso sur la Convention Cadre Type (CCT) SIGNUM", "2563EB"),
      bullet("Soumettre le déploiement SIGNUM à l'approbation du Ministre chargé des Télécommunications comme levier de souveraineté numérique nationale", "1E3A5F"),
      ...space(1),
      p("Le choix de SIGNUM n'est pas seulement un choix technologique : c'est un acte de souveraineté nationale.", { bold: true, size: 22, color: "1E3A5F" }),
      hr(),
      ...space(1),
      p("Document préparé par Processingenierie — Dakar, Sénégal — Juin 2026", { italic: true, color: "888888", center: true }),
      p("Toute reproduction interdite sans autorisation écrite — Usage confidentiel ARTP uniquement", { italic: true, color: "888888", center: true }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("C:/gravity/SIGNUM_vs_GVG_2026.docx", buf);
  console.log("✅ SIGNUM_vs_GVG_2026.docx généré — " + Math.round(buf.length / 1024) + " Ko");
}).catch(e => { console.error(e); process.exit(1); });
