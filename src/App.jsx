import NoteList from './components/NoteList'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'

import { useState } from 'react'
import { nanoid } from 'nanoid'

function App() {
  const [notes, setNotes] = useState([]);

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
        pinned: false
      }
    ]);
  };

  const handleSaveNote = (id, title, text) => {
    setNotes(notes =>
      notes.map(note =>
        note.id === id
          ? { ...note, title, text, isEditing: false }
          : note
      )
    );
  };

  const handleDeleteNote = (id) => {
    setNotes(notes => notes.filter(note => note.id !== id));
  };

  const handleEditNote = (id) => {
    setNotes(notes =>
      notes.map(note =>
        note.id === id
          ? { ...note, isEditing: true }
          : note
      )
    );
  };

  const handlePinNote = (id) => {
    setNotes(notes =>
      notes.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  // Sort notes: pinned first, then by creation date
  const sortedNotes = [
    ...notes.filter(note => note.pinned),
    ...notes.filter(note => !note.pinned)
  ];

  const [searchText, setSearchText] = useState('')

  
  return (
    <div>
      <Navbar/>
      <SearchBar/>
      <NoteList
        notes={sortedNotes}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        onEditNote={handleEditNote}
        onPinNote={handlePinNote}
      />
      <button
        className={`group mb-[5px] fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full w-14 h-14 shadow-lg text-3xl flex items-center justify-center transition-all duration-300 z-50
                    hover:scale-110 hover:shadow-2xl 
                    ${notes.length === 0 ? "animate-pulse ring-4 ring-yellow-300/70" : ""}`}
        onClick={handleAddNote}
        aria-label="Add Note"
      >
        <span className="inline-block transition-transform duration-300 ease-in-out group-hover:rotate-45">
          +
        </span>
      </button>
    </div>
  )
}

export default App