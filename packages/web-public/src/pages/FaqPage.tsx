import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronDownIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const FAQS = [
  {
    q: "Qu'est-ce que la QoS (Qualité de Service) ?",
    a: "La QoS mesure les performances des réseaux mobiles selon 4 critères : le débit descendant (vitesse de téléchargement), le débit montant (vitesse d'envoi), la latence (temps de réponse) et la disponibilité du réseau. L'ARTP fixe des seuils minimaux que les opérateurs doivent respecter.",
  },
  {
    q: "Quels sont les seuils réglementaires ARTP ?",
    a: "Débit descendant : ≥ 5 Mbps · Débit montant : ≥ 1 Mbps · Latence : ≤ 100 ms · Disponibilité : ≥ 99%. Ces seuils sont définis dans le cahier des charges des opérateurs et peuvent être révisés par arrêté.",
  },
  {
    q: "Comment porter une plainte contre mon opérateur ?",
    a: "1) Contactez d'abord votre opérateur via son service client. 2) Si le problème persiste après 15 jours, saisissez l'ARTP via le formulaire en ligne sur artp.sn, par email à plaintes@artp.sn ou en vous rendant au guichet. L'ARTP traitera votre plainte sous 30 jours.",
  },
  {
    q: "Qu'est-ce qu'une zone blanche ?",
    a: "Une zone blanche est un endroit où aucun opérateur ne propose de couverture réseau mobile. Ces zones sont identifiées par les agents terrain ARTP et signalées aux opérateurs pour plan d'action obligatoire dans un délai de 90 jours.",
  },
  {
    q: "Comment sont mesurées les données de débit ?",
    a: "Les mesures sont effectuées par les agents terrain ARTP équipés d'appareils homologués, aux heures de pointe (8h-20h). Les résultats sont la médiane de 30 mesures sur chaque point de contrôle. Les opérateurs transmettent aussi leurs propres mesures, contrôlées par l'ARTP.",
  },
  {
    q: "À quelle fréquence les données sont-elles mises à jour ?",
    a: "Les indicateurs nationaux sont publiés chaque mois. Les rapports trimestriels sont publiés dans les 30 jours suivant la fin du trimestre. Le bilan annuel est publié en janvier pour l'année précédente.",
  },
  {
    q: "Puis-je réutiliser les données ARTP ?",
    a: "Oui, les données publiées sur ce portail sont en Open Data sous licence CC-BY 4.0. Vous pouvez les réutiliser librement avec mention de la source « ARTP Sénégal ».",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      <Navbar/>
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Questions fréquentes</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Tout ce que vous devez savoir sur la qualité des réseaux et l'ARTP</p>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-3 mb-12">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
                <span className="font-bold text-slate-800 text-sm leading-snug">{faq.q}</span>
                <ChevronDownIcon className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}/>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="card p-6">
          <h2 className="text-lg font-black text-slate-800 mb-5">Contacter l'ARTP</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { Icon: PhoneIcon,    label: "Téléphone",  value: "+221 33 869 75 10", sub: "Lun–Ven, 8h–17h"  },
              { Icon: EnvelopeIcon, label: "Email",      value: "contact@artp.sn",   sub: "Réponse sous 48h" },
              { Icon: GlobeAltIcon, label: "Site web",   value: "www.artp.sn",       sub: "Formulaire plainte"},
            ].map(({ Icon, label, value, sub }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 bg-artp-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-artp-600"/>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
