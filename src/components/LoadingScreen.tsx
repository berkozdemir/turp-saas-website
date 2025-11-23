import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <Loader2 size={48} className="animate-spin text-rose-600 mx-auto mb-4" />
      <h2 className="text-slate-600 font-bold text-lg">Turp Yükleniyor...</h2>
    </div>
  </div>
);
