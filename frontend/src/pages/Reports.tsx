import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Activity, Users, CheckCircle2, Heart, TrendingUp, BarChart2 } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

interface Patient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  sex: string;
  bedNumber: string;
  sofaScore: number;
  apacheIIScore: number;
  status: string;
  icuaw?: string;
  admissionDate: string;
  DailyRecords?: any[];
  LaboratoryValues?: any[];
}

export default function Reports() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await axios.get('/api/patients');
        setPatients(res.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const totalAdmitted = patients.length;
  const activeCount = patients.filter(p => p.status === 'active').length;
  const dischargedCount = patients.filter(p => p.status === 'discharged').length;
  const deceasedCount = patients.filter(p => p.status === 'deceased').length;

  // Calculators
  const avgAge = totalAdmitted > 0 
    ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / totalAdmitted) 
    : 0;

  const activePatients = patients.filter(p => p.status === 'active');
  const avgSofa = activePatients.length > 0
    ? (activePatients.reduce((sum, p) => sum + (p.sofaScore || 0), 0) / activePatients.length).toFixed(1)
    : '0';

  const avgApache = activePatients.length > 0
    ? (activePatients.reduce((sum, p) => sum + (p.apacheIIScore || 0), 0) / activePatients.length).toFixed(1)
    : '0';

  const exportGeneralReport = () => {
    // Sheet 1: Patients demographic summaries
    const patientDetailsData = patients.map((p) => ({
      UHID: p.uhid,
      Name: p.name,
      Age: p.age,
      Sex: p.sex.toUpperCase(),
      Bed: p.bedNumber || 'Unassigned',
      Status: p.status.toUpperCase(),
      'Initial SOFA': p.sofaScore || 0,
      'Initial APACHE II': p.apacheIIScore || 0,
      'ICUAW Outcome': (p.icuaw || 'pending').toUpperCase(),
      'Admission Date': new Date(p.admissionDate).toLocaleDateString(),
    }));

    // Sheet 2: Daily record entries
    const dailyRecordsData: any[] = [];
    // Sheet 3: Lab value entries
    const labValuesData: any[] = [];

    patients.forEach((p) => {
      if (p.DailyRecords && p.DailyRecords.length > 0) {
        p.DailyRecords.forEach((d) => {
          dailyRecordsData.push({
            UHID: p.uhid,
            'Patient Name': p.name,
            Date: d.date,
            'SOFA Score': d.sofaScore ?? '',
            'Heart Rate Min': d.hrMin ?? '',
            'Heart Rate Max': d.hrMax ?? '',
            'SBP Min': d.sbpMin ?? '',
            'SBP Max': d.sbpMax ?? '',
            'DBP Min': d.dbpMin ?? '',
            'DBP Max': d.dbpMax ?? '',
            'Respiratory Rate Min': d.rrMin ?? '',
            'Respiratory Rate Max': d.rrMax ?? '',
            'SpO2 Min': d.spo2Min ?? '',
            'SpO2 Max': d.spo2Max ?? '',
            'Temperature Min': d.tempMin ?? '',
            'Temperature Max': d.tempMax ?? '',
            'RASS Min': d.rassMin ?? '',
            'RASS Max': d.rassMax ?? '',
            'Urine Output Min': d.urineMin ?? '',
            'Urine Output Max': d.urineMax ?? '',
            GCS: d.gcs ?? '',
            'Mechanical Vent Duration (hrs)': d.mechVentDuration ?? '',
            'Sedation Duration (hrs)': d.sedationDuration ?? '',
            'Neuromuscular Duration (hrs)': d.neuromuscularDuration ?? '',
            'Corticosteroid Duration (hrs)': d.corticosteroidDuration ?? '',
            'Vasopressor Duration (hrs)': d.vasopressorDuration ?? '',
            'Mobilization Time (hrs)': d.mobilizationTime ?? '',
            'Immobilization Duration (hrs)': d.immobilizationDuration ?? '',
            'Nutrition Route': d.nutritionRoute ?? '',
            'Protein Intake (gm/day)': d.proteinIntake ?? '',
            'Handgrip Strength (unit-kg force)': d.handgripStrength ?? '',
          });
        });
      }

      if (p.LaboratoryValues && p.LaboratoryValues.length > 0) {
        p.LaboratoryValues.forEach((l) => {
          labValuesData.push({
            UHID: p.uhid,
            'Patient Name': p.name,
            Date: l.date,
            'Glucose Min': l.glucoseMin ?? '',
            'Glucose Max': l.glucoseMax ?? '',
            Phosphate: l.phosphate ?? '',
            Potassium: l.potassium ?? '',
            Albumin: l.albumin ?? '',
            CRP: l.crp ?? '',
            Procalcitonin: l.procalcitonin ?? '',
            Creatinine: l.creatinine ?? '',
            AST: l.ast ?? '',
            ALT: l.alt ?? '',
            Bilirubin: l.bilirubin ?? '',
            Lactate: l.lactate ?? '',
            Hb: l.hb ?? '',
            TLC: l.tlc ?? '',
            Platelets: l.plt ?? '',
            TSH: l.tsh ?? '',
            T3: l.t3 ?? '',
            T4: l.t4 ?? '',
          });
        });
      }
    });

    const workbook = XLSX.utils.book_new();

    // Append Sheet 1
    const wsPatients = XLSX.utils.json_to_sheet(patientDetailsData);
    XLSX.utils.book_append_sheet(workbook, wsPatients, 'Patients Demographic');

    // Append Sheet 2
    const wsDaily = XLSX.utils.json_to_sheet(dailyRecordsData.length > 0 ? dailyRecordsData : [{ UHID: 'No records available' }]);
    XLSX.utils.book_append_sheet(workbook, wsDaily, 'Daily Vitals & Treatment');

    // Append Sheet 3
    const wsLabs = XLSX.utils.json_to_sheet(labValuesData.length > 0 ? labValuesData : [{ UHID: 'No records available' }]);
    XLSX.utils.book_append_sheet(workbook, wsLabs, 'Lab Record Logs');

    XLSX.writeFile(workbook, 'AIIMS_ICU_Comprehensive_Audit_Report.xlsx');
  };

  return (
    <div className="space-y-8 animate-slide-up select-none font-body text-[#e2e8f0]">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Clinical Analytics & Reports</h1>
          <p className="text-[#64748b] text-sm font-medium mt-1">Data analysis and administrative spreadsheets.</p>
        </div>
        <button 
          onClick={exportGeneralReport}
          disabled={loading || patients.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0ba5e9] hover:bg-[#38bdf8] text-black rounded-xl text-xs font-black shadow-md transition disabled:opacity-50"
        >
          <Download className="h-4 w-4 stroke-[3]" /> Download Full Audit Report
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#64748b] text-sm font-semibold">Generating clinical analysis...</div>
      ) : (
        <>
          {/* Top analytical summary grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Stat: Total Admitted */}
            <div className="bg-[#0f1b26] p-5 rounded-2xl border border-[#1e2e3d]/60 shadow-lg">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Total Admitted</span>
              <div className="flex items-center justify-between mt-3">
                <h2 className="text-3xl font-extrabold text-white">{totalAdmitted}</h2>
                <div className="p-2.5 bg-[#132839] text-[#0ba5e9] rounded-xl">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Stat: Active Cases */}
            <div className="bg-[#0f1b26] p-5 rounded-2xl border border-[#1e2e3d]/60 shadow-lg">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Active in ICU</span>
              <div className="flex items-center justify-between mt-3">
                <h2 className="text-3xl font-extrabold text-sky-400">{activeCount}</h2>
                <div className="p-2.5 bg-[#132839] text-sky-400 rounded-xl">
                  <Activity className="h-5 w-5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Stat: Discharged */}
            <div className="bg-[#0f1b26] p-5 rounded-2xl border border-[#1e2e3d]/60 shadow-lg">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Discharged</span>
              <div className="flex items-center justify-between mt-3">
                <h2 className="text-3xl font-extrabold text-emerald-400">{dischargedCount}</h2>
                <div className="p-2.5 bg-[#132839] text-emerald-400 rounded-xl">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Stat: Deceased */}
            <div className="bg-[#0f1b26] p-5 rounded-2xl border border-[#1e2e3d]/60 shadow-lg">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Deceased</span>
              <div className="flex items-center justify-between mt-3">
                <h2 className="text-3xl font-extrabold text-rose-500">{deceasedCount}</h2>
                <div className="p-2.5 bg-[#132839] text-rose-500 rounded-xl">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analytical details column */}
            <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
                <TrendingUp className="h-4.5 w-4.5 text-[#0ba5e9]" /> Severity Indices & Demographics
              </h3>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/40">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Avg SOFA</span>
                  <span className="text-xl font-bold text-white mt-1 block">{avgSofa}</span>
                </div>
                <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/40">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Avg APACHE II</span>
                  <span className="text-xl font-bold text-white mt-1 block">{avgApache}</span>
                </div>
                <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/40">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Avg Age</span>
                  <span className="text-xl font-bold text-white mt-1 block">{avgAge} yrs</span>
                </div>
              </div>


            </div>

            {/* General instructions audit card */}
            <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
                  <BarChart2 className="h-4.5 w-4.5 text-[#0ba5e9]" /> Clinical Audit Guide
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed mt-4">
                  The clinical audit reports provide general distributions of patients admitted to the ICU. You can use the top right button to export this table data directly into a spreadsheet compatible with standard electronic medical record (EMR) format tools.
                </p>
                <div className="bg-[#0a131a] border border-[#1e2e3d]/40 p-4 rounded-xl mt-6 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Key Highlights</span>
                  <ul className="text-[#94a3b8] space-y-1 font-semibold">
                    <li>• Current Bed Occupancy Count: {activeCount} beds</li>
                    <li>• Average Severity Indicator (SOFA): {avgSofa} points</li>
                    <li>• Patient Outflow Ratio (Discharged): {totalAdmitted > 0 ? Math.round((dischargedCount / totalAdmitted) * 100) : 0}%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
