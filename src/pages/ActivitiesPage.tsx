import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { CampaignActivity, SubCounty, ActivityType, ActivityStatus } from '../types/campaign';
import { SUB_COUNTIES } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select, Textarea } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  FileText,
  CheckCircle2,
  Trash2,
  Eye,
  Sparkles,
} from 'lucide-react';

const ACTIVITY_TYPES: ActivityType[] = [
  'Mega Rally',
  'Town Hall Baraza',
  'Door-to-Door',
  'Farmers Forum',
  'Youth Sports Outreach',
  'Market Walkabout',
  'Volunteer Training',
];

interface ActivitiesPageProps {
  scheduleModalOpen: boolean;
  setScheduleModalOpen: (open: boolean) => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  scheduleModalOpen,
  setScheduleModalOpen,
}) => {
  const { activities, addActivity, updateActivity, deleteActivity } = useCampaign();

  // Filters
  const [subCountyFilter, setSubCountyFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Activity for Details Modal
  const [selectedActivity, setSelectedActivity] = useState<CampaignActivity | null>(null);
  const [actualTurnoutInput, setActualTurnoutInput] = useState<string>('');

  // New Activity Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ActivityType>('Town Hall Baraza');
  const [newSubCounty, setNewSubCounty] = useState<SubCounty>('Mathira');
  const [newWard, setNewWard] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCoordinator, setNewCoordinator] = useState('');
  const [newTargetTurnout, setNewTargetTurnout] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSecurityClearance, setNewSecurityClearance] = useState(false);
  const [newSoundTruck, setNewSoundTruck] = useState(false);
  const [newLeaflets, setNewLeaflets] = useState('1000');

  // Filtered activities
  const filteredActivities = activities.filter((act) => {
    if (subCountyFilter !== 'All' && act.subCounty !== subCountyFilter) return false;
    if (typeFilter !== 'All' && act.type !== typeFilter) return false;
    if (statusFilter !== 'All' && act.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        act.title.toLowerCase().includes(q) ||
        act.venue.toLowerCase().includes(q) ||
        act.ward.toLowerCase().includes(q) ||
        act.leadCoordinator.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVenue.trim() || !newDate.trim()) {
      alert('Please fill in Activity Title, Venue, and Date');
      return;
    }

    addActivity({
      title: newTitle.trim(),
      type: newType,
      subCounty: newSubCounty,
      ward: newWard.trim() || 'Central Ward',
      venue: newVenue.trim(),
      date: newDate,
      time: newTime.trim() || '10:00 AM - 1:00 PM',
      leadCoordinator: newCoordinator.trim() || 'County Mobilization Team',
      targetTurnout: parseInt(newTargetTurnout) || 500,
      status: 'Upcoming',
      description: newDescription.trim() || 'Field mobilization and voter engagement rally.',
      securityClearance: newSecurityClearance,
      soundTruckBooked: newSoundTruck,
      leafletsCount: parseInt(newLeaflets) || 1000,
    });

    // Reset Form
    setNewTitle('');
    setNewWard('');
    setNewVenue('');
    setNewDate('');
    setNewTime('');
    setNewCoordinator('');
    setNewTargetTurnout('');
    setNewDescription('');
    setNewSecurityClearance(false);
    setNewSoundTruck(false);
    setScheduleModalOpen(false);
  };

  const handleSaveTurnout = (activityId: string) => {
    const val = parseInt(actualTurnoutInput);
    if (!isNaN(val) && val >= 0) {
      updateActivity(activityId, {
        actualTurnout: val,
        status: 'Completed',
      });
      if (selectedActivity && selectedActivity.id === activityId) {
        setSelectedActivity({
          ...selectedActivity,
          actualTurnout: val,
          status: 'Completed',
        });
      }
      setActualTurnoutInput('');
    }
  };

  const totalExpectedTurnout = filteredActivities.reduce((acc, a) => acc + a.targetTurnout, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Campaign Activities & Rallies
            </h2>
            <Badge variant="yellow" className="font-bold">
              {filteredActivities.length} Events
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Logistical scheduling, barazas, roadshows, and voter mobilization for Nyeri County.
          </p>
        </div>

        <Button
          variant="yellow"
          onClick={() => setScheduleModalOpen(true)}
          className="font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Schedule New Activity
        </Button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Upcoming Events</span>
          <p className="text-xl font-black text-blue-600">
            {activities.filter((a) => a.status === 'Upcoming' || a.status === 'In Progress').length}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Completed Barazas</span>
          <p className="text-xl font-black text-emerald-600">
            {activities.filter((a) => a.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Projected Turnout</span>
          <p className="text-xl font-black text-zinc-900">
            {totalExpectedTurnout.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Active Sub-Counties</span>
          <p className="text-xl font-black text-amber-600">6 of 6</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-zinc-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search venue, coordinator, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Sub-county filter */}
            <Select
              value={subCountyFilter}
              onChange={(e) => setSubCountyFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Sub-Counties</option>
              {SUB_COUNTIES.map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </Select>

            {/* Type filter */}
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Activity Types</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>

            {/* Status filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
            </Select>
          </div>

          {(subCountyFilter !== 'All' || typeFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
              <span className="text-zinc-500">
                Filtered view showing <strong>{filteredActivities.length}</strong> of {activities.length} activities
              </span>
              <button
                onClick={() => {
                  setSubCountyFilter('All');
                  setTypeFilter('All');
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Cards List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center space-y-3">
          <CalendarDays className="h-10 w-10 text-zinc-300 mx-auto" />
          <h3 className="font-bold text-zinc-800">No activities match your filters</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search criteria or schedule a new campaign baraza using the button above.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubCountyFilter('All');
              setTypeFilter('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((act) => {
            const isCompleted = act.status === 'Completed';

            return (
              <Card
                key={act.id}
                className="border border-zinc-200 hover:border-yellow-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Badge variant="blue" className="text-[10px] font-bold">
                        {act.subCounty}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {act.ward}
                      </Badge>
                      <Badge variant="default" className="text-[10px] font-semibold bg-zinc-100 text-zinc-800">
                        {act.type}
                      </Badge>
                    </div>

                    <Badge
                      variant={
                        act.status === 'Completed'
                          ? 'success'
                          : act.status === 'In Progress'
                          ? 'warning'
                          : 'yellow'
                      }
                      className="text-[10px] shrink-0"
                    >
                      {act.status}
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-extrabold text-zinc-900 leading-snug">
                    {act.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-3 flex-1">
                  <p className="text-xs text-zinc-600 line-clamp-2">
                    {act.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-zinc-700 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{act.date} • {act.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
                      <span className="truncate">{act.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">Lead: {act.leadCoordinator}</span>
                    </div>
                  </div>

                  {/* Logistics Checkmarks */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1 font-medium ${
                          act.securityClearance ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                        title={act.securityClearance ? 'Police Clearance Approved' : 'Clearance Pending'}
                      >
                        {act.securityClearance ? (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        {act.securityClearance ? 'Security OK' : 'No Permit'}
                      </span>

                      <span
                        className={`flex items-center gap-1 font-medium ${
                          act.soundTruckBooked ? 'text-blue-700' : 'text-zinc-400'
                        }`}
                        title={act.soundTruckBooked ? 'PA Sound Rig Confirmed' : 'No PA Booked'}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        {act.soundTruckBooked ? 'PA Sound' : 'No PA'}
                      </span>
                    </div>

                    <span className="font-semibold text-zinc-800">
                      Target: {act.targetTurnout.toLocaleString()}
                    </span>
                  </div>

                  {act.actualTurnout !== undefined && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-900 flex items-center justify-between">
                      <span className="font-semibold">Turnout Recorded:</span>
                      <strong className="text-sm font-black">{act.actualTurnout.toLocaleString()} attendees</strong>
                    </div>
                  )}
                </CardContent>

                <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedActivity(act);
                        setActualTurnoutInput(act.actualTurnout ? String(act.actualTurnout) : '');
                      }}
                      className="text-xs h-8 flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" /> Details & Prep
                    </Button>

                    {!isCompleted && (
                      <Button
                        variant="yellow"
                        size="sm"
                        onClick={() => {
                          const recorded = prompt(
                            `Mark "${act.title}" as Completed.\nEnter actual crowd turnout count:`,
                            String(act.targetTurnout)
                          );
                          if (recorded !== null) {
                            const val = parseInt(recorded) || act.targetTurnout;
                            updateActivity(act.id, {
                              status: 'Completed',
                              actualTurnout: val,
                            });
                          }
                        }}
                        className="text-xs h-8 font-bold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Done
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete activity "${act.title}"?`)) {
                        deleteActivity(act.id);
                      }
                    }}
                    className="text-zinc-400 hover:text-red-600 h-8 w-8 p-0"
                    title="Delete activity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* SCHEDULE ACTIVITY MODAL */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent onClose={() => setScheduleModalOpen(false)}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-bold">
                <CalendarDays className="h-4 w-4" />
              </div>
              <DialogTitle>Schedule Campaign Activity</DialogTitle>
            </div>
            <DialogDescription>
              Plan a rally, townhall baraza, or grassroots mobilization session in Nyeri County.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateActivity} className="space-y-3.5 text-xs text-zinc-700">
            <div>
              <label className="block font-bold text-zinc-900 mb-1">Activity Title *</label>
              <Input
                placeholder="e.g. Mweiga Center Coffee Farmers Listening Baraza"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Sub-County *</label>
                <Select
                  value={newSubCounty}
                  onChange={(e) => setNewSubCounty(e.target.value as SubCounty)}
                >
                  {SUB_COUNTIES.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                  <option value="Countywide">Countywide</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Ward / Location</label>
                <Input
                  placeholder="e.g. Ruguru Ward"
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Activity Type</label>
                <Select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ActivityType)}
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Target Turnout</label>
                <Input
                  type="number"
                  placeholder="e.g. 1500"
                  value={newTargetTurnout}
                  onChange={(e) => setNewTargetTurnout(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Venue Name & Landmark *</label>
              <Input
                placeholder="e.g. Karatina Stadium or Tetu Social Hall"
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Date *</label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Time Range</label>
                <Input
                  placeholder="e.g. 10:00 AM - 1:00 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Lead Field Coordinator</label>
              <Input
                placeholder="e.g. Peter Mwangi / Ann Muthoni"
                value={newCoordinator}
                onChange={(e) => setNewCoordinator(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Mobilization Objectives / Notes</label>
              <Textarea
                placeholder="Key message, targeted voter demographic, specific manifesto commitments..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Logistics check boxes */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <span className="font-bold text-zinc-900 block">Logistical Readiness Checklist:</span>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                  <input
                    type="checkbox"
                    checked={newSecurityClearance}
                    onChange={(e) => setNewSecurityClearance(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600"
                  />
                  <span>Police Permit Filed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                  <input
                    type="checkbox"
                    checked={newSoundTruck}
                    onChange={(e) => setNewSoundTruck(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600"
                  />
                  <span>PA Sound Truck Reserved</span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setScheduleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="yellow" className="font-bold">
                Confirm & Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ACTIVITY DETAILS & LOGISTICS MODAL */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent onClose={() => setSelectedActivity(null)} className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="blue">{selectedActivity.subCounty}</Badge>
                <Badge variant="yellow">{selectedActivity.type}</Badge>
                <Badge variant="outline">{selectedActivity.status}</Badge>
              </div>
              <DialogTitle className="text-xl mt-2">{selectedActivity.title}</DialogTitle>
              <DialogDescription>
                Detailed logistics and operational briefing for this campaign event.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2 text-xs sm:text-sm text-zinc-700">
              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-500 text-xs block">Date & Time:</span>
                    <strong className="text-zinc-900">{selectedActivity.date} ({selectedActivity.time})</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Venue & Ward:</span>
                    <strong className="text-zinc-900">{selectedActivity.venue}, {selectedActivity.ward}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Lead Coordinator:</span>
                    <strong className="text-zinc-900">{selectedActivity.leadCoordinator}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Target Attendance:</span>
                    <strong className="text-zinc-900">{selectedActivity.targetTurnout.toLocaleString()} citizens</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Operational Agenda:</h4>
                <p className="text-zinc-600 bg-white p-3 rounded-lg border border-zinc-200 leading-relaxed">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Logistical clearance controls */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-950">Field Operational Readiness:</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedActivity.securityClearance}
                      onChange={(e) => {
                        const updated = { ...selectedActivity, securityClearance: e.target.checked };
                        setSelectedActivity(updated);
                        updateActivity(selectedActivity.id, { securityClearance: e.target.checked });
                      }}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="font-medium text-blue-900">Security Clearance (Police Form 1)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedActivity.soundTruckBooked}
                      onChange={(e) => {
                        const updated = { ...selectedActivity, soundTruckBooked: e.target.checked };
                        setSelectedActivity(updated);
                        updateActivity(selectedActivity.id, { soundTruckBooked: e.target.checked });
                      }}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="font-medium text-blue-900">PA Sound System Rig Booked</span>
                  </label>
                </div>
              </div>

              {/* Record actual turnout */}
              <div className="p-3.5 bg-yellow-50 border border-yellow-300 rounded-xl space-y-2">
                <h4 className="font-bold text-yellow-950">Post-Rally Turnout Verification:</h4>
                <p className="text-xs text-yellow-900">
                  Record final headcount compiled by polling cluster marshals:
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter verified attendee count..."
                    value={actualTurnoutInput}
                    onChange={(e) => setActualTurnoutInput(e.target.value)}
                    className="bg-white text-xs"
                  />
                  <Button
                    variant="yellow"
                    size="sm"
                    onClick={() => handleSaveTurnout(selectedActivity.id)}
                    className="font-bold shrink-0 text-xs"
                  >
                    Save & Mark Completed
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedActivity(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
