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
    verticalAlign: "center",
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
  return new Paragraph({
    heading: level,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: "Arial", bold: true, size: level === HeadingLevel.HEADING_1 ? 32 : 26, color: level === HeadingLevel.HEADING_1 ? "1E3A5F" : "2563EB" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: opts.size || 20, bold: opts.bold || false, italic: opts.italic || false, color: opts.color || "000000" })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20 })]
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

// ── Tableaux CDR ──────────────────────────────────────────────────────────────
function tableCDRChamps() {
  const rows = [
    ["recordType", "INTEGER", "0=MOC, 1=MTC, 4=Roaming", "Obligatoire"],
    ["servedIMSI", "OCTET STRING (8)", "IMSI appelant (15 chiffres BCD)", "Obligatoire"],
    ["servedIMEI", "OCTET STRING (8)", "IMEI terminal (15 chiffres)", "Obligatoire"],
    ["servedMSISDN", "MSISDN", "Numéro MSISDN appelant", "Obligatoire"],
    ["callingNumber", "CalledNumber", "Numéro B appelé (E.164)", "Obligatoire"],
    ["calledNumber", "CalledNumber", "Numéro C (redirection)", "Conditionnel"],
    ["mscAddress", "AddressString", "Adresse MSC commutateur", "Obligatoire"],
    ["callDuration", "CallDuration", "Durée effective en secondes", "Obligatoire"],
    ["seizureTime", "TimeStamp", "Timestamp prise d'appel UTC", "Obligatoire"],
    ["answerTime", "TimeStamp", "Timestamp décrochage UTC", "Conditionnel"],
    ["releaseTime", "TimeStamp", "Timestamp fin d'appel UTC", "Obligatoire"],
    ["causeForTerm", "CauseForTerm", "Cause de terminaison (0=normal)", "Obligatoire"],
    ["cellID", "CellGlobalIdOrServiceAreaIdFixedLength", "CGI/SAI cellule origine", "Obligatoire"],
    ["location", "LocationAreaAndCell", "LAC + CI localisation", "Obligatoire"],
    ["chargedParty", "ChargedParty", "Partie taxée (0=appelant)", "Conditionnel"],
    ["roamingNumber", "MSISDN", "Numéro roaming si applicable", "Conditionnel"],
    ["dataVolumeUplink", "DataVolumeOctets", "Volume upload DATA (octets)", "Conditionnel"],
    ["dataVolumeDownlink", "DataVolumeOctets", "Volume download DATA (octets)", "Conditionnel"],
    ["apnNI", "APN-NI", "Access Point Name (DATA)", "Conditionnel"],
    ["chargingCharacteristics", "ChargingCharacteristics", "Caractéristiques de taxation", "Conditionnel"],
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 1800, 3420, 1800],
    rows: [
      new TableRow({ children: [th("Champ ASN.1", 2340), th("Type", 1800), th("Description", 3420), th("Statut", 1800)] }),
      ...rows.map(([f, t, d, s]) => new TableRow({ children: [
        cell(f, { width: 2340, size: 18 }),
        cell(t, { width: 1800, size: 17, color: "1D4ED8" }),
        cell(d, { width: 3420, size: 18 }),
        cell(s, { width: 1800, size: 18, color: s === "Obligatoire" ? "DC2626" : "059669" }),
      ]}))
    ]
  });
}

function tableSLA() {
  const rows = [
    ["Complétude CDR", "≥ 99,5% / heure", "≥ 99,9% / jour", "Déduction redevance proportionnelle"],
    ["Délai de livraison", "≤ 15 minutes", "≤ 5 minutes", "Pénalité 500 000 FCFA/heure"],
    ["Intégrité données", "0 CDR corrompu", "0 CDR corrompu", "Audit immédiat + correction sous 2h"],
    ["Disponibilité SFTP", "99,5% mensuel", "99,9% mensuel", "Pénalité 1 000 000 FCFA/jour"],
    ["Chiffrement", "AES-256 obligatoire", "AES-256 obligatoire", "Suspension accès réseau"],
    ["Notification incident", "≤ 30 min", "≤ 15 min", "Signalement ARTP obligatoire"],
    ["Réconciliation", "≤ 4h après livraison", "≤ 2h", "Nouveau fichier corrigé obligatoire"],
    ["Archivage local", "5 ans minimum", "7 ans", "Passible de sanction pénale"],
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 1800, 1800, 3420],
    rows: [
      new TableRow({ children: [th("Indicateur", 2340), th("Minimum ARTP", 1800), th("Cible SIGNUM", 1800), th("Pénalité si violation", 3420)] }),
      ...rows.map(([ind, min, cib, pen]) => new TableRow({ children: [
        cell(ind, { width: 2340, bold: true }),
        cell(min, { width: 1800 }),
        cell(cib, { width: 1800, color: "059669" }),
        cell(pen, { width: 3420, color: "DC2626", size: 17 }),
      ]}))
    ]
  });
}

function tablePenalites() {
  const rows = [
    ["Non-transmission CDR", "< 24h", "5 000 000 FCFA/jour", "Art. 14 Loi 2018-28"],
    ["Non-transmission CDR", "> 24h", "15 000 000 FCFA/jour + suspension", "Art. 14 + Art. 22"],
    ["CDR falsifiés / altérés", "Tout", "50 000 000 FCFA + retrait agrément", "Art. 25 + Pénal"],
    ["Accès non autorisé plateforme", "Tout", "25 000 000 FCFA", "Art. 19"],
    ["Refus audit SIGNUM", "Tout", "Suspension service", "Art. 18"],
    ["Dépassement délai livraison", "> 1h", "500 000 FCFA/heure de retard", "Contrat CCT"],
    ["Fuite données abonnés", "Tout", "100 000 000 FCFA + poursuites", "Loi 2008-12 DPCP"],
    ["Non-conformité IMEI", "Tout", "10 000 000 FCFA/mois", "Règlement CEDEAO"],
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 1200, 2760, 2600],
    rows: [
      new TableRow({ children: [th("Infraction", 2800), th("Durée", 1200), th("Pénalité", 2760), th("Base légale", 2600)] }),
      ...rows.map(([inf, dur, pen, base]) => new TableRow({ children: [
        cell(inf, { width: 2800 }),
        cell(dur, { width: 1200 }),
        cell(pen, { width: 2760, color: "DC2626", bold: true, size: 18 }),
        cell(base, { width: 2600, color: "1D4ED8", size: 17 }),
      ]}))
    ]
  });
}

// ── Doc ───────────────────────────────────────────────────────────────────────
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
            new TextRun({ text: "SIGNUM — Convention Cadre Type avec les Opérateurs (CCT)", font: "Arial", size: 18, color: "1E3A5F", bold: true }),
            new TextRun({ text: "     |     Processingenierie × ARTP     |     Confidentiel", font: "Arial", size: 16, color: "888888" })
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
      ...space(3),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
        children: [new TextRun({ text: "RÉPUBLIQUE DU SÉNÉGAL", font: "Arial", size: 24, bold: true, color: "1E3A5F", allCaps: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Autorité de Régulation des Télécommunications et des Postes", font: "Arial", size: 22, color: "2563EB" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 },
        children: [new TextRun({ text: "ARTP", font: "Arial", size: 22, bold: true, color: "2563EB" })] }),
      hr(),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
        children: [new TextRun({ text: "CONVENTION CADRE TYPE", font: "Arial", size: 40, bold: true, color: "1E3A5F", allCaps: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
        children: [new TextRun({ text: "RELATIVE À LA TRANSMISSION DES DONNÉES DE SIGNALISATION", font: "Arial", size: 26, bold: true, color: "1E3A5F" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 },
        children: [new TextRun({ text: "DANS LE CADRE DU SYSTÈME SIGNUM", font: "Arial", size: 26, bold: true, color: "DC2626" })] }),
      hr(),
      ...space(2),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
        children: [new TextRun({ text: "ENTRE", font: "Arial", size: 22, bold: true, color: "555555" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "L'Autorité de Régulation des Télécommunications et des Postes (ARTP)", font: "Arial", size: 22, bold: true, color: "1E3A5F" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Représentée par son Directeur Général", font: "Arial", size: 20, italic: true, color: "555555" })] }),
      ...space(1),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
        children: [new TextRun({ text: "ET", font: "Arial", size: 22, bold: true, color: "555555" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "[DÉNOMINATION DE L'OPÉRATEUR]", font: "Arial", size: 22, bold: true, color: "DC2626" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Représenté par son Directeur Général / Directeur Technique", font: "Arial", size: 20, italic: true, color: "555555" })] }),
      ...space(2),
      hr(),
      ...space(2),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Dakar, le [DATE DE SIGNATURE]", font: "Arial", size: 20, italic: true, color: "888888" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Version 1.0 | SIGNUM-CCT-2026", font: "Arial", size: 18, color: "888888" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Document CONFIDENTIEL — Processingenierie © 2026", font: "Arial", size: 18, color: "888888", italic: true })] }),

      // ── PRÉAMBULE ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("PRÉAMBULE"),
      p("La présente Convention Cadre Type (ci-après « CCT » ou « la Convention ») est conclue dans le cadre du déploiement du Système SIGNUM (Surveillance Intelligente et Gouvernance des Numéros et Usages Mobiles), plateforme souveraine de régulation des télécommunications de la République du Sénégal, développée par Processingenierie pour le compte de l'ARTP."),
      p("SIGNUM constitue le socle technologique permettant à l'ARTP d'exercer pleinement ses attributions légales en matière de surveillance du trafic télécom, de réconciliation des CDR (Call Detail Records), de détection de fraude, de régulation fiscale des OTT, et de gouvernance du registre IMEI national."),
      p("La présente CCT définit les obligations techniques et juridiques des opérateurs de réseaux mobiles — Orange Sénégal, Free Sénégal (Saga Africa Holdings), Expresso Télécom — dans le cadre de leur connexion à la plateforme SIGNUM."),
      hr(),

      // ── ARTICLE 1 : FONDEMENTS LÉGAUX ──
      h("ARTICLE 1 — FONDEMENTS JURIDIQUES ET RÉGLEMENTAIRES"),
      p("La présente Convention est conclue sur la base des textes suivants :"),
      bullet("Loi n° 2018-28 du 12 décembre 2018 portant Code des Télécommunications du Sénégal, notamment ses articles 14 (obligation de transmission de données), 18 (droit d'audit de l'ARTP), 22 (sanctions) et 25 (dispositions pénales)"),
      bullet("Décret n° 2019-XXX portant attributions, organisation et fonctionnement de l'ARTP"),
      bullet("Arrêté du Ministre chargé des Télécommunications relatif aux CDR et aux obligations de reporting des opérateurs"),
      bullet("Règlement CEDEAO n° C/REG.25/11/08 relatif à l'interconnexion et à la qualité de service dans l'espace CEDEAO"),
      bullet("Loi n° 2008-12 du 25 janvier 2008 sur la Protection des Données à Caractère Personnel (DPCP)"),
      bullet("Convention de Budapest sur la cybercriminalité (Conseil de l'Europe, ratifiée par le Sénégal)"),
      bullet("Recommandations ITU-T E.212 (IMSI), E.164 (numérotation), 3GPP TS 32.298 (format CDR)"),
      hr(),

      // ── ARTICLE 2 : OBJET ──
      h("ARTICLE 2 — OBJET DE LA CONVENTION"),
      p("La présente Convention a pour objet de définir :"),
      bullet("Les modalités techniques de connexion de l'Opérateur à la plateforme SIGNUM"),
      bullet("Le format, la structure ASN.1 et les champs obligatoires des CDR transmis"),
      bullet("Les protocoles de transfert sécurisé (SFTP over TLS) vers les serveurs SIGNUM"),
      bullet("Les niveaux de service (SLA) applicables à la transmission des données"),
      bullet("Les pénalités applicables en cas de non-respect des obligations"),
      bullet("Les modalités d'accès de l'ARTP aux données de l'Opérateur dans le cadre des contrôles"),
      bullet("Les dispositions relatives à la confidentialité et à la protection des données"),
      hr(),

      // ── ARTICLE 3 : PÉRIMÈTRE TECHNIQUE ──
      h("ARTICLE 3 — PÉRIMÈTRE TECHNIQUE ET TYPES DE DONNÉES"),
      h("3.1 Types de CDR concernés", HeadingLevel.HEADING_2),
      p("L'Opérateur s'engage à transmettre à SIGNUM les enregistrements de détail des communications (CDR) pour les catégories suivantes :"),
      bullet("CDR voix : Mobile Originating Call (MOC), Mobile Terminating Call (MTC), Forwarded calls"),
      bullet("CDR roaming : Roaming outbound (abonnés sénégalais à l'étranger), Roaming inbound (visiteurs étrangers au Sénégal)"),
      bullet("CDR SMS : SMS-MO, SMS-MT, SMS-roaming"),
      bullet("CDR DATA : sessions GPRS/3G/4G/5G, y compris usage OTT identifié par DPI"),
      bullet("CDR USSD : transactions USSD de tous types"),
      bullet("CDR Mobile Money : toutes transactions financières sur réseau mobile"),
      bullet("CDR VoLTE / VoIP : appels sur réseau IP (IMS)"),
      bullet("CDR interconnexion internationale : appels entrants/sortants vers/depuis l'étranger"),
      h("3.2 Format technique — Norme 3GPP TS 32.298", HeadingLevel.HEADING_2),
      p("Les CDR doivent être fournis en format ASN.1 BER (Basic Encoding Rules) conformément à la norme 3GPP TS 32.298. Le tableau ci-dessous liste les champs obligatoires et conditionnels :"),
      ...space(1),
      tableCDRChamps(),
      ...space(1),
      h("3.3 Fichiers CDR — Format et nommage", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 7020],
        rows: [
          new TableRow({ children: [th("Paramètre", 2340), th("Spécification", 7020)] }),
          new TableRow({ children: [cell("Format fichier", { width: 2340, bold: true }), cell("ASN.1 BER (.asn ou .dat) — ZIP64 autorisé pour compression", { width: 7020 })] }),
          new TableRow({ children: [cell("Encodage", { width: 2340, bold: true }), cell("BER (Basic Encoding Rules) — DER accepté mais non requis", { width: 7020 })] }),
          new TableRow({ children: [cell("Nommage", { width: 2340, bold: true }), cell("CDR_[OPERATEUR]_[YYYYMMDD]_[HHMMSS]_[SEQ].asn.gz", { width: 7020 })] }),
          new TableRow({ children: [cell("Exemple", { width: 2340, bold: true }), cell("CDR_ORANGE_20260315_141500_00001.asn.gz", { width: 7020, color: "1D4ED8" })] }),
          new TableRow({ children: [cell("Période couverte", { width: 2340, bold: true }), cell("Maximum 15 minutes par fichier (fenêtre glissante)", { width: 7020 })] }),
          new TableRow({ children: [cell("Taille max", { width: 2340, bold: true }), cell("500 Mo par fichier (compressé) — fractionner si dépassé", { width: 7020 })] }),
          new TableRow({ children: [cell("Checksum", { width: 2340, bold: true }), cell("Fichier .md5 ou .sha256 accompagnant chaque CDR", { width: 7020 })] }),
        ]
      }),
      hr(),

      // ── ARTICLE 4 : PROTOCOLE SFTP ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("ARTICLE 4 — PROTOCOLE DE TRANSFERT SFTP ET SÉCURITÉ"),
      h("4.1 Architecture de connexion", HeadingLevel.HEADING_2),
      p("La transmission des CDR s'effectue via le protocole SFTP (SSH File Transfer Protocol) over TLS 1.3 vers les serveurs SIGNUM hébergés dans les Data Centers de l'ARTP (DC1 Dakar, DC2 Thiès). La connexion est établie selon l'architecture suivante :"),
      bullet("Réseau dédié : VPN IPSec site-à-site entre le NOC de l'Opérateur et le DC SIGNUM"),
      bullet("Authentification : certificat X.509 v3 + clé RSA 4096 bits (ou ECDSA P-256)"),
      bullet("Chiffrement en transit : AES-256-GCM (TLS 1.3 minimum, TLS 1.2 exceptionnellement)"),
      bullet("Chiffrement au repos : AES-256 avec rotation de clés mensuelle (HSM obligatoire)"),
      bullet("Redondance : deux liens SFTP actif/passif, basculement automatique < 30 secondes"),
      h("4.2 Paramètres de connexion SFTP", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 6240],
        rows: [
          new TableRow({ children: [th("Paramètre", 3120), th("Valeur", 6240)] }),
          new TableRow({ children: [cell("Adresse IP SIGNUM DC1", { width: 3120, bold: true }), cell("[CONFIDENTIEL — communiqué lors de la mise en production]", { width: 6240, color: "DC2626" })] }),
          new TableRow({ children: [cell("Adresse IP SIGNUM DC2", { width: 3120, bold: true }), cell("[CONFIDENTIEL — DC2 Thiès — secours]", { width: 6240, color: "DC2626" })] }),
          new TableRow({ children: [cell("Port SFTP", { width: 3120, bold: true }), cell("2222 (standard SFTP modifié — pare-feu filtrant)", { width: 6240 })] }),
          new TableRow({ children: [cell("Compte utilisateur", { width: 3120, bold: true }), cell("sftp_[CODE_OPERATEUR]_signum (ex: sftp_orange_signum)", { width: 6240 })] }),
          new TableRow({ children: [cell("Répertoire dépôt", { width: 3120, bold: true }), cell("/upload/cdr/[OPERATEUR]/[YYYY]/[MM]/[DD]/", { width: 6240 })] }),
          new TableRow({ children: [cell("Répertoire accusé réception", { width: 3120, bold: true }), cell("/ack/[OPERATEUR]/ — fichier .ack généré par SIGNUM", { width: 6240 })] }),
          new TableRow({ children: [cell("Version SSH", { width: 3120, bold: true }), cell("SSHv2 minimum — SSHv1 rejeté", { width: 6240 })] }),
          new TableRow({ children: [cell("Ciphers autorisés", { width: 3120, bold: true }), cell("aes256-gcm@openssh.com, chacha20-poly1305@openssh.com", { width: 6240 })] }),
        ]
      }),
      h("4.3 Fréquence et délais de transmission", HeadingLevel.HEADING_2),
      bullet("CDR voix/SMS : toutes les 15 minutes (fenêtre glissante, batch automatisé)"),
      bullet("CDR DATA/OTT : toutes les 30 minutes (volume plus important)"),
      bullet("CDR Mobile Money : toutes les 5 minutes (sensibilité AML)"),
      bullet("Réconciliation journalière : fichier récapitulatif J+1 avant 06h00 UTC"),
      bullet("CDR historiques (migration initiale) : livraison des 12 derniers mois sous 30 jours"),
      hr(),

      // ── ARTICLE 5 : SLA ──
      h("ARTICLE 5 — NIVEAUX DE SERVICE (SLA)"),
      p("Les indicateurs de performance suivants sont définis comme niveaux de service contractuels :"),
      ...space(1),
      tableSLA(),
      ...space(1),
      p("En cas de dépassement des seuils ARTP, l'Opérateur dispose d'un délai de 2 heures pour notifier ARTP et d'un délai de 4 heures pour corriger la situation. Passé ce délai, les pénalités entrent automatiquement en vigueur.", { color: "DC2626" }),
      hr(),

      // ── ARTICLE 6 : PÉNALITÉS ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("ARTICLE 6 — RÉGIME DES PÉNALITÉS ET SANCTIONS"),
      p("Le régime de pénalités suivant s'applique conformément à la Loi n° 2018-28 et aux termes de la présente Convention :"),
      ...space(1),
      tablePenalites(),
      ...space(1),
      p("Les pénalités sont notifiées par voie de mise en demeure et recouvrées par voie administrative. L'Opérateur dispose d'un délai de 15 jours pour contester une pénalité devant le Directeur Général de l'ARTP.", { italic: true, color: "555555" }),
      hr(),

      // ── ARTICLE 7 : CONFIDENTIALITÉ ──
      h("ARTICLE 7 — CONFIDENTIALITÉ ET PROTECTION DES DONNÉES"),
      h("7.1 Classification des données", HeadingLevel.HEADING_2),
      p("Les données transmises dans le cadre de la présente Convention sont classifiées comme suit :"),
      bullet("CONFIDENTIEL DÉFENSE (Niveau 4) : données brutes CDR incluant IMSI, localisation cellulaire, contenu DPI — accès restreint aux agents habilités ARTP"),
      bullet("CONFIDENTIEL (Niveau 3) : statistiques de trafic agrégées par opérateur — accès équipe SIGNUM"),
      bullet("RESTREINT (Niveau 2) : indicateurs de performance réseau, KPI qualité — accès élargi ARTP"),
      bullet("PUBLIC (Niveau 1) : résumés statistiques annuels publiés dans le rapport d'activité ARTP"),
      h("7.2 Obligations de l'Opérateur", HeadingLevel.HEADING_2),
      bullet("Ne communiquer les données SIGNUM à aucun tiers sans autorisation écrite préalable de l'ARTP"),
      bullet("Mettre en place un contrôle d'accès strict (RBAC) aux systèmes de génération et transmission CDR"),
      bullet("Journaliser tous les accès aux données CDR (qui a accédé, quand, depuis quelle IP)"),
      bullet("Signaler sous 72h tout incident de sécurité potentiellement compromettant des données SIGNUM"),
      bullet("Interdire tout traitement analytique des CDR transmis à SIGNUM sans autorisation expresse ARTP"),
      h("7.3 Obligations de l'ARTP / SIGNUM", HeadingLevel.HEADING_2),
      bullet("Utiliser les données reçues exclusivement dans le cadre des missions légales de l'ARTP"),
      bullet("Ne pas partager les données brutes avec des entités étrangères sans accord de l'Opérateur"),
      bullet("Appliquer le principe de minimisation des données (RGPD art. 5 — applicable par analogie)"),
      bullet("Assurer l'audit annuel de sécurité ISO/IEC 27001 de la plateforme SIGNUM"),
      bullet("Notifier l'Opérateur en cas de brèche de sécurité affectant ses données dans SIGNUM"),
      hr(),

      // ── ARTICLE 8 : DROITS D'ACCÈS ET AUDIT ──
      h("ARTICLE 8 — DROITS D'ACCÈS ET MODALITÉS D'AUDIT"),
      p("Conformément à l'article 18 de la Loi n° 2018-28, l'ARTP dispose des droits d'accès suivants :"),
      bullet("Accès en lecture seule au NOC de l'Opérateur pour vérification de la cohérence des CDR (avec préavis de 48h sauf urgence)"),
      bullet("Audit physique des systèmes de facturation et de génération CDR (MSC, HLR, DPI) 2 fois par an"),
      bullet("Audit technique spécial sans préavis en cas de suspicion de fraude ou de manipulation des CDR"),
      bullet("Accès aux journaux de transmission SFTP pour vérification des fichiers envoyés"),
      bullet("Droit de contre-expertise par un tiers de confiance désigné par l'ARTP en cas de litige"),
      p("L'Opérateur s'engage à fournir une assistance technique lors de tout audit et à mettre à disposition le personnel compétent (ingénieur CDR, responsable technique réseau).", { italic: true }),
      hr(),

      // ── ARTICLE 9 : DURÉE ET RÉSILIATION ──
      h("ARTICLE 9 — DURÉE, RENOUVELLEMENT ET RÉSILIATION"),
      bullet("Durée initiale : 3 ans à compter de la date de signature, renouvelable tacitement par périodes d'un an"),
      bullet("Résiliation pour faute : résiliation immédiate par notification ARTP si violation grave (CDR falsifiés, refus d'audit, atteinte à la souveraineté des données)"),
      bullet("Résiliation ordinaire : préavis de 6 mois par lettre recommandée — aucune résiliation possible pendant une procédure judiciaire en cours"),
      bullet("Effets de la résiliation : l'Opérateur conserve l'obligation d'archiver ses CDR pendant 5 ans après résiliation — ARTP conserve les données déjà transmises"),
      hr(),

      // ── ARTICLE 10 : DISPOSITIONS FINALES ──
      h("ARTICLE 10 — DISPOSITIONS FINALES"),
      bullet("Droit applicable : droit sénégalais"),
      bullet("Juridiction compétente : Tribunal de Grande Instance de Dakar (section commerciale)"),
      bullet("Langue : français (version officielle — toute traduction n'a qu'une valeur indicative)"),
      bullet("Modification : tout avenant doit être signé des deux parties et ne peut réduire les obligations légales"),
      bullet("Intégralité : la présente Convention annule et remplace toute convention antérieure de même nature"),
      bullet("Primauté : en cas de conflit entre la Convention et la réglementation ARTP, la réglementation ARTP prévaut"),
      hr(),

      // ── SIGNATURES ──
      new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),
      h("SIGNATURES"),
      ...space(2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [
            cell("POUR L'ARTP", { width: 4680, bold: true, center: true, bg: "EFF6FF" }),
            cell("POUR [L'OPÉRATEUR]", { width: 4680, bold: true, center: true, bg: "FFF7ED" })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [
              ...space(1),
              p("Le Directeur Général de l'ARTP", { center: true }),
              ...space(4),
              p("[Nom et prénom]", { center: true, italic: true }),
              p("[Date de signature]", { center: true, italic: true }),
            ]}),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [
              ...space(1),
              p("Le Directeur Général / Directeur Technique", { center: true }),
              ...space(4),
              p("[Nom et prénom]", { center: true, italic: true }),
              p("[Date de signature]", { center: true, italic: true }),
            ]}),
          ]}),
        ]
      }),
      ...space(2),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "Fait à Dakar, en deux exemplaires originaux, le _________________ 2026", font: "Arial", size: 20, italic: true, color: "555555" })
      ]}),
      ...space(2),
      hr(),
      p("ANNEXE A — Spécifications techniques détaillées des interfaces SFTP SIGNUM [à joindre]", { italic: true, color: "888888" }),
      p("ANNEXE B — Liste des adresses IP et certificates de sécurité SIGNUM [confidentiel]", { italic: true, color: "888888" }),
      p("ANNEXE C — Procédures d'escalade et contacts d'urgence 24/7 [à joindre]", { italic: true, color: "888888" }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("C:/gravity/SIGNUM_CCT_Operateurs_2026.docx", buf);
  console.log("✅ SIGNUM_CCT_Operateurs_2026.docx généré — " + Math.round(buf.length / 1024) + " Ko");
}).catch(e => { console.error(e); process.exit(1); });
