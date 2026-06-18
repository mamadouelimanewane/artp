import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-artp-600 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-white"/>
              </div>
              <div>
                <p className="text-white font-black text-sm">ARTP Sénégal</p>
                <p className="text-slate-500 text-xs">Autorité de Régulation des Télécommunications et des Postes</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              L'ARTP publie ces données dans le cadre de sa mission de transparence et de protection des consommateurs.
            </p>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-4">Portail</p>
            <div className="space-y-2">
              {["Accueil","Opérateurs","Carte","Rapports","FAQ"].map(l => (
                <a key={l} href="#" className="block">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-4">Contact</p>
            <div className="space-y-2 text-sm">
              <p>Rue des Géraniums, Dakar</p>
              <p>+221 33 869 75 10</p>
              <p><a href="mailto:contact@artp.sn" className="text-artp-400 hover:text-artp-300">contact@artp.sn</a></p>
              <p><a href="https://www.artp.sn" className="text-artp-400 hover:text-artp-300">www.artp.sn</a></p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 ARTP Sénégal. Données mises à jour mensuellement.</p>
          <div className="flex gap-4">
            <a href="#">Mentions légales</a>
            <a href="#">Données personnelles</a>
            <a href="#">Accessibilité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
