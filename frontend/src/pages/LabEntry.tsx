import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Beaker, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Patient {
  id: string;
  uhid: string;
  name: string;
  bedNumber: string;
}

export default function LabEntry() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Lab inputs matching the parameters spreadsheet
  const [labs, setLabs] = useState({
    glucoseMin: '',
    glucoseMax: '',
    phosphate: '',
    potassium: '',
    albumin: '',
    crp: '',
    procalcitonin: '',
    creatinine: '',
    ast: '',
    alt: '',
    bilirubin: '',
    lactate: '',
    hb: '',
    tlc: '',
    plt: '',
    tsh: '',
    t3: '',
    t4: '',
  });

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await axios.get('/api/patients');
        const activeList = res.data.filter((p: any) => p.status === 'active');
        setPatients(activeList);
        if (activeList.length > 0) {
          setSelectedPatientId(activeList[0].id);
        }
      } catch (err) {
        console.error('Error fetching patients list:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setErrorMsg('Please select a patient before submitting.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const data = {
        date: entryDate,
        glucoseMin: labs.glucoseMin ? parseFloat(labs.glucoseMin) : undefined,
        glucoseMax: labs.glucoseMax ? parseFloat(labs.glucoseMax) : undefined,
        phosphate: labs.phosphate ? parseFloat(labs.phosphate) : undefined,
        potassium: labs.potassium ? parseFloat(labs.potassium) : undefined,
        albumin: labs.albumin ? parseFloat(labs.albumin) : undefined,
        crp: labs.crp ? parseFloat(labs.crp) : undefined,
        procalcitonin: labs.procalcitonin ? parseFloat(labs.procalcitonin) : undefined,
        creatinine: labs.creatinine ? parseFloat(labs.creatinine) : undefined,
        ast: labs.ast ? parseFloat(labs.ast) : undefined,
        alt: labs.alt ? parseFloat(labs.alt) : undefined,
        bilirubin: labs.bilirubin ? parseFloat(labs.bilirubin) : undefined,
        lactate: labs.lactate ? parseFloat(labs.lactate) : undefined,
        hb: labs.hb ? parseFloat(labs.hb) : undefined,
        tlc: labs.tlc ? parseFloat(labs.tlc) : undefined,
        plt: labs.plt ? parseFloat(labs.plt) : undefined,
        tsh: labs.tsh ? parseFloat(labs.tsh) : undefined,
        t3: labs.t3 ? parseFloat(labs.t3) : undefined,
        t4: labs.t4 ? parseFloat(labs.t4) : undefined,
      };

      await axios.post(`/api/patients/${selectedPatientId}/labs`, data);
      navigate(`/patient/${selectedPatientId}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to register laboratory values.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up select-none font-body text-[#e2e8f0]">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Lab Record Entry</h1>
        <p className="text-[#64748b] text-sm font-medium mt-1">Record daily laboratory values independently</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-400 font-bold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-400 font-bold">{errorMsg}</p>
        </div>
      )}

      {/* Selectors Area */}
      <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Select Patient</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-4 py-3 pr-10 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba5e9] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230ba5e9%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[position:right_16px_center] bg-no-repeat"
          >
            {loading ? (
              <option>Loading patients...</option>
            ) : patients.length === 0 ? (
              <option>No active patients found</option>
            ) : (
              patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.uhid}) {p.bedNumber ? ` - ${p.bedNumber}` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba5e9]"
          />
        </div>
      </div>

      {/* Main input card */}
      <form onSubmit={handleSubmit} className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="space-y-1 pb-2 border-b border-[#1e2e3d]/40">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Beaker className="h-5 w-5 text-[#0ba5e9]" /> Laboratory Values
          </h2>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Hemoglobin */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Hemoglobin (g/dL)</label>
            <input
              type="text"
              placeholder="Hemoglobin"
              value={labs.hb}
              onChange={(e) => setLabs({ ...labs, hb: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* TLC */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Total Leukocyte Count (cells/mm³)</label>
            <input
              type="text"
              placeholder="Total Leukocyte Count"
              value={labs.tlc}
              onChange={(e) => setLabs({ ...labs, tlc: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Platelets */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Platelet Count (cells/mm³)</label>
            <input
              type="text"
              placeholder="Platelet Count"
              value={labs.plt}
              onChange={(e) => setLabs({ ...labs, plt: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Glucose variability */}
          <div className="space-y-1 col-span-1 lg:col-span-2">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Glucose Variability Min/Max (mg/dL)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Min"
                value={labs.glucoseMin}
                onChange={(e) => setLabs({ ...labs, glucoseMin: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
              />
              <input
                type="text"
                placeholder="Max"
                value={labs.glucoseMax}
                onChange={(e) => setLabs({ ...labs, glucoseMax: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
              />
            </div>
          </div>

          {/* Phosphate */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Phosphate (mEq/L)</label>
            <input
              type="text"
              placeholder="Phosphate"
              value={labs.phosphate}
              onChange={(e) => setLabs({ ...labs, phosphate: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Potassium */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Potassium (mEq/L)</label>
            <input
              type="text"
              placeholder="Potassium"
              value={labs.potassium}
              onChange={(e) => setLabs({ ...labs, potassium: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Albumin */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Albumin (mg/dL)</label>
            <input
              type="text"
              placeholder="Albumin"
              value={labs.albumin}
              onChange={(e) => setLabs({ ...labs, albumin: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* CRP */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">CRP (mg/dL)</label>
            <input
              type="text"
              placeholder="CRP"
              value={labs.crp}
              onChange={(e) => setLabs({ ...labs, crp: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Procalcitonin */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Procalcitonin (ng/mL)</label>
            <input
              type="text"
              placeholder="Procalcitonin"
              value={labs.procalcitonin}
              onChange={(e) => setLabs({ ...labs, procalcitonin: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Creatinine */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Creatinine (mg/dL)</label>
            <input
              type="text"
              placeholder="Creatinine"
              value={labs.creatinine}
              onChange={(e) => setLabs({ ...labs, creatinine: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* AST */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">AST (mg/dL)</label>
            <input
              type="text"
              placeholder="AST"
              value={labs.ast}
              onChange={(e) => setLabs({ ...labs, ast: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* ALT */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">ALT (mg/dL)</label>
            <input
              type="text"
              placeholder="ALT"
              value={labs.alt}
              onChange={(e) => setLabs({ ...labs, alt: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Bilirubin */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Bilirubin (mg/L)</label>
            <input
              type="text"
              placeholder="Bilirubin"
              value={labs.bilirubin}
              onChange={(e) => setLabs({ ...labs, bilirubin: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* Lactate */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">Lactate (g/dL)</label>
            <input
              type="text"
              placeholder="Lactate"
              value={labs.lactate}
              onChange={(e) => setLabs({ ...labs, lactate: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* TSH */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">TSH (U)</label>
            <input
              type="text"
              placeholder="TSH"
              value={labs.tsh}
              onChange={(e) => setLabs({ ...labs, tsh: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* T3 */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">T3 (U)</label>
            <input
              type="text"
              placeholder="T3"
              value={labs.t3}
              onChange={(e) => setLabs({ ...labs, t3: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>

          {/* T4 */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#94a3b8] tracking-wide">T4 (U)</label>
            <input
              type="text"
              placeholder="T4"
              value={labs.t4}
              onChange={(e) => setLabs({ ...labs, t4: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
            />
          </div>
        </div>

        {/* Submit block */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2e3d]/40">
          <button
            type="submit"
            disabled={submitting || !selectedPatientId}
            className="px-6 py-3 bg-[#0ba5e9] hover:bg-[#38bdf8] text-black text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {submitting ? 'Registering Lab...' : 'Save Lab Findings'}
          </button>
        </div>
      </form>
    </div>
  );
}
