import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Database, CheckCircle2, AlertTriangle, Copy, ExternalLink, RefreshCw, Sparkles, Check } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured } from '../lib/supabase';
import { useCampaign } from '../context/CampaignContext';

interface SupabaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ open, onOpenChange }) => {
  const { supabaseStatus, checkSupabaseConnection, seedSupabaseData } = useCampaign();
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const projectId = supabaseUrl.replace('https://', '').split('.')[0] || 'your-project';

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRefresh = async () => {
    setIsSyncing(true);
    await checkSupabaseConnection();
    setIsSyncing(false);
  };

  const handleSeed = async () => {
    setIsSyncing(true);
    const success = await seedSupabaseData();
    setIsSyncing(false);
    if (success) {
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-xs">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                Supabase Integration
                {supabaseStatus === 'connected' && (
                  <Badge variant="success" className="text-xs">
                    Live & Synced
                  </Badge>
                )}
                {supabaseStatus === 'needs_tables' && (
                  <Badge variant="warning" className="text-xs">
                    Tables Needed in Supabase
                  </Badge>
                )}
                {supabaseStatus === 'local_only' && (
                  <Badge variant="default" className="text-xs">
                    Local Storage
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Cloud database sync for activities, field tasks, community issues, and campaign team.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs sm:text-sm text-zinc-700">
          {/* Connection status card */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Connected Endpoint:</span>
              <strong className="text-xs font-mono text-blue-700 truncate max-w-[280px]">
                {supabaseUrl || 'Not configured'}
              </strong>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Sync Status:</span>
                {supabaseStatus === 'connected' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Tables Active & Streaming
                  </span>
                ) : supabaseStatus === 'needs_tables' ? (
                  <span className="text-amber-700 font-bold flex items-center gap-1 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Tables not created yet
                  </span>
                ) : (
                  <span className="text-zinc-600 font-bold text-xs">Checking connection...</span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isSyncing}
                className="text-xs h-7 px-2.5"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                Test Connection
              </Button>
            </div>
          </div>

          {/* If tables are needed or user wants SQL schema */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-zinc-900 text-xs flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Required Supabase Database Tables (SQL)
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href={`https://supabase.com/dashboard/project/${projectId}/sql`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  Open Supabase SQL Editor <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="relative">
              <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl text-[11px] font-mono max-h-48 overflow-y-auto leading-relaxed border border-zinc-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>

              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold shadow-xs cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy SQL
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-zinc-500">
              Paste and run this query once in your <strong>Supabase SQL Editor</strong> to create the 4 campaign tables (<code className="bg-zinc-100 px-1 py-0.5 rounded">activities</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded">tasks</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded">community_issues</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded">team_members</code>) with security policies enabled.
            </p>
          </div>

          {/* Seed Action */}
          {supabaseStatus === 'connected' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Seed Baseline Nyeri Training Data
                </p>
                <p className="text-[11px] text-emerald-800">
                  Populate your Supabase tables with initial sample activities, tasks, and issues.
                </p>
              </div>
              <Button
                variant="yellow"
                size="sm"
                onClick={handleSeed}
                disabled={isSyncing}
                className="font-bold text-xs shrink-0"
              >
                {seedSuccess ? 'Seeded Successfully!' : 'Seed Supabase'}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          <Button
            variant="yellow"
            onClick={handleCopy}
            className="font-bold flex items-center gap-1.5"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied SQL Script' : 'Copy SQL Schema Script'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
