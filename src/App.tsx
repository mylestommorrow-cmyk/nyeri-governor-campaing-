/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampaignProvider, useCampaign, AppPage } from './context/CampaignContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { TestingGuideModal } from './components/TestingGuideModal';
import { SupabaseModal } from './components/SupabaseModal';
import { DashboardPage } from './pages/DashboardPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { TasksPage } from './pages/TasksPage';
import { CommunityIssuesPage } from './pages/CommunityIssuesPage';
import { TeamPage } from './pages/TeamPage';
import { HelpCircle, Database } from 'lucide-react';

function CampaignMainContent() {
  const { activePage, setActivePage, supabaseStatus } = useCampaign();
  const [testingGuideOpen, setTestingGuideOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal triggers shared with dashboard quick actions
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newIssueModalOpen, setNewIssueModalOpen] = useState(false);
  const [newMemberModalOpen, setNewMemberModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 flex font-sans antialiased selection:bg-yellow-300 selection:text-black">
      {/* Left Sidebar Navigation */}
      <Sidebar
        onOpenTestingGuide={() => setTestingGuideOpen(true)}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / Breadcrumb Bar */}
        <Header
          onOpenTestingGuide={() => setTestingGuideOpen(true)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        />

        {/* Supabase Setup Banner Notice if tables haven't been created yet */}
        {supabaseStatus === 'needs_tables' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 sm:px-6 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Supabase Connected:</strong> Tables not found yet in your Supabase project. The app is temporarily using local storage.
              </span>
            </div>
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="font-bold underline text-amber-950 hover:text-black shrink-0 cursor-pointer"
            >
              Copy SQL Schema Script →
            </button>
          </div>
        )}

        {/* Page Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-20 md:pb-12">
          {activePage === 'dashboard' && (
            <DashboardPage
              onScheduleActivity={() => {
                setActivePage('activities');
                setScheduleModalOpen(true);
              }}
              onAddTask={() => {
                setActivePage('tasks');
                setNewTaskModalOpen(true);
              }}
              onLogIssue={() => {
                setActivePage('issues');
                setNewIssueModalOpen(true);
              }}
              onAddTeamMember={() => {
                setActivePage('team');
                setNewMemberModalOpen(true);
              }}
            />
          )}

          {activePage === 'activities' && (
            <ActivitiesPage
              scheduleModalOpen={scheduleModalOpen}
              setScheduleModalOpen={setScheduleModalOpen}
            />
          )}

          {activePage === 'tasks' && (
            <TasksPage
              newTaskModalOpen={newTaskModalOpen}
              setNewTaskModalOpen={setNewTaskModalOpen}
            />
          )}

          {activePage === 'issues' && (
            <CommunityIssuesPage
              newIssueModalOpen={newIssueModalOpen}
              setNewIssueModalOpen={setNewIssueModalOpen}
            />
          )}

          {activePage === 'team' && (
            <TeamPage
              newMemberModalOpen={newMemberModalOpen}
              setNewMemberModalOpen={setNewMemberModalOpen}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-black text-zinc-400 py-5 px-6 hidden md:block mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-yellow-400 text-black flex items-center justify-center font-black text-xs">
                CCM
              </div>
              <div>
                <p className="font-semibold text-white">
                  County Campaign Manager • Nyeri Gubernatorial Simulation
                </p>
                <p className="text-[11px] text-zinc-500">
                  Fictional Training Prototype for political campaign management & field logistics.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSupabaseModalOpen(true)}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Database className="h-3.5 w-3.5" /> Supabase Cloud Database
              </button>
              <span className="text-zinc-600">|</span>
              <button
                onClick={() => setTestingGuideOpen(true)}
                className="text-yellow-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5" /> Testing Guide
              </button>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 text-[11px]">
                Palette: Yellow #FACC15 • Blue #2563EB • Black #000000
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (for quick thumb navigation on phone) */}
      <MobileNav />

      {/* Testing Guide Modal */}
      <TestingGuideModal
        open={testingGuideOpen}
        onOpenChange={setTestingGuideOpen}
      />

      {/* Supabase Schema and Status Modal */}
      <SupabaseModal
        open={supabaseModalOpen}
        onOpenChange={setSupabaseModalOpen}
      />
    </div>
  );
}

export default function App() {
  return (
    <CampaignProvider>
      <CampaignMainContent />
    </CampaignProvider>
  );
}
