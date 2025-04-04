import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Menu, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  const dashboardSubItems = user?.role === 'Administrador' ? [
    { path: '/dashboard?type=senior', label: 'Senior' },
    { path: '/dashboard?type=junior', label: 'Junior' }
  ] : undefined;

  const baseMenuItems = [
    {
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      subItems: dashboardSubItems
    },
    { path: '/clients', icon: <Users className="w-5 h-5" />, label: 'Clientes' },
  ];

  const adminMenuItem = { 
    path: '/settings', 
    icon: <Settings className="w-5 h-5" />, 
    label: 'Configuración' 
  };

  // Only include settings menu item for administrators
  const menuItems = user?.role === 'Administrador' 
    ? [...baseMenuItems, adminMenuItem]
    : baseMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
          <img 
            src="https://logistik.com.py/wp-content/uploads/2019/08/logo.png" 
            alt="Logistik Logo" 
            className="h-8"
          />
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 ${
                  location.pathname === item.path ? 'bg-yellow-50 text-yellow-600' : ''
                }`}
              >
                {item.icon}
                <span className="ml-3 text-sm font-medium">{item.label}</span>
                {item.subItems && <ChevronDown className="w-4 h-4 ml-auto" />}
              </Link>
              {item.subItems && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 ${
                        location.pathname + location.search === subItem.path ? 'bg-yellow-50 text-yellow-600' : ''
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3 text-sm font-medium">Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Menu className="w-6 h-6 text-gray-500" />
            <h1 className="ml-4 text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {user?.name} - {user?.role}
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
