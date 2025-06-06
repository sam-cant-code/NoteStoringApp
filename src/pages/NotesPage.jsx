import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import NoteList from '../components/NoteList';
import SortIcon from '../reactIcons/sortIcon.png';

function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
      return;
    }

    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef, 
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAddNote = async () => {
    if (notes.some(note => note.isEditing)) return;
    
    try {
      await addDoc(collection(db, 'notes'), {
        userId: auth.currentUser.uid,
        title: "",
        text: "",
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
      await updateDoc(doc(db, 'notes', id), {
        title,
        text,
        isEditing: false,
        lastModified: Date.now()
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

  const handleEditNote = async (id) => {
    try {
      await updateDoc(doc(db, 'notes', id), {
        isEditing: true
      });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handlePinNote = async (id) => {
    const note = notes.find(n => n.id === id);
    try {
      await updateDoc(doc(db, 'notes', id), {
        pinned: !note.pinned
      });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const toggleSort = () => {
    setSortOrder(current => current === "newest" ? "oldest" : "newest");
  };

  const sortedAndFilteredNotes = [...notes]
    .filter(note => 
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.text.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      return sortOrder === "newest" 
        ? b.createdAt - a.createdAt 
        : a.createdAt - b.createdAt;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {auth.currentUser?.displayName?.split(' ')[0] || 'User'}!
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="w-full sm:w-auto flex-grow">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div 
            onClick={toggleSort}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full px-3 py-1.5 transition-colors"
          >
            <img 
              src={SortIcon} 
              alt="Sort" 
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Sort by {sortOrder}
            </span>
          </div>
        </div>
        <NoteList
          notes={sortedAndFilteredNotes}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
          onEditNote={handleEditNote}
          onPinNote={handlePinNote}
        />
        <button
          className="group fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full w-14 h-14 shadow-lg text-3xl flex items-center justify-center transition-all duration-300 z-50 hover:-translate-x-2 hover:scale-110 hover:shadow-2xl"
          onClick={handleAddNote}
          aria-label="Add Note"
        >
          <span className="-translate-y-0.75 inline-block transition-transform duration-300 ease-in-out group-hover:rotate-45 origin-center">
            +
          </span>
        </button>
      </div>
    </div>
  );
}

export default NotesPage;