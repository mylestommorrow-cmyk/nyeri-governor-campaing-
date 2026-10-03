import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { TeamMember, TeamRole, SubCounty } from '../types/campaign';
import { SUB_COUNTIES } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import {
  Users,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Shield,
  Trash2,
  UserCheck,
  Award,
} from 'lucide-react';

const TEAM_ROLES: TeamRole[] = [
  'Campaign Director',
  'Sub-County Coordinator',
  'Youth League Lead',
  'Women League Liaison',
  'Logistics & Fleet Officer',
  'Communications & Media',
  'Field Mobilizer',
];

interface TeamPageProps {
  newMemberModalOpen: boolean;
  setNewMemberModalOpen: (open: boolean) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  newMemberModalOpen,
  setNewMemberModalOpen,
}) => {
  const { team, addTeamMember, deleteTeamMember, stats } = useCampaign();

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [subCountyFilter, setSubCountyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State for New Member
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<TeamRole>('Field Mobilizer');
  const [newSubCounty, setNewSubCounty] = useState<SubCounty>('Nyeri Town');
  const [newWard, setNewWard] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVolunteers, setNewVolunteers] = useState('25');
  const [newStatus, setNewStatus] = useState<'Active in Field' | 'At Campaign HQ' | 'On Standby'>('Active in Field');

  const filteredTeam = team.filter((member) => {
    if (roleFilter !== 'All' && member.role !== roleFilter) return false;
    if (subCountyFilter !== 'All' && member.subCounty !== subCountyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        member.fullName.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        (member.ward && member.ward.toLowerCase().includes(q)) ||
        member.subCounty.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Please enter Team Member Full Name');
      return;
    }

    addTeamMember({
      fullName: newName.trim(),
      role: newRole,
      subCounty: newSubCounty,
      ward: newWard.trim() || undefined,
      phone: newPhone.trim() || '+254 700 000 000',
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@nyericampaign.test`,
      status: newStatus,
      volunteersLed: parseInt(newVolunteers) || 10,
    });

    // Reset Form
    setNewName('');
    setNewWard('');
    setNewPhone('');
    setNewEmail('');
    setNewVolunteers('25');
    setNewMemberModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Campaign Team & Field Marshals
            </h2>
            <Badge variant="yellow" className="font-bold">
              {stats.totalTeamMembers} Officers
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Territory directors, youth mobilization heads, and volunteer precinct coordinators across Nyeri.
          </p>
        </div>

        <Button
          variant="yellow"
          onClick={() => setNewMemberModalOpen(true)}
          className="font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Field Officers</span>
          <p className="text-xl font-black text-blue-600">{stats.totalTeamMembers}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Grassroots Volunteers</span>
          <p className="text-xl font-black text-emerald-600">{stats.totalVolunteers.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Active in Field</span>
          <p className="text-xl font-black text-zinc-900">
            {team.filter((m) => m.status === 'Active in Field').length}
          </p>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase">Campaign HQ Staff</span>
          <p className="text-xl font-black text-amber-600">
            {team.filter((m) => m.status === 'At Campaign HQ').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-zinc-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search staff name, ward, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Role Filter */}
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Campaign Roles</option>
              {TEAM_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>

            {/* Sub-County Filter */}
            <Select
              value={subCountyFilter}
              onChange={(e) => setSubCountyFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Territories</option>
              {SUB_COUNTIES.map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
              <option value="Countywide">Countywide</option>
            </Select>
          </div>

          {(roleFilter !== 'All' || subCountyFilter !== 'All' || searchQuery) && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
              <span className="text-zinc-500">
                Filtered view showing <strong>{filteredTeam.length}</strong> of {team.length} members
              </span>
              <button
                onClick={() => {
                  setRoleFilter('All');
                  setSubCountyFilter('All');
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

      {/* Team Cards Grid */}
      {filteredTeam.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center space-y-3">
          <Users className="h-10 w-10 text-zinc-300 mx-auto" />
          <h3 className="font-bold text-zinc-800">No team members match your criteria</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new team coordinator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeam.map((member) => (
            <Card
              key={member.id}
              className="border border-zinc-200 hover:border-yellow-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="blue" className="text-[10px] font-bold">
                    {member.subCounty}
                  </Badge>

                  <Badge
                    variant={
                      member.status === 'Active in Field'
                        ? 'success'
                        : member.status === 'At Campaign HQ'
                        ? 'default'
                        : 'outline'
                    }
                    className="text-[10px]"
                  >
                    {member.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-700 to-black text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs border border-white/20">
                    {member.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-extrabold truncate">
                      {member.fullName}
                    </CardTitle>
                    <p className="text-xs font-semibold text-blue-700 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-2.5 flex-1">
                {member.ward && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span>Ward: <strong>{member.ward}</strong></span>
                  </div>
                )}

                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-2.5 space-y-1.5 text-xs text-zinc-700">
                  <div className="flex items-center gap-2 text-zinc-600 truncate">
                    <Phone className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 truncate">
                    <Mail className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-zinc-500">Volunteers Supervised:</span>
                  <span className="font-bold text-zinc-900 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full text-[11px]">
                    {member.volunteersLed} personnel
                  </span>
                </div>
              </CardContent>

              <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Simulated call / SMS dispatch to ${member.fullName} (${member.phone})`)}
                  className="text-xs h-7 px-2.5"
                >
                  <Phone className="h-3 w-3 mr-1" /> Contact
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`Remove ${member.fullName} from campaign roster?`)) {
                      deleteTeamMember(member.id);
                    }
                  }}
                  className="text-zinc-400 hover:text-red-600 h-7 w-7 p-0"
                  title="Remove member"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD TEAM MEMBER MODAL */}
      <Dialog open={newMemberModalOpen} onOpenChange={setNewMemberModalOpen}>
        <DialogContent onClose={() => setNewMemberModalOpen(false)}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-bold">
                <Users className="h-4 w-4" />
              </div>
              <DialogTitle>Add Campaign Team Member</DialogTitle>
            </div>
            <DialogDescription>
              Assign a field coordinator, mobilization captain, or secretariat officer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMember} className="space-y-3.5 text-xs text-zinc-700">
            <div>
              <label className="block font-bold text-zinc-900 mb-1">Full Name *</label>
              <Input
                placeholder="e.g. Christine Wangui Ngunjiri"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Campaign Role</label>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as TeamRole)}
                >
                  {TEAM_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Sub-County Territory</label>
                <Select
                  value={newSubCounty}
                  onChange={(e) => setNewSubCounty(e.target.value as SubCounty)}
                >
                  <option value="Countywide">Countywide</option>
                  {SUB_COUNTIES.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Ward / Location (Optional)</label>
                <Input
                  placeholder="e.g. Chinga Ward"
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Operational Status</label>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                >
                  <option value="Active in Field">Active in Field</option>
                  <option value="At Campaign HQ">At Campaign HQ</option>
                  <option value="On Standby">On Standby</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-900 mb-1">Phone Number</label>
                <Input
                  placeholder="e.g. +254 712 345 678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1">Volunteers Supervised</label>
                <Input
                  type="number"
                  placeholder="e.g. 35"
                  value={newVolunteers}
                  onChange={(e) => setNewVolunteers(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-900 mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="e.g. c.wangui@nyericampaign.test"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewMemberModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="yellow" className="font-bold">
                Register Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
