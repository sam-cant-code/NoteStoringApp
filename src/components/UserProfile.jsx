import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Update photoURL when auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.photoURL) {
        setPhotoURL(user.photoURL);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Default avatar if no photoURL is available
  const defaultAvatar = "https://api.dicebear.com/7.x/initials/svg?seed=" + 
    (auth.currentUser?.displayName || "User");

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img 
          src={photoURL || defaultAvatar}
          alt="Profile" 
          className="w-10 h-10 rounded-full border-2 border-yellow-400 shadow-md"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              {auth.currentUser?.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {auth.currentUser?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;