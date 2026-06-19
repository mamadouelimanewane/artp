const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();

// ── Palette "Midnight Executive" – SIGNUM
const C = {
  indigo:   '4F46E5',
  indigo2:  '6366F1',
  indigoL:  'C7D2FE',  // indigo-200
  indigoXL: 'EEF2FF',  // indigo-50
  cyan:     '06B6D4',
  dark:     '0F172A',
  slate:    '1E293B',
  slate2:   '334155',
  gray:     '64748B',
  grayL:    'CBD5E1',
  white:    'FFFFFF',
  offWhite: 'F8FAFC',
  green:    '059669',
  greenL:   'D1FAE5',
  amber:    'D97706',
  amberL:   'FEF3C7',
  red:      'DC2626',
  redL:     'FEE2E2',
  blue1:    '1E3A8A', blue1L: 'DBEAFE',
  blue2:    '064E3B', blue2L: 'D1FAE5',
  brown:    '78350F', brownL: 'FEF3C7',
  rose:     '7F1D1D', roseL:  'FEE2E2',
  violet:   '4C1D95', violetL:'EDE9FE',
};

pptx.layout  = 'LAYOUT_WIDE'; // 13.3" × 7.5"
pptx.author  = 'Processingenierie';
pptx.subject = 'SIGNUM – Deck Exécutif ARTP 2026';
pptx.title   = 'SIGNUM × ARTP – Plan Stratégique';

// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────
const W = 13.3, H = 7.5;

function kpi(sl, x, y, val, lbl, valColor) {
  sl.addShape(pptx.shapes.RECTANGLE, { x, y, w: 2.9, h: 1.35,
    fill: { color: C.indigoXL }, line: { color: C.indigoL, width: 1 } });
  sl.addText(val, { x, y: y + 0.05, w: 2.9, h: 0.75,
    fontSize: 30, bold: true, color: valColor || C.indigo, align: 'center', fontFace: 'Calibri', margin: 0 });
  sl.addText(lbl, { x, y: y + 0.82, w: 2.9, h: 0.42,
    fontSize: 11, color: C.gray, align: 'center', fontFace: 'Calibri', margin: 0 });
}

function tbl(sl, rows, colW, x, y) {
  const built = rows.map((row, ri) =>
    row.map(cell => ({
      text: String(cell),
      options: ri === 0
        ? { fill: { color: C.slate }, color: C.white, bold: true, fontSize: 11, fontFace: 'Calibri', align: 'left' }
        : { fill: { color: ri % 2 === 0 ? C.white : C.offWhite }, color: C.dark, fontSize: 11, fontFace: 'Calibri', align: 'left' }
    }))
  );
  sl.addTable(built, { x, y, colW, border: { pt: 0.5, color: 'E2E8F0' }, rowH: 0.38 });
}

function bullets(sl, items, x, y, w, h, color) {
  sl.addText(
    items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, fontSize: 12, color: color || C.dark, fontFace: 'Calibri', paraSpaceAfter: 5 } })),
    { x, y, w, h, valign: 'top' }
  );
}

function footer(sl) {
  sl.addText('Processingenierie × ARTP  ·  CONFIDENTIEL  ·  Juin 2026', {
    x: 0.3, y: 7.22, w: 12.7, h: 0.22, fontSize: 8, color: C.gray, fontFace: 'Calibri' });
}

// ────────────────────────────────────────────────
// SLIDE 1 – COUVERTURE
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.dark };

  // Left accent bar
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.4, h: H, fill: { color: C.indigo }, line: { color: C.indigo, width: 0 } });

  // Top label
  sl.addText('PROCESSINGENIERIE  ×  ARTP  ·  DOCUMENT CONFIDENTIEL  ·  JUIN 2026', {
    x: 0.6, y: 0.38, w: 12.3, h: 0.35, fontSize: 10, color: C.gray, fontFace: 'Calibri', charSpacing: 1 });

  // Main title
  sl.addText('SIGNUM', { x: 0.6, y: 0.8, w: 12.3, h: 1.9,
    fontSize: 100, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  // Divider line
  sl.addShape(pptx.shapes.LINE, { x: 0.6, y: 2.75, w: 12.3, h: 0,
    line: { color: C.indigo2, width: 2 } });

  // Subtitle
  sl.addText('Surveillance Intelligente et Gouvernance des Numéros et Usages Mobiles', {
    x: 0.6, y: 2.85, w: 10, h: 0.55, fontSize: 16, color: C.indigoL, fontFace: 'Calibri', italic: true });
  sl.addText('Plan Stratégique de Déploiement  ·  5 Phases  ·  36 Mois', {
    x: 0.6, y: 3.45, w: 10, h: 0.45, fontSize: 14, color: C.gray, fontFace: 'Calibri' });

  // KPI row
  const kpis = [
    ['36 mois',        'Durée'],
    ['4,85 Mds FCFA',  'Budget total'],
    ['+2 234%',        'ROI net 3 ans'],
    ['47 pers.',       'Effectif projet'],
    ['3→8 pays',       'CEDEAO'],
  ];
  kpis.forEach(([v, l], i) => {
    const x = 0.6 + i * 2.54;
    sl.addShape(pptx.shapes.RECTANGLE, { x, y: 4.35, w: 2.4, h: 1.1,
      fill: { color: C.slate }, line: { color: C.indigo2, width: 1 } });
    sl.addText(v, { x, y: 4.38, w: 2.4, h: 0.6, fontSize: 18, bold: true, color: C.white, align: 'center', fontFace: 'Calibri', margin: 0 });
    sl.addText(l, { x, y: 4.95, w: 2.4, h: 0.38, fontSize: 10, color: C.grayL, align: 'center', fontFace: 'Calibri', margin: 0 });
  });

  // Bottom
  sl.addText('Processingenierie  ©  2026  ·  Confidentiel', {
    x: 0.6, y: 7.1, w: 12.3, h: 0.28, fontSize: 9, color: C.slate2, fontFace: 'Calibri' });
}

// ────────────────────────────────────────────────
// SLIDE 2 – SOMMAIRE
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.dark };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.4, h: H, fill: { color: C.indigo }, line: { color: C.indigo, width: 0 } });
  sl.addText('Sommaire', { x: 0.6, y: 0.28, w: 12, h: 0.65, fontSize: 34, bold: true, color: C.white, fontFace: 'Calibri' });
  sl.addShape(pptx.shapes.LINE, { x: 0.6, y: 1.0, w: 12.0, h: 0, line: { color: C.indigo2, width: 1.5 } });

  const items = [
    '01 · Contexte — La fraude télécom au Sénégal',
    '02 · Pourquoi SIGNUM vs GVG',
    '03 · Architecture technique',
    '04 · Phase 1 — Fondation (M1–M3)',
    '05 · Phase 2 — Déploiement national (M4–M9)',
    '06 · Phase 3 — Consolidation & Sanctions (M10–M15)',
    '07 · Phase 4 — Innovation & SIGNUM 2.0 (M16–M24)',
    '08 · Phase 5 — SIGNUM Africa · CEDEAO (M25–M36)',
    '09 · Ressources humaines',
    '10 · Budget consolidé',
    '11 · ROI & Recettes récupérées',
    '12 · Risques & Mitigation',
    '13 · Gouvernance & Parties prenantes',
    '14 · Prochaines étapes — Décision requise',
    '15 · Contacts',
  ];
  items.forEach((item, i) => {
    const col = i < 8 ? 0 : 1;
    const row = i < 8 ? i : i - 8;
    const x = 0.7 + col * 6.5;
    const y = 1.18 + row * 0.69;
    sl.addShape(pptx.shapes.RECTANGLE, { x, y, w: 6.0, h: 0.56,
      fill: { color: row % 2 === 0 ? C.slate : '11203A' }, line: { color: C.slate2, width: 0.5 } });
    sl.addText(item, { x: x + 0.18, y: y + 0.05, w: 5.6, h: 0.45,
      fontSize: 12, color: row % 2 === 0 ? C.grayL : 'A0B0C8', fontFace: 'Calibri', margin: 0 });
  });
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 3 – CONTEXTE
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('01 · Contexte — La fraude télécom coûte 47–71 Mds FCFA par an au Sénégal', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  tbl(sl, [
    ['Source de fraude', 'Mécanisme', 'Perte annuelle'],
    ['SIM Box', 'Bypass trafic international via SIM locales', '12–18 Mds FCFA'],
    ['CDR manquants / Grey Routes', 'CDR incomplets ou non transmis à l\'ARTP', '8–14 Mds FCFA'],
    ['Non-conformité fiscale opérateurs', 'Sous-déclaration du CA taxable', '6–10 Mds FCFA'],
    ['OTT non régulé (WhatsApp, Viber…)', 'Trafic voix OTT sans redevance', '18–24 Mds FCFA'],
    ['Fraude Mobile Money / AML', 'Smurfing, mules, transactions fractionnées', '3–5 Mds FCFA'],
    ['TOTAL', '', '47–71 Mds FCFA / an'],
  ], [4.0, 5.3, 2.5], 0.4, 1.0);

  // Alert box
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 5.0, w: 12.5, h: 1.35,
    fill: { color: C.redL }, line: { color: 'FECACA', width: 1 } });
  sl.addText('⚠  Situation actuelle', { x: 0.6, y: 5.08, w: 12, h: 0.38,
    fontSize: 13, bold: true, color: C.red, fontFace: 'Calibri', margin: 0 });
  sl.addText('GVG (Global Voice Group, Luxembourg) détenait le contrat de surveillance du trafic international. Ce contrat a été résilié en 2023 (décision ARMP). La place est libre — SIGNUM est la solution souveraine qui s\'impose.', {
    x: 0.6, y: 5.48, w: 12, h: 0.75, fontSize: 11.5, color: '7F1D1D', fontFace: 'Calibri', margin: 0 });
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 4 – SIGNUM vs GVG
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('02 · Pourquoi SIGNUM — 7 raisons structurelles d\'écarter GVG', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  tbl(sl, [
    ['Critère', 'GVG (Luxembourg)', 'SIGNUM (Processingenierie · Dakar)'],
    ['Propriété données',   'Hébergées hors Sénégal',          '100% souverain — DC Dakar + DC Thiès'],
    ['Couverture CDR',      '60–70% (échantillonnage)',         '100% — sondes DPI passives indépendantes'],
    ['Coût',                'Contrat opaque, dépendance étrangère', '4,85 Mds FCFA → autofinancé dès M9'],
    ['IA & détection',      'Boîte noire — non auditable',     'Modèles ML souverains + SHAP explicable'],
    ['Preuves judiciaires', 'Non admissibles au SN',           'SHA-256 + RFC 3161 TSA + Hyperledger'],
    ['Compétences locales', 'Zéro transfert',                  '30 ingénieurs SN formés en 18 mois'],
    ['Conformité loi SN',   'Loi 2018-28 art.14 non respectée','Conforme ARTP · CDP · CENTIF · GAFI'],
  ], [2.5, 4.1, 5.2], 0.4, 1.0);

  sl.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 5.65, w: 12.5, h: 0.75,
    fill: { color: C.greenL }, line: { color: 'BBF7D0', width: 1 } });
  sl.addText('✅  SIGNUM n\'est pas une alternative à GVG — c\'est son remplacement naturel, 100% souverain et 22× plus rentable pour l\'État.', {
    x: 0.6, y: 5.73, w: 12, h: 0.6, fontSize: 12.5, bold: true, color: '065F46', fontFace: 'Calibri', margin: 0 });
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 5 – ARCHITECTURE TECHNIQUE
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('03 · Architecture Technique — Comment SIGNUM fonctionne', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  const cols = [
    { title: 'SOURCES — Opérateurs', color: C.blue1, textColor: C.blue1L,
      items: ['Orange SN · CDR SFTP 15min', 'Free SN · CDR SFTP 15min', 'Expresso · CDR SFTP 15min', 'Sondes DPI passives (port SPAN)', 'APIs Mobile Money (Wave, Orange Money, Free Money)'] },
    { title: 'SIGNUM CORE — Datacenters SN', color: C.slate, textColor: C.grayL,
      items: ['Kafka → Apache Flink (streaming)', 'ClickHouse OLAP (analyses)', 'PostgreSQL + TimescaleDB', 'MinIO (stockage objet souverain)', 'ML : LSTM / XGBoost / GNN / Transformer', 'Blockchain Hyperledger (preuves)'] },
    { title: 'INTERFACES ARTP', color: C.blue2, textColor: C.blue2L,
      items: ['Dashboard ARTP (React/Web)', 'Alertes temps réel < 30 secondes', 'Interface CNIE / DGE', 'Interface CENTIF (AML)', 'Dossiers judiciaires auto (PDF signé)', 'App mobile iOS / Android'] },
  ];

  cols.forEach((col, ci) => {
    const x = 0.4 + ci * 4.3;
    sl.addShape(pptx.shapes.RECTANGLE, { x, y: 1.0, w: 4.0, h: 5.6,
      fill: { color: col.color }, line: { color: col.color, width: 0 } });
    sl.addText(col.title, { x: x + 0.1, y: 1.08, w: 3.8, h: 0.55,
      fontSize: 11.5, bold: true, color: C.white, align: 'center', fontFace: 'Calibri', margin: 0 });
    col.items.forEach((item, ii) => {
      sl.addShape(pptx.shapes.RECTANGLE, { x: x + 0.12, y: 1.73 + ii * 0.78, w: 3.76, h: 0.65,
        fill: { color: C.slate2 }, line: { color: '475569', width: 0.5 } });
      sl.addText('▸  ' + item, { x: x + 0.2, y: 1.77 + ii * 0.78, w: 3.6, h: 0.55,
        fontSize: 10, color: col.textColor, fontFace: 'Calibri', margin: 0 });
    });
  });

  // Arrows
  sl.addShape(pptx.shapes.LINE, { x: 4.4, y: 3.75, w: 0.3, h: 0, line: { color: C.indigo2, width: 3 } });
  sl.addText('→', { x: 4.35, y: 3.55, w: 0.5, h: 0.4, fontSize: 22, bold: true, color: C.indigo2, align: 'center', fontFace: 'Calibri', margin: 0 });
  sl.addText('→', { x: 8.65, y: 3.55, w: 0.5, h: 0.4, fontSize: 22, bold: true, color: C.cyan, align: 'center', fontFace: 'Calibri', margin: 0 });
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDES 6–10 : LES 5 PHASES
// ────────────────────────────────────────────────
const phases = [
  { num: '04', label: 'Phase 1 — Fondation', period: 'Mois 1–3', color: C.blue1, lightColor: C.blue1L,
    budget: '480 M FCFA', effectif: '7 personnes', obj: 'Poser les bases juridiques, techniques et humaines',
    acts: [
      'Sem. 1-2 : Décision ARTP publiée au JO — Art. 17 Loi 2011-01 (CDR obligatoires)',
      'Sem. 3-4 : Signature des 3 conventions opérateurs (Orange, Free, Expresso)',
      'Sem. 5-6 : Déploiement Infrastructure DC1 Dakar (20 serveurs, réseau 10 Gbps)',
      'Sem. 7-10 : Installation Kubernetes, Kafka, PostgreSQL, ClickHouse, SIGNUM v1.0',
      'Sem. 11-12 : Tests de charge + Pentest + Validation ARTP + Formation 10 agents',
    ],
    livs: ['Décision ARTP publiée · 3 conventions signées', 'Infrastructure DC1 opérationnelle', 'Rapport pentest validé (0 vulnérabilité critique)', 'Plan de formation 30 agents ARTP'],
  },
  { num: '05', label: 'Phase 2 — Déploiement National', period: 'Mois 4–9', color: C.blue2, lightColor: C.blue2L,
    budget: '1,12 Md FCFA', effectif: '22 personnes', obj: 'Connecter les 3 opérateurs — premières alertes fraude',
    acts: [
      'M4 : Installation sondes DPI chez Orange SN (port SPAN · CDR SFTP temps réel)',
      'M5 : Intégration Free SN + Expresso + APIs Mobile Money (Wave, Orange Money)',
      'M6 : Interface CNIE / DGE — croisement SIM × identité nationale opérationnel',
      'M7 : Shadow mode — calibrage seuils ML sans alerte officielle (mois de parallèle)',
      'M8-9 : GO LIVE — 1ère alerte SIM Box officielle · 1er PV ARTP · Cérémonie',
    ],
    livs: ['3 opérateurs connectés · 100% CDR couverts', 'Dashboard 20 agents ARTP actifs', '1ère détection fraude < 60 secondes', 'DC2 Thiès (Disaster Recovery) opérationnel'],
  },
  { num: '06', label: 'Phase 3 — Consolidation & Sanctions', period: 'Mois 10–15', color: C.brown, lightColor: C.brownL,
    budget: '890 M FCFA', effectif: '31 personnes', obj: 'Modules AML, QoS urgences, dossiers judiciaires, OTT',
    acts: [
      'M10-11 : Module AML Mobile Money — interface CENTIF · alertes GAFI R.16 actives',
      'M11-12 : Module QoS urgences 15/17/18 · monitoring couverture par préfecture',
      'M12-13 : 1er dossier judiciaire SIGNUM transmis au Parquet de Dakar (test)',
      'M14 : 1er rapport OTT remis au Ministère de l\'Économie Numérique',
      'M15 : Bilan semestriel · 30 agents ARTP certifiés SIGNUM',
    ],
    livs: ['38–55 Mds FCFA/an en cours de récupération', '3+ dossiers transmis au Parquet', 'Rapport OTT Ministère remis', '30 agents ARTP certifiés SIGNUM'],
  },
  { num: '07', label: 'Phase 4 — Innovation & SIGNUM 2.0', period: 'Mois 16–24', color: C.rose, lightColor: C.roseL,
    budget: '1,36 Md FCFA', effectif: '38 personnes', obj: 'LLM souverain, blockchain, certification ISO 27001',
    acts: [
      'M16-18 : LLM souverain fine-tuné télécom SN · rapports narratifs en français',
      'M18-20 : Blockchain Hyperledger Fabric SN (nœuds ARTP + ARMP + Parquet)',
      'M20-21 : Analyse de graphe GNN pour réseaux de fraude multi-acteurs',
      'M21-22 : App mobile ARTP (iOS + Android) · alertes push critiques',
      'M22-24 : Certification ISO 27001 + SOC 2 (Bureau Veritas)',
    ],
    livs: ['SIGNUM 2.0 déployé · LLM actif', 'Certification ISO 27001 obtenue', 'App mobile opérationnelle', 'GPU cluster NVIDIA A100 opérationnel'],
  },
  { num: '08', label: 'Phase 5 — SIGNUM Africa · CEDEAO', period: 'Mois 25–36', color: C.violet, lightColor: C.violetL,
    budget: '1,0 Md FCFA', effectif: '47 personnes', obj: 'Standard régional · 6 pays · 7,4 Mds FCFA/an licences',
    acts: [
      'M25-30 : Déploiement Côte d\'Ivoire (ARTCI) + Bénin (ARCEP) — licences P1',
      'M30-33 : Déploiement Togo (ARCEP) + Mali (AMRTP)',
      'M33-36 : Déploiement Burkina Faso + Niger · SIGNUM Academy lancée',
      'M25-36 : Support SaaS 24/7 en français depuis Dakar pour tous les pays',
      'M36 : Bilan programme · projection Phase 6 (Ghana, Nigeria)',
    ],
    livs: ['6 pays CEDEAO sous licence', '7,4 Mds FCFA revenus licences annuels', 'SIGNUM Academy opérationnelle', 'Sénégal = leader régional régulation télécom'],
  },
];

phases.forEach(ph => {
  const sl = pptx.addSlide();
  sl.background = { color: C.white };

  // Header band
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 1.25,
    fill: { color: ph.color }, line: { color: ph.color, width: 0 } });
  sl.addText(ph.num + ' · ' + ph.label, { x: 0.4, y: 0.08, w: 9.8, h: 0.65,
    fontSize: 22, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });
  sl.addText(ph.period + '  ·  ' + ph.obj, { x: 0.4, y: 0.73, w: 9.8, h: 0.4,
    fontSize: 12, color: ph.lightColor, fontFace: 'Calibri', margin: 0 });
  // Budget + effectif badges
  sl.addShape(pptx.shapes.RECTANGLE, { x: 10.5, y: 0.1, w: 2.5, h: 0.52,
    fill: { color: C.dark }, line: { color: C.white, width: 1 } });
  sl.addText(ph.budget, { x: 10.5, y: 0.1, w: 2.5, h: 0.52,
    fontSize: 15, bold: true, color: C.white, align: 'center', fontFace: 'Calibri', margin: 0 });
  sl.addShape(pptx.shapes.RECTANGLE, { x: 10.5, y: 0.7, w: 2.5, h: 0.43,
    fill: { color: C.slate2 }, line: { color: C.slate2, width: 0 } });
  sl.addText(ph.effectif, { x: 10.5, y: 0.7, w: 2.5, h: 0.43,
    fontSize: 11, color: ph.lightColor, align: 'center', fontFace: 'Calibri', margin: 0 });

  // Activities
  sl.addText('Activités clés', { x: 0.4, y: 1.38, w: 8.0, h: 0.38,
    fontSize: 13, bold: true, color: C.dark, fontFace: 'Calibri', margin: 0 });
  ph.acts.forEach((act, i) => {
    sl.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.82 + i * 0.9, w: 7.9, h: 0.78,
      fill: { color: i % 2 === 0 ? C.white : C.offWhite }, line: { color: 'E2E8F0', width: 0.5 } });
    sl.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.82 + i * 0.9, w: 0.06, h: 0.78,
      fill: { color: ph.color }, line: { color: ph.color, width: 0 } });
    sl.addText(act, { x: 0.58, y: 1.9 + i * 0.9, w: 7.6, h: 0.62,
      fontSize: 11, color: C.dark, fontFace: 'Calibri', margin: 0 });
  });

  // Deliverables
  sl.addText('Livrables', { x: 8.65, y: 1.38, w: 4.35, h: 0.38,
    fontSize: 13, bold: true, color: C.dark, fontFace: 'Calibri', margin: 0 });
  ph.livs.forEach((liv, i) => {
    sl.addShape(pptx.shapes.RECTANGLE, { x: 8.65, y: 1.82 + i * 1.38, w: 4.35, h: 1.22,
      fill: { color: ph.lightColor }, line: { color: ph.lightColor, width: 1 } });
    sl.addShape(pptx.shapes.RECTANGLE, { x: 8.65, y: 1.82 + i * 1.38, w: 0.06, h: 1.22,
      fill: { color: ph.color }, line: { color: ph.color, width: 0 } });
    sl.addText('✓  ' + liv, { x: 8.8, y: 1.9 + i * 1.38, w: 4.05, h: 1.0,
      fontSize: 11, color: ph.color, fontFace: 'Calibri', margin: 0, bold: true });
  });
  footer(sl);
});

// ────────────────────────────────────────────────
// SLIDE 11 – RH
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('09 · Ressources Humaines — 47 personnes sur 36 mois', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  tbl(sl, [
    ['Phase', 'Période', 'Effectif', 'Principaux recrutements', 'Budget RH'],
    ['Phase 1 — Fondation',     'M1–M3',   '7 pers.',  'Juriste, DevOps, Architecte système',       '54 M FCFA'],
    ['Phase 2 — Déploiement',   'M4–M9',   '22 pers.', 'Data Eng., Développeurs, Terrain opérateurs','310 M FCFA'],
    ['Phase 3 — Consolidation', 'M10–M15', '31 pers.', 'Data Scientists ML, Expert AML, Juriste pénal','280 M FCFA'],
    ['Phase 4 — Innovation',    'M16–M24', '38 pers.', 'LLM, Blockchain, Mobile, ISO 27001',         '450 M FCFA'],
    ['Phase 5 — CEDEAO',        'M25–M36', '47 pers.', 'Commercial CEDEAO, Déploiement pays',        '626 M FCFA'],
    ['TOTAL PROGRAMME',         '36 mois', '47',       '',                                           '1 720 M FCFA'],
  ], [2.5, 1.3, 1.3, 4.5, 2.0], 0.4, 1.0);

  // Source breakdown
  sl.addText('Répartition par source', { x: 0.4, y: 4.38, w: 12.5, h: 0.38,
    fontSize: 13, bold: true, color: C.dark, fontFace: 'Calibri', margin: 0 });
  const srcs = [
    { pct: '30%', label: 'Processingenierie\n(équipe existante)', color: C.indigo },
    { pct: '40%', label: 'Recrutement SN\n(ESP / UCAD / marché)', color: C.green },
    { pct: '21%', label: 'Agents ARTP\n(formés par SIGNUM)', color: C.amber },
    { pct: '9%',  label: 'Consultants\nexternes / CEDEAO', color: C.red },
  ];
  srcs.forEach((s, i) => {
    const x = 0.4 + i * 3.1;
    sl.addShape(pptx.shapes.RECTANGLE, { x, y: 4.85, w: 2.9, h: 1.55,
      fill: { color: C.white }, line: { color: s.color, width: 2 } });
    sl.addShape(pptx.shapes.RECTANGLE, { x, y: 4.85, w: 2.9, h: 0.06,
      fill: { color: s.color }, line: { color: s.color, width: 0 } });
    sl.addText(s.pct, { x, y: 4.92, w: 2.9, h: 0.75,
      fontSize: 30, bold: true, color: s.color, align: 'center', fontFace: 'Calibri', margin: 0 });
    sl.addText(s.label, { x, y: 5.65, w: 2.9, h: 0.68,
      fontSize: 10, color: C.gray, align: 'center', fontFace: 'Calibri', margin: 0 });
  });
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 12 – BUDGET
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('10 · Budget Consolidé — 4,85 Mds FCFA sur 36 mois', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  kpi(sl, 0.35, 1.0, '4,85 Mds', 'Budget total investi', C.red);
  kpi(sl, 3.45, 1.0, '55 Mds',   'Recettes SN / an (an 3)', C.green);
  kpi(sl, 6.55, 1.0, '+2 234%',  'ROI net 3 ans', C.indigo);
  kpi(sl, 9.65, 1.0, '7 mois',   'Payback estimé', C.amber);

  tbl(sl, [
    ['Phase', 'Budget', '%', 'Financement recommandé'],
    ['Phase 1 — Fondation',     '480 M FCFA',   '9,9%',  'Budget État / Loi de finances 2027'],
    ['Phase 2 — Déploiement',   '1 120 M FCFA', '23,1%', 'Budget État + Fonds CEDEAO / UEMOA'],
    ['Phase 3 — Consolidation', '890 M FCFA',   '18,4%', 'Banque Mondiale / IFC (prêt souverain 0,5%)'],
    ['Phase 4 — Innovation',    '1 360 M FCFA', '28,0%', 'Autofinancement sur recettes récupérées'],
    ['Phase 5 — CEDEAO',        '1 000 M FCFA', '20,6%', 'Autofinancement + revenus licences CEDEAO'],
    ['TOTAL',                   '4 850 M FCFA', '100%',  ''],
  ], [2.8, 2.1, 1.2, 5.6], 0.35, 2.55);
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 13 – ROI
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('11 · ROI — Pour chaque 1 FCFA investi, l\'État récupère 22 FCFA', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  tbl(sl, [
    ['Année', 'Recettes Sénégal', 'Licences CEDEAO', 'Total récupéré', 'Budget investi cumulé', 'ROI cumulé'],
    ['An 1 (M1–M12)',  '8 Mds FCFA',  '—',            '8 Mds FCFA',    '1,6 Md FCFA',  '+400%'],
    ['An 2 (M13–M24)', '38 Mds FCFA', '—',            '38 Mds FCFA',   '3,7 Mds FCFA', '+927%'],
    ['An 3 (M25–M36)', '55 Mds FCFA', '7,4 Mds FCFA', '62,4 Mds FCFA','4,85 Mds FCFA','+2 234%'],
    ['TOTAL 3 ANS',    '101 Mds',     '7,4 Mds',      '108,4 Mds',    '',              ''],
  ], [2.0, 2.4, 2.4, 2.4, 2.5, 1.7], 0.35, 1.0);

  // Chart bar visual
  const bars = [
    { label: 'An 1', val: 8,    maxVal: 62, color: C.blue1 },
    { label: 'An 2', val: 38,   maxVal: 62, color: C.indigo },
    { label: 'An 3', val: 62.4, maxVal: 62, color: C.green },
  ];
  sl.addText('Recettes récupérées par année (Mds FCFA)', { x: 0.4, y: 3.4, w: 6.0, h: 0.38,
    fontSize: 12, bold: true, color: C.dark, fontFace: 'Calibri', margin: 0 });
  bars.forEach((b, i) => {
    const bw = (b.val / b.maxVal) * 5.5;
    sl.addShape(pptx.shapes.RECTANGLE, { x: 1.5, y: 3.9 + i * 0.85, w: bw, h: 0.65,
      fill: { color: b.color }, line: { color: b.color, width: 0 } });
    sl.addText(b.label, { x: 0.4, y: 3.9 + i * 0.85, w: 1.0, h: 0.65,
      fontSize: 12, bold: true, color: C.dark, fontFace: 'Calibri', margin: 0, valign: 'middle' });
    sl.addText(b.val + ' Mds', { x: 1.5 + bw + 0.1, y: 3.9 + i * 0.85, w: 1.5, h: 0.65,
      fontSize: 12, bold: true, color: b.color, fontFace: 'Calibri', margin: 0, valign: 'middle' });
  });

  // Investment comparison
  sl.addShape(pptx.shapes.RECTANGLE, { x: 7.3, y: 3.4, w: 5.7, h: 3.3,
    fill: { color: C.greenL }, line: { color: 'BBF7D0', width: 1 } });
  sl.addText('Comparaison des scénarios', { x: 7.5, y: 3.48, w: 5.3, h: 0.4,
    fontSize: 12, bold: true, color: '065F46', fontFace: 'Calibri', margin: 0 });
  [
    ['Sans SIGNUM :', '47–71 Mds perdus / an · Fraude non sanctionnée'],
    ['Scénario bas :', '38 Mds récupérés dès an 2 · Payback 7 mois'],
    ['Scénario haut :', '62,4 Mds récupérés an 3 (SN + CEDEAO)'],
  ].forEach(([lbl, val], i) => {
    sl.addText(lbl, { x: 7.5, y: 3.98 + i * 0.82, w: 1.8, h: 0.38,
      fontSize: 11, bold: true, color: '166534', fontFace: 'Calibri', margin: 0 });
    sl.addText(val, { x: 9.35, y: 3.98 + i * 0.82, w: 3.45, h: 0.38,
      fontSize: 11, color: '166534', fontFace: 'Calibri', margin: 0 });
  });
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 14 – RISQUES
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('12 · Risques & Mitigation', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  tbl(sl, [
    ['Risque', 'Proba.', 'Impact', 'Mitigation'],
    ['Résistance opérateurs (refus CDR)',      'Moy.', '🔴 Élevé', 'Décision ARTP contraignante + pénalités 50 M FCFA / semaine de retard'],
    ['Pénurie talents SS7 / ML au Sénégal',   'Moy.', '🟠 Moyen', 'Partenariat ESP/UCAD + diaspora sénégalaise + formation interne 6 mois'],
    ['Cyberattaque sur infrastructure SIGNUM', 'Fbl.', '🔴 Élevé', 'Zero-trust + pentest trimestriel + SOC 24/7 + DC2 Thiès (DR)'],
    ['Changement politique / nouveau gouv.',   'Fbl.', '🔴 Élevé', 'Ancrage légal (loi, pas seulement décision) + ROI prouvé dès M9'],
    ['Qualité CDR dégradée par opérateurs',    'Moy.', '🟠 Moyen', 'Sondes DPI indépendantes — opérateurs ne contrôlent pas la mesure'],
    ['Retard paiement budget État',            'Moy.', '🟡 Faible', 'Paiement par jalons + ligne crédit bancaire Processingenierie'],
    ['Évolution techno (5G, eSIM)',            'Hte.', '🟡 Faible', 'Architecture modulaire SIGNUM — module 5G/SBI prévu Phase 4'],
  ], [3.6, 1.0, 1.3, 6.8], 0.35, 1.0);
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 15 – GOUVERNANCE
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.white };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.9, fill: { color: C.dark }, line: { color: C.dark, width: 0 } });
  sl.addText('13 · Gouvernance — Structure de pilotage', {
    x: 0.4, y: 0.1, w: 12.5, h: 0.65, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });

  // Comité
  sl.addShape(pptx.shapes.RECTANGLE, { x: 4.15, y: 1.05, w: 5.0, h: 0.85,
    fill: { color: C.slate }, line: { color: C.indigo2, width: 2 } });
  sl.addText('COMITÉ DE PILOTAGE MENSUEL', { x: 4.15, y: 1.1, w: 5.0, h: 0.4,
    fontSize: 12, bold: true, color: C.white, align: 'center', fontFace: 'Calibri', margin: 0 });
  sl.addText('DG ARTP · Ministre · DG Processingenierie', { x: 4.15, y: 1.5, w: 5.0, h: 0.3,
    fontSize: 10, color: C.indigoL, align: 'center', fontFace: 'Calibri', margin: 0 });

  const ents = [
    { title: 'Chef de Projet SIGNUM', sub: 'Processingenierie', color: C.indigo, x: 0.4 },
    { title: 'Responsable ARTP',      sub: 'Cadre senior désigné', color: C.green, x: 5.05 },
    { title: 'Comité Technique',      sub: 'DSI opérateurs · CNIE · CENTIF', color: C.amber, x: 9.7 },
  ];
  ents.forEach(e => {
    sl.addShape(pptx.shapes.RECTANGLE, { x: e.x, y: 2.25, w: 3.4, h: 0.85,
      fill: { color: C.offWhite }, line: { color: e.color, width: 2 } });
    sl.addShape(pptx.shapes.RECTANGLE, { x: e.x, y: 2.25, w: 3.4, h: 0.1,
      fill: { color: e.color }, line: { color: e.color, width: 0 } });
    sl.addText(e.title, { x: e.x + 0.1, y: 2.38, w: 3.2, h: 0.4,
      fontSize: 11, bold: true, color: e.color, fontFace: 'Calibri', margin: 0 });
    sl.addText(e.sub, { x: e.x + 0.1, y: 2.75, w: 3.2, h: 0.3,
      fontSize: 10, color: C.gray, fontFace: 'Calibri', margin: 0 });
  });

  // Two columns
  sl.addText('Réunions & Reporting', { x: 0.4, y: 3.35, w: 6.0, h: 0.38,
    fontSize: 13, bold: true, color: C.dark, fontFace: 'Calibri', margin: 0 });
  bullets(sl, [
    'Comité de pilotage : mensuel (KPIs, budget, décisions)',
    'Rapport technique ARTP : hebdomadaire',
    'Rapport Ministère / Finances : trimestriel (recettes)',
    'Audit externe annuel : ISO 27001 + financier',
    'Rapport CEDEAO : semestriel (dès Phase 5)',
  ], 0.4, 3.8, 5.8, 2.8);

  sl.addText('Documents contractuels', { x: 7.0, y: 3.35, w: 6.0, h: 0.38,
    fontSize: 13, bold: true, color: C.dark, fontFace: 'Calibri', margin: 0 });
  bullets(sl, [
    'Convention ARTP × Processingenierie',
    '3 conventions opérateurs (Orange · Free · Expresso)',
    'Convention ARTP × DGE (accès CNIE)',
    'Convention ARTP × CENTIF (alertes AML)',
    'Contrats SaaS avec régulateurs CEDEAO (Phase 5)',
  ], 7.0, 3.8, 6.0, 2.8);
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 16 – PROCHAINES ÉTAPES
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.dark };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.4, h: H, fill: { color: C.indigo }, line: { color: C.indigo, width: 0 } });
  sl.addText('14 · Prochaines étapes — Décision requise', {
    x: 0.6, y: 0.22, w: 12, h: 0.65, fontSize: 28, bold: true, color: C.white, fontFace: 'Calibri' });
  sl.addText('Actions à enclencher dans les 30 prochains jours', {
    x: 0.6, y: 0.88, w: 12, h: 0.35, fontSize: 13, color: C.indigoL, fontFace: 'Calibri' });

  const steps = [
    { n:'01', title:'Décision ARTP',       urgence:'🔴 Immédiat — J+0 à J+15',
      desc: 'Réunion interne ARTP pour valider le principe SIGNUM · Désigner le Responsable ARTP (cadre senior)' },
    { n:'02', title:'Signature convention', urgence:'🔴 Critique — J+15 à J+30',
      desc: 'Signature convention-cadre Processingenierie × ARTP · Inscrire budget Phase 1 dans PLF 2027' },
    { n:'03', title:'Notification opérateurs', urgence:'🟠 Haute — J+20 à J+45',
      desc: 'ARTP notifie Orange, Free, Expresso de leurs obligations CDR et du calendrier SIGNUM' },
    { n:'04', title:'Recrutement SS7',     urgence:'🟠 Haute — Lancer maintenant',
      desc: 'L\'Ingénieur SS7/Diameter est le profil le plus rare — 2–3 mois pour le trouver' },
    { n:'05', title:'Sélection datacenter', urgence:'🟡 Important — J+30 à J+60',
      desc: 'Identifier et réserver racks DC1 Dakar · Visite technique équipe Processingenierie' },
    { n:'06', title:'Présentation Ministère', urgence:'🟡 Important — J+30',
      desc: 'Présenter ce deck au Ministre de l\'Économie Numérique · Valider budget Loi de finances' },
  ];

  steps.forEach((s, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const x = 0.6 + col * 6.45;
    const y = 1.45 + row * 1.9;
    sl.addShape(pptx.shapes.RECTANGLE, { x, y, w: 6.1, h: 1.72,
      fill: { color: C.slate }, line: { color: C.slate2, width: 0.5 } });
    sl.addShape(pptx.shapes.RECTANGLE, { x, y, w: 0.08, h: 1.72,
      fill: { color: C.indigo2 }, line: { color: C.indigo2, width: 0 } });
    sl.addText(s.n, { x: x + 0.15, y: y + 0.12, w: 0.65, h: 0.65,
      fontSize: 24, bold: true, color: C.indigo2, fontFace: 'Calibri', margin: 0 });
    sl.addText(s.title, { x: x + 0.85, y: y + 0.12, w: 5.1, h: 0.45,
      fontSize: 13.5, bold: true, color: C.white, fontFace: 'Calibri', margin: 0 });
    sl.addText(s.urgence, { x: x + 0.85, y: y + 0.58, w: 5.1, h: 0.32,
      fontSize: 10, color: C.indigoL, fontFace: 'Calibri', margin: 0 });
    sl.addText(s.desc, { x: x + 0.15, y: y + 0.95, w: 5.8, h: 0.68,
      fontSize: 10.5, color: C.grayL, fontFace: 'Calibri', margin: 0 });
  });
  footer(sl);
}

// ────────────────────────────────────────────────
// SLIDE 17 – CONTACTS
// ────────────────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.background = { color: C.dark };
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.4, h: H, fill: { color: C.indigo }, line: { color: C.indigo, width: 0 } });
  sl.addText('15 · Contacts & Prochaine réunion', {
    x: 0.6, y: 0.22, w: 12, h: 0.65, fontSize: 28, bold: true, color: C.white, fontFace: 'Calibri' });
  sl.addShape(pptx.shapes.LINE, { x: 0.6, y: 0.93, w: 12.0, h: 0, line: { color: C.indigo2, width: 1.5 } });

  // Contact card
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 5.6, h: 3.1,
    fill: { color: C.slate }, line: { color: C.indigo2, width: 1 } });
  sl.addText('PROCESSINGENIERIE', { x: 0.8, y: 1.3, w: 5.2, h: 0.48,
    fontSize: 15, bold: true, color: C.indigo2, fontFace: 'Calibri', margin: 0 });
  sl.addText('Maître d\'œuvre technique SIGNUM', { x: 0.8, y: 1.76, w: 5.2, h: 0.35,
    fontSize: 11, color: C.gray, fontFace: 'Calibri', margin: 0 });
  [
    '📍  Dakar, Sénégal',
    '🌐  www.processingenierie.sn',
    '✉   contact@processingenierie.sn',
    '📞  +221 XX XXX XX XX',
  ].forEach((l, i) => {
    sl.addText(l, { x: 0.8, y: 2.25 + i * 0.46, w: 5.2, h: 0.4,
      fontSize: 12, color: C.grayL, fontFace: 'Calibri', margin: 0 });
  });

  // Calendar card
  sl.addShape(pptx.shapes.RECTANGLE, { x: 6.65, y: 1.15, w: 6.3, h: 3.1,
    fill: { color: C.slate }, line: { color: C.green, width: 1 } });
  sl.addText('Calendrier suggéré', { x: 6.85, y: 1.3, w: 5.9, h: 0.48,
    fontSize: 15, bold: true, color: C.green, fontFace: 'Calibri', margin: 0 });
  [
    '📅  J+15  —  Présentation DG ARTP',
    '📅  J+30  —  Présentation Ministre',
    '📅  J+45  —  Validation Présidence / SGG',
    '📅  J+60  —  Signature convention SIGNUM',
    '📅  M1    —  Kick-off Phase 1',
  ].forEach((l, i) => {
    sl.addText(l, { x: 6.85, y: 1.85 + i * 0.46, w: 5.9, h: 0.4,
      fontSize: 12, color: C.grayL, fontFace: 'Calibri', margin: 0 });
  });

  // Quote
  sl.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 4.65, w: 12.3, h: 1.15,
    fill: { color: C.slate }, line: { color: C.indigo2, width: 1 } });
  sl.addText(
    '« Le Sénégal a toutes les compétences pour opérer ce système. SIGNUM est la preuve que la souveraineté numérique africaine est possible dès aujourd\'hui. »',
    { x: 0.8, y: 4.76, w: 12.0, h: 0.9, fontSize: 14, italic: true, color: C.indigoL,
      align: 'center', fontFace: 'Calibri', margin: 0 });

  sl.addText('Processingenierie  ©  2026  ·  Confidentiel  ·  SIGNUM × ARTP', {
    x: 0.6, y: 7.1, w: 12.3, h: 0.28, fontSize: 9, color: C.slate2, fontFace: 'Calibri', align: 'center' });
}

// ── Write
pptx.writeFile({ fileName: 'C:/gravity/SIGNUM_Deck_Executif_ARTP_2026.pptx' })
  .then(() => console.log('Done: C:/gravity/SIGNUM_Deck_Executif_ARTP_2026.pptx'))
  .catch(e => { console.error(e.message); process.exit(1); });
