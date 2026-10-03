import React from 'react';
import { useCampaign, AppPage } from '../context/CampaignContext';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  AlertCircle,
  Users,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, stats } = useCampaign();

  const navItems: { page: AppPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      page: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      page: 'activities',
      label: 'Activities',
      icon: <CalendarDays className="h-5 w-5" />,
      badge: stats.upcomingActivities,
    },
    {
      page: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="h-5 w-5" />,
      badge: stats.pendingTasks,
    },
    {
      page: 'issues',
      label: 'Issues',
      icon: <AlertCircle className="h-5 w-5" />,
      badge: stats.urgentIssuesCount,
    },
    {
      page: 'team',
      label: 'Team',
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t-2 border-yellow-400 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all cursor-pointer min-w-[56px] ${
                isActive
                  ? 'text-yellow-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <span className={isActive ? 'text-yellow-400' : 'text-zinc-400'}>
                  {item.icon}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-blue-600 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
