import React from 'react';
import { useCampaign, AppPage } from '../context/CampaignContext';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  AlertCircle,
  Users,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  MapPin,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SidebarProps {
  onOpenTestingGuide: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenTestingGuide,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { activePage, setActivePage, stats, resetAllData } = useCampaign();

  const navItems: { page: AppPage; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      page: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      page: 'activities',
      label: 'Activities & Rallies',
      icon: <CalendarDays className="h-5 w-5" />,
      badge: stats.upcomingActivities,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      page: 'tasks',
      label: 'Operational Tasks',
      icon: <CheckSquare className="h-5 w-5" />,
      badge: stats.pendingTasks,
      badgeColor: 'bg-yellow-400 text-black',
    },
    {
      page: 'issues',
      label: 'Community Issues',
      icon: <AlertCircle className="h-5 w-5" />,
      badge: stats.urgentIssuesCount,
      badgeColor: 'bg-red-600 text-white',
    },
    {
      page: 'team',
      label: 'Field Team',
      icon: <Users className="h-5 w-5" />,
      badge: stats.totalTeamMembers,
      badgeColor: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    },
  ];

  const handleNavClick = (page: AppPage) => {
    setActivePage(page);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black text-white w-64 lg:w-72 border-r-4 border-yellow-400 shrink-0">
      {/* Top Brand Banner */}
      <div className="p-5 border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-black">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 flex items-center justify-center text-black font-black text-xl shadow-md border-2 border-white/20">
              CCM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base tracking-tight text-white leading-tight">
                  Campaign Mgr
                </h1>
                <Badge variant="blue" className="bg-blue-600 text-white border-blue-400 text-[10px] py-0 px-1.5 font-bold">
                  Nyeri
                </Badge>
              </div>
              <p className="text-[11px] text-yellow-400 font-semibold uppercase tracking-wider">
                County Ops Console
              </p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Candidate Profile Box */}
        <div className="bg-zinc-900/90 rounded-xl p-3 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-yellow-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 fill-yellow-400" /> Fictional Candidate
            </span>
            <span className="text-[9px] bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded font-bold">
              2027
            </span>
          </div>
          <p className="text-xs font-bold text-white">Dr. Grace Wambui Kariuki</p>
          <p className="text-[11px] text-zinc-400 italic">"Umoja, Kazi na Maendeleo"</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1.5">
        <div className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
          Navigation Menu
        </div>
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-yellow-300' : 'text-zinc-400'}>
                  {item.icon}
                </span>
                <span className="text-left font-medium">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                      isActive ? 'bg-yellow-400 text-black' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4 text-yellow-300" />}
              </div>
            </button>
          );
        })}

        {/* Quick Summary Pill in Sidebar */}
        <div className="pt-4 px-2">
          <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              County Quick Pulse
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Sub-Counties</span>
                <strong className="text-yellow-400 text-sm font-black">6 of 6</strong>
              </div>
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Task Rate</span>
                <strong className="text-blue-400 text-sm font-black">{stats.taskCompletionRate}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls in Sidebar */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950 space-y-2">
        <Button
          variant="yellow"
          size="sm"
          onClick={() => {
            onOpenTestingGuide();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <HelpCircle className="h-4 w-4" />
          How To Test Prototype
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (window.confirm('Reset all campaign data back to baseline training values?')) {
              resetAllData();
              if (onCloseMobile) onCloseMobile();
            }
          }}
          className="w-full text-xs bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Sample Data
        </Button>

        <div className="pt-2 text-center">
          <p className="text-[10px] text-zinc-500">
            Training Prototype • Fictional Simulation
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden md:flex flex-col sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar (when toggled via mobile top bar) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Slide-out drawer */}
          <div className="relative z-50 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
