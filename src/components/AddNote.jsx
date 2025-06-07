import { useState, useEffect, useRef } from 'react';
import DeleteIcon from '../reactIcons/deleteIcon.png';
import { motion } from 'framer-motion';


const AddNote = ({ id, onSave, onDelete, initialTitle = '', initialText = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const titleInputRef = useRef(null);
  const noteRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleBlur = (e) => {
  if (!noteRef.current.contains(e.relatedTarget)) {
    if (title.trim() || text.trim()) {
      const finalTitle = title.trim() ? title : 'Untitled Note';
      onSave(id, finalTitle, text);
    } else {
      onDelete(id);
    }
  }
};


  return (
    <div 
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
      onBlur={handleBlur}
    >
      <div
        ref={noteRef}
        className="bg-white rounded-lg p-6 shadow-2xl w-[90%] max-w-2xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <input
          type="text"
          ref={titleInputRef}
          className="w-full text-2xl font-bold mb-4 bg-white rounded p-2 focus:outline-none"
          placeholder="Enter Title..."
          maxLength={50}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          rows="8"
          className="w-full text-lg mb-6 bg-white rounded p-2 focus:outline-none resize-none"
          placeholder="Enter note content..."
          maxLength={200}
          value={text}
          onChange={e => setText(e.target.value)}
        ></textarea>
        <div className="flex items-center justify-between">
          <small className="text-gray-500">{200 - text.length} remaining</small>
          <img
            src={DeleteIcon}
            alt="DeleteButton"
            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onDelete(id)}
            title="Delete"
          />
        </div>
      </div>
    </div>
  );
};

export default AddNote;
