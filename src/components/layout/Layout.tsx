import { Outlet, Link, useLocation } from 'react-router-dom';

export const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Invoix<span className="text-blue-600">.</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={`${isActive('/')} transition-colors`}>
              Home
            </Link>
            <Link to="/create" className={`${isActive('/create')} transition-colors`}>
              Create
            </Link>
            <Link to="/invoices" className={`${isActive('/invoices')} transition-colors`}>
              Invoices
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Invoix. All invoices are stored locally on your device.</p>
          <div className="flex gap-4 text-gray-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-blue-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
