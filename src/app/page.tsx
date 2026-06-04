
'use client';

import { ActionGrid } from '@/components/cashier/ActionGrid';
import { useState, useEffect } from 'react';

export default function CashierPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="pt-4">
        <ActionGrid />
      </div>
    </div>
  );
}
