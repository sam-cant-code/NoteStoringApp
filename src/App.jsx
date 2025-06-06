import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AuthPage from './pages/AuthPage';
import NotesPage from './pages/NotesPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/notes" /> : <AuthPage />} 
        />
        <Route 
          path="/notes" 
          element={user ? <NotesPage /> : <Navigate to="/" />} 
        />
        {/* Catch all route - redirect to home */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;