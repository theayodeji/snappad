"use client";

import {
  Home,
  CalendarCheck,
  Building,
  Settings,
  HelpCircle,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Properties", href: "/properties", icon: Building },
  { label: "Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

const HostSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar: Hidden on small screens, visible from md and up */}
      <aside
        className={clsx(
          "h-[calc(100vh-72px)] transition-all duration-300 sticky top-18 hidden md:flex flex-col pb-8 rounded-r-md",
          collapsed ? "w-20" : "w-64",
          "dark:bg-neutral-800 bg-white"
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-between w-full sticky top-0 z-10 mt-2",
            collapsed && "justify-center"
          )}
        >
          <span
            className={clsx(
              "text-xl font-bold transition-opacity px-3 py-5",
              collapsed ? "hidden" : "text-black dark:text-white"
            )}
          >
            Host Panel
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-gray-600 hover:text-primary dark:text-white p-3"
          >
            {collapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
        </div>

        <nav aria-label="Host navigation" className="flex-1">
          <ul className="space-y-4 px-4">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={clsx(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      collapsed ? "justify-center" : "",
                      isActive
                        ? "bg-gray-200 dark:bg-primary/70 font-medium hover:bg-primary/70"
                        : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-primary/70"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={32} />
                    {!collapsed && (
                      <span className="text-black dark:text-white">
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <Link
            href="/list-property"
            className={clsx(
              "flex items-center gap-2 dark:text-white bg-primary hover:bg-primary/90 rounded-lg" +
                (collapsed ? " px-0 py-1 justify-center" : " px-4 py-2")
            )}
          >
            <Plus size={24} />
            {!collapsed && (
              <span className="text-black dark:text-white">
                List New Property
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Bottom bar: Only visible on small screens */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 flex justify-around items-center py-2 z-50 md:hidden">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center px-2 text-xs",
                isActive
                  ? "text-primary font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={22} />
              <span className="mt-1">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default HostSidebar;
