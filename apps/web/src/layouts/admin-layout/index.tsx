import { BookOpen, LogOut, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { cn } from '@sticker-manager/ui';
import { useLogout } from '@/data/queries/auth.queries';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { to: '/admin/albums', label: 'Álbuns', icon: BookOpen },
  { to: '/admin/users', label: 'Usuários', icon: Users },
];

export default function AdminLayout() {
  const user = useAuth('ADMIN');
  const navigate = useNavigate();
  const logout = useLogout();

  if (!user) return null;

  function handleLogout() {
    logout.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) });
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between h-14 px-4 border-b bg-background">
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Sticker Manager</span>
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={18} />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-60 border-r bg-background z-20">
        <div className="flex flex-col justify-center h-16 px-6 border-b shrink-0">
          <span className="font-semibold">Sticker Manager</span>
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1 p-3 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 flex items-center justify-around h-16 border-t bg-background">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>

    </div>
  );
}
