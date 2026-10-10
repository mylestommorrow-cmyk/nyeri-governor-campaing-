import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  CampaignActivity,
  CampaignTask,
  CommunityIssue,
  TeamMember,
  SubCounty,
} from '../types/campaign';
import {
  INITIAL_ACTIVITIES,
  INITIAL_TASKS,
  INITIAL_ISSUES,
  INITIAL_TEAM,
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type AppPage = 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team';
export type SupabaseStatus = 'connected' | 'needs_tables' | 'local_only' | 'checking';

interface CampaignContextType {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  activities: CampaignActivity[];
  tasks: CampaignTask[];
  issues: CommunityIssue[];
  team: TeamMember[];
  addActivity: (activity: Omit<CampaignActivity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<CampaignActivity>) => void;
  deleteActivity: (id: string) => void;
  addTask: (task: Omit<CampaignTask, 'id' | 'createdAt'>) => void;
  toggleTaskStatus: (id: string) => void;
  updateTask: (id: string, updates: Partial<CampaignTask>) => void;
  deleteTask: (id: string) => void;
  addIssue: (issue: Omit<CommunityIssue, 'id' | 'dateReported'>) => void;
  updateIssue: (id: string, updates: Partial<CommunityIssue>) => void;
  deleteIssue: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  resetAllData: () => void;
  selectedSubCountyFilter: SubCounty | 'All';
  setSelectedSubCountyFilter: (subCounty: SubCounty | 'All') => void;
  supabaseStatus: SupabaseStatus;
  checkSupabaseConnection: () => Promise<void>;
  seedSupabaseData: () => Promise<boolean>;
  stats: {
    totalActivities: number;
    upcomingActivities: number;
    completedActivities: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    urgentIssuesCount: number;
    totalIssues: number;
    totalTeamMembers: number;
    totalVolunteers: number;
    taskCompletionRate: number;
  };
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVITIES: 'county_campaign_activities_v1',
  TASKS: 'county_campaign_tasks_v1',
  ISSUES: 'county_campaign_issues_v1',
  TEAM: 'county_campaign_team_v1',
};

// Converters between frontend TypeScript entities and PostgreSQL snake_case rows
const mapActivityFromDb = (row: any): CampaignActivity => ({
  id: row.id,
  title: row.title,
  type: row.type,
  subCounty: row.sub_county,
  ward: row.ward,
  venue: row.venue,
  date: typeof row.date === 'string' ? row.date.slice(0, 10) : row.date,
  time: row.time || '10:00 AM - 1:00 PM',
  leadCoordinator: row.lead_coordinator,
  targetTurnout: row.target_turnout || 0,
  actualTurnout: row.actual_turnout ?? undefined,
  status: row.status,
  description: row.description || '',
  securityClearance: Boolean(row.security_clearance),
  soundTruckBooked: Boolean(row.sound_truck_booked),
  leafletsCount: row.leaflets_count || 0,
});

const mapActivityToDb = (act: CampaignActivity) => ({
  id: act.id,
  title: act.title,
  type: act.type,
  sub_county: act.subCounty,
  ward: act.ward,
  venue: act.venue,
  date: act.date,
  time: act.time,
  lead_coordinator: act.leadCoordinator,
  target_turnout: act.targetTurnout,
  actual_turnout: act.actualTurnout,
  status: act.status,
  description: act.description,
  security_clearance: act.securityClearance,
  sound_truck_booked: act.soundTruckBooked,
  leaflets_count: act.leafletsCount,
});

const mapTaskFromDb = (row: any): CampaignTask => ({
  id: row.id,
  title: row.title,
  subCounty: row.sub_county,
  category: row.category,
  priority: row.priority,
  status: row.status,
  assigneeName: row.assignee_name,
  dueDate: typeof row.due_date === 'string' ? row.due_date.slice(0, 10) : row.due_date,
  description: row.description || '',
  createdAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
});

const mapTaskToDb = (task: CampaignTask) => ({
  id: task.id,
  title: task.title,
  sub_county: task.subCounty,
  category: task.category,
  priority: task.priority,
  status: task.status,
  assignee_name: task.assigneeName,
  due_date: task.dueDate,
  description: task.description,
});

const mapIssueFromDb = (row: any): CommunityIssue => ({
  id: row.id,
  title: row.title,
  category: row.category,
  subCounty: row.sub_county,
  ward: row.ward,
  reportedBy: row.reported_by || 'Local Community Group',
  dateReported: typeof row.date_reported === 'string' ? row.date_reported.slice(0, 10) : new Date().toISOString().slice(0, 10),
  status: row.status,
  priority: row.priority,
  description: row.description || '',
  campaignActionPledge: row.campaign_action_pledge || '',
});

const mapIssueToDb = (issue: CommunityIssue) => ({
  id: issue.id,
  title: issue.title,
  category: issue.category,
  sub_county: issue.subCounty,
  ward: issue.ward,
  reported_by: issue.reportedBy,
  status: issue.status,
  priority: issue.priority,
  description: issue.description,
  campaign_action_pledge: issue.campaignActionPledge,
  date_reported: issue.dateReported,
});

const mapTeamFromDb = (row: any): TeamMember => ({
  id: row.id,
  fullName: row.full_name,
  role: row.role,
  subCounty: row.sub_county,
  ward: row.ward || undefined,
  phone: row.phone || '+254 700 000 000',
  email: row.email || 'team@nyericampaign.test',
  status: row.status,
  volunteersLed: row.volunteers_led || 0,
});

const mapTeamToDb = (m: TeamMember) => ({
  id: m.id,
  full_name: m.fullName,
  role: m.role,
  sub_county: m.subCounty,
  ward: m.ward,
  phone: m.phone,
  email: m.email,
  status: m.status,
  volunteers_led: m.volunteersLed,
});

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>('dashboard');
  const [selectedSubCountyFilter, setSelectedSubCountyFilter] = useState<SubCounty | 'All'>('All');
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>(
    isSupabaseConfigured ? 'checking' : 'local_only'
  );

  const [activities, setActivities] = useState<CampaignActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [tasks, setTasks] = useState<CampaignTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [issues, setIssues] = useState<CommunityIssue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAM);
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });

  // Local Storage Backups
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch {}
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch {}
  }, [team]);

  // Check Supabase Connection & Load Data
  const checkSupabaseConnection = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setSupabaseStatus('local_only');
      return;
    }

    try {
      // Check if activities table exists
      const { data: actData, error: actError } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true });

      if (actError) {
        // Table doesn't exist yet (42P01) or permissions not set
        console.warn('Supabase connected, but tables need to be created:', actError.message);
        setSupabaseStatus('needs_tables');
        return;
      }

      setSupabaseStatus('connected');

      // Fetch other tables if available
      const [
        { data: taskData },
        { data: issueData },
        { data: teamData }
      ] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('community_issues').select('*'),
        supabase.from('team_members').select('*'),
      ]);

      if (actData && actData.length > 0) {
        setActivities(actData.map(mapActivityFromDb));
      }
      if (taskData && taskData.length > 0) {
        setTasks(taskData.map(mapTaskFromDb));
      }
      if (issueData && issueData.length > 0) {
        setIssues(issueData.map(mapIssueFromDb));
      }
      if (teamData && teamData.length > 0) {
        setTeam(teamData.map(mapTeamFromDb));
      }

      // If Supabase tables are totally empty, automatically seed initial training dataset
      if (actData && actData.length === 0) {
        console.log('Supabase tables empty, auto-seeding initial Nyeri campaign data...');
        await seedSupabaseData();
      }
    } catch (err) {
      console.error('Error connecting to Supabase:', err);
      setSupabaseStatus('needs_tables');
    }
  }, []);

  const seedSupabaseData = useCallback(async (): Promise<boolean> => {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      await Promise.all([
        supabase.from('activities').upsert(INITIAL_ACTIVITIES.map(mapActivityToDb)),
        supabase.from('tasks').upsert(INITIAL_TASKS.map(mapTaskToDb)),
        supabase.from('community_issues').upsert(INITIAL_ISSUES.map(mapIssueToDb)),
        supabase.from('team_members').upsert(INITIAL_TEAM.map(mapTeamToDb)),
      ]);

      setActivities(INITIAL_ACTIVITIES);
      setTasks(INITIAL_TASKS);
      setIssues(INITIAL_ISSUES);
      setTeam(INITIAL_TEAM);
      setSupabaseStatus('connected');
      return true;
    } catch (err) {
      console.error('Failed to seed Supabase:', err);
      return false;
    }
  }, []);

  // Run initial Supabase check on mount
  useEffect(() => {
    checkSupabaseConnection();
  }, [checkSupabaseConnection]);

  // Set up live real-time subscription when Supabase is connected
  useEffect(() => {
    if (!supabase || supabaseStatus !== 'connected') return;

    const channel = supabase
      .channel('campaign-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newAct = mapActivityFromDb(payload.new);
          setActivities((prev) => prev.some((a) => a.id === newAct.id) ? prev : [newAct, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapActivityFromDb(payload.new);
          setActivities((prev) => prev.map((a) => a.id === updated.id ? updated : a));
        } else if (payload.eventType === 'DELETE') {
          setActivities((prev) => prev.filter((a) => a.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newTask = mapTaskFromDb(payload.new);
          setTasks((prev) => prev.some((t) => t.id === newTask.id) ? prev : [newTask, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapTaskFromDb(payload.new);
          setTasks((prev) => prev.map((t) => t.id === updated.id ? updated : t));
        } else if (payload.eventType === 'DELETE') {
          setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_issues' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newIssue = mapIssueFromDb(payload.new);
          setIssues((prev) => prev.some((i) => i.id === newIssue.id) ? prev : [newIssue, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapIssueFromDb(payload.new);
          setIssues((prev) => prev.map((i) => i.id === updated.id ? updated : i));
        } else if (payload.eventType === 'DELETE') {
          setIssues((prev) => prev.filter((i) => i.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabaseStatus]);

  // Actions
  const addActivity = async (activity: Omit<CampaignActivity, 'id'>) => {
    const newAct: CampaignActivity = {
      ...activity,
      id: `act-${Date.now().toString(36)}`,
    };
    // Optimistic local state update
    setActivities((prev) => [newAct, ...prev]);

    // Async Supabase sync
    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('activities').insert([mapActivityToDb(newAct)]);
      } catch (e) {
        console.error('Supabase activity insert failed:', e);
      }
    }
  };

  const updateActivity = async (id: string, updates: Partial<CampaignActivity>) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updates } : act))
    );

    if (supabase && supabaseStatus === 'connected') {
      try {
        const found = activities.find((a) => a.id === id);
        if (found) {
          const merged = { ...found, ...updates };
          await supabase.from('activities').update(mapActivityToDb(merged)).eq('id', id);
        }
      } catch (e) {
        console.error('Supabase activity update failed:', e);
      }
    }
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('activities').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase activity delete failed:', e);
      }
    }
  };

  const addTask = async (task: Omit<CampaignTask, 'id' | 'createdAt'>) => {
    const newTask: CampaignTask = {
      ...task,
      id: `tsk-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [newTask, ...prev]);

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('tasks').insert([mapTaskToDb(newTask)]);
      } catch (e) {
        console.error('Supabase task insert failed:', e);
      }
    }
  };

  const toggleTaskStatus = async (id: string) => {
    let nextStatus: 'Pending' | 'Completed' = 'Completed';
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('tasks').update({ status: nextStatus }).eq('id', id);
      } catch (e) {
        console.error('Supabase toggle task status failed:', e);
      }
    }
  };

  const updateTask = async (id: string, updates: Partial<CampaignTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    if (supabase && supabaseStatus === 'connected') {
      try {
        const found = tasks.find((t) => t.id === id);
        if (found) {
          const merged = { ...found, ...updates };
          await supabase.from('tasks').update(mapTaskToDb(merged)).eq('id', id);
        }
      } catch (e) {
        console.error('Supabase task update failed:', e);
      }
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('tasks').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase task delete failed:', e);
      }
    }
  };

  const addIssue = async (issue: Omit<CommunityIssue, 'id' | 'dateReported'>) => {
    const newIss: CommunityIssue = {
      ...issue,
      id: `iss-${Date.now().toString(36)}`,
      dateReported: new Date().toISOString().slice(0, 10),
    };
    setIssues((prev) => [newIss, ...prev]);

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('community_issues').insert([mapIssueToDb(newIss)]);
      } catch (e) {
        console.error('Supabase issue insert failed:', e);
      }
    }
  };

  const updateIssue = async (id: string, updates: Partial<CommunityIssue>) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, ...updates } : iss))
    );

    if (supabase && supabaseStatus === 'connected') {
      try {
        const found = issues.find((i) => i.id === id);
        if (found) {
          const merged = { ...found, ...updates };
          await supabase.from('community_issues').update(mapIssueToDb(merged)).eq('id', id);
        }
      } catch (e) {
        console.error('Supabase issue update failed:', e);
      }
    }
  };

  const deleteIssue = async (id: string) => {
    setIssues((prev) => prev.filter((iss) => iss.id !== id));

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('community_issues').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase issue delete failed:', e);
      }
    }
  };

  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `tm-${Date.now().toString(36)}`,
    };
    setTeam((prev) => [...prev, newMember]);

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('team_members').insert([mapTeamToDb(newMember)]);
      } catch (e) {
        console.error('Supabase member insert failed:', e);
      }
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );

    if (supabase && supabaseStatus === 'connected') {
      try {
        const found = team.find((t) => t.id === id);
        if (found) {
          const merged = { ...found, ...updates };
          await supabase.from('team_members').update(mapTeamToDb(merged)).eq('id', id);
        }
      } catch (e) {
        console.error('Supabase member update failed:', e);
      }
    }
  };

  const deleteTeamMember = async (id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));

    if (supabase && supabaseStatus === 'connected') {
      try {
        await supabase.from('team_members').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase member delete failed:', e);
      }
    }
  };

  const resetAllData = async () => {
    setActivities(INITIAL_ACTIVITIES);
    setTasks(INITIAL_TASKS);
    setIssues(INITIAL_ISSUES);
    setTeam(INITIAL_TEAM);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.ISSUES);
      localStorage.removeItem(STORAGE_KEYS.TEAM);
    } catch {}

    if (supabase && supabaseStatus === 'connected') {
      await seedSupabaseData();
    }
  };

  const stats = useMemo(() => {
    const totalActivities = activities.length;
    const upcomingActivities = activities.filter((a) => a.status === 'Upcoming' || a.status === 'In Progress').length;
    const completedActivities = activities.filter((a) => a.status === 'Completed').length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const urgentIssuesCount = issues.filter((i) => i.priority === 'Urgent').length;
    const totalIssues = issues.length;

    const totalTeamMembers = team.length;
    const totalVolunteers = team.reduce((sum, member) => sum + (member.volunteersLed || 0), 0);

    return {
      totalActivities,
      upcomingActivities,
      completedActivities,
      totalTasks,
      pendingTasks,
      completedTasks,
      urgentIssuesCount,
      totalIssues,
      totalTeamMembers,
      totalVolunteers,
      taskCompletionRate,
    };
  }, [activities, tasks, issues, team]);

  return (
    <CampaignContext.Provider
      value={{
        activePage,
        setActivePage,
        activities,
        tasks,
        issues,
        team,
        addActivity,
        updateActivity,
        deleteActivity,
        addTask,
        toggleTaskStatus,
        updateTask,
        deleteTask,
        addIssue,
        updateIssue,
        deleteIssue,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        resetAllData,
        selectedSubCountyFilter,
        setSelectedSubCountyFilter,
        supabaseStatus,
        checkSupabaseConnection,
        seedSupabaseData,
        stats,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
