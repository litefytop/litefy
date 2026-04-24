import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { getNavItems } from "@/main";
import { Title, Img, MoonIcon, SunIcon, GitHubIcon, LanguageIcon } from "@/components";
import { useTheme } from "@/components/ui/theme";
import LOGO from "@/assets/LOGO.svg";

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useTheme();

  return (
    <button
      onClick={toggleColorScheme}
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle color scheme"
    >
      {colorScheme === "light" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </button>
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
    <button
      onClick={toggleLocale}
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle language"
    >
      <LanguageIcon size={20} />
    </button>
  );
}

function SidebarContent({ locale }: { locale: string }) {
  const navItems = getNavItems(locale as "zh" | "en");

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto p-4">
        {navItems.map((group) => (
          <div key={group.title} className="mb-6">
            <Title className="text-xs uppercase text-muted-foreground mb-2">
              {group.title}
            </Title>
            <ul className="space-y-1">
              {group.items
                .slice()
                .sort((a, b) => (a.key || "").localeCompare(b.key || ""))
                .map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={`/${locale}${item.href}`}
                      end={item.href === "/"}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-sm transition-colors ${
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
          </div>
        ))}
      </nav>
    </div>
  );
}

function Header({ locale, className }: { locale: string; className?: string }) {
  return (
    <header className={`h-14 border-b bg-card flex items-center justify-between px-4 ${className || ""}`}>
      <div className="flex items-center gap-2">
        <Img src={LOGO} className="size-8" alt="Logo" />
        <p className="whitespace-nowrap font-bold text-lg">Plain UI</p>
      </div>
      <div className="flex items-center gap-2">
        <LanguageToggle locale={locale} />
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="GitHub"
        >
          <GitHubIcon size={20} />
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function Layout({ locale = "zh" }: { locale?: string }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] grid-rows-[auto_1fr] min-h-screen bg-background text-foreground">
      <Header locale={locale} className="col-span-2 sticky top-0 z-10" />
      <aside className="border-r bg-card overflow-y-auto sticky top-14 h-[calc(100vh-3.5rem)]">
        <SidebarContent locale={locale} />
      </aside>
      <main className="overflow-y-auto container mx-auto px-6 py-8 max-w-4xl">
        <Outlet />
      </main>
    </div>
  );
}
