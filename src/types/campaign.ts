export type SubCounty = 
  | 'Nyeri Town'
  | 'Mathira'
  | 'Kieni'
  | 'Othaya'
  | 'Mukurwe-ini'
  | 'Tetu'
  | 'Countywide';

export type ActivityType = 
  | 'Mega Rally'
  | 'Town Hall Baraza'
  | 'Door-to-Door'
  | 'Farmers Forum'
  | 'Youth Sports Outreach'
  | 'Market Walkabout'
  | 'Volunteer Training';

export type ActivityStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Postponed';

export interface CampaignActivity {
  id: string;
  title: string;
  type: ActivityType;
  subCounty: SubCounty;
  ward: string;
  venue: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM - 1:00 PM"
  leadCoordinator: string;
  targetTurnout: number;
  actualTurnout?: number;
  status: ActivityStatus;
  description: string;
  securityClearance: boolean;
  soundTruckBooked: boolean;
  leafletsCount: number;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 
  | 'Logistics & Sound'
  | 'Field Mobilization'
  | 'Media & Publicity'
  | 'Security & Protocol'
  | 'Legal & Compliance'
  | 'Community Engagement';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface CampaignTask {
  id: string;
  title: string;
  description?: string;
  subCounty: SubCounty;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeName: string;
  dueDate: string;
  createdAt: string;
}

export type IssueCategory = 
  | 'Agriculture & Coffee/Tea'
  | 'Water & Irrigation'
  | 'Roads & Infrastructure'
  | 'Healthcare & Dispensaries'
  | 'Youth & Job Creation'
  | 'Market Traders & Revenue Fees'
  | 'Education & County Bursaries';

export type IssueStatus = 
  | 'Logged'
  | 'Investigating'
  | 'Manifesto Pledge Made'
  | 'Rapid Response Action';

export interface CommunityIssue {
  id: string;
  title: string;
  category: IssueCategory;
  subCounty: SubCounty;
  ward: string;
  reportedBy: string; // Fictional group, e.g. "Karatina Market Traders Association"
  dateReported: string;
  status: IssueStatus;
  priority: 'Urgent' | 'Moderate' | 'Routine';
  description: string;
  campaignActionPledge: string;
}

export type TeamRole = 
  | 'Campaign Director'
  | 'Sub-County Coordinator'
  | 'Youth League Lead'
  | 'Women League Liaison'
  | 'Logistics & Fleet Officer'
  | 'Communications & Media'
  | 'Field Mobilizer';

export interface TeamMember {
  id: string;
  fullName: string;
  role: TeamRole;
  subCounty: SubCounty;
  ward?: string;
  phone: string; // fictional placeholder
  email: string; // fictional placeholder
  status: 'Active in Field' | 'At Campaign HQ' | 'On Standby';
  volunteersLed: number;
}
