import Layout from "../components/Layout";
import { useAuthStore } from "../store/auth";
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const OP_INFO: Record<string, { fullName: string; website: string; phone: string; email: string; color: string }> = {
  orange:   { fullName:"Orange Sénégal SA",       website:"www.orange.sn",    phone:"800 00 08 00", email:"support@orange.sn",    color:"text-orange-600 bg-orange-50" },
  free:     { fullName:"Free Sénégal (Saga Africa)",website:"www.free.sn",    phone:"3087",         email:"support@free.sn",       color:"text-indigo-600 bg-indigo-50" },
  expresso: { fullName:"Expresso Sénégal SA",      website:"www.expressotelecom.sn",phone:"800 400 400",email:"sav@expressotelecom.sn",color:"text-red-600 bg-red-50" },
};

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const op = OP_INFO[user?.operator ?? "orange"] ?? OP_INFO.orange;

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6">Mon compte</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Profil utilisateur */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-op-100 flex items-center justify-center">
                <span className="text-op-700 font-black text-xl">{user?.name?.[0]?.toUpperCase() ?? "?"}</span>
              </div>
              <div>
                <p className="font-black text-slate-900 text-base">{user?.name}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
                <span className={`badge text-xs mt-1 ${op.color}`}>
                  {op.fullName}
                </span>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-50">
              {[
                { label:"Rôle", value:"Responsable réglementaire" },
                { label:"Accès", value:"Portail Opérateurs ARTP" },
                { label:"Identifiant", value: user?.id?.slice(0,8) + "..." },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                  <span className="text-sm text-slate-700 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infos opérateur */}
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <BuildingOffice2Icon className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-700">Informations opérateur</h2>
            </div>
            <div className="space-y-3">
              {[
                { Icon: BuildingOffice2Icon, label:"Raison sociale", value: op.fullName },
                { Icon: GlobeAltIcon,        label:"Site web",       value: op.website  },
                { Icon: PhoneIcon,           label:"Service client", value: op.phone    },
                { Icon: EnvelopeIcon,        label:"Email support",  value: op.email    },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-slate-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact ARTP */}
          <div className="card p-5 lg:col-span-2 bg-gradient-to-r from-op-50 to-emerald-50 border-op-100">
            <h2 className="text-sm font-bold text-op-800 mb-2">Contact ARTP — Direction de la Réglementation</h2>
            <p className="text-xs text-op-700">Tél : (+221) 33 849 08 08 &nbsp;•&nbsp; Email : reglementation@artp.sn &nbsp;•&nbsp; Km 5, Boulevard du Centenaire de la Commune de Dakar</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
