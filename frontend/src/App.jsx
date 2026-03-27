import React from 'react';
import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DateProvider, useDate } from './context/DateContext';
import { Settings, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Menu, ArrowLeft } from 'lucide-react';
import { format, subDays, addDays, isToday } from 'date-fns';
import Sidebar from './components/Sidebar';
import PageWrapper from './components/PageWrapper';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Schedule from './pages/Schedule';
import Learning from './pages/Learning';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import Summary from './pages/Summary';
import AddHabit from './pages/AddHabit';
import DailyHabitCheck from './pages/DailyHabitCheck';
import Notes from './pages/Notes';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Topbar = ({ toggleMobileMenu }) => {
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!user) return null;

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => {
    if (!isToday(selectedDate)) setSelectedDate(addDays(selectedDate, 1));
  };
  const handleSetToday = () => setSelectedDate(new Date());

  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

  return (
    <header className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border-b border-slate-100 bg-white z-10 relative gap-4">
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-slate-500 hover:text-primary-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white transition-all flex items-center gap-1.5 px-3 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-tight">Back</span>
          </button>
        )}

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button onClick={handlePrevDay} className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500"/></button>
          <div className="flex items-center gap-2 px-3 min-w-40 justify-center">
            <CalendarIcon className="w-4 h-4 text-primary-500" />
            <span className="font-bold text-slate-700">{format(selectedDate, 'MMM dd, yyyy')}</span>
          </div>
          <button 
            onClick={handleNextDay} 
            disabled={isToday(selectedDate)}
            className={`p-1 rounded-lg transition-colors ${isToday(selectedDate) ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-white text-slate-500'}`}
          >
            <ChevronRight className="w-5 h-5"/>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <Link to="/settings" className="p-2 text-slate-400 hover:text-primary-600 bg-slate-50 border border-slate-100 rounded-full hover:bg-white transition-all">
          <Settings className="w-5 h-5" />
        </Link>
        <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full hover:bg-white transition-all group">
          <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="font-semibold text-sm pr-2 text-slate-700 hidden sm:inline">{user.full_name || 'Profile'}</span>
        </Link>
      </div>
    </header>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans relative">
      {user && (
        <Sidebar 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      )}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <div className="flex-1 overflow-y-auto relative p-4 md:p-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
              <Route path="/dashboard" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
              <Route path="/habits" element={<PrivateRoute><PageWrapper><Habits /></PageWrapper></PrivateRoute>} />
              <Route path="/schedule" element={<PrivateRoute><PageWrapper><Schedule /></PageWrapper></PrivateRoute>} />
              <Route path="/learning" element={<PrivateRoute><PageWrapper><Learning /></PageWrapper></PrivateRoute>} />
              <Route path="/tasks" element={<PrivateRoute><PageWrapper><Tasks /></PageWrapper></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
              <Route path="/summary" element={<PrivateRoute><PageWrapper><Summary /></PageWrapper></PrivateRoute>} />
              <Route path="/add-habit" element={<PrivateRoute><PageWrapper><AddHabit /></PageWrapper></PrivateRoute>} />
              <Route path="/daily-check" element={<PrivateRoute><PageWrapper><DailyHabitCheck /></PageWrapper></PrivateRoute>} />
              <Route path="/notes" element={<PrivateRoute><PageWrapper><Notes /></PageWrapper></PrivateRoute>} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DateProvider>
        <AppContent />
      </DateProvider>
    </AuthProvider>
  );
}

export default App;
