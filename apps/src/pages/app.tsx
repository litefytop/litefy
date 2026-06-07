import {
  NavLink,
  useLocation,
  useNavigate,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { getNavItems, getPageTitle } from "@/pages/config/routes";
import {
  Title,
  Image,
  Sidebar,
  Button,
  Toaster,
  Dropdown,
  ScrollShadow,
} from "@/component";
import { useTheme } from "@/component";
import { t } from "@/pages/config/i18n";
import { SidebarHandle } from "@/component/ui/sidebar";
import LOGO from "@/assets/LOGO.svg";
import {
  MoonIcon,
  SunIcon,
  PanelLeftIcon,
  LanguagesIcon,
  ContrastIcon,
} from "lucide-react";

function useUpdateTitle({ locale }: { locale: string }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = getPageTitle(pathname, locale as "zh" | "en");
    document.title = `${title} - Litefy UI`;
  }, [pathname, locale]);
}

function ThemeToggle({ locale }: { locale: string }) {
  const { colorScheme, setColorScheme } = useTheme();
  const lang = t(locale as "zh" | "en");

  const getIcon = () => {
    if (colorScheme === "system") return <ContrastIcon />;
    return colorScheme === "light" ? <SunIcon /> : <MoonIcon />;
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Toggle color scheme"
        className={[Button.class.base, Button.class.variant.text]}
      >
        {getIcon()}
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => setColorScheme("light")}>
          <SunIcon size={16} />
          {lang.common.theme.light}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setColorScheme("dark")}>
          <MoonIcon size={16} />
          {lang.common.theme.dark}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setColorScheme("system")}>
          <ContrastIcon size={16} />
          {lang.common.theme.system}
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}

function LanguageToggle({ locale }: { locale: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLocale = () => {
    const newLocale = locale === "zh" ? "en" : "zh";
    const newPath = location.pathname.replace(`/${locale}`, `/${newLocale}`);
    navigate(newPath || `/${newLocale}/`);
  };

  return (
    <Button variant="text" onClick={toggleLocale} aria-label="Toggle language">
      <LanguagesIcon />
    </Button>
  );
}

function SidebarContent({ locale }: { locale: string }) {
  const navItems = getNavItems(locale as "zh" | "en");

  return (
    <nav className="flex flex-col h-full  p-4 gap-4">
      {navItems.map((group) => (
        <ul key={group.title}>
          <li>
            <Title className="text-xs uppercase text-muted-foreground mb-2">
              {group.title}
            </Title>
          </li>
          {group.items.map((item) => (
            <li key={item.href}>
              <NavLink
                to={`/${locale}${item.href}`}
                end={item.href === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2 my-1 rounded-md text-sm ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}

function Header({
  locale,
  className,
  sidebarRef,
}: {
  locale: string;
  className?: string;
  sidebarRef: React.RefObject<SidebarHandle | null>;
}) {
  return (
    <header
      className={`border-b bg-card flex items-center justify-between px-4 ${className || ""}`}
    >
      <div className="flex items-center gap-2">
        <Image src={LOGO} className="size-8" alt="Logo" />
        <p className="whitespace-nowrap font-bold text-lg">Litefy UI</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="text"
          aria-label="GitHub"
          onClick={() => window.open("https://github.com", "_blank")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </Button>
        <ThemeToggle locale={locale} />
        <LanguageToggle locale={locale} />
        <Button
          variant="text"
          aria-label="Toggle sidebar"
          onClick={() => sidebarRef.current?.toggle()}
        >
          <PanelLeftIcon />
        </Button>
      </div>
    </header>
  );
}

export function App({ locale = "zh" }: { locale?: string }) {
  const sidebarRef = useRef<SidebarHandle | null>(null);
  useUpdateTitle({ locale });

  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[3.5rem_1fr] h-screen bg-background text-foreground overflow-hidden">
      <Header locale={locale} sidebarRef={sidebarRef} className="col-span-2" />
      <Sidebar controlRef={sidebarRef} className="w-3xs shrink-0 border-r">
        <ScrollShadow>
          <SidebarContent locale={locale} />
        </ScrollShadow>
      </Sidebar>
      <main className="flex-1  overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <Outlet />
        </div>
      </main>

      <ScrollRestoration />
      <Toaster position="top-right" />
    </div>
  );
}
