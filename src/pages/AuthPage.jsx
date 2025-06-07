import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useState } from 'react';

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/notes');
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: "Create Notes Instantly",
      desc: "Quickly jot down your thoughts, ideas, and reminders with ease.",
      icon: "📝"
    },
    {
      title: "Organize & Pin",
      desc: "Pin important notes and keep your workspace organized.",
      icon: "📌"
    },
    {
      title: "Edit & Delete",
      desc: "Easily update or remove notes as your ideas evolve.",
      icon: "✏️"
    },
    {
      title: "Sync Across Devices",
      desc: "Access your notes anywhere, anytime—securely in the cloud.",
      icon: "☁️"
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 font-sans px-4">
      <div className="w-full max-w-lg text-center mt-12">
        <h1 className="text-4xl sm:text-5xl font-black text-yellow-600 animate-slide-down font-title">
          <span
            className="text-yellow-500"
            style={{ textShadow: '0 0 4px #fff, 0 0 8px #fff' }}
          >
            MyNotes
          </span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-700 font-semibold font-body animate-fade-in-slow">
          Your notes, everywhere. Fast, simple, and always in sync.
        </p>
        <p className="mt-2 text-sm sm:text-base text-gray-700 font-medium font-body animate-fade-in-slow">
          The fastest way to capture, organize, and access your notes anywhere.
        </p>
      </div>

      <div className="w-full flex justify-center mt-10">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`animate-pop-up-from-bottom w-full max-w-xs flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 border-none rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-white font-bold text-lg sm:text-xl shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-6 h-6"
          />
          {loading ? (
            <span className="animate-pulse font-body">Signing in...</span>
          ) : (
            <span className="font-body">Get Started</span>
          )}
        </button>
      </div>

      <div className="w-full flex flex-wrap justify-center gap-6 sm:gap-8 mt-14 px-2 sm:px-4">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="flex-1 min-w-[180px] max-w-xs bg-white/90 rounded-2xl shadow-lg border border-yellow-200 p-6 sm:p-7 flex flex-col items-center text-center animate-pop-up"
            style={{ animationDelay: `${0.3 + idx * 0.2}s` }}
          >
            <div className="text-4xl sm:text-5xl mb-3">{feature.icon}</div>
            <div className="font-title text-lg sm:text-2xl font-bold text-yellow-600 mb-2">
              {feature.title}
            </div>
            <div className="font-body text-sm sm:text-base text-gray-700">{feature.desc}</div>
          </div>
        ))}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700;900&family=Quicksand:wght@400;600;700&display=swap');
          .font-title {
            font-family: 'Fira Sans', 'Montserrat', Arial, sans-serif;
            letter-spacing: 0.02em;
          }
          .font-body {
            font-family: 'Quicksand', 'Inter', Arial, sans-serif;
            letter-spacing: 0.01em;
          }
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-slide-down {
            animation: slide-down 0.7s ease-out both;
          }
          @keyframes fade-in-slow {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in-slow {
            animation: fade-in-slow 1.2s 0.3s both;
          }
          @keyframes pop-up {
            0% { opacity: 0; transform: translateY(60px) scale(0.8);}
            60% { opacity: 1; transform: translateY(-10px) scale(1.05);}
            100% { opacity: 1; transform: translateY(0) scale(1);}
          }
          .animate-pop-up {
            animation: pop-up 0.8s ease-out both;
          }
          @keyframes pop-up-from-bottom {
            0% { opacity: 0; transform: translateY(80px) scale(0.9);}
            60% { opacity: 1; transform: translateY(-8px) scale(1.04);}
            100% { opacity: 1; transform: translateY(0) scale(1);}
          }
          .animate-pop-up-from-bottom {
            animation: pop-up-from-bottom 1s ease-out both;
          }
        `}
      </style>
    </div>
  );
}

export default AuthPage;
