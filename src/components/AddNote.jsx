import { useState, useEffect, useRef } from 'react';


const EditNote = ({ id, initialTitle, initialText, onSave, onDelete, onCancel }) => {
  const [title, setTitle] = useState(initialTitle || '');
  const [text, setText] = useState(initialText || '');
  const [isAnimated, setIsAnimated] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
    // Trigger entrance animation
    setTimeout(() => setIsAnimated(true), 10);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim() === '' && text.trim() === '') return;
    onSave(id, title, text);
  };

  const handleCancel = () => {
    setTitle(initialTitle || '');
    setText(initialText || '');
    onCancel?.();
  };

  const handleDelete = () => {
    setIsAnimated(false);
    setTimeout(() => onDelete(id), 200);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out ${
      isAnimated ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white rounded-lg p-6 shadow-2xl w-[90%] max-w-2xl transform transition-all duration-300 ${
        isAnimated ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Header */}
        <div className="relative mb-4">
          <input
            ref={titleInputRef}
            type="text"
            className="w-full text-2xl font-bold bg-white rounded p-2 focus:outline-none transition-all duration-200 focus:bg-gray-50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title..."
            maxLength={50}
          />
        </div>

        {/* Content area */}
        <div className="relative mb-6">
          <textarea
            rows="8"
            className="w-full text-lg bg-white rounded p-2 focus:outline-none resize-none transition-all duration-200 focus:bg-gray-50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter note content..."
          />
        </div>

        {/* Bottom section with buttons */}
        <div className="flex items-center justify-end">
          <div className="flex gap-3">
            <button
              type="submit"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
            >
              Save Changes
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            
            <button
              type="button"
              className="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer transition-all duration-200 transform hover:scale-110 active:scale-95"
              onClick={handleDelete}
              title="Delete Note"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNote;