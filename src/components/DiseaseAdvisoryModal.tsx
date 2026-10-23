import React from 'react';
import { X, AlertTriangle, ShieldCheck, HelpCircle, Thermometer, Droplets, BookOpen, Stethoscope } from 'lucide-react';
import { DiseaseAdvisory } from '../types';

interface DiseaseAdvisoryModalProps {
  advisory: DiseaseAdvisory | null;
  onClose: () => void;
}

export const DiseaseAdvisoryModal: React.FC<DiseaseAdvisoryModalProps> = ({ advisory, onClose }) => {
  if (!advisory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-sky-950 via-teal-900 to-sky-900 text-white rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                advisory.risk_level === 'High'
                  ? 'bg-rose-500 text-white'
                  : advisory.risk_level === 'Moderate'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {advisory.risk_level} Risk Level
            </span>

            <span className="text-xs bg-sky-800/80 text-sky-200 px-3 py-1 rounded-full border border-sky-700">
              {advisory.category.toUpperCase()} ADVISORY
            </span>

            {advisory.is_outbreak ? (
              <span className="text-xs bg-red-600 text-white font-bold px-3 py-1 rounded-full animate-pulse">
                CONFIRMED LOCAL OUTBREAK
              </span>
            ) : (
              <span className="text-xs bg-teal-800 text-teal-200 px-3 py-1 rounded-full border border-teal-700">
                Educational Advisory Only
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black text-white">{advisory.disease_name}</h2>
          <p className="text-sky-200 text-sm mt-1">
            Target Host: <span className="font-semibold text-white">{advisory.affected_species}</span>
          </p>
        </div>

        {/* Mandatory Health Disclaimer Callout */}
        <div className="mx-6 mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <Stethoscope className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold uppercase tracking-wider text-amber-800">
              Aquatic Health Professional Advisory
            </p>
            <p className="leading-relaxed">
              {advisory.disclaimer ||
                'This bulletin provides general biosecurity and management guidelines. Do not claim an active outbreak is occurring without verified clinical PCR confirmation. Consult a certified aquatic animal health professional or state fisheries diagnostic laboratory before introducing medications or drain harvesting.'}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Environmental Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm mb-1">
                <Thermometer className="w-4 h-4 text-sky-600" />
                Seasonal Peak Risk Period
              </div>
              <p className="text-xs font-semibold text-sky-800">{advisory.seasonal_risk_period}</p>
            </div>

            <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-100">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm mb-1">
                <Droplets className="w-4 h-4 text-teal-600" />
                Favorable Environmental Triggers
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">{advisory.favorable_conditions}</p>
            </div>
          </div>

          {/* Observable Symptoms */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Observable Symptoms in Ponds
            </h4>
            <ul className="space-y-2">
              {advisory.symptoms.map((symptom, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Biosecurity & Prevention Measures */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Pond Biosecurity &amp; Prevention Checklist
            </h4>
            <div className="space-y-2">
              {advisory.prevention_measures.map((measure, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span className="pt-0.5 leading-relaxed">{measure}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Recommended Emergency Protocol
            </h4>
            <div className="space-y-2">
              {advisory.recommended_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-700 bg-sky-50/60 p-3 rounded-lg border border-sky-100 leading-relaxed"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Source: <strong className="text-slate-700">{advisory.source}</strong></span>
          </div>
          <div>Published: {advisory.publication_date}</div>
        </div>
      </div>
    </div>
  );
};
