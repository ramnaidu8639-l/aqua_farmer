import React from 'react';
import { Waves, Shield, Phone, Mail, ExternalLink, Heart, AlertOctagon } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenPythonDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenPythonDocs }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-sky-950 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-400 flex items-center justify-center text-slate-950 font-black">
                <Waves className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-lg font-black text-white">Aqua <span className="text-cyan-400">Farmers</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering coastal and inland aquaculture farmers with verified seed hatchery rates, wholesale mandi tracking, and scientific disease advisories.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                <Shield className="w-3.5 h-3.5" /> CAA &amp; NFDB Compliant Standard
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-cyan-400 transition">
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('seed-prices')} className="hover:text-cyan-400 transition">
                  Verified Hatchery Seed Prices
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('market-rates')} className="hover:text-cyan-400 transition">
                  Daily Wholesale Market Rates
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('diseases')} className="hover:text-cyan-400 transition">
                  Seasonal Diseases &amp; Biosecurity
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-cyan-400 transition">
                  Farmer Personal Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Backend Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenPythonDocs} className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                  <span>Python Flask Backend Code</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={onOpenPythonDocs} className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                  <span>MySQL Schema (schema.sql)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={onOpenPythonDocs} className="hover:text-cyan-400 transition">
                  SQLAlchemy Relational Models
                </button>
              </li>
              <li>
                <button onClick={onOpenPythonDocs} className="hover:text-cyan-400 transition">
                  Pytest Automated Test Suite
                </button>
              </li>
              <li>
                <span className="text-slate-500">REST API v1.0 Standard</span>
              </li>
            </ul>
          </div>

          {/* Biosecurity Helpline & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              Emergency Biosecurity
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <p className="text-[11px] leading-relaxed">
                Notice symptoms of WSSV, EHP, or abnormal mortalities? Contact your district fisheries emergency lab:
              </p>
              <div className="font-mono text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> 1800-425-1660 (National Aqua Line)
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> health-support@aquafarmers.in
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Educational Disclaimer */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p className="max-w-3xl text-center md:text-left leading-relaxed">
            <strong>Advisory Notice:</strong> Aqua Farmers provides educational biosecurity advisories and verified mandi auction benchmarks. Market prices are updated by authorized administrators and regional fisheries officers. We strictly do not declare localized disease outbreaks without verified PCR confirmation from accredited fisheries laboratories. Always seek guidance from a licensed aquatic animal pathologist.
          </p>
          <div className="text-slate-400 whitespace-nowrap">
            &copy; {new Date().getFullYear()} Aqua Farmers. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
