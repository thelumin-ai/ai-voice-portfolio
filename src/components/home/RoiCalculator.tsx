"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, Calculator, ArrowUpRight } from "lucide-react";

export default function RoiCalculator() {
  const [calls, setCalls] = useState(250);
  const [tasks, setTasks] = useState(100);
  const [wage, setWage] = useState(25);

  const workingDays = 22;
  const callHours = (calls * 3) / 60;
  const taskHours = (tasks * 5) / 60;
  const monthlyHumanHours = (callHours + taskHours) * workingDays;
  const computedHumanCost = monthlyHumanHours * wage * 1.25;

  const voiceCostPerDay = calls * 3 * 0.18;
  const workflowCostPerDay = tasks * 0.02;
  const computedAiCost = (voiceCostPerDay + workflowCostPerDay) * workingDays;
  const computedSavings = computedHumanCost - computedAiCost;

  const humanCost = Math.round(computedHumanCost);
  const aiCost = Math.round(computedAiCost);
  const savings = Math.round(computedSavings > 0 ? computedSavings : 0);
  const yearlySavings = Math.round(computedSavings > 0 ? computedSavings * 12 : 0);

  return (
    <section id="roi-calculator" className="relative py-24 bg-black text-white overflow-hidden border-t border-zinc-900">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-blue-500 blur-3xl rounded-full mix-blend-screen" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 max-w-[1400px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-4">
            <Calculator className="w-3.5 h-3.5 mr-2" />
            ROI &amp; Savings Calculator
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Stop Overpaying for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              Manual Operations
            </span>
          </h2>
          <p className="text-lg text-gray-300">
            See exactly how much you can save by replacing manual receptionists, data entry, and follow-ups with high-converting AI Voice Agents and automated CRM workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Sliders Area */}
          <div className="lg:col-span-7 bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-8">
              {/* Slider 1: Calls */}
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <label htmlFor="roi-calls-slider" className="text-sm font-semibold text-gray-200">Daily Phone Calls Handled</label>
                  <span className="text-lg font-bold text-blue-400">{calls} <span className="text-xs text-gray-400">calls/day</span></span>
                </div>
                <input
                  id="roi-calls-slider"
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calls}
                  onChange={(e) => setCalls(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>10 calls</span>
                  <span>1,000 calls</span>
                </div>
              </div>

              {/* Slider 2: CRM Tasks */}
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <label htmlFor="roi-tasks-slider" className="text-sm font-semibold text-gray-200">Daily CRM &amp; Data-Entry Tasks</label>
                  <span className="text-lg font-bold text-blue-400">{tasks} <span className="text-xs text-gray-400">tasks/day</span></span>
                </div>
                <input
                  id="roi-tasks-slider"
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={tasks}
                  onChange={(e) => setTasks(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5 tasks (manual HubSpot/SMS)</span>
                  <span>500 tasks</span>
                </div>
              </div>

              {/* Slider 3: Hourly Wage */}
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <label htmlFor="roi-wage-slider" className="text-sm font-semibold text-gray-200">Human Employee Hourly Wage</label>
                  <span className="text-lg font-bold text-blue-400">${wage}/hr</span>
                </div>
                <input
                  id="roi-wage-slider"
                  type="range"
                  min="12"
                  max="50"
                  step="1"
                  value={wage}
                  onChange={(e) => setWage(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>$12/hr</span>
                  <span>$50/hr</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-zinc-500 shrink-0" />
                Includes 25% human hiring overhead (taxes, software).
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-zinc-500 shrink-0" />
                Calculated at $0.18/voice-minute &amp; $0.02/make-n8n run.
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/30 to-zinc-950 border border-blue-500/25 p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-2">Estimated Monthly Savings</div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1 flex flex-wrap items-baseline gap-x-2">
                <span>${savings.toLocaleString()}</span>
                <span className="text-base font-normal text-gray-400">/ month</span>
              </div>
              <div className="text-sm text-emerald-400 font-semibold flex items-center mb-8">
                <ArrowUpRight className="w-4 h-4 mr-1 shrink-0" />
                Save ${yearlySavings.toLocaleString()} / year
              </div>

              {/* Comparative bars */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5 gap-2">
                    <span>Manual Human Cost</span>
                    <span>${humanCost.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="bg-red-500/80 h-full rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5 gap-2">
                    <span>AI &amp; Workflow Automation Cost</span>
                    <span className="text-blue-400">${aiCost.toLocaleString()}/mo</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (aiCost / (humanCost || 1)) * 100)}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="bg-blue-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <a
                href="#consultation"
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 transition-all shadow-lg hover:shadow-blue-500/20 group"
              >
                <span>Automate My Operations &amp; Save</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-center text-xs text-gray-400 mt-3">
                100% customized voice agency &amp; CRM systems tailored for your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
