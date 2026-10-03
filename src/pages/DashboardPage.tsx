import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { SUB_COUNTY_READINESS } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  CalendarDays,
  CheckSquare,
  AlertCircle,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Megaphone,
  Sparkles,
} from 'lucide-react';

interface DashboardPageProps {
  onScheduleActivity: () => void;
  onAddTask: () => void;
  onLogIssue: () => void;
  onAddTeamMember: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onScheduleActivity,
  onAddTask,
  onLogIssue,
  onAddTeamMember,
}) => {
  const { stats, activities, tasks, issues, setActivePage, toggleTaskStatus } = useCampaign();
  const [selectedSubCountyFilter, setSelectedSubCountyFilter] = useState<string>('All');

  const upcomingList = activities
    .filter((a) => a.status === 'Upcoming' || a.status === 'In Progress')
    .slice(0, 3);

  const urgentIssuesList = issues
    .filter((i) => i.priority === 'Urgent')
    .slice(0, 3);

  const pendingTaskList = tasks
    .filter((t) => t.status === 'Pending')
    .slice(0, 4);

  const filteredReadiness = selectedSubCountyFilter === 'All'
    ? SUB_COUNTY_READINESS
    : SUB_COUNTY_READINESS.filter((sc) => sc.name === selectedSubCountyFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Campaign Banner: Blue, Yellow & Black */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-black text-white p-6 sm:p-8 shadow-lg border-b-4 border-yellow-400 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-yellow-400/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 fill-black" />
              Nyeri 2027 Gubernatorial Campaign
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Field Command & Strategy Console
            </h2>
            <p className="text-sm text-blue-100 font-medium">
              Candidate: <span className="text-yellow-300 font-bold">Dr. Grace Wambui Kariuki</span> • Slogan: <span className="italic">"Umoja, Kazi na Maendeleo"</span>
            </p>
            <p className="text-xs text-blue-200">
              Coordinating voter engagement, grassroots barazas, field tasks, and constituent listening tours across all 6 Nyeri sub-counties.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <Button
              variant="yellow"
              onClick={onScheduleActivity}
              className="text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CalendarDays className="h-4 w-4" />
              Schedule Activity
            </Button>
            <Button
              variant="outline"
              onClick={onAddTask}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5"
            >
              <CheckSquare className="h-4 w-4 text-yellow-300" />
              Assign Field Task
            </Button>
            <Button
              variant="outline"
              onClick={onLogIssue}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5"
            >
              <AlertCircle className="h-4 w-4 text-yellow-300" />
              Log Community Issue
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Bold Yellow, Blue & Black Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Activities */}
        <Card className="border-t-4 border-t-blue-600 hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-zinc-500">Activities</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900">
                {stats.totalActivities}
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {stats.upcomingActivities} upcoming
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <button
              onClick={() => setActivePage('activities')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
            >
              View Campaign Calendar <ArrowRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* Card 2: Field Tasks */}
        <Card className="border-t-4 border-t-yellow-400 hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-zinc-500">Field Tasks</span>
              <div className="h-8 w-8 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center">
                <CheckSquare className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900">
                {stats.taskCompletionRate}%
              </span>
              <span className="text-xs text-zinc-500">
                {stats.completedTasks}/{stats.totalTasks} done
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="w-full bg-zinc-100 rounded-full h-2 mb-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${stats.taskCompletionRate}%` }}
              />
            </div>
            <button
              onClick={() => setActivePage('tasks')}
              className="text-xs font-bold text-black hover:text-yellow-700 inline-flex items-center gap-1 cursor-pointer"
            >
              Manage Field Ops <ArrowRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* Card 3: Urgent Community Issues */}
        <Card className="border-t-4 border-t-black hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-zinc-500">Community Grievances</span>
              <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900">
                {stats.urgentIssuesCount}
              </span>
              <span className="text-xs font-bold text-amber-600">Urgent logged</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <button
              onClick={() => setActivePage('issues')}
              className="text-xs font-bold text-zinc-900 hover:text-black inline-flex items-center gap-1 cursor-pointer"
            >
              Listening Tour Log ({stats.totalIssues}) <ArrowRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* Card 4: Team & Volunteers */}
        <Card className="border-t-4 border-t-blue-700 hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-zinc-500">Field Mobilizers</span>
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900">
                {stats.totalVolunteers}
              </span>
              <span className="text-xs text-zinc-500">
                via {stats.totalTeamMembers} captains
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <button
              onClick={() => setActivePage('team')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
            >
              View Field Team <ArrowRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Sub-County Readiness Progress Tracker */}
      <Card className="shadow-xs border border-zinc-200">
        <CardHeader className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Sub-County Mobilization & Readiness Index
              </CardTitle>
              <Badge variant="yellow" className="text-[10px]">6 Sub-Counties</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Field operational readiness and simulated voter reach estimates across Nyeri County.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Filter:</span>
            <select
              value={selectedSubCountyFilter}
              onChange={(e) => setSelectedSubCountyFilter(e.target.value)}
              className="text-xs bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1.5 font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Sub-Counties</option>
              {SUB_COUNTY_READINESS.map((sc) => (
                <option key={sc.name} value={sc.name}>{sc.name}</option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReadiness.map((sc) => (
              <div
                key={sc.name}
                className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-white hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    {sc.name}
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    sc.readinessScore >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : sc.readinessScore >= 70
                      ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                      : 'bg-zinc-200 text-zinc-800'
                  }`}>
                    {sc.readinessScore}% Ready
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 mb-3">
                  <div className="flex justify-between">
                    <span>Simulated Reach:</span>
                    <span className="font-bold text-zinc-900">
                      {sc.reachedEstimate.toLocaleString()} / {sc.voterTarget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${Math.round((sc.reachedEstimate / sc.voterTarget) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
                    <span>Field Lead: {sc.coordinator}</span>
                    <span className="text-blue-700 font-semibold">
                      {Math.round((sc.reachedEstimate / sc.voterTarget) * 100)}% target
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200/80 text-[11px] text-zinc-600 flex items-center justify-between">
                  <span className="italic truncate pr-2 text-zinc-500">
                    Priority: {sc.keyFocus}
                  </span>
                  <button
                    onClick={() => setActivePage('activities')}
                    className="text-blue-600 font-bold hover:underline shrink-0 cursor-pointer"
                  >
                    Events →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two columns: Upcoming Schedule & Urgent Community Grievances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Upcoming Schedule */}
        <Card className="border border-zinc-200">
          <CardHeader className="p-5 border-b border-zinc-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-base font-bold">Upcoming Campaign Schedule</CardTitle>
            </div>
            <Button
              variant="yellow"
              size="sm"
              onClick={onScheduleActivity}
              className="text-xs h-7 px-2.5 font-bold"
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {upcomingList.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No upcoming activities scheduled.</p>
            ) : (
              upcomingList.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-yellow-400 hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="blue" className="text-[10px] py-0">
                          {act.subCounty}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] py-0 font-medium">
                          {act.type}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 leading-snug">
                        {act.title}
                      </h4>
                    </div>
                    <Badge
                      variant={act.status === 'In Progress' ? 'warning' : 'yellow'}
                      className="shrink-0 text-[10px]"
                    >
                      {act.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 pt-1">
                    <span className="flex items-center gap-1 text-zinc-700">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      {act.date} • {act.time}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-700">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      {act.venue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px]">
                    <span className="text-zinc-500">
                      Target Turnout: <strong className="text-zinc-800">{act.targetTurnout.toLocaleString()}</strong>
                    </span>
                    <button
                      onClick={() => setActivePage('activities')}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Details & Logistics →
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePage('activities')}
                className="w-full text-xs font-semibold"
              >
                View Full Calendar ({activities.length} Events)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Critical Community Grievances & Pending Tasks */}
        <div className="space-y-6">
          {/* Urgent Issues */}
          <Card className="border border-zinc-200">
            <CardHeader className="p-5 border-b border-zinc-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-base font-bold">Urgent Community Grievances</CardTitle>
              </div>
              <Button
                variant="dark"
                size="sm"
                onClick={onLogIssue}
                className="text-xs h-7 px-2.5"
              >
                <Plus className="h-3 w-3 mr-1" /> Log Issue
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {urgentIssuesList.map((iss) => (
                <div
                  key={iss.id}
                  className="p-3.5 rounded-xl border border-red-200/80 bg-red-50/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-[10px] py-0 font-bold">
                        {iss.priority}
                      </Badge>
                      <Badge variant="blue" className="text-[10px] py-0">
                        {iss.subCounty} - {iss.ward}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-zinc-500">{iss.dateReported}</span>
                  </div>

                  <h5 className="text-xs sm:text-sm font-bold text-zinc-900">
                    {iss.title}
                  </h5>
                  <p className="text-xs text-zinc-600 line-clamp-2">
                    {iss.description}
                  </p>

                  <div className="bg-yellow-100/80 border border-yellow-300/80 rounded-lg p-2 mt-2">
                    <p className="text-[11px] text-yellow-950 font-medium">
                      <strong>Campaign Action:</strong> {iss.campaignActionPledge}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-1 text-center">
                <button
                  onClick={() => setActivePage('issues')}
                  className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  View All {issues.length} Community Issues →
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Field Tasks Quick Checklist */}
          <Card className="border border-zinc-200">
            <CardHeader className="p-4 border-b border-zinc-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-bold text-zinc-900">Immediate Field Tasks</h4>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddTask}
                className="text-xs h-7 px-2"
              >
                + Add Task
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {pendingTaskList.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'Completed'}
                    onChange={() => toggleTaskStatus(task.id)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 leading-tight">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <span className="font-medium text-blue-700">{task.subCounty}</span>
                      <span>•</span>
                      <span>Assignee: {task.assigneeName}</span>
                      <span>•</span>
                      <span className="font-bold text-amber-700">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
