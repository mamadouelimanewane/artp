const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink, TableOfContents
} = require('docx');
const fs = require('fs');

const INDIGO = "4F46E5";
const CYAN = "0891B2";
const DARK = "0F172A";
const GRAY = "64748B";
const WHITE = "FFFFFF";
const LIGHT_BG = "F8FAFC";
const GREEN = "059669";
const AMBER = "D97706";
const RED = "DC2626";
const PURPLE = "7C3AED";

const border1 = { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" };
const borders = { top: border1, bottom: border1, left: border1, right: border1 };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function cell(text, opts = {}) {
  return new TableCell({
    borders: opts.borders || borders,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({
        text: String(text),
        bold: opts.bold || false,
        size: opts.size || 20,
        color: opts.color || DARK,
        font: "Calibri",
      })]
    })]
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: INDIGO, space: 6 } },
    children: [new TextRun({ text, bold: true, size: 36, color: INDIGO, font: "Calibri" })]
  });
}

function heading2(text, color = DARK) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, size: 28, color, font: "Calibri" })]
  });
}

function heading3(text, color = DARK) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, bold: true, size: 22, color, font: "Calibri" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [new TextRun({
      text,
      size: opts.size || 20,
      color: opts.color || DARK,
      bold: opts.bold || false,
      italics: opts.italic || false,
      font: "Calibri",
    })]
  });
}

function bullet(text, color = DARK) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, color, font: "Calibri" })]
  });
}

function kpiTable(items) {
  // items: [{label, value, color}]
  const cols = items.length;
  const colW = Math.floor(9360 / cols);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: items.map(() => colW),
    rows: [
      new TableRow({
        children: items.map(it => new TableCell({
          borders,
          width: { size: colW, type: WidthType.DXA },
          shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 140, right: 140 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.value, bold: true, size: 36, color: it.color || INDIGO, font: "Calibri" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 16, color: GRAY, font: "Calibri" })] }),
          ]
        }))
      })
    ]
  });
}

function phaseTable(rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: rows[0].map((h, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: "1E293B", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: WHITE, font: "Calibri" })] })]
    }))
  });
  const dataRows = rows.slice(1).map((row, ri) => new TableRow({
    children: row.map((d, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: ri % 2 === 0 ? WHITE : LIGHT_BG, type: ShadingType.CLEAR },
      margins: { top: 70, bottom: 70, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: String(d), size: 18, color: DARK, font: "Calibri" })] })]
    }))
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows]
  });
}

function sp(n = 120) {
  return new Paragraph({ spacing: { before: n, after: n }, children: [new TextRun("")] });
}

// ============================================================
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: "Calibri", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Calibri", color: INDIGO },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: DARK },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 } },
    ]
  },
  sections: [
    // ==================== PAGE DE COUVERTURE ====================
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        sp(720),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 }, children: [new TextRun({ text: "PROCESSINGENIERIE  ×  ARTP", bold: true, size: 22, color: INDIGO, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text: "DOCUMENT CONFIDENTIEL — Juin 2026", size: 18, color: GRAY, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Plan Stratégique de Déploiement", bold: true, size: 56, color: DARK, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 480 }, children: [new TextRun({ text: "SIGNUM — 5 Phases · 36 Mois", bold: true, size: 40, color: INDIGO, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "Surveillance Intelligente et Gouvernance des Numéros et Usages Mobiles", size: 22, color: GRAY, italics: true, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 480 }, children: [new TextRun({ text: "Document de stratégie opérationnelle, technique et financière pour l’Autorité de Régulation des Télécommunications et des Postes du Sénégal", size: 20, color: GRAY, font: "Calibri" })] }),
        sp(120),
        // KPI cover table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1560, 1560, 1560, 1560, 1560, 1560],
          rows: [
            new TableRow({ children: [
              ...["Durée totale", "Budget total", "ROI an 3", "Opérateurs", "Effectif projet", "Recettes / an"].map((h, i) => new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, shading: { fill: "1E293B", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 16, color: WHITE, font: "Calibri" })] })] }))
            ]}),
            new TableRow({ children: [
              ...["36 mois", "4,85 Mds FCFA", "+2 847%", "3→8 CEDEAO", "47 personnes", "38–55 Mds FCFA"].map((v, i) => new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, shading: { fill: LIGHT_BG, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 80, right: 80 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: v, bold: true, size: 20, color: INDIGO, font: "Calibri" })] })] }))
            ]}),
          ]
        }),
        sp(720),
        new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 4, color: INDIGO, space: 12 } }, spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "Processingenierie · Dakar, Sénégal · www.processingenierie.sn", size: 18, color: GRAY, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ce document est confidentiel et réservé à l’ARTP, au Ministère et à la Présidence", size: 16, color: GRAY, italics: true, font: "Calibri" })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },

    // ==================== CONTENU PRINCIPAL ====================
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: INDIGO, space: 6 } },
          children: [
            new TextRun({ text: "SIGNUM × ARTP — Plan Stratégique de Déploiement · Confidentiel", size: 16, color: GRAY, font: "Calibri" }),
          ]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0", space: 6 } },
          children: [
            new TextRun({ text: "Processingenierie © 2026 · ", size: 16, color: GRAY, font: "Calibri" }),
            new TextRun({ text: "Page ", size: 16, color: GRAY, font: "Calibri" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY, font: "Calibri" }),
          ]
        })] })
      },
      children: [

        // TABLE DES MATIERES
        new TableOfContents("Table des matières", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== RESUME EXECUTIF =====
        heading1("1. Résumé Exécutif"),
        sp(60),
        kpiTable([
          { label: "Phases de déploiement", value: "5", color: INDIGO },
          { label: "Mois de programme", value: "36", color: RED },
          { label: "Personnes mobilisées", value: "47", color: GREEN },
          { label: "Budget total (Mds FCFA)", value: "4,85", color: AMBER },
        ]),
        sp(120),
        heading2("1.1 Objectif stratégique"),
        para("SIGNUM vise à doter l’ARTP d’un système souverain de surveillance télécom 100% sénégalais, capable de récupérer 38 à 55 milliards de FCFA par an de recettes fiscales actuellement perdues à cause des fraudes SIM Box, Grey Routes, non-conformités CDR et impact OTT non régulé."),
        para("En 36 mois, SIGNUM passera du déploiement national sénégalais à un export SaaS vers 7 pays de la CEDEAO, générant des revenus pour Processingenierie et une influence technologique du Sénégal dans la région."),
        sp(80),
        heading2("1.2 Ce que SIGNUM apporte à l’ARTP"),
        bullet("Indépendance technologique — Fin de la dépendance GVG/BOT — l’État possède le système"),
        bullet("Recettes fiscales récupérées — 38–55 Mds FCFA/an dès la Phase 2 (mois 9)"),
        bullet("Capacité judiciaire — Dossiers légaux admissibles devant les tribunaux sénégalais"),
        bullet("Transfert de compétences — 30 ingénieurs sénégalais formés en 18 mois"),
        sp(80),
        heading2("1.3 Jalons clés"),
        phaseTable([
          ["Jalon", "Mois", "Description"],
          ["Décision ARTP publiée", "Mois 1", "Texte réglementaire opposable aux 3 opérateurs"],
          ["Go Live national", "Mois 9", "3 opérateurs connectés · Alertes fraude temps réel actives"],
          ["1ère condamnation judiciaire", "Mois 18", "Dossier SIGNUM accepté par le Parquet de Dakar"],
          ["SIGNUM Africa lancé", "Mois 30", "3 pays CEDEAO sous licence · Revenus SaaS actifs"],
          ["Export complet CEDEAO", "Mois 36", "6 pays · 7,4 Mds FCFA de licences annuelles"],
        ], [2800, 1400, 5160]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== CONTEXTE =====
        heading1("2. Contexte et Enjeux"),
        heading2("2.1 Manque à gagner actuel (2026)"),
        phaseTable([
          ["Source de fraude", "Perte annuelle estimée"],
          ["SIM Box (bypass international)", "12–18 Mds FCFA"],
          ["CDR manquants / Grey Routes", "8–14 Mds FCFA"],
          ["Non-conformité fiscale opérateurs", "6–10 Mds FCFA"],
          ["OTT non taxé (WhatsApp, Viber, Skype)", "18–24 Mds FCFA"],
          ["Fraude Mobile Money (AML)", "3–5 Mds FCFA"],
          ["TOTAL", "47–71 Mds FCFA par an"],
        ], [6000, 3360]),
        sp(80),
        heading2("2.2 Cadre légal existant — Base de SIGNUM"),
        phaseTable([
          ["Texte légal", "Disposition pertinente"],
          ["Loi 2011-01 — Code des Télécoms SN", "Art. 17 : obligation opérateurs de fournir CDR à l’ARTP"],
          ["Loi 2008-12 — Protection données personnelles", "Autorise le traitement de données à des fins de régulation"],
          ["Loi 2018-28 — Cybercriminalité", "Art. 14 : données télécom doivent rester en territoire SN"],
          ["Décision ARMP 2023 — Résiliation GVG", "Précédent direct — laisse la place libre pour SIGNUM"],
        ], [4680, 4680]),
        sp(80),
        heading2("2.3 Parties prenantes et leurs attentes"),
        phaseTable([
          ["Partie prenante", "Attente principale", "Rôle dans SIGNUM"],
          ["ARTP", "Contrôle effectif des opérateurs", "Maître d’ouvrage — utilisateur principal"],
          ["Ministère des Finances / DGID", "Recettes fiscales maximisées", "Bénéficiaire direct des recettes récupérées"],
          ["Ministère Économie Numérique", "Souveraineté tech + régulation OTT", "Tutelle ARTP + validation politique"],
          ["Présidence / SGG", "Indépendance vis-à-vis fournisseurs étrangers", "Validation stratégique finale"],
          ["CENTIF", "Alertes AML temps réel GAFI R.16", "Réceptionnaire alertes Mobile Money"],
          ["Opérateurs (Orange/Free/Expresso)", "Traitement équitable, SLA définis", "Fournisseurs de données CDR"],
          ["Processingenierie", "Déploiement réussi + expansion CEDEAO", "Maître d’œuvre technique"],
        ], [2800, 3200, 3360]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== PHASE 1 =====
        heading1("3. Phase 1 — Fondation (Mois 1–3)"),
        sp(60),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [7200, 2160],
          rows: [new TableRow({ children: [
            new TableCell({ borders, shading: { fill: "1E3A8A", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 }, width: { size: 7200, type: WidthType.DXA }, children: [
              new Paragraph({ children: [new TextRun({ text: "Phase 1 — Fondation & Légalisation · Mois 1 à 3", bold: true, size: 24, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ children: [new TextRun({ text: "Poser les bases juridiques, techniques et humaines du projet", size: 18, color: "93C5FD", font: "Calibri" })] }),
            ]}),
            new TableCell({ borders, shading: { fill: "1E3A8A", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, width: { size: 2160, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "480 M FCFA", bold: true, size: 28, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Budget Phase 1", size: 16, color: "93C5FD", font: "Calibri" })] }),
            ]}),
          ]})]
        }),
        sp(100),
        heading2("3.1 Activités clés"),
        phaseTable([
          ["Période", "Activité", "Responsable"],
          ["Semaine 1-2", "Signature convention Processingenierie × ARTP + décision ARTP Art. 17", "ARTP + Juriste"],
          ["Semaine 3-4", "Signature 3 conventions opérateurs (Orange, Free, Expresso) avec SLA et pénalités", "Processingenierie"],
          ["Semaine 5-6", "Location racks datacenter Dakar DC1 · Déploiement réseau 10 Gbps", "DevOps"],
          ["Semaine 7-10", "Installation Kubernetes, Kafka, PostgreSQL, ClickHouse · SIGNUM v1.0", "Architecte système"],
          ["Semaine 11-12", "Tests de charge, pentest, validation ARTP sur données synthétiques", "Sécurité + ARTP"],
        ], [1600, 5360, 2400]),
        sp(80),
        heading2("3.2 Ressources humaines — Phase 1 (7 personnes)"),
        phaseTable([
          ["Poste", "Nb", "Profil requis", "Source", "Coût/mois"],
          ["Chef de projet SIGNUM", "1", "PMP + 10 ans télécom", "Processingenierie", "1,2 M FCFA"],
          ["Architecte système senior", "1", "Kubernetes, microservices, télécom", "Processingenierie", "1,0 M FCFA"],
          ["Juriste télécoms / réglementaire", "1", "Droit des télécoms SN + CEDEAO", "Recrutement SN", "0,8 M FCFA"],
          ["Ingénieur DevOps / Infrastructure", "2", "Kubernetes, Terraform, Linux", "Processingenierie", "1,6 M FCFA"],
          ["Responsable ARTP (liaison)", "1", "Cadre ARTP désigné", "ARTP (pris en charge)", "0"],
          ["Expert sécurité (pentest OSCP/CEH)", "1", "Expérience télécom + systèmes SCADA", "Prestataire ext.", "1,5 M (one-shot)"],
          ["TOTAL PHASE 1", "7", "", "", "~18 M FCFA / mois"],
        ], [3200, 600, 2400, 1760, 1400]),
        sp(80),
        heading2("3.3 Budget détaillé Phase 1 (480 M FCFA)"),
        phaseTable([
          ["Poste budgétaire", "Montant", "%"],
          ["Infrastructure serveurs (20 Dell R750 + stockage NAS)", "180 M FCFA", "37,5%"],
          ["Connectivité datacenter (fibres 10 Gbps × 3 opérateurs)", "45 M FCFA", "9,4%"],
          ["Licences logiciels (Kafka Enterprise, Elasticsearch)", "38 M FCFA", "7,9%"],
          ["Ressources humaines (3 mois × 7 personnes)", "54 M FCFA", "11,3%"],
          ["Conseil juridique & rédaction textes réglementaires", "28 M FCFA", "5,8%"],
          ["Audit sécurité (pentest + rapport)", "15 M FCFA", "3,1%"],
          ["Formation initiale 10 agents ARTP", "25 M FCFA", "5,2%"],
          ["Frais divers, déplacements, contingence 10%", "95 M FCFA", "19,8%"],
          ["TOTAL PHASE 1", "480 M FCFA", "100%"],
        ], [5760, 2200, 1400]),
        sp(80),
        heading2("3.4 Livrables Phase 1"),
        bullet("Décision ARTP publiée au Journal Officiel — texte réglementaire opposable aux opérateurs"),
        bullet("3 conventions signées (Orange, Free, Expresso) — format CDR, SLA, pénalités définis"),
        bullet("Infrastructure DC1 opérationnelle — Kubernetes + base de données + monitoring 24/7"),
        bullet("Rapport pentest validé — zéro vulnérabilité critique, signé par auditeur indépendant"),
        bullet("Plan de formation ARTP — programme 30 agents, calendrier 18 mois"),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== PHASE 2 =====
        heading1("4. Phase 2 — Déploiement (Mois 4–9)"),
        sp(60),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [7200, 2160],
          rows: [new TableRow({ children: [
            new TableCell({ borders, shading: { fill: "064E3B", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 }, width: { size: 7200, type: WidthType.DXA }, children: [
              new Paragraph({ children: [new TextRun({ text: "Phase 2 — Déploiement & Intégration opérateurs · Mois 4 à 9", bold: true, size: 24, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ children: [new TextRun({ text: "Connecter les 3 opérateurs — premières alertes fraude officielles", size: 18, color: "6EE7B7", font: "Calibri" })] }),
            ]}),
            new TableCell({ borders, shading: { fill: "064E3B", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, width: { size: 2160, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1,12 Md FCFA", bold: true, size: 28, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Budget Phase 2", size: 16, color: "6EE7B7", font: "Calibri" })] }),
            ]}),
          ]})]
        }),
        sp(100),
        heading2("4.1 Activités clés"),
        phaseTable([
          ["Mois", "Activité principale", "Détail technique"],
          ["M4", "Installation sondes DPI chez Orange SN", "Rack dédié · Port SPAN configuré · CDR SFTP toutes 15 min"],
          ["M5", "Intégration Free SN + Expresso", "Même architecture DPI · APIs Mobile Money connectées"],
          ["M6", "Interface CNIE (DGE)", "API Direction Générale des Élections · croisement SIM × NIN"],
          ["M7", "Shadow mode (mois de parallèle)", "Analyse sans alerte officielle · calibrage seuils détection ML"],
          ["M8-9", "Go Live officiel SIGNUM", "1ère alerte SIM Box officielle · 1er PV ARTP · Cérémonie"],
        ], [1000, 3000, 5360]),
        sp(80),
        heading2("4.2 Ressources humaines — Phase 2 (22 personnes)"),
        phaseTable([
          ["Poste", "Nb", "Source"],
          ["Chef de projet (reconduit)", "1", "Processingenierie"],
          ["Ingénieurs intégration télécom", "4", "Processingenierie"],
          ["Ingénieur DPI / réseau", "2", "Processingenierie"],
          ["Data engineers (Kafka / Apache Flink)", "3", "Recrutement SN"],
          ["Développeurs backend (Node.js / Python)", "4", "Recrutement SN"],
          ["Analystes fraude ARTP (formés en Phase 1)", "5", "ARTP"],
          ["Techniciens terrain (chez opérateurs)", "3", "Recrutement SN"],
          ["TOTAL PHASE 2", "22", ""],
        ], [4500, 1200, 3660]),
        sp(80),
        heading2("4.3 Budget Phase 2 (1,12 Md FCFA)"),
        phaseTable([
          ["Poste budgétaire", "Montant"],
          ["Équipements DPI (3 opérateurs × sondes Netscout / JDSU)", "280 M FCFA"],
          ["Ressources humaines (6 mois × 22 personnes)", "310 M FCFA"],
          ["Infrastructure DC2 Thiès (Disaster Recovery)", "220 M FCFA"],
          ["Intégration API CNIE / DGE", "45 M FCFA"],
          ["Formation 20 agents ARTP supplémentaires", "60 M FCFA"],
          ["Contingence + frais divers (18%)", "205 M FCFA"],
          ["TOTAL PHASE 2", "1 120 M FCFA"],
        ], [6000, 3360]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== PHASE 3 =====
        heading1("5. Phase 3 — Consolidation (Mois 10–15)"),
        sp(60),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [7200, 2160],
          rows: [new TableRow({ children: [
            new TableCell({ borders, shading: { fill: "78350F", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 }, width: { size: 7200, type: WidthType.DXA }, children: [
              new Paragraph({ children: [new TextRun({ text: "Phase 3 — Consolidation & Modules avancés · Mois 10 à 15", bold: true, size: 24, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ children: [new TextRun({ text: "Activer AML, QoS urgences, dossiers judiciaires, rapport OTT au Ministère", size: 18, color: "FDE68A", font: "Calibri" })] }),
            ]}),
            new TableCell({ borders, shading: { fill: "78350F", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, width: { size: 2160, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "890 M FCFA", bold: true, size: 28, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Budget Phase 3", size: 16, color: "FDE68A", font: "Calibri" })] }),
            ]}),
          ]})]
        }),
        sp(100),
        heading2("5.1 Nouveaux modules activés"),
        phaseTable([
          ["Module", "Fonctionnalités", "Interface externe"],
          ["AML Mobile Money", "Graphe smurfing Wave/Orange Money/Free Money · détection XGBoost+GNN", "CENTIF · BCEAO · GAFI R.16"],
          ["QoS Urgences 15/17/18", "Monitoring 24/7 appels urgence par opérateur et région · alerte si taux échec > 2%", "Préfectures · ARTP direction"],
          ["Dossier judiciaire auto", "Génération PDF signé · chaîne SHA-256 · horodatage RFC 3161 TSA", "Parquet de Dakar · tribunaux"],
          ["OTT Monitor", "Mesure trafic OTT (WhatsApp, Viber, Skype) · rapport impact fiscal", "Ministère Économie Numérique"],
        ], [2000, 4360, 3000]),
        sp(80),
        heading2("5.2 Ressources humaines — Phase 3 (31 personnes)"),
        phaseTable([
          ["Poste", "Nb", "Source"],
          ["Équipe permanente (reconduite de Phase 2)", "22", "Phases 1+2"],
          ["Data scientists / ML engineers", "3", "Recrutement SN (ESP/UCAD)"],
          ["Expert AML / conformité BCEAO", "1", "Consultant externe"],
          ["Juriste pénal numérique", "1", "Cabinet Dakar"],
          ["Analystes fraude ARTP (renforcé)", "4", "ARTP"],
          ["TOTAL PHASE 3", "31", ""],
        ], [4500, 1200, 3660]),
        sp(80),
        heading2("5.3 Résultats attendus fin Phase 3"),
        bullet("38–55 Mds FCFA/an de recettes en cours de récupération"),
        bullet("Au moins 3 dossiers judiciaires transmis au Parquet de Dakar"),
        bullet("0 opérateur avec CDR manquants non sanctionnés"),
        bullet("1 rapport OTT remis au Ministère de l’Économie Numérique"),
        bullet("30 agents ARTP autonomes sur le dashboard SIGNUM"),
        bullet("Interface CENTIF opérationnelle — 100% des alertes AML transmises"),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== PHASE 4 =====
        heading1("6. Phase 4 — Innovation & SIGNUM 2.0 (Mois 16–24)"),
        sp(60),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [7200, 2160],
          rows: [new TableRow({ children: [
            new TableCell({ borders, shading: { fill: "7F1D1D", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 }, width: { size: 7200, type: WidthType.DXA }, children: [
              new Paragraph({ children: [new TextRun({ text: "Phase 4 — Innovation & SIGNUM 2.0 · Mois 16 à 24", bold: true, size: 24, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ children: [new TextRun({ text: "IA de nouvelle génération, blockchain souveraine, certification internationale", size: 18, color: "FCA5A5", font: "Calibri" })] }),
            ]}),
            new TableCell({ borders, shading: { fill: "7F1D1D", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, width: { size: 2160, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1,36 Md FCFA", bold: true, size: 28, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Budget Phase 4", size: 16, color: "FCA5A5", font: "Calibri" })] }),
            ]}),
          ]})]
        }),
        sp(100),
        heading2("6.1 Nouvelles capacités SIGNUM 2.0"),
        phaseTable([
          ["Innovation", "Description", "Impact"],
          ["LLM embarqué souverain", "Modèle GPT fine-tuné sur données télécom SN · Hébergé 100% Dakar", "Rapports narratifs automatiques en français"],
          ["Blockchain Hyperledger Fabric", "Réseau blockchain souverain · Nœuds ARTP + ARMP + Parquet", "Preuves judiciaires infalsifiables"],
          ["Analyse de graphe GNN", "Graph Neural Network pour réseaux de fraude multi-acteurs", "Démantèlement réseaux complexes"],
          ["App mobile ARTP (iOS/Android)", "Alertes push critiques · KPIs temps réel · Dossiers hors bureau", "Mobilité des agents ARTP"],
          ["Certification ISO 27001 + SOC 2", "Audit sécurité international par Bureau Veritas", "Prérequis contrats export CEDEAO"],
        ], [2400, 4000, 2960]),
        sp(80),
        heading2("6.2 Budget Phase 4 (1,36 Md FCFA)"),
        phaseTable([
          ["Poste budgétaire", "Montant"],
          ["GPU cluster (NVIDIA A100 × 8) pour entraînement LLM", "380 M FCFA"],
          ["LLM fine-tuning + infrastructure IA", "180 M FCFA"],
          ["Blockchain Hyperledger Fabric setup (4 nœuds)", "95 M FCFA"],
          ["Développement app mobile iOS + Android", "75 M FCFA"],
          ["Certification ISO 27001 (Bureau Veritas / SGS)", "85 M FCFA"],
          ["Ressources humaines (9 mois × 38 personnes)", "450 M FCFA"],
          ["Contingence + frais divers", "95 M FCFA"],
          ["TOTAL PHASE 4", "1 360 M FCFA"],
        ], [6000, 3360]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== PHASE 5 =====
        heading1("7. Phase 5 — Export CEDEAO « SIGNUM Africa » (Mois 25–36)"),
        sp(60),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [7200, 2160],
          rows: [new TableRow({ children: [
            new TableCell({ borders, shading: { fill: "4C1D95", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 }, width: { size: 7200, type: WidthType.DXA }, children: [
              new Paragraph({ children: [new TextRun({ text: "Phase 5 — SIGNUM Africa · Export SaaS CEDEAO · Mois 25 à 36", bold: true, size: 24, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ children: [new TextRun({ text: "Devenir le standard régional de surveillance télécom — 8 pays, 169 M abonnés", size: 18, color: "C4B5FD", font: "Calibri" })] }),
            ]}),
            new TableCell({ borders, shading: { fill: "4C1D95", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, width: { size: 2160, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1,0 Md FCFA", bold: true, size: 28, color: WHITE, font: "Calibri" })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Budget Phase 5", size: 16, color: "C4B5FD", font: "Calibri" })] }),
            ]}),
          ]})]
        }),
        sp(100),
        heading2("7.1 Stratégie de déploiement CEDEAO"),
        phaseTable([
          ["Pays cible", "Priorité", "Stratégie d’entrée", "Licence / an"],
          ["🇨🇮 Côte d’Ivoire", "P1 — Urgent", "Approche ARTCI directe + décision CEDEAO", "2,8 Mds FCFA"],
          ["🇧🇯 Bénin", "P1 — Urgent", "ARCEP Bénin — aucun système actif", "0,9 Md FCFA"],
          ["🇹🇬 Togo", "P2", "ARCEP Togo — relation CEDEAO", "0,6 Md FCFA"],
          ["🇲🇱 Mali", "P2", "AMRTP Mali — partenaire stratégique", "1,1 Md FCFA"],
          ["🇧🇫 Burkina Faso", "P3", "ARCEP BF — GVG contesté à remplacer", "1,2 Md FCFA"],
          ["🇳🇪 Niger", "P3", "ARCNET Niger", "0,8 Md FCFA"],
        ], [2200, 1400, 3760, 2000]),
        sp(80),
        heading2("7.2 Modèle SaaS SIGNUM Africa"),
        phaseTable([
          ["Modèle", "Conditions", "Montant"],
          ["Licence SaaS annuelle (petits pays)", "< 15 M abonnés", "600–900 M FCFA / an"],
          ["Licence SaaS annuelle (grands pays)", "> 15 M abonnés", "1,2–2,8 Mds FCFA / an"],
          ["Modèle hybride — setup initial", "One-shot + maintenance annuelle", "800 M + 200 M FCFA / an"],
          ["Formation incluse", "30 agents / pays", "Inclus dans la licence"],
        ], [3200, 3000, 3160]),
        sp(80),
        heading2("7.3 Projection revenus Phase 5"),
        phaseTable([
          ["Période", "Pays activés", "Revenus licences"],
          ["Mois 25–30", "CI + Bénin", "3,7 Mds FCFA"],
          ["Mois 30–33", "Togo + Mali", "1,7 Md FCFA"],
          ["Mois 33–36", "Burkina + Niger", "2,0 Mds FCFA"],
          ["TOTAL AN 3 — LICENCES CEDEAO", "6 pays", "7,4 Mds FCFA"],
        ], [2400, 3360, 3600]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== RESSOURCES HUMAINES =====
        heading1("8. Ressources Humaines — Vue complète"),
        heading2("8.1 Évolution des effectifs par phase"),
        phaseTable([
          ["Phase", "Période", "Effectif total", "Nouveaux recrutements"],
          ["Phase 1 — Fondation", "M1–M3", "7 personnes", "1 juriste, 2 DevOps (SN)"],
          ["Phase 2 — Déploiement", "M4–M9", "22 personnes", "+15 (data eng., dév., terrain)"],
          ["Phase 3 — Consolidation", "M10–M15", "31 personnes", "+9 (ML, AML, juriste pénal)"],
          ["Phase 4 — Innovation", "M16–M24", "38 personnes", "+7 (LLM, blockchain, mobile)"],
          ["Phase 5 — Export CEDEAO", "M25–M36", "47 personnes", "+9 (commercial, déploiement pays)"],
        ], [2400, 1600, 2000, 3360]),
        sp(80),
        heading2("8.2 Répartition par profil (effectif final : 47)"),
        phaseTable([
          ["Profil technique", "Nb", "Source"],
          ["Ingénieurs système / réseau / télécom", "8", "Processingenierie"],
          ["Data engineers (Kafka, Flink, ClickHouse)", "5", "Recrutement SN"],
          ["Data scientists / ML engineers", "5", "Recrutement SN (ESP, UCAD)"],
          ["Développeurs backend (Node.js / Python)", "6", "Recrutement SN"],
          ["Développeurs frontend + mobile (React)", "3", "Processingenierie"],
          ["Ingénieurs DPI / sécurité réseau", "4", "Processingenierie"],
          ["Analystes fraude ARTP (formés par SIGNUM)", "10", "ARTP"],
          ["Juristes (pénal numérique + réglementaire)", "2", "Cabinets Dakar / Abidjan"],
          ["Commercial CEDEAO / Business Development", "4", "Processingenierie"],
          ["TOTAL", "47", ""],
        ], [4500, 1200, 3660]),
        sp(80),
        heading2("8.3 Plan de formation ARTP — Programme 36 mois"),
        phaseTable([
          ["Période", "Programme", "Agents concernés", "Durée"],
          ["M1–M3", "Formation fondamentale : architecture télécom, lecture CDR, dashboard", "10 agents", "80h / agent"],
          ["M4–M9", "Formation avancée : détection fraude, SS7/Diameter, interface CNIE", "20 agents", "120h / agent"],
          ["M10–M15", "Spécialisation AML : GAFI R.16, graphe, interface CENTIF", "5 agents", "60h / agent"],
          ["M25–M36", "Formation formateurs CEDEAO : programme SIGNUM Academy", "6 agents", "40h / agent"],
        ], [1400, 3760, 2000, 2200]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== BUDGET CONSOLIDE =====
        heading1("9. Budget Consolidé — 36 Mois"),
        sp(60),
        kpiTable([
          { label: "Budget total investi", value: "4,85 Mds FCFA", color: RED },
          { label: "Recettes SN récupérées an 3", value: "55 Mds FCFA", color: GREEN },
          { label: "ROI cumulé 3 ans", value: "+2 234%", color: INDIGO },
          { label: "Payback (mois)", value: "7 mois", color: AMBER },
        ]),
        sp(120),
        heading2("9.1 Budget par phase"),
        phaseTable([
          ["Phase", "Période", "Budget", "% total"],
          ["Phase 1 — Fondation", "M1–M3", "480 M FCFA", "9,9%"],
          ["Phase 2 — Déploiement", "M4–M9", "1 120 M FCFA", "23,1%"],
          ["Phase 3 — Consolidation", "M10–M15", "890 M FCFA", "18,4%"],
          ["Phase 4 — Innovation", "M16–M24", "1 360 M FCFA", "28,0%"],
          ["Phase 5 — Export CEDEAO", "M25–M36", "1 000 M FCFA", "20,6%"],
          ["TOTAL PROGRAMME 36 MOIS", "", "4 850 M FCFA", "100%"],
        ], [3200, 1400, 2400, 2360]),
        sp(80),
        heading2("9.2 Budget par catégorie"),
        phaseTable([
          ["Catégorie", "Montant", "% total"],
          ["Infrastructure & matériel (serveurs, DPI, réseau)", "1 420 M FCFA", "29%"],
          ["Ressources humaines (47 personnes sur 36 mois)", "1 720 M FCFA", "35%"],
          ["Logiciels & licences (Kafka, Elasticsearch, Hyperledger)", "620 M FCFA", "13%"],
          ["Formation & transfert de compétences (30 agents ARTP)", "380 M FCFA", "8%"],
          ["Export CEDEAO (business dev, déploiement pays)", "320 M FCFA", "7%"],
          ["Contingence 8% (réserve sur risques)", "390 M FCFA", "8%"],
          ["TOTAL", "4 850 M FCFA", "100%"],
        ], [4500, 2400, 2460]),
        sp(80),
        heading2("9.3 Projection des recettes récupérées"),
        phaseTable([
          ["Année", "Recettes SN", "Licences CEDEAO", "Total"],
          ["An 1 (M1–M12)", "8 Mds FCFA", "0", "8 Mds FCFA"],
          ["An 2 (M13–M24)", "38 Mds FCFA", "0", "38 Mds FCFA"],
          ["An 3 (M25–M36)", "55 Mds FCFA", "7,4 Mds FCFA", "62,4 Mds FCFA"],
          ["TOTAL 3 ANS", "101 Mds FCFA", "7,4 Mds FCFA", "108,4 Mds FCFA"],
        ], [2400, 2400, 2400, 2160]),
        sp(80),
        para("ROI net 3 ans = (108,4 - 4,85) / 4,85 = +2 134% — Pour chaque 1 FCFA investi, 22 FCFA sont récupérés pour l’État sénégalais.", { bold: true }),
        sp(80),
        heading2("9.4 Sources de financement recommandées"),
        phaseTable([
          ["Source", "Montant", "Conditions", "Phase"],
          ["Budget État / Ministère des Finances", "1,5 Md FCFA", "Loi de finances 2027 — ligne ARTP", "1+2"],
          ["Fonds CEDEAO / UEMOA tech", "800 M FCFA", "Programme régulation numérique", "2+5"],
          ["Banque Mondiale / IFC", "1,2 Md FCFA", "Prêt souverain 0,5% — gouvernance numérique", "3+4"],
          ["Prélèvement sur recettes récupérées", "1,35 Md FCFA", "Autofinancement dès M9", "4+5"],
          ["TOTAL", "4,85 Mds FCFA", "", ""],
        ], [2800, 1800, 3160, 1600]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== RISQUES =====
        heading1("10. Gestion des Risques"),
        phaseTable([
          ["Risque", "Probabilité", "Impact", "Mitigation"],
          ["Résistance opérateurs — refus CDR", "Moyenne", "Élevé", "Décision ARTP contraignante + pénalités 50 M FCFA/semaine de retard"],
          ["Pénurie talents Kafka/ML au SN", "Moyenne", "Moyen", "Partenariat ESP/UCAD + recrutement diaspora + formation interne 6 mois"],
          ["Cyberattaque sur SIGNUM", "Faible", "Élevé", "Architecture zero-trust + pentest trimestriel + DC2 Thiès + SOC 24/7"],
          ["Changement politique", "Faible", "Élevé", "Ancrer SIGNUM dans la loi + démonstration ROI rapide dès M9"],
          ["Qualité CDR dégradée par opérateurs", "Moyenne", "Moyen", "Sondes DPI indépendantes mesurant le trafic réel indépendamment"],
          ["Retard paiement budget État", "Moyenne", "Moyen", "Paiement par jalons + ligne crédit bancaire pour avance de trésorerie"],
          ["Évolution techno (5G, eSIM)", "Haute", "Faible", "Architecture modulaire SIGNUM — module 5G/SBI prévu Phase 4"],
        ], [2800, 1400, 1200, 3960]),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== KPIs =====
        heading1("11. Indicateurs de Succès (KPIs)"),
        heading2("11.1 Tableau de bord de pilotage — Comité mensuel"),
        phaseTable([
          ["KPI", "Phase 1 (M3)", "Phase 2 (M9)", "Phase 3 (M15)", "Phase 4 (M24)", "Phase 5 (M36)"],
          ["CDR couverts (%)", "0%", "100%", "100%", "100%", "100%"],
          ["Fraudes détectées / mois", "0", "50+", "200+", "500+", "500+"],
          ["Recettes récup. (Mds FCFA/an)", "0", "8", "38", "55", "62,4"],
          ["Agents ARTP formés", "10", "20", "30", "30", "36+"],
          ["Dossiers judiciaires transmis", "0", "1", "5+", "20+", "50+"],
          ["Uptime système (%)", "99%", "99,9%", "99,95%", "99,97%", "99,97%"],
          ["Délai détection fraude (sec)", "—", "< 60s", "< 30s", "< 10s", "< 10s"],
          ["Pays CEDEAO sous licence", "0", "0", "0", "0", "3+"],
          ["Satisfaction ARTP (NPS)", "—", "60+", "70+", "80+", "85+"],
        ], [2800, 1200, 1200, 1200, 1200, 1760]),
        sp(120),
        heading2("11.2 Condition de succès absolue"),
        para("Le programme SIGNUM sera considéré comme un SUCCÈS COMPLET si, au terme des 36 mois :", { bold: true }),
        bullet("L’État sénégalais est propriétaire d’un système de surveillance télécom souverain, sans dépendance à un fournisseur étranger"),
        bullet("Au moins 38 Mds FCFA/an de recettes supplémentaires sont versées au Trésor public"),
        bullet("30 ingénieurs et analystes sénégalais sont pleinement autonomes pour opérer et évoluer SIGNUM"),
        bullet("Au moins 1 condamnation judiciaire basée sur des preuves numériques SIGNUM a été prononcée"),
        bullet("Au moins 3 pays de la CEDEAO ont adopté SIGNUM, faisant du Sénégal le leader régional en régulation télécom numérique"),
        sp(240),
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: INDIGO, space: 12 } },
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 60 },
          children: [new TextRun({ text: "Processingenierie © 2026 · Tous droits réservés", size: 16, color: GRAY, font: "Calibri" })]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ce document est confidentiel. Toute reproduction ou diffusion est interdite sans autorisation écrite.", size: 14, color: GRAY, italics: true, font: "Calibri" })] }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('C:/gravity/SIGNUM_Strategie_ARTP_2026.docx', buffer);
  console.log('Done: C:/gravity/SIGNUM_Strategie_ARTP_2026.docx');
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
