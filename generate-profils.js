const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
} = require('docx');
const fs = require('fs');

const INDIGO = "4F46E5"; const CYAN = "0891B2"; const DARK = "0F172A";
const GRAY = "64748B"; const WHITE = "FFFFFF"; const LIGHT = "F8FAFC";
const GREEN = "059669"; const AMBER = "D97706"; const RED = "DC2626";
const PURPLE = "7C3AED"; const SLATE = "1E293B"; const INDIGO_LIGHT = "EEF2FF";

const b1 = { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" };
const brd = { top: b1, bottom: b1, left: b1, right: b1 };
const nb = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const nbrd = { top: nb, bottom: nb, left: nb, right: nb };

function sp(n = 80) { return new Paragraph({ spacing: { before: n, after: n }, children: [new TextRun("")] }); }

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 340, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: INDIGO, space: 6 } },
    children: [new TextRun({ text, bold: true, size: 34, color: INDIGO, font: "Calibri" })]
  });
}
function h2(text, color = DARK) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 80 },
    children: [new TextRun({ text, bold: true, size: 26, color, font: "Calibri" })]
  });
}
function h3(text, color = DARK) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, bold: true, size: 22, color, font: "Calibri" })]
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [new TextRun({ text, size: opts.size || 20, color: opts.color || DARK, bold: opts.bold || false, italics: opts.italic || false, font: "Calibri" })]
  });
}
function bullet(text, color = DARK) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 }, spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, color, font: "Calibri" })]
  });
}
function subbullet(text) {
  return new Paragraph({
    numbering: { reference: "subbullets", level: 0 }, spacing: { before: 30, after: 30 },
    children: [new TextRun({ text, size: 18, color: GRAY, font: "Calibri" })]
  });
}

function row(cells, colWidths, headerBg = null) {
  return new TableRow({
    tableHeader: !!headerBg,
    children: cells.map((txt, i) => new TableCell({
      borders: brd,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: headerBg ? { fill: headerBg, type: ShadingType.CLEAR } : undefined,
      margins: { top: 80, bottom: 80, left: 130, right: 130 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ children: [new TextRun({ text: String(txt), bold: !!headerBg, size: headerBg ? 18 : 19, color: headerBg ? WHITE : DARK, font: "Calibri" })] })]
    }))
  });
}
function tbl(rows_data, colWidths) {
  const [header, ...data] = rows_data;
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: colWidths,
    rows: [
      row(header, colWidths, SLATE),
      ...data.map((r, ri) => new TableRow({ children: r.map((txt, i) => new TableCell({
        borders: brd,
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill: ri % 2 === 0 ? WHITE : LIGHT, type: ShadingType.CLEAR },
        margins: { top: 70, bottom: 70, left: 130, right: 130 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: String(txt), size: 18, color: DARK, font: "Calibri" })] })]
      })) }))
    ]
  });
}

// Profil card = bandeau coloré + corps blanc
function profileCard(icon, title, subtitle, color, bodyChildren) {
  return [
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [7600, 1760],
      rows: [new TableRow({ children: [
        new TableCell({ borders: brd, shading: { fill: color, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 160, right: 160 }, width: { size: 7600, type: WidthType.DXA }, children: [
          new Paragraph({ children: [new TextRun({ text: `${icon}  ${title}`, bold: true, size: 24, color: WHITE, font: "Calibri" })] }),
          new Paragraph({ children: [new TextRun({ text: subtitle, size: 17, color: "BFD9FF", font: "Calibri" })] }),
        ]}),
        new TableCell({ borders: brd, shading: { fill: color, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, width: { size: 1760, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Non-Software", bold: true, size: 16, color: WHITE, font: "Calibri" })] }),
        ]}),
      ]})]
    }),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
      rows: [new TableRow({ children: [new TableCell({
        borders: brd,
        shading: { fill: LIGHT, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 180, right: 180 },
        children: bodyChildren,
      })] })]
    }),
    sp(120),
  ];
}

function labelRow(label, value) {
  return new Table({
    width: { size: 8940, type: WidthType.DXA }, columnWidths: [2400, 6540],
    rows: [new TableRow({ children: [
      new TableCell({ borders: nbrd, width: { size: 2400, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, color: INDIGO, font: "Calibri" })] })] }),
      new TableCell({ borders: nbrd, width: { size: 6540, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: value, size: 18, color: DARK, font: "Calibri" })] })] }),
    ]})]
  });
}

// =========================================================
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 600, hanging: 300 } } } }] },
      { reference: "subbullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1000, hanging: 300 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: "Calibri", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 34, bold: true, font: "Calibri", color: INDIGO },
        paragraph: { spacing: { before: 340, after: 100 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: DARK },
        paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 1 } },
    ]
  },
  sections: [
    // ===== COVER =====
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        sp(840),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 }, children: [new TextRun({ text: "PROCESSINGENIERIE  ×  ARTP", bold: true, size: 22, color: INDIGO, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text: "DOCUMENT CONFIDENTIEL — Juin 2026", size: 18, color: GRAY, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Profils Ingénieurs & Techniciens", bold: true, size: 52, color: DARK, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "SIGNUM — Hors Développement Logiciel", bold: true, size: 34, color: INDIGO, font: "Calibri" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 480 }, children: [new TextRun({ text: "Réseau · Télécom · Infrastructure · Sécurité · Terrain · Énergie", size: 22, color: GRAY, italics: true, font: "Calibri" })] }),
        sp(100),
        new Table({
          width: { size: 9360, type: WidthType.DXA }, columnWidths: [1870, 1870, 1870, 1870, 1880],
          rows: [
            new TableRow({ children: ["Catégorie", "Réseau & Télécom", "Infra & DC", "Sécurité", "Terrain & Énergie"].map((h, i) => new TableCell({ borders: brd, width: { size: i===4?1880:1870, type: WidthType.DXA }, shading: { fill: SLATE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 17, color: WHITE, font: "Calibri" })] })] })) }),
            new TableRow({ children: ["Nb postes", "4", "4", "3", "3"].map((v, i) => new TableCell({ borders: brd, width: { size: i===4?1880:1870, type: WidthType.DXA }, shading: { fill: INDIGO_LIGHT, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: v, bold: true, size: 26, color: INDIGO, font: "Calibri" })] })] })) }),
          ]
        }),
        sp(600),
        new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 4, color: INDIGO, space: 12 } }, spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "Processingenierie · Dakar, Sénégal · Programme SIGNUM 2026–2029", size: 18, color: GRAY, font: "Calibri" })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },

    // ===== CONTENU =====
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: INDIGO, space: 6 } }, children: [new TextRun({ text: "SIGNUM — Profils Ingénieurs & Techniciens Non-Software · Confidentiel", size: 16, color: GRAY, font: "Calibri" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0", space: 6 } }, children: [new TextRun({ text: "Processingenierie © 2026  ·  Page ", size: 16, color: GRAY, font: "Calibri" }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY, font: "Calibri" })] })] }) },
      children: [

        // ===== INTRO =====
        h1("1. Pourquoi ces profils sont critiques"),
        p("SIGNUM n'est pas uniquement une application web. C'est une infrastructure physique installée dans les datacenters des opérateurs télécoms, connectée à leurs équipements cœur de réseau via des protocoles bas-niveau (SS7, Diameter, SIGTRAN), avec des sondes matérielles passives et deux datacenters souverains à opérer 24/7."),
        sp(40),
        p("Les profils présentés ici sont distincts des développeurs logiciels et data scientists. Ils interviennent sur le hardware, le réseau physique, les protocoles télécom et la sécurité de l'infrastructure. Sans eux, le logiciel SIGNUM ne peut pas fonctionner."),
        sp(80),
        new Table({
          width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680],
          rows: [
            row(["Ce que fait le profil software", "Ce que fait le profil non-software"], [4680, 4680], SLATE),
            ...[
              ["Développe les algorithmes de détection ML", "Installe les sondes DPI qui captent le trafic physique"],
              ["Code le dashboard ARTP (React/TypeScript)", "Raccorde les fibres 10 Gbps entre les datacenters"],
              ["Configure Kafka et les pipelines de données", "Installe les serveurs Dell R750 et configure les baies RAID"],
              ["Développe les APIs de réconciliation CDR", "Configure les liens SS7/Diameter avec les opérateurs"],
              ["Déploie les conteneurs Kubernetes", "Dimensionne les onduleurs et groupes électrogènes du DC"],
            ].map((r, ri) => new TableRow({ children: r.map((txt, i) => new TableCell({ borders: brd, width: { size: 4680, type: WidthType.DXA }, shading: { fill: ri%2===0?WHITE:LIGHT, type: ShadingType.CLEAR }, margins: { top: 70, bottom: 70, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: txt, size: 18, color: DARK, font: "Calibri" })] })] })) }))
          ]
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== CATEGORIE 1 : RÉSEAU & TÉLÉCOM =====
        h1("2. Réseau & Télécoms (4 profils)"),
        sp(60),

        // Profil 1
        ...profileCard("📡", "Ingénieur Réseau Télécom — SS7 / Diameter / SIGTRAN", "Profil le plus rare et critique du programme · Niveau senior 7+ ans", "1E3A8A", [
          labelRow("Mission", "Configurer et maintenir les liens de signalisation entre SIGNUM et les cœurs de réseau des 3 opérateurs. C'est lui qui rend possible la réception des CDR en temps réel."),
          sp(40),
          labelRow("Protocoles requis", "SS7 (ISUP, MAP, TCAP, SCCP) · SIGTRAN (M3UA, SCTP) · Diameter (3GPP Rx, Gx, Gy) · SMPP · SIP"),
          sp(30),
          labelRow("Équipements", "Passerelles de signalisation (Dialogic, Ulticom, Netcracker) · Sondes Tektronix / JDSU · Wireshark SS7"),
          sp(30),
          labelRow("Expérience type", "5+ ans chez Ericsson, Nokia, Huawei Afrique de l'Ouest, ou département réseau de Orange / Sonatel"),
          sp(30),
          labelRow("Où recruter", "Diaspora sénégalaise (anciens d'Ericsson France/UK) · TOGOCEL / MTN Côte d'Ivoire · LinkedIn réseau \"SS7 West Africa\""),
          sp(30),
          labelRow("Criticité", "BLOQUANT — sans ce profil, SIGNUM ne reçoit aucune donnée opérateur"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 1 (architecture) → Phase 2 (déploiement) → permanent en maintenance"),
          sp(30),
          labelRow("Coût estimé", "1,5 – 2,2 M FCFA / mois (senior) ou 8–12 M FCFA mission 3 mois (consultant)"),
        ]),

        // Profil 2
        ...profileCard("🔍", "Ingénieur DPI — Deep Packet Inspection", "Installe les sondes passives dans les salles serveurs des opérateurs · Niveau confirmé", "1E40AF", [
          labelRow("Mission", "Déployer les sondes DPI en mode passif (port SPAN / TAP) dans les datacenters de Orange, Free et Expresso pour capturer et classifier le trafic en temps réel sans l'interrompre."),
          sp(40),
          labelRow("Technologies", "Netscout · JDSU / Viavi · nDPI (open source) · Wireshark · Classification SNI/IP par application OTT"),
          sp(30),
          labelRow("Protocoles réseau", "IPFIX / NetFlow v9 · sFlow · PCAP · Interfaces 1G / 10G / 40G SFP+"),
          sp(30),
          labelRow("Compétences clés", "Connexion port SPAN sur switches Cisco / Juniper · TAP optiques · Agrégation de flux réseau"),
          sp(30),
          labelRow("Expérience type", "Ingénieur réseau avec expérience en analyse de trafic · CCNP ou équivalent"),
          sp(30),
          labelRow("Où recruter", "Fournisseurs d'équipements réseau au SN · Ingénieurs NOC des opérateurs"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 2 uniquement (installation) puis missions ponctuelles de maintenance"),
          sp(30),
          labelRow("Coût estimé", "900 K – 1,3 M FCFA / mois"),
        ]),

        // Profil 3
        ...profileCard("🌐", "Ingénieur Transmission / Fibre Optique", "Raccorde les datacenters SIGNUM aux opérateurs en liens dédiés · Niveau confirmé", "1D4ED8", [
          labelRow("Mission", "Établir et opérer les liens de connectivité haute capacité entre DC1 Dakar (SIGNUM) et les nœuds réseau des 3 opérateurs, ainsi que le lien DC1 ↔ DC2 Thiès (réplication)."),
          sp(40),
          labelRow("Technologies", "Fibre optique monomode · DWDM · MPLS L2/L3 VPN · BGP / OSPF · Liens dédiés 10 Gbps"),
          sp(30),
          labelRow("Équipements", "Cisco ASR / Juniper MX · Multiplexeurs DWDM · OTDRs (test fibre) · Patch panels FO"),
          sp(30),
          labelRow("Compétences clés", "Splicing fibre · Mesures OTDR · Configuration VRF / MPLS · Gestion SLA de bande passante"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 1 (mise en place) → maintenance trimestrielle"),
          sp(30),
          labelRow("Coût estimé", "800 K – 1,2 M FCFA / mois"),
        ]),

        // Profil 4
        ...profileCard("📻", "Ingénieur RF / Couverture Réseau", "Analyse la couverture radio pour le module QoS urgences 15/17/18 · Niveau confirmé", "2563EB", [
          labelRow("Mission", "Croiser les données de couverture radio des opérateurs avec les incidents d'appels d'urgence (15, 17, 18) pour distinguer les échecs dus à la couverture de ceux dus à la fraude ou à la configuration réseau."),
          sp(40),
          labelRow("Technologies", "Drive test (TEMS, NEMO) · Outils de planification radio (Atoll, MapInfo) · KPIs RAN (RSRP, SINR, handover)"),
          sp(30),
          labelRow("Standards", "3GPP LTE / 5G NR · GSM EDGE · UMTS · Interfaces Uu, S1, X2"),
          sp(30),
          labelRow("Compétences clés", "Analyse de logs RAN · Corrélation géographique incidents / couverture · Rapports ARTP"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 3 (module QoS) → rapports trimestriels"),
          sp(30),
          labelRow("Coût estimé", "800 K – 1,1 M FCFA / mois"),
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== CATEGORIE 2 : INFRASTRUCTURE & DATACENTER =====
        h1("3. Infrastructure & Datacenter (4 profils)"),
        sp(60),

        // Profil 5
        ...profileCard("🖥️", "Ingénieur Systèmes Linux / Bare Metal", "Opère les serveurs physiques des datacenters SIGNUM · Niveau senior", "064E3B", [
          labelRow("Mission", "Installer, configurer et maintenir les serveurs physiques (Dell R750, HPE ProLiant) sur lesquels tourne SIGNUM. Différent d'un DevOps cloud : il travaille sur hardware réel avec accès physique iDRAC/iLO."),
          sp(40),
          labelRow("Compétences Linux", "RHEL / CentOS Stream · Kernel tuning (hugepages, IRQ affinity, NUMA) · Systemd · LVM · LUKS chiffrement"),
          sp(30),
          labelRow("Hardware", "Dell iDRAC 9 · HPE iLO 6 · PXE boot automatisé · Configuration BIOS/UEFI · Gestion RAID matériel"),
          sp(30),
          labelRow("Réseau bas niveau", "Configuration LACP / bonding · VLAN tagging · SR-IOV pour performance réseau 40G"),
          sp(30),
          labelRow("Différence avec DevOps", "Le DevOps cloud ne touche jamais au matériel. Ce profil intervient quand un disque tombe en panne à 3h du matin."),
          sp(30),
          labelRow("Nb nécessaire", "2 personnes (astreinte 24/7 → rotations)"),
          sp(30),
          labelRow("Coût estimé", "900 K – 1,3 M FCFA / mois / personne"),
        ]),

        // Profil 6
        ...profileCard("💾", "Ingénieur Stockage & Sauvegarde", "Gère les volumes massifs de CDR et les politiques de rétention légale · Niveau confirmé", "065F46", [
          labelRow("Mission", "Dimensionner, déployer et opérer les systèmes de stockage pour les CDR (plusieurs teraoctets par jour). Assurer la rétention légale 5 ans minimum et les sauvegardes chiffrées."),
          sp(40),
          labelRow("Technologies", "MinIO (stockage objet souverain) · Ceph · NetApp ONTAP · Veeam Backup · Chiffrement AES-256"),
          sp(30),
          labelRow("Volumétrie estimée", "Orange : ~800 GB CDR/jour · Free : ~200 GB · Expresso : ~80 GB → Total : ~1,1 TB/jour → 400 TB/an"),
          sp(30),
          labelRow("Conformité légale", "Politique de rétention 5 ans (obligation légale SN) · Immuabilité WORM · Hachage SHA-256 de chaque fichier"),
          sp(30),
          labelRow("Compétences", "ZFS / Btrfs · SAN iSCSI / FC · NFS / SMB · Déduplication · Tiering chaud/froid"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 1 (architecture) → permanent"),
          sp(30),
          labelRow("Coût estimé", "900 K – 1,2 M FCFA / mois"),
        ]),

        // Profil 7
        ...profileCard("🏗️", "Technicien Datacenter (Infrastructure physique)", "Câblage, baies, climatisation, accès physique · Niveau technicien senior", "047857", [
          labelRow("Mission", "Assurer l'installation physique et la maintenance continue des équipements dans les datacenters DC1 Dakar et DC2 Thiès : câblage structuré, gestion des baies 19\", climatisation, contrôle d'accès."),
          sp(40),
          labelRow("Compétences", "Câblage Cat6A / fibre OM4 · Gestion baies 19\" (unités rack, PDU) · Monitoring environnemental (température, humidité)"),
          sp(30),
          labelRow("Sécurité physique", "Contrôle accès badge + biométrie · Surveillance CCTV · Journaux d'accès (exigence légale ARTP)"),
          sp(30),
          labelRow("Climatisation", "Précision cooling (CRAC units) · Calcul PUE · Gestion free cooling si disponible au SN"),
          sp(30),
          labelRow("Nb nécessaire", "2 personnes (1 par datacenter — DC1 Dakar + DC2 Thiès)"),
          sp(30),
          labelRow("Profil", "BTS Électrotechnique / Réseaux · 3–5 ans expérience datacenter · Habilitation électrique B2V"),
          sp(30),
          labelRow("Coût estimé", "400 – 600 K FCFA / mois / personne"),
        ]),

        // Profil 8
        ...profileCard("⚡", "Ingénieur Électrotechnicien / Continuité d'énergie", "Dimensionne l'alimentation des datacenters · Critique au Sénégal (coupures EDC)", "065F46", [
          labelRow("Mission", "Concevoir et opérer l'alimentation électrique des deux datacenters pour garantir une disponibilité 99,97% malgré les coupures fréquentes du réseau électrique sénégalais (EDC/SENELEC)."),
          sp(40),
          labelRow("Équipements", "Onduleurs UPS (APC / Eaton) · Groupes électrogènes diesel 200–500 kVA · Tableaux électriques HTA/BTA · ATS"),
          sp(30),
          labelRow("Calcul charge", "DC1 Dakar : ~150 kW IT load estimé · DC2 Thiès : ~80 kW · Autonomie cible : 72h sans réseau EDC"),
          sp(30),
          labelRow("Normes", "IEC 62040 (UPS) · NF C 15-100 · Tier II minimum ANSI/TIA-942 (objectif Tier III pour DC1)"),
          sp(30),
          labelRow("Où recruter", "Ingénieurs électriciens avec expérience en projets télécom / banques au Sénégal · Profil SENELEC / ASER"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 1 uniquement (conception et installation) → astreinte trimestrielle"),
          sp(30),
          labelRow("Coût estimé", "1,0 – 1,5 M FCFA / mois Phase 1 · 200 K / mois maintenance"),
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== CATEGORIE 3 : SÉCURITÉ =====
        h1("4. Sécurité Physique & Réseau (3 profils)"),
        sp(60),

        // Profil 9
        ...profileCard("🛡️", "Ingénieur Sécurité Réseau — Firewall / IDS / IPS", "Segmente et protège l'infrastructure SIGNUM · Niveau senior · Certifié", "7F1D1D", [
          labelRow("Mission", "Déployer et opérer l'architecture de sécurité périmétrique entre SIGNUM, les opérateurs et l'Internet. SIGNUM est une cible stratégique — des opérateurs ou des acteurs de fraude pourraient tenter de l'attaquer."),
          sp(40),
          labelRow("Architecture réseau", "Zone SIGNUM-Core (données brutes CDR) · Zone DMZ (APIs opérateurs) · Zone ARTP (dashboard) · Zone Admin"),
          sp(30),
          labelRow("Équipements", "Palo Alto PA-Series ou Fortinet FortiGate · Snort / Suricata IDS/IPS · Juniper SRX · Load balancers F5"),
          sp(30),
          labelRow("Certifications", "CCNP Security · Palo Alto PCNSE · Fortinet NSE4+ · ou CISSP"),
          sp(30),
          labelRow("Compétences clés", "Zero-trust network design · Microsegmentation · VPN IPsec site-to-site · DLP · Log management SIEM"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 1 (architecture) → Phase 2 (déploiement) → permanent"),
          sp(30),
          labelRow("Coût estimé", "1,2 – 1,8 M FCFA / mois"),
        ]),

        // Profil 10
        ...profileCard("🔒", "Analyste SOC — Security Operations Center 24/7", "Surveille SIGNUM en permanence contre les intrusions · Niveau N2/N3", "991B1B", [
          labelRow("Mission", "Surveiller en temps réel tous les accès à l'infrastructure SIGNUM, détecter les anomalies, répondre aux incidents de sécurité. SIGNUM contient des données sur des millions de SIM sénégalaises — une fuite serait catastrophique."),
          sp(40),
          labelRow("Outils", "SIEM (Splunk / Elastic SIEM / IBM QRadar) · EDR (CrowdStrike / SentinelOne) · SOAR · Threat intelligence feeds"),
          sp(30),
          labelRow("Scénarios à surveiller", "Accès non autorisé aux CDR · Exfiltration de données · Attaque DDoS sur APIs · Tentative de modification des logs de fraude"),
          sp(30),
          labelRow("Organisation", "2 analystes N2 (rotations matin/soir) + 1 N3 (astreinte nuit) → Total : 3 personnes minimum"),
          sp(30),
          labelRow("Certifications", "CompTIA Security+ · CEH · GCIA · ou formation interne sur 6 mois"),
          sp(30),
          labelRow("Phase d'intervention", "Dès Phase 2 (Go Live) → permanent 24/7"),
          sp(30),
          labelRow("Coût estimé", "600 K – 900 K FCFA / mois / analyste · Total : ~2,2 M / mois pour l'équipe"),
        ]),

        // Profil 11
        ...profileCard("🔍", "Expert Sécurité Offensive — Pentest / Red Team", "Audite SIGNUM avant et après chaque déploiement majeur · Prestataire externe", "B91C1C", [
          labelRow("Mission", "Réaliser des tests d'intrusion réguliers sur l'infrastructure SIGNUM pour identifier les vulnérabilités avant qu'elles ne soient exploitées. Requis avant le Go Live et avant chaque export CEDEAO."),
          sp(40),
          labelRow("Périmètre", "Infrastructure réseau · APIs REST · Applications web (dashboard ARTP) · Systèmes SS7 · Social engineering"),
          sp(30),
          labelRow("Certifications", "OSCP (Offensive Security) · CEH · GPEN · ou équivalent international reconnu"),
          sp(30),
          labelRow("Fréquence", "Pentest initial Phase 1 (avant Go Live) · Pentest Phase 4 (avant certification ISO 27001) · Audit annuel ensuite"),
          sp(30),
          labelRow("Livrables", "Rapport executive (pour ARTP/Ministère) + rapport technique (pour équipe Processingenierie) + plan de remédiation"),
          sp(30),
          labelRow("Où trouver", "Cabinet cybersécurité Dakar ou Abidjan · Bug bounty platforms · Anciens de la DGESN / DPJ"),
          sp(30),
          labelRow("Coût estimé", "8 – 20 M FCFA par engagement (one-shot) selon périmètre"),
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== CATEGORIE 4 : TERRAIN =====
        h1("5. Terrain & Intégration Opérateurs (3 profils)"),
        sp(60),

        // Profil 12
        ...profileCard("🔧", "Technicien Intégration Terrain — Chez les opérateurs", "Se déplace dans les salles serveurs de Orange, Free, Expresso · Profil discret et habilité", "1E3A5F", [
          labelRow("Mission", "Installer physiquement les sondes DPI, configurer les ports SPAN sur les switches des opérateurs, tester la connectivité SFTP vers SIGNUM, et assurer la maintenance des équipements installés."),
          sp(40),
          labelRow("Accès requis", "Habilitation d'accès datacenter × 3 opérateurs (procédure administrative ARTP) · Casier judiciaire vierge · Confidentialité absolue"),
          sp(30),
          labelRow("Compétences", "Câblage réseau · Configuration switches Cisco / Juniper (CLI) · Tests SFTP / FTPS · Wireshark basique"),
          sp(30),
          labelRow("Matériel manipulé", "Sondes DPI passives (port TAP / SPAN) · Serveurs rack 1U–2U · Câbles SFP+ 10G · Convertisseurs fibre"),
          sp(30),
          labelRow("Profil humain", "Discrétion professionnelle absolue · Résistance au stress · Capacité à travailler en milieu sécurisé contraignant"),
          sp(30),
          labelRow("Nb nécessaire", "3 techniciens (1 référent par opérateur)"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 2 (installation) → missions ponctuelles maintenance"),
          sp(30),
          labelRow("Coût estimé", "350 – 550 K FCFA / mois"),
        ]),

        // Profil 13
        ...profileCard("📱", "Technicien Support Terrain — Agents ARTP", "Accompagne les agents ARTP sur le terrain lors des opérations fraude · Niveau technicien", "0C4A6E", [
          labelRow("Mission", "Accompagner les agents ARTP lors des opérations de vérification terrain (descentes chez les fraudeurs, vérification d'équipements SIM Box, saisies). Fournit le support technique en temps réel."),
          sp(40),
          labelRow("Équipements terrain", "Scanner IMEI portable · Détecteur SIM Box RF · Terminal SIGNUM mobile (app Android) · Imprimante PV portable"),
          sp(30),
          labelRow("Compétences", "Lecture CDR terrain · Utilisation app mobile SIGNUM · Rédaction PV technique · Chaîne de custody numérique"),
          sp(30),
          labelRow("Formation ARTP", "Ce profil peut être recruté parmi les agents ARTP formés par SIGNUM — évolution de carrière naturelle"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 3 (premières sanctions) → permanent"),
          sp(30),
          labelRow("Coût estimé", "300 – 450 K FCFA / mois"),
        ]),

        // Profil 14
        ...profileCard("📡", "Ingénieur CEDEAO — Déploiement International", "Déploie SIGNUM dans les pays partenaires · Bilingue · Mobile", "0369A1", [
          labelRow("Mission", "Reproduire le déploiement SIGNUM dans les 6 pays CEDEAO cibles (CI, Bénin, Togo, Mali, Burkina, Niger). Adapter les configurations aux équipements et protocoles locaux de chaque opérateur national."),
          sp(40),
          labelRow("Profil", "Ingénieur télécom confirmé · Mobilité internationale acceptée · Français + Anglais · Connaissance du contexte CEDEAO"),
          sp(30),
          labelRow("Compétences", "Déploiement DPI multi-opérateurs · Configuration réseau SS7/Diameter · Formation utilisateurs en local · Gestion de projet"),
          sp(30),
          labelRow("Nb nécessaire", "4 ingénieurs déploiement (2 missions en parallèle possibles)"),
          sp(30),
          labelRow("Phase d'intervention", "Phase 5 uniquement (M25–M36)"),
          sp(30),
          labelRow("Coût estimé", "1,0 – 1,5 M FCFA / mois + frais de mission"),
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== TABLEAU DE SYNTHESE =====
        h1("6. Tableau de Synthèse — 14 Profils Non-Software"),
        sp(80),
        tbl([
          ["#", "Profil", "Catégorie", "Nb", "Phase", "Criticité", "Coût/mois (M FCFA)"],
          ["1", "Ingénieur Réseau SS7 / Diameter / SIGTRAN", "Réseau Télécom", "1", "P1→Perm", "🔴 BLOQUANT", "1,5 – 2,2"],
          ["2", "Ingénieur DPI (Deep Packet Inspection)", "Réseau Télécom", "2", "P2→P3", "🔴 Élevée", "0,9 – 1,3"],
          ["3", "Ingénieur Transmission / Fibre Optique", "Réseau Télécom", "1", "P1→P2", "🟠 Haute", "0,8 – 1,2"],
          ["4", "Ingénieur RF / Couverture Réseau", "Réseau Télécom", "1", "P3→Perm", "🟡 Moyenne", "0,8 – 1,1"],
          ["5", "Ingénieur Systèmes Linux Bare Metal", "Infra & DC", "2", "P1→Perm", "🔴 BLOQUANT", "0,9 – 1,3"],
          ["6", "Ingénieur Stockage & Sauvegarde", "Infra & DC", "1", "P1→Perm", "🔴 Élevée", "0,9 – 1,2"],
          ["7", "Technicien Datacenter (physique)", "Infra & DC", "2", "P1→Perm", "🟠 Haute", "0,4 – 0,6"],
          ["8", "Ingénieur Électrotechnicien / Énergie", "Infra & DC", "1", "P1 seul.", "🟠 Haute", "1,0 – 1,5"],
          ["9", "Ingénieur Sécurité Réseau Firewall/IDS", "Sécurité", "1", "P1→Perm", "🔴 Élevée", "1,2 – 1,8"],
          ["10", "Analyste SOC 24/7", "Sécurité", "3", "P2→Perm", "🟠 Haute", "0,6 – 0,9/pers."],
          ["11", "Expert Pentest / Red Team", "Sécurité", "1", "P1+P4+ann.", "🟡 Moyenne", "8–20 M (one-shot)"],
          ["12", "Technicien Intégration Terrain (opérateurs)", "Terrain", "3", "P2→P3", "🔴 Élevée", "0,35 – 0,55"],
          ["13", "Technicien Support Terrain ARTP", "Terrain", "2", "P3→Perm", "🟡 Moyenne", "0,3 – 0,45"],
          ["14", "Ingénieur Déploiement CEDEAO", "International", "4", "P5 seul.", "🟠 Haute", "1,0 – 1,5"],
        ], [400, 3000, 1400, 500, 1000, 1160, 1900]),
        sp(100),

        // Budget RH non-software
        h2("6.1 Enveloppe budgétaire — Ressources humaines non-software"),
        tbl([
          ["Phase", "Profils actifs", "Coût mensuel estimé", "Durée", "Sous-total"],
          ["Phase 1 (M1–M3)", "SS7 + Linux×2 + Stockage + DC×2 + Élec + Firewall + Fibre", "~9,5 M FCFA/mois", "3 mois", "~28 M FCFA"],
          ["Phase 2 (M4–M9)", "Phase 1 + DPI×2 + SOC×3 + Terrain×3 + RF", "~16 M FCFA/mois", "6 mois", "~96 M FCFA"],
          ["Phase 3 (M10–M15)", "Équipe permanente + SOC + Support terrain", "~14 M FCFA/mois", "6 mois", "~84 M FCFA"],
          ["Phase 4 (M16–M24)", "Équipe permanente + Pentest (one-shot)", "~14 M + 15 M", "9 mois", "~141 M FCFA"],
          ["Phase 5 (M25–M36)", "Équipe permanente + CEDEAO×4", "~20 M FCFA/mois", "12 mois", "~240 M FCFA"],
          ["TOTAL 36 MOIS", "", "", "", "~589 M FCFA"],
        ], [2000, 3400, 2000, 1000, 1960]),
        sp(80),
        p("Note : Ce budget est inclus dans l'enveloppe RH totale du plan stratégique (1 720 M FCFA). Les profils non-software représentent ~34% des coûts RH totaux.", { italic: true, color: GRAY }),
        sp(120),

        // Où recruter
        h2("6.2 Stratégie de recrutement — Profils non-software"),
        tbl([
          ["Source de recrutement", "Profils concernés", "Délai d'activation"],
          ["Processingenierie (équipe existante)", "Chef projet, architecte, DevOps, DPI", "Immédiat"],
          ["Diaspora sénégalaise (LinkedIn / télécoms)", "SS7/Diameter (critique), Sécurité senior", "1–3 mois"],
          ["Anciens employés Orange / Sonatel / Free SN", "RF, transmission, DPI, terrain", "2–4 mois"],
          ["ESP / UCAD (jeunes ingénieurs formés)", "Linux, stockage, SOC N2, techniciens DC", "3–6 mois"],
          ["Consultants externes régionaux (CI, SN)", "Pentest, AML, droit numérique", "On-demand"],
          ["ARTP (agents internes reconvertis)", "Technicien terrain, support ARTP, SOC N1", "Formation 3 mois"],
        ], [3200, 3160, 3000]),
        sp(120),

        // Conclusion
        h1("7. Recommandations Prioritaires"),
        bullet("Recruter l'Ingénieur SS7/Diameter en PREMIER — c'est le profil le plus long à trouver et le plus critique. Lancer la recherche dès la signature de la convention ARTP.", RED),
        bullet("Négocier les accès datacenter opérateurs dès Phase 1 — les Techniciens terrain ont besoin d'habilitations administratives longues à obtenir."),
        bullet("Créer un partenariat ESP/UCAD pour le pipeline Linux + SOC — former 6 étudiants en master télécom sur SIGNUM dès Phase 1 → embaucher les meilleurs en Phase 2."),
        bullet("Exiger un casier judiciaire vierge + enquête de moralité pour tous les profils terrain — ils ont accès aux datacenters des opérateurs."),
        bullet("Prévoir une clause de non-concurrence 24 mois pour les ingénieurs SS7 et DPI — risque de débauchage par les opérateurs."),
        bullet("Budget électricité Phase 1 : ne pas sous-estimer — un datacenter sans autonomie 72h au Sénégal est une infrastructure non opérationnelle."),
        sp(240),
        new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 6, color: INDIGO, space: 12 } }, spacing: { before: 240, after: 60 }, children: [new TextRun({ text: "Processingenierie © 2026 · Document confidentiel réservé à l'ARTP et au Ministère", size: 16, color: GRAY, font: "Calibri" })] }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('C:/gravity/SIGNUM_Profils_NonSoftware_2026.docx', buffer);
  console.log('Done: C:/gravity/SIGNUM_Profils_NonSoftware_2026.docx');
}).catch(err => { console.error(err.message); process.exit(1); });
