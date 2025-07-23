'use client';

export default function ProtectedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Protected Page</h1>
        <p className="text-gray-700">You have accessed a protected page with a valid API Key.</p>
      </div>
    </div>
  );
} 