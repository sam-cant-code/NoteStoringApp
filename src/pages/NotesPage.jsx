import { useState, useEffect } from 'react';
import {
  collection, query, where, onSnapshot, addDoc,
  updateDoc, deleteDoc, doc, orderBy
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import NoteList from '../components/NoteList';
import SortIcon from '../reactIcons/sortIcon.png';

function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
        return;
      }

      const notesRef = collection(db, 'notes');
      const q = query(
        notesRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribeNotes = onSnapshot(
        q,
        (snapshot) => {
          const notesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotes(notesData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching notes:', error);
          setLoading(false);
        }
      );

      return unsubscribeNotes;
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleAddNote = async () => {
    if (notes.some((note) => note.isEditing)) return;
    try {
      await addDoc(collection(db, 'notes'), {
        userId: auth.currentUser.uid,
        title: '',
        text: '',
        createdAt: Date.now(),
        lastModified: Date.now(),
        isEditing: true,
        pinned: false,
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleSaveNote = async (id, title, text) => {
    try {
      const finalTitle = title.trim() || 'Untitled Note';
      await updateDoc(doc(db, 'notes', id), {
        title: finalTitle,
        text,
        isEditing: false,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Updated to handle both starting edit mode and saving changes
  const handleEditNote = async (id, title, text) => {
    try {
      if (title !== undefined && text !== undefined) {
        // This is a save operation
        const finalTitle = title.trim() || 'Untitled Note';
        await updateDoc(doc(db, 'notes', id), {
          title: finalTitle,
          text,
          isEditing: false,
          lastModified: Date.now(),
        });
      } else {
        // This is starting edit mode
        await updateDoc(doc(db, 'notes', id), {
          isEditing: true,
        });
      }
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  const handleCancelEdit = async (id) => {
    try {
      await updateDoc(doc(db, 'notes', id), {
        isEditing: false,
      });
    } catch (error) {
      console.error('Error canceling edit:', error);
    }
  };

  const handlePinNote = async (id) => {
    const note = notes.find((n) => n.id === id);
    try {
      await updateDoc(doc(db, 'notes', id), {
        pinned: !note.pinned,
      });
    } catch (error) {
      console.error('Error pinning note:', error);
    }
  };

  const toggleSort = () => {
    setSortOrder((current) => (current === 'newest' ? 'oldest' : 'newest'));
  };

  const sortedAndFilteredNotes = [...notes]
    .filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.text.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      return sortOrder === 'newest'
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-yellow-700 text-sm font-medium animate-pulse">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed background that covers entire viewport */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 -z-10"></div>
      
      <div className="min-h-screen overflow-x-hidden">
        <Navbar search={search} setSearch={setSearch} />
        
        {/* Main content container with improved responsive padding */}
        <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Header section with enhanced responsive layout */}
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between pt-3 xs:pt-4 sm:pt-6 pb-2 xs:pb-3 sm:pb-4 gap-2 xs:gap-3">
            {/* User name header with improved text handling */}
            <div className="min-w-0 flex-1 xs:flex-none xs:max-w-[60%] sm:max-w-none">
              <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-yellow-700">
                <span className="block truncate">
                  {auth.currentUser?.displayName?.split(' ')[0] || 'User'}'s Notes
                </span>
              </h1>
            </div>
            
            {/* Sort button with improved responsive design */}
            <div className="flex items-center justify-between xs:justify-end gap-3">
              {/* Mobile notes count */}
              <div className="block xs:hidden flex-1 min-w-0">
                <span className="text-xs text-yellow-600/80 block truncate">
                  {sortedAndFilteredNotes.length} note{sortedAndFilteredNotes.length !== 1 ? 's' : ''}
                  {search && ` found`}
                </span>
              </div>
              
              <button
                onClick={toggleSort}
                className="flex items-center gap-1.5 xs:gap-2 bg-white/80 backdrop-blur hover:bg-yellow-100 active:bg-yellow-200 rounded-full px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md flex-shrink-0 border border-white/50"
                aria-label={`Sort notes by ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
              >
                <img 
                  src={SortIcon} 
                  alt="Sort" 
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-200 hover:rotate-180" 
                />
                <span className="text-yellow-700 whitespace-nowrap font-medium">
                  <span className="hidden xs:inline">Sort by </span>
                  {sortOrder}
                </span>
              </button>
            </div>
          </div>

          {/* Enhanced search results indicator */}
          {search && (
            <div className="pb-2 xs:pb-3">
              <div className="bg-white/60 backdrop-blur rounded-lg px-3 py-2 border border-white/50">
                <p className="text-xs sm:text-sm text-yellow-700">
                  {sortedAndFilteredNotes.length > 0 ? (
                    <>
                      Found <span className="font-semibold">{sortedAndFilteredNotes.length}</span> note
                      {sortedAndFilteredNotes.length !== 1 ? 's' : ''} matching 
                      <span className="font-semibold break-all"> "{search}"</span>
                    </>
                  ) : (
                    <>No notes found for <span className="font-semibold break-all">"{search}"</span></>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* MOVED: Enhanced empty state with better responsive design - NOW IN THE MIDDLE */}
          {!loading && sortedAndFilteredNotes.length === 0 && (
            <div className="text-center py-12 xs:py-16 sm:py-20 md:py-24 px-3 xs:px-4">
              <div className="max-w-sm mx-auto">
                {search ? (
                  <div className="space-y-4">
                    {/* Search icon or illustration could go here */}
                    <div className="text-5xl xs:text-6xl sm:text-7xl mb-6 grayscale">🔍</div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-600 mb-3">
                      No notes found
                    </h3>
                    <p className="text-gray-500 text-base xs:text-lg break-words px-2 mb-4">
                      No notes match "<span className="font-medium">{search}</span>"
                    </p>
                    <p className="text-gray-400 text-sm xs:text-base">
                      Try adjusting your search or{' '}
                      <button 
                        onClick={() => setSearch('')}
                        className="text-gray-600 underline hover:text-gray-700 font-medium"
                      >
                        clear search
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Welcome illustration */}
                    <div className="text-5xl xs:text-6xl sm:text-7xl mb-6 grayscale">📝</div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-600 mb-3">
                      Start taking notes
                    </h3>
                    <p className="text-gray-500 text-base xs:text-lg mb-6">
                      Your notes will appear here
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm xs:text-base">
                      <span>Tap the</span>
                      <div className="inline-flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 bg-gray-400 text-white rounded-full text-lg xs:text-xl font-bold shadow-md">
                        +
                      </div>
                      <span>button to create your first note</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes List with improved responsive spacing - only shows when there are notes */}
          {!loading && sortedAndFilteredNotes.length > 0 && (
            <div className="pb-24 xs:pb-20 sm:pb-16 md:pb-12 lg:pb-8">
              <NoteList
                notes={sortedAndFilteredNotes}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
                onEditNote={handleEditNote}
                onCancelEdit={handleCancelEdit}
                onPinNote={handlePinNote}
              />
            </div>
          )}

          {/* Enhanced Add Note Floating Button with better responsive positioning */}
          <button
            className={`group fixed bottom-4 right-3 xs:bottom-5 xs:right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-white font-bold rounded-full w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl active:shadow-md text-xl xs:text-2xl sm:text-3xl flex items-center justify-center z-50 transition-all duration-300 active:scale-95 touch-manipulation border-2 border-white/20 ${
              notes.some((note) => note.isEditing) 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-110'
            }`}
            onClick={handleAddNote}
            aria-label="Add new note"
            disabled={notes.some((note) => note.isEditing)}
          >
            <span className="group-hover:rotate-[135deg] transition-transform duration-300 ease-in-out origin-center">
              +
            </span>
            
            {/* Tooltip for larger screens */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
              Add new note
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

export default NotesPage;