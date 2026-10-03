import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

export type AppPage = 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team';

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

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>('dashboard');
  const [selectedSubCountyFilter, setSelectedSubCountyFilter] = useState<SubCounty | 'All'>('All');

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

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch {
      // ignore
    }
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch {
      // ignore
    }
  }, [team]);

  const addActivity = (activity: Omit<CampaignActivity, 'id'>) => {
    const newAct: CampaignActivity = {
      ...activity,
      id: `act-${Date.now().toString(36)}`,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const updateActivity = (id: string, updates: Partial<CampaignActivity>) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updates } : act))
    );
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  const addTask = (task: Omit<CampaignTask, 'id' | 'createdAt'>) => {
    const newTask: CampaignTask = {
      ...task,
      id: `tsk-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const updateTask = (id: string, updates: Partial<CampaignTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addIssue = (issue: Omit<CommunityIssue, 'id' | 'dateReported'>) => {
    const newIss: CommunityIssue = {
      ...issue,
      id: `iss-${Date.now().toString(36)}`,
      dateReported: new Date().toISOString().slice(0, 10),
    };
    setIssues((prev) => [newIss, ...prev]);
  };

  const updateIssue = (id: string, updates: Partial<CommunityIssue>) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, ...updates } : iss))
    );
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) => prev.filter((iss) => iss.id !== id));
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `tm-${Date.now().toString(36)}`,
    };
    setTeam((prev) => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteTeamMember = (id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const resetAllData = () => {
    setActivities(INITIAL_ACTIVITIES);
    setTasks(INITIAL_TASKS);
    setIssues(INITIAL_ISSUES);
    setTeam(INITIAL_TEAM);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.ISSUES);
      localStorage.removeItem(STORAGE_KEYS.TEAM);
    } catch {
      // ignore
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
