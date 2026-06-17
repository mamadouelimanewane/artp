import { useState, useEffect } from "react";
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SignalIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { api } from "../services/api";

type NotifType = "alerte_qos" | "plainte_urgente" | "plainte_resolue" | "systeme";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body?: string;
  message?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string | Date;
  link?: string;
}

interface NormalizedNotif {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}

function normalize(n: Notification): NormalizedNotif {
  return {
    id: n.id,
    type: (n.type as NotifType) ?? "systeme",
    title: n.title ?? "",
    message: n.body ?? n.message ?? "",
    read: n.isRead ?? n.read ?? false,
    createdAt: new Date(n.createdAt),
    link: n.link,
  };
}

const notifConfig: Record<
  NotifType,
  {
    icon: React.ComponentType<{ className?: string }>;
    bg: string;
    iconColor: string;
    label: string;
  }
> = {
  alerte_qos: {
    icon: SignalIcon,
    bg: "bg-red-100",
    iconColor: "text-red-600",
    label: "Alerte QoS",
  },
  plainte_urgente: {
    icon: ExclamationTriangleIcon,
    bg: "bg-orange-100",
    iconColor: "text-orange-600",
    label: "Plainte urgente",
  },
  plainte_resolue: {
    icon: CheckCircleIcon,
    bg: "bg-green-100",
    iconColor: "text-green-600",
    label: "Résolue",
  },
  systeme: {
    icon: BellIcon,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Système",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NormalizedNotif[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/notifications?page=1&limit=20")
      .then((res) => {
        const raw: Notification[] =
          res.data?.data?.notifications ??
          res.data?.data ??
          res.data?.notifications ??
          res.data ??
          [];
        const arr = Array.isArray(raw) ? raw : [];
        setNotifications(arr.map(normalize));
      })
      .catch(() => {
        // Fallback vers donnees locales si l'API n'est pas disponible
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markRead(id: string) {
    api.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    api.patch("/notifications/read-all").catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("Toutes les notifications marquées comme lues");
  }

  function deleteNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  if (loading) {
    return (
      <div className="max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes les notifications ont été lues"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <CheckIcon className="h-4 w-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filtres type */}
      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-artp-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f === "all"
              ? `Toutes (${notifications.length})`
              : `Non lues (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <BellIcon className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Aucune notification</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === "unread"
              ? "Toutes vos notifications ont été lues"
              : "Vous n'avez aucune notification pour l'instant"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const config = notifConfig[notif.type] ?? notifConfig.systeme;
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={`card flex items-start gap-4 transition-all ${
                  !notif.read ? "border-artp-200 bg-artp-50/20" : ""
                }`}
              >
                {/* Icone type */}
                <div
                  className={`${config.bg} p-2.5 rounded-xl flex-shrink-0 mt-0.5`}
                >
                  <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span
                      className={`badge ${config.bg} ${config.iconColor} text-xs`}
                    >
                      {config.label}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-artp-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-1.5">
                    {notif.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(notif.createdAt, {
                        locale: fr,
                        addSuffix: true,
                      })}
                    </span>
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="text-xs text-artp-600 hover:text-artp-800 font-medium"
                      >
                        Marquer comme lu
                      </button>
                    )}
                    {notif.link && (
                      <a
                        href={notif.link}
                        className="text-xs text-artp-600 hover:text-artp-800 font-medium"
                      >
                        Voir le détail &rarr;
                      </a>
                    )}
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      className="text-xs text-gray-400 hover:text-red-500 ml-auto"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Types de notifications */}
      <div className="card bg-gray-50 border-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Légende des types de notifications
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(notifConfig).map(([type, conf]) => {
            const Icon = conf.icon;
            return (
              <div key={type} className="flex items-center gap-2 text-xs text-gray-600">
                <div className={`${conf.bg} p-1.5 rounded-lg`}>
                  <Icon className={`h-3.5 w-3.5 ${conf.iconColor}`} />
                </div>
                {conf.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
