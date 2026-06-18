import Layout from "../components/Layout";
import { BellIcon, ShieldCheckIcon, GlobeAltIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  return (
    <Layout title="Paramètres" subtitle="Configuration du tableau de bord ARTP">
      <div className="max-w-2xl space-y-5">
        {[
          { Icon:BellIcon,        title:"Alertes & notifications", desc:"Seuils de déclenchement des alertes QoS",
            fields:[{label:"Seuil débit critique (Mbps)",default:"3"},{label:"Seuil latence critique (ms)",default:"200"},{label:"Délai alerte zone blanche (h)",default:"24"}] },
          { Icon:ShieldCheckIcon, title:"Seuils réglementaires", desc:"Valeurs de référence ARTP — modifiables par arrêté",
            fields:[{label:"Débit minimal (Mbps)",default:"5"},{label:"Latence maximale (ms)",default:"100"},{label:"Disponibilité minimale (%)",default:"99"}] },
          { Icon:GlobeAltIcon,    title:"API & synchronisation", desc:"Connexion à l'API centrale ARTP",
            fields:[{label:"URL API",default:"http://localhost:3001/api"},{label:"Intervalle rafraîchissement (s)",default:"60"}] },
          { Icon:UserGroupIcon,   title:"Accès & utilisateurs", desc:"Gestion des comptes autorisés",
            fields:[{label:"Session timeout (min)",default:"30"}] },
        ].map(({ Icon, title, desc, fields }) => (
          <div key={title} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-artp-50 flex items-center justify-center">
                <Icon className="h-5 w-5 text-artp-600"/>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{title}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input defaultValue={f.default} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-artp-500 focus:bg-white transition-all"/>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn-primary">Enregistrer les paramètres</button>
      </div>
    </Layout>
  );
}
