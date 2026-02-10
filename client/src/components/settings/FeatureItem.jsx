import React from 'react';
import { CheckCircle } from 'lucide-react';

const FeatureItem = ({ text, dark }) => (
  <div className={`flex items-center gap-2 text-sm font-medium ${dark ? 'text-indigo-100' : 'text-slate-400'}`}>
    <CheckCircle size={16} className={dark ? "text-indigo-300" : "text-slate-500"} />
    {text}
  </div>
);

export default FeatureItem;