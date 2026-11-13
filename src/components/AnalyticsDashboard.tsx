import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { TrendingUp, Users, Zap, ShieldCheck, Activity, BarChart3 } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Platform Intelligence & Growth Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Usage Telemetry, DAU & Retention Cohorts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time platform adoption, daily active risk analysts, feature utilization, and prevented fraud metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Current DAU</p>
            <p className="font-extrabold text-emerald-400 text-sm">2,680 Active</p>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase">MAU</p>
            <p className="font-extrabold text-blue-400 text-sm">14,200 Monthly</p>
          </div>
        </div>
      </div>

      {/* Row 1: Charts - Prevented Fraud Losses & Daily Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Losses Saved Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Prevented Fraud Loss Trend ($ USD)
            </h3>
            <span className="text-xs font-bold text-emerald-400">+24% vs last week</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeSeries}>
                <defs>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, 'Fraud Saved']}
                />
                <Area type="monotone" dataKey="fraudLossSaved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLoss)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Active Usage (DAU/MAU) Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Daily Active Usage (DAU) Growth
            </h3>
            <span className="text-xs font-bold text-blue-400">+18% MoM</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="dau" name="Daily Active Users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: User Retention Cohorts Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Fintech Customer Retention Matrix (Weekly Cohorts)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-4">Cohort Month</th>
                <th className="py-2.5 px-4">Account Size</th>
                <th className="py-2.5 px-4">Week 1</th>
                <th className="py-2.5 px-4">Week 2</th>
                <th className="py-2.5 px-4">Week 3</th>
                <th className="py-2.5 px-4">Week 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {data.retentionData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-semibold text-blue-400">{row.cohort}</td>
                  <td className="py-3 px-4 font-bold">{row.size} accounts</td>
                  <td className="py-3 px-4 bg-blue-600/30 font-bold text-blue-200 text-center">{row.w1}%</td>
                  <td className="py-3 px-4 bg-blue-600/25 font-bold text-blue-200 text-center">{row.w2}%</td>
                  <td className="py-3 px-4 bg-blue-600/20 font-bold text-blue-300 text-center">{row.w3}%</td>
                  <td className="py-3 px-4 bg-blue-600/15 font-bold text-blue-300 text-center">{row.w4}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Feature Utilization Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Feature Adoption & API Call Volume
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.featureUsage.map((feat, i) => (
            <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-200 leading-snug">{feat.feature}</span>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  +{feat.growth}%
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/60 flex justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Active Teams</p>
                  <p className="font-extrabold text-slate-100">{feat.activeUsers}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Monthly API Calls</p>
                  <p className="font-extrabold text-blue-400 font-mono">
                    {(feat.monthlyCalls / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
