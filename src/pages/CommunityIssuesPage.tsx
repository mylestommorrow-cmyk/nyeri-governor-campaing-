import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { CommunityIssue, IssueCategory, IssueStatus, SubCounty } from '../types/campaign';
import { SUB_COUNTIES } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select, Textarea } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import {
  AlertCircle,
  Plus,
  Search,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Trash2,
  Edit3,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';

const ISSUE_CATEGORIES: IssueCategory[] = [
  'Agriculture & Coffee/Tea',
  'Water & Irrigation',
  'Roads & Infrastructure',
  'Healthcare & Dispensaries',
  'Youth & Job Creation',
  'Market Traders & Revenue Fees',
  'Education & County Bursaries',
];

interface CommunityIssuesPageProps {
  newIssueModalOpen: boolean;
  setNewIssueModalOpen: (open: boolean) => void;
}

export const CommunityIssuesPage: React.FC<CommunityIssuesPageProps> = ({
  newIssueModalOpen,
  setNewIssueModalOpen,
}) => {
  const { issues, addIssue, updateIssue, deleteIssue, stats } = useCampaign();

  // Filters
  const [subCountyFilter, setSubCountyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing pledge modal
  const [editingIssue, setEditingIssue] = useState<CommunityIssue | null>(null);
  const [editPledgeText, setEditPledgeText] = useState('');
  const [editStatus, setEditStatus] = useState<IssueStatus>('Manifesto Pledge Made');

  // New Issue Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubCounty, setNewSubCounty] = useState<SubCounty>('Mathira');
  const [newWard, setNewWard] = useState('');
  const [newCategory, setNewCategory] = useState<IssueCategory>('Agriculture & Coffee/Tea');
  const [newReportedBy, setNewReportedBy] = useState('');
  const [newPriority, setNewPriority] = useState<'Urgent' | 'Moderate' | 'Routine'>('Urgent');
  const [newDescription, setNewDescription] = useState('');
  const [newActionPledge, setNewActionPledge] = useState('');

  const filteredIssues = issues.filter((iss) => {
    if (subCountyFilter !== 'All' && iss.subCounty !== subCountyFilter) return false;
    if (categoryFilter !== 'All' && iss.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && iss.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        iss.title.toLowerCase().includes(q) ||
        iss.ward.toLowerCase().includes(q) ||
        iss.reportedBy.toLowerCase().includes(q) ||
        iss.description.toLowerCase().includes(q) ||
        iss.campaignActionPledge.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Please fill in Issue Title and Description');
      return;
    }

    addIssue({
      title: newTitle.trim(),
      subCounty: newSubCounty,
      ward: newWard.trim() || 'Central Ward',
      category: newCategory,
      reportedBy: newReportedBy.trim() || 'Local Community Delegation',
      status: 'Logged',
      priority: newPriority,
      description: newDescription.trim(),
      campaignActionPledge:
        newActionPledge.trim() ||
        'Candidate acknowledged issue; policy team drafting manifesto response.',
    });

    // Reset Form
    setNewTitle('');
    setNewWard('');
    setNewReportedBy('');
    setNewDescription('');
    setNewActionPledge('');
    setNewPriority('Urgent');
    setNewIssueModalOpen(false);
  };

  const handleSavePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIssue) {
      updateIssue(editingIssue.id, {
        campaignActionPledge: editPledgeText.trim(),
        status: editStatus,
      });
      setEditingIssue(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Community Listening & Policy Grievances
            </h2>
            <Badge variant="yellow" className="font-bold">
              {stats.totalIssues} Grievances
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Constituent priorities, market trader petitions, and localized pledges gathered across Nyeri County.
          </p>
        </div>

        <Button
          variant="yellow"
          onClick={() => setNewIssueModalOpen(true)}
          className="font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Log Community Issue
        </Button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Urgent Grievances</span>
          <p className="text-xl font-black text-red-600">{stats.urgentIssuesCount}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Manifesto Pledges</span>
          <p className="text-xl font-black text-blue-600">
            {issues.filter((i) => i.status === 'Manifesto Pledge Made').length}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Rapid Actions Taken</span>
          <p className="text-xl font-black text-emerald-600">
            {issues.filter((i) => i.status === 'Rapid Response Action').length}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Investigating</span>
          <p className="text-xl font-black text-amber-600">
            {issues.filter((i) => i.status === 'Investigating' || i.status === 'Logged').length}
          </p>
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
                placeholder="Search issues, wards, pledges..."
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

            {/* Category filter */}
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Policy Categories</option>
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>

            {/* Status filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Logged">Logged Only</option>
              <option value="Investigating">Investigating</option>
              <option value="Manifesto Pledge Made">Manifesto Pledge Made</option>
              <option value="Rapid Response Action">Rapid Response Action</option>
            </Select>
          </div>

          {(subCountyFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
              <span className="text-zinc-500">
                Filtered view showing <strong>{filteredIssues.length}</strong> of {issues.length} grievances
              </span>
              <button
                onClick={() => {
                  setSubCountyFilter('All');
                  setCategoryFilter('All');
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

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-zinc-300 mx-auto" />
          <h3 className="font-bold text-zinc-800">No community issues match your filters</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your criteria or click "+ Log Community Issue" to add constituent grievances.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((iss) => (
            <Card
              key={iss.id}
              className="border border-zinc-200 hover:border-yellow-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Badge
                      variant={
                        iss.priority === 'Urgent'
                          ? 'destructive'
                          : iss.priority === 'Moderate'
                          ? 'warning'
                          : 'default'
                      }
                      className="text-[10px] font-bold"
                    >
                      {iss.priority}
                    </Badge>
                    <Badge variant="blue" className="text-[10px] font-bold">
                      {iss.subCounty}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {iss.ward}
                    </Badge>
                  </div>

                  <Badge
                    variant={
                      iss.status === 'Manifesto Pledge Made'
                        ? 'yellow'
                        : iss.status === 'Rapid Response Action'
                        ? 'success'
                        : 'outline'
                    }
                    className="text-[10px] shrink-0"
                  >
                    {iss.status}
                  </Badge>
                </div>

                <CardTitle className="text-base font-extrabold text-zinc-900 leading-snug">
                  {iss.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                  <span className="font-semibold text-blue-800">{iss.category}</span>
                  <span>•</span>
                  <span>Reported by: {iss.reportedBy}</span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-3 flex-1">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {iss.description}
                </p>

                {/* Candidate Action Pledge Callout Box (Yellow / Gold / Blue theme) */}
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wide">
                    <BookmarkCheck className="h-3.5 w-3.5 text-yellow-600 fill-yellow-400" />
                    <span>Candidate Action Commitment</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-800 italic">
                    "{iss.campaignActionPledge}"
                  </p>
                </div>
              </CardContent>

              <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-zinc-400">
                  Logged: {iss.dateReported}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingIssue(iss);
                      setEditPledgeText(iss.campaignActionPledge);
                      setEditStatus(iss.status);
                    }}
                    className="text-xs h-8 flex items-center gap-1"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Update Pledge
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete issue "${iss.title}"?`)) {
                        deleteIssue(iss.id);
                      }
                    }}
                    className="text-zinc-400 hover:text-red-600 h-8 w-8 p-0"
                    title="Delete issue"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* LOG COMMUNITY ISSUE MODAL */}
      <Dialog open={newIssueModalOpen} onOpenChange={setNewIssueModalOpen}>
        <DialogContent onClose={() => setNewIssueModalOpen(false)}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-bold">
                <AlertCircle className="h-4 w-4" />
              </div>
              <DialogTitle>Log Constituent Community Issue</DialogTitle>
            </div>
            <DialogDescription>
              Record a localized grievance heard during listening tours across Nyeri County.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateIssue} className="space-y-3.5 text-xs text-zinc-700">
            <div>
              <label className="block font-bold text-zinc-900 mb-1">Issue Headline *</label>
              <Input
                placeholder="e.g. Inadequate coffee cherry advance funds at factory"
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
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Ward / Location</label>
                <Input
                  placeholder="e.g. Mahiga Ward"
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Policy Category</label>
                <Select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as IssueCategory)}
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Urgency Priority</label>
                <Select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                >
                  <option value="Urgent">Urgent Crisis</option>
                  <option value="Moderate">Moderate Concern</option>
                  <option value="Routine">Routine Request</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Reported By (Group or Citizens)</label>
              <Input
                placeholder="e.g. Karatina Market Traders or Chinga Smallholders Cooperative"
                value={newReportedBy}
                onChange={(e) => setNewReportedBy(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Grievance Description *</label>
              <Textarea
                placeholder="Describe what the community said, impact on families, and who is affected..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Candidate Pledge / Proposed Solution</label>
              <Textarea
                placeholder="What will Dr. Grace Wambui Kariuki promise or implement if elected?"
                value={newActionPledge}
                onChange={(e) => setNewActionPledge(e.target.value)}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewIssueModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="yellow" className="font-bold">
                Log Issue & Pledge
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* UPDATE PLEDGE MODAL */}
      {editingIssue && (
        <Dialog open={!!editingIssue} onOpenChange={() => setEditingIssue(null)}>
          <DialogContent onClose={() => setEditingIssue(null)}>
            <DialogHeader>
              <DialogTitle>Update Campaign Pledge & Status</DialogTitle>
              <DialogDescription>
                {editingIssue.title} ({editingIssue.subCounty})
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSavePledge} className="space-y-4 text-xs text-zinc-700">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Action Status</label>
                <Select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as IssueStatus)}
                >
                  <option value="Logged">Logged (Under review)</option>
                  <option value="Investigating">Investigating on ground</option>
                  <option value="Manifesto Pledge Made">Manifesto Pledge Made</option>
                  <option value="Rapid Response Action">Rapid Response Action Initiated</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Candidate Action Commitment</label>
                <Textarea
                  value={editPledgeText}
                  onChange={(e) => setEditPledgeText(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingIssue(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="yellow" className="font-bold">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
