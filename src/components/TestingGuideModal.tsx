import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle2, Flag, Compass, Calendar, ListTodo, AlertTriangle, Users, RotateCcw } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';

interface TestingGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({ open, onOpenChange }) => {
  const { resetAllData } = useCampaign();

  const handleReset = () => {
    if (window.confirm('Reset all campaign data back to initial training values?')) {
      resetAllData();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-yellow-400 text-black p-1.5 rounded-lg">
              <Compass className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">Prototype Testing & Training Guide</DialogTitle>
          </div>
          <DialogDescription>
            This training prototype demonstrates field operations for a fictional Nyeri County Governor campaign. Follow this guide to verify each page and interactive flow on both mobile and desktop screens.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-sm text-zinc-700">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-blue-950 mb-1">
              <Flag className="h-4 w-4 text-blue-700" />
              Theme & Architecture
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">
              Designed with the requested <strong>Blue</strong> (civic trust), <strong>Yellow</strong> (energy/campaign gold), and <strong>Black</strong> (bold authority) palette. It operates with client-side persistence (no external backend, APIs, or real voter databases required).
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start border-b border-zinc-100 pb-3">
              <div className="h-7 w-7 rounded-full bg-yellow-100 text-yellow-800 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-blue-600" /> Test Dashboard
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Verify the 4 primary KPI cards (Upcoming Rallies, Field Tasks, Urgent Community Issues, Volunteers Mobilized). Review the 6 sub-county readiness cards (Nyeri Town, Mathira, Kieni, Othaya, Mukurwe-ini, Tetu). Try the quick action buttons to immediately trigger modals.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start border-b border-zinc-100 pb-3">
              <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-yellow-600" /> Test Activities Page
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Filter activities by Sub-County (e.g. <em>Mathira</em> or <em>Kieni</em>) and Type (<em>Farmers Forum</em>, <em>Mega Rally</em>). Click any activity to inspect logistical clearance (Police clearance, sound truck, flyer targets). Click <strong>+ Schedule Activity</strong> to add a new event and see it immediately reflected in the feed.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start border-b border-zinc-100 pb-3">
              <div className="h-7 w-7 rounded-full bg-black text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4 text-blue-600" /> Test Operational Tasks
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Click the checkbox on any task to instantly toggle between <em>Completed</em> and <em>Pending</em> (notice the live completion % bar update). Filter by status (<em>Pending</em>, <em>Completed</em>) or Priority (<em>High</em>). Click <strong>+ New Task</strong> to assign an operational assignment.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start border-b border-zinc-100 pb-3">
              <div className="h-7 w-7 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Test Community Issues Page
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Explore localized grievances (Coffee milling deductions in Othaya, feeder roads in Kieni, Karatina market levies). Filter by Sub-County and Category. Click <strong>Update Pledge</strong> on an issue to record candidate commitments, or <strong>+ Log Community Issue</strong> to record a new community grievance.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start pb-1">
              <div className="h-7 w-7 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                5
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-600" /> Test Team Roster & Mobile Responsiveness
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Filter team members by Sub-County or role. Add a new field coordinator. Resize your browser window down to mobile width (or inspect with mobile device mode): observe the thumb-friendly bottom navigation bar and mobile card view.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-red-600 border-zinc-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Initial Sample Data
          </Button>
          <Button
            variant="yellow"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-1"
          >
            <CheckCircle2 className="h-4 w-4" /> Got It, Start Testing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
