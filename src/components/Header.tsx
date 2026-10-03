import React from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Menu, HelpCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  onOpenTestingGuide: () => void;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTestingGuide,
  onOpenMobileSidebar,
}) => {
  const { activePage, stats, resetAllData } = useCampaign();

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Campaign Dashboard & Strategy',
      subtitle: 'Overview of Nyeri County 6 sub-counties readiness and grassroots operations',
    },
    activities: {
      title: 'Campaign Activities & Barazas',
      subtitle: 'Scheduling, logistics clearance, and turnout tracking',
    },
    tasks: {
      title: 'Operational Field Tasks',
      subtitle: 'Field assignments, compliance, and volunteer coordination',
    },
    issues: {
      title: 'Community Listening Tour & Issues',
      subtitle: 'Constituent grievances and candidate policy pledges',
    },
    team: {
      title: 'Campaign Team & Field Marshals',
      subtitle: 'Sub-county coordinators, youth leads, and volunteer directory',
    },
  };

  const current = pageTitles[activePage] || {
    title: 'County Campaign Manager',
    subtitle: 'Nyeri County Gubernatorial Simulation',
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-zinc-200 shadow-xs">
      {/* Disclaimer sub-banner */}
      <div className="bg-yellow-400 text-black px-4 py-1 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-black fill-black" />
          <span className="font-extrabold uppercase tracking-wide">Fictional Training Prototype</span>
          <span className="hidden sm:inline text-black/80 font-normal">
            — Nyeri County Gubernatorial Campaign Simulation • Fictional Data
          </span>
        </div>
        <button
          onClick={onOpenTestingGuide}
          className="underline font-bold text-xs hover:text-blue-900 cursor-pointer shrink-0 ml-2"
        >
          Testing Guide & Scenarios →
        </button>
      </div>

      {/* Main Top Header Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
            title="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight truncate">
                {current.title}
              </h1>
              <Badge variant="blue" className="hidden lg:inline-flex text-[10px] py-0 px-2 font-bold">
                Nyeri 2027
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 hidden sm:block truncate">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="yellow"
            size="sm"
            onClick={onOpenTestingGuide}
            className="text-xs font-bold hidden sm:inline-flex items-center gap-1.5 shadow-xs"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>How To Test</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all campaign data back to baseline training values?')) {
                resetAllData();
              }
            }}
            title="Reset Sample Data"
            className="text-xs bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-red-700 hover:bg-zinc-100 p-2 sm:px-3"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">Reset Data</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
