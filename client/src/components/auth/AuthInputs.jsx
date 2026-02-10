import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';

export const InputGroup = ({ label, icon, type, value, onChange, placeholder, isMobileDark }) => (
    <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${isMobileDark ? 'text-slate-300 lg:text-slate-500' : 'text-slate-500'}`}>{label}</label>
        <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isMobileDark ? 'text-slate-400 group-focus-within:text-indigo-400 lg:group-focus-within:text-indigo-500' : 'text-slate-400'}`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 lg:py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-600 lg:placeholder:text-slate-400 
                ${isMobileDark
                    ? 'bg-slate-900/50 lg:bg-slate-50 border-slate-700 lg:border-slate-200 text-white lg:text-slate-900 focus:ring-indigo-500/50 lg:focus:ring-indigo-500/20 focus:border-indigo-400 lg:focus:border-indigo-500 focus:bg-slate-800 lg:focus:bg-white'
                    : 'bg-slate-50 border-slate-200'
                }`}
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

const ReqItem = ({ met, text, isMobileDark }) => (
    <div className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors duration-300 ${met ? "text-emerald-400 lg:text-emerald-600" : (isMobileDark ? "text-slate-500 lg:text-slate-300" : "text-slate-300")}`}>
        <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${met ? "bg-emerald-500 border-emerald-500" : (isMobileDark ? "border-slate-600 lg:border-slate-200" : "border-slate-200")}`}>
            {met && <CheckCircle2 size={10} className="text-white" />}
        </div>
        <span>{text}</span>
    </div>
);

export const PasswordInput = ({ value, onChange, showValidation, label = "Contraseña", isMobileDark, placeholder = "••••••••" }) => (
    <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${isMobileDark ? 'text-slate-300 lg:text-slate-500' : 'text-slate-500'}`}>{label}</label>
        <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isMobileDark ? 'text-slate-400 group-focus-within:text-indigo-400 lg:group-focus-within:text-indigo-500' : 'text-slate-400'}`}>
                <Lock size={20} />
            </div>
            <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 lg:py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium tracking-wide placeholder:text-slate-600 lg:placeholder:text-slate-400
                ${isMobileDark
                    ? 'bg-slate-900/50 lg:bg-slate-50 border-slate-700 lg:border-slate-200 text-white lg:text-slate-900 focus:ring-indigo-500/50 lg:focus:ring-indigo-500/20 focus:border-indigo-400 lg:focus:border-indigo-500 focus:bg-slate-800 lg:focus:bg-white'
                    : 'bg-slate-50 border-slate-200'
                }`}
                placeholder={placeholder}
                required
            />
        </div>
        {showValidation && (
            <div className="mt-3 grid grid-cols-2 gap-2">
                <ReqItem met={value.length >= 6} text="Mín. 6 caracteres" isMobileDark={isMobileDark} />
                <ReqItem met={/[A-Z]/.test(value)} text="Mayúscula" isMobileDark={isMobileDark} />
                <ReqItem met={/\d/.test(value)} text="Número" isMobileDark={isMobileDark} />
                <ReqItem met={/[!@#$%^&*]/.test(value)} text="Símbolo" isMobileDark={isMobileDark} />
            </div>
        )}
    </div>
);