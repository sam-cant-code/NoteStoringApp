import { useState, useEffect, useRef } from 'react';
import DeleteIcon from '../reactIcons/deleteIcon.png';

const EditNote = ({ id, initialTitle, initialText, onSave, onDelete }) => {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim() === "" && text.trim() === "") return;
    onSave(id, title, text);
  };

  return (
    <form
      className="w-full bg-white rounded-xl p-5 shadow-lg flex flex-col gap-3 border border-yellow-200"
      onSubmit={handleSave}
    >
      <input
        ref={titleInputRef}
        type="text"
        className="w-full text-2xl font-bold mb-4 bg-white rounded p-2 focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title..."
        maxLength={50}
      />
      <textarea
        className="w-full text-lg mb-6 bg-white rounded p-2 min-h-[200px] focus:outline-none resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter note content..."
        maxLength={200}
      />
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors shadow"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="p-2 bg-transparent hover:bg-red-100 rounded-lg transition-colors shadow"
          onClick={() => onDelete(id)}
          title="Delete"
        >
          <img src={DeleteIcon} alt="Delete" className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default EditNote;