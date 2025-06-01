import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import NoteList from './components/NoteList';
import SortIcon from './reactIcons/sortIcon.png';

function App() {
  // Initialize state with data from localStorage or defaults
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(() => {
    const savedSort = localStorage.getItem('sortOrder');
    return savedSort || "newest";
  });

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Save sort order to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  const handleAddNote = () => {
    if (notes.some(note => note.isEditing)) return;
    setNotes([
      ...notes,
      {
        id: nanoid(),
        title: "",
        text: "",
        createdAt: Date.now(),
        isEditing: true,
        pinned: false,
      },
    ]);
  };

  const handleSaveNote = (id, title, text) => {
    setNotes(
      notes.map(note =>
        note.id === id ? { ...note, title, text, isEditing: false } : note
      )
    );
  };

  const handleDeleteNote = id => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = id => {
    setNotes(
      notes.map(note =>
        note.id === id ? { ...note, isEditing: true } : note
      )
    );
  };

  const handlePinNote = id => {
    setNotes(
      notes.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const toggleSort = () => {
    setSortOrder(current => current === "newest" ? "oldest" : "newest");
  };

  // Filter and sort notes
  const sortedAndFilteredNotes = [...notes]
    .filter(note => note.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      return sortOrder === "newest" 
        ? b.createdAt - a.createdAt 
        : a.createdAt - b.createdAt;
    });

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-between px-6 py-4">
        <SearchBar value={search} onChange={setSearch} />
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
  );
}

export default App;
