import {
  NavLink,
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";
import { getNavItems } from "@/pages/config/routes";
import {
  Title,
  Image,
  MoonIcon,
  SunIcon,
  GitHubIcon,
  LanguageIcon,
  Sidebar,
  PanelLeft,
  Button,
  Toaster,
} from "@/component";
import { useTheme } from "@/component";
import LOGO from "@/assets/LOGO.svg";

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleColorScheme}
      aria-label="Toggle color scheme"
    >
      {colorScheme === "light" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </Button>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 路由切换时滚动到顶部
    const main = document.querySelector("main");
    if (main) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  return null;
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
    <Button variant="ghost" onClick={toggleLocale} aria-label="Toggle language">
      <LanguageIcon size={20} />
    </Button>
  );
}

function SidebarContent({ locale }: { locale: string }) {
  const navItems = getNavItems(locale as "zh" | "en");

  return (
    <nav className="flex flex-col h-full overflow-y-auto p-4 gap-6">
      {navItems.map((group) => (
        <ul key={group.title} className="space-y-1">
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
                  `block px-3 py-2 rounded-md text-sm  ${
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

function Header({ locale, className }: { locale: string; className?: string }) {
  return (
    <header
      className={`h-14 border-b bg-card flex items-center justify-between px-4 ${className || ""}`}
    >
      <div className="flex items-center gap-2">
        <Image src={LOGO} className="size-8" alt="Logo" />
        <p className="whitespace-nowrap font-bold text-lg">Plain UI</p>
      </div>
      <div className="flex items-center gap-2">
        <Sidebar.Trigger variant="ghost" aria-label="Toggle sidebar">
          <PanelLeft />
        </Sidebar.Trigger>
        <LanguageToggle locale={locale} />
        <Button
          variant="ghost"
          aria-label="GitHub"
          onClick={() => window.open("https://github.com", "_blank")}
        >
          <GitHubIcon size={20} />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function App({ locale = "zh" }: { locale?: string }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header locale={locale} className="shrink-0" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="w-3xs shrink-0 overflow-y-auto">
          <SidebarContent locale={locale} />
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          <ScrollToTop />

          <div className="container mx-auto px-6 py-8 max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
