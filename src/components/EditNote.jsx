import { useState, useEffect, useRef } from 'react';

const EditNote = ({ id, initialTitle, initialText, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  return (
    <div className="w-full">
      <input
        ref={titleInputRef}
        type="text"
        className="w-full text-2xl font-bold mb-4 bg-yellow-100 rounded p-2 focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title..."
        maxLength={50}
      />
      <textarea
        className="w-full text-lg mb-6 bg-yellow-100 rounded p-2 min-h-[200px] focus:outline-none resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter note content..."
        maxLength={200}
      />
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition-colors"
          onClick={() => onSave(id, title, text)}
        >
          Save
        </button>
        <button
          className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditNote;