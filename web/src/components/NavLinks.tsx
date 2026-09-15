import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  Leaf,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const NAV_ITEMS: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Shipment Planning", href: "/planning", icon: ClipboardList },
  { label: "Risk & Exceptions", href: "/risk", icon: AlertTriangle },
  { label: "Sustainability", href: "/sustainability", icon: Leaf },
  { label: "AI Decision Support", href: "/decision-support", icon: Sparkles },
];

export function NavLinks({
  pathname,
  onNavigate,
  mobile,
}: {
  pathname: string;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  return (
    <nav className={cn("flex flex-col", mobile ? "gap-1" : "gap-1 px-3")}>
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <a
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
              active
                ? "bg-white/10 font-medium text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            )}
          >
            {active ? (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-400" />
            ) : null}
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors duration-150",
                active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
              )}
            />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
