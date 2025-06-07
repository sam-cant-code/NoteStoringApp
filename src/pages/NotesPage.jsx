import { useState, useEffect } from 'react';
import {
  collection, query, where, onSnapshot, addDoc,
  updateDoc, deleteDoc, doc, orderBy
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
      <Navbar search={search} setSearch={setSearch} />

      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-6 sm:py-6">

        {/* Sort Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 pb-4 gap-3 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-yellow-700">
            {auth.currentUser?.displayName?.split(' ')[0] || 'User'}'s Notes
          </h1>
          <button
            onClick={toggleSort}
            className="flex items-center gap-2 bg-white/80 backdrop-blur hover:bg-yellow-100 rounded-full px-4 py-2 transition-colors text-sm shadow-sm"
          >
            <img src={SortIcon} alt="Sort" className="w-5 h-5" />
            <span className="text-yellow-700">Sort by {sortOrder}</span>
          </button>
        </div>

        {/* Notes List */}
        <div className="pb-24 sm:pb-8">
          <NoteList
            notes={sortedAndFilteredNotes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onEditNote={handleEditNote}
            onPinNote={handlePinNote}
          />
        </div>

        {/* Floating Add Note Button */}
        <button
          className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full w-12 h-12 sm:w-16 sm:h-16 shadow-xl text-2xl sm:text-3xl flex items-center justify-center z-50 transition-all duration-300 active:scale-95"
          onClick={handleAddNote}
          aria-label="Add Note"
        >
          <span className="group-hover:rotate-90 transition-transform duration-300 ease-in-out origin-center">+</span>
        </button>

      </div>
    </div>
  );
}

export default NotesPage;
