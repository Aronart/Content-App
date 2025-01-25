'use client';

import { GlobalConfigForm } from './GlobalConfigForm';

export function GlobalConfigPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Global Settings</h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <GlobalConfigForm />
        </div>
      </div>
    </div>
  );
}
