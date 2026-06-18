import Sidebar from "./Sidebar";

interface Props { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode; }

export default function Layout({ children, title, subtitle, actions }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
