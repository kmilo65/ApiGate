import Link from "next/link";

export default function Sidebar({ className = "" }) {
  return (
    <aside className={`w-64 h-full min-h-screen bg-white shadow-md rounded-r-2xl flex flex-col p-6 overflow-hidden transition-all duration-300 z-30 ${className}`}>
      {/* Logo/Title */}
      <div className="mb-10">
        <span className="text-3xl font-bold text-gray-900">ApiGate AI</span>
      </div>
      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboards" className="flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
              Overview
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v-1a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>
              Research Assistant
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>
              Research Reports
            </Link>
          </li>
          <li>
            <Link href="/playground" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18v-1a4 4 0 00-3-3.87M12 3v1m0 16v1m8-9h1M3 12H2m15.36 6.36l.71.71M6.34 6.34l-.71-.71M17.66 6.34l.71-.71M6.34 17.66l-.71.71" /></svg>
              API Playground
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>
              Invoices
            </Link>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4h9m-9 8h9" /></svg>
              Documentation
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6m5-1l-7 7m0 0l7-7m-7 7V3" /></svg>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
} 