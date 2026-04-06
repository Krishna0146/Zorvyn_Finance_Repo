import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';
import '@/index.css';
import { initializeMockData } from './services/mockData';
import storageService from './services/storageService';
import useTheme from './hooks/useTheme';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import EMIs from './pages/EMIs';
import Fees from './pages/Fees';
import Savings from './pages/Savings';
import Investments from './pages/Investments';
import Trips from './pages/Trips';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    initializeMockData();
    setCurrentUser(storageService.getCurrentUser());
  }, []);

  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUser(storageService.getCurrentUser());
    };
    window.addEventListener('storage', handleUserChange);
    return () => window.removeEventListener('storage', handleUserChange);
  }, []);

  return (
    <div className="App min-h-screen bg-background">
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            currentUser={currentUser}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="max-w-[1600px] mx-auto w-full">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/emis" element={<EMIs />} />
                  <Route path="/fees" element={<Fees />} />
                  <Route path="/savings" element={<Savings />} />
                  <Route path="/investments" element={<Investments />} />
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        
        <Toaster 
          position="top-right" 
          richColors 
          theme={theme}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;