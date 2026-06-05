import React from 'react';

const Toggle = ({ enabled, onChange }) => (
  <button aria-label="Interactive control" type="button" onClick={onChange} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
    <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

export default Toggle;