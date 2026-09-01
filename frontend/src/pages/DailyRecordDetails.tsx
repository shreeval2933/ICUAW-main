import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, ShieldAlert, Sparkles, ClipboardCheck, Dumbbell } from 'lucide-react';
import axios from 'axios';

export default function DailyRecordDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vitals' | 'treatment' | 'practices' | 'nutrition' | 'icuaw'>('vitals');

  useEffect(() => {
    async function loadRecord() {
      try {
        const res = await axios.get(`/api/patients`);
        let foundRecord: any = null;
        let foundPatient: any = null;
        for (const p of res.data) {
          const detailRes = await axios.get(`/api/patients/${p.id}`);
          const rec = (detailRes.data.DailyRecords || []).find((r: any) => r.id === id);
          if (rec) {
            foundRecord = rec;
            foundPatient = detailRes.data;
            break;
          }
        }
        
        if (foundRecord) {
          setRecord({ ...foundRecord, patient: foundPatient });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRecord();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-[#64748b] text-sm font-semibold">Loading daily record details...</div>;
  }

  if (!record) {
    return (
      <div className="text-center py-24 bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl">
        <h2 className="text-lg font-bold text-white">Daily Record Not Found</h2>
        <button onClick={() => navigate('/patients')} className="mt-4 text-[#0ba5e9] font-bold hover:underline">
          Return to Patients Directory
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'vitals', label: 'VITAL SIGNS' },
    { id: 'treatment', label: 'TREATMENT VARIABLES' },
    { id: 'practices', label: 'ICU PRACTICES' },
    { id: 'nutrition', label: 'NUTRITION' },
    { id: 'icuaw', label: 'ICUAW' },
  ] as const;

  return (
    <div className="space-y-6 animate-slide-up select-none font-body text-[#e2e8f0]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/patient/${record.patient.id}`)}
            className="p-2 bg-[#0b131a] border border-[#1e2e3d] rounded-xl hover:bg-[#132230] text-[#94a3b8] hover:text-white transition"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-heading text-white">Daily Record Details</h1>
            <p className="text-[#64748b] text-xs font-semibold mt-1">
              Logged on: {new Date(record.createdAt || record.date).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Patient card widget */}
        <div className="bg-[#0b131a] border border-[#1e2e3d]/60 px-4 py-2.5 rounded-xl flex items-center gap-6 text-xs text-[#94a3b8]">
          <div>
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block">Patient</span>
            <span className="text-white font-bold">{record.patient.name}</span>
          </div>
          <div className="border-l border-[#1e2e3d] pl-6">
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block">UHID</span>
            <span className="text-white font-bold">{record.patient.uhid}</span>
          </div>
        </div>
      </div>

      {/* Overview Block */}
      <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
        <div>
          <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">SOFA Score</span>
          <span className="text-sm font-extrabold text-white mt-1.5 block">{record.sofaScore ?? 'N/A'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">GCS (3-15)</span>
          <span className="text-sm font-extrabold text-white mt-1.5 block">{record.gcs ?? 'N/A'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Status</span>
          <span className="inline-flex mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#142332] text-[#0ba5e9] border border-[#1e2e3d]/60">
            Recorded
          </span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-row overflow-x-auto whitespace-nowrap bg-[#0b131a] rounded-xl border border-[#1e2e3d]/60 p-1.5 gap-1.5 text-center scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 shrink-0 min-w-[140px] sm:min-w-0 py-2.5 px-4 rounded-lg text-xs font-black transition text-center ${
              activeTab === tab.id 
                ? 'bg-[#132230] text-[#0ba5e9] border border-[#1e2e3d]/40' 
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panel block content */}
      <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6">
        
        {/* Tab 1: Vitals */}
        {activeTab === 'vitals' && (
          <div className="space-y-4 animate-fade-in text-xs font-semibold">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
              <Activity className="h-4 w-4 text-[#0ba5e9]" /> VITAL SIGNS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">SOFA Score</span>
                <span className="text-white font-bold">{record.sofaScore ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">GCS (3-15)</span>
                <span className="text-white font-bold">{record.gcs ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Heart Rate (beats/min)</span>
                <span className="text-white font-bold">{record.hrMin ?? '-' } to {record.hrMax ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">BP Systolic (mmHg)</span>
                <span className="text-white font-bold">{record.sbpMin ?? '-' } to {record.sbpMax ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">BP Diastolic (mmHg)</span>
                <span className="text-white font-bold">{record.dbpMin ?? '-' } to {record.dbpMax ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Respiratory Rate</span>
                <span className="text-white font-bold">{record.rrMin ?? '-' } to {record.rrMax ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">SpO2 (%)</span>
                <span className="text-white font-bold">{record.spo2Min ?? '-' } to {record.spo2Max ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Temperature (F)</span>
                <span className="text-white font-bold">{record.tempMin ?? '-' } to {record.tempMax ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">RASS Score</span>
                <span className="text-white font-bold">{record.rassMin ?? '-' } to {record.rassMax ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Urine Output (mL/hour)</span>
                <span className="text-white font-bold">{record.urineMin ?? '-' } to {record.urineMax ?? '-'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Treatment Variables */}
        {activeTab === 'treatment' && (
          <div className="space-y-4 animate-fade-in text-xs font-semibold">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
              <ShieldAlert className="h-4 w-4 text-[#0ba5e9]" /> TREATMENT VARIABLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Mechanical Ventilation Duration</span>
                <span className="text-white font-bold">{record.mechVentDuration ? `${record.mechVentDuration} hours` : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Duration of Sedation</span>
                <span className="text-white font-bold">{record.sedationDuration ? `${record.sedationDuration} dose/kg/day` : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Neuromuscular Blocking Agents</span>
                <span className="text-white font-bold">{record.neuromuscularDuration ? `${record.neuromuscularDuration} dose/kg/day` : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Corticosteroid Therapy</span>
                <span className="text-white font-bold">{record.corticosteroidDuration ? `${record.corticosteroidDuration} dose/kg/day` : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Vasopressor Use</span>
                <span className="text-white font-bold">{record.vasopressorDuration ? `${record.vasopressorDuration} dose/kg/day` : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: ICU Practices */}
        {activeTab === 'practices' && (
          <div className="space-y-4 animate-fade-in text-xs font-semibold">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
              <ClipboardCheck className="h-4 w-4 text-[#0ba5e9]" /> ICU PRACTICES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Time to Mobilization</span>
                <span className="text-white font-bold">{record.mobilizationTime ? `${record.mobilizationTime} hours` : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Duration of Immobilization</span>
                <span className="text-white font-bold">{record.immobilizationDuration ? `${record.immobilizationDuration} hours` : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Nutrition */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4 animate-fade-in text-xs font-semibold">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
              <Sparkles className="h-4 w-4 text-[#0ba5e9]" /> NUTRITION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Route</span>
                <span className="text-white font-bold capitalize">{record.nutritionRoute || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Daily Protein Intake</span>
                <span className="text-white font-bold">{record.proteinIntake ? `${record.proteinIntake} gm/day` : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: ICUAW */}
        {activeTab === 'icuaw' && (
          <div className="space-y-4 animate-fade-in text-xs font-semibold">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
              <Dumbbell className="h-4 w-4 text-[#0ba5e9]" /> ICUAW
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between border-b border-[#1e2e3d]/20 pb-2">
                <span className="text-[#64748b]">Handgrip strength (unit-kg force)</span>
                <span className="text-white font-bold">{record.handgripStrength != null ? `${record.handgripStrength} kg force` : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
