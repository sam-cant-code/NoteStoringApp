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
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col transition-all duration-300 ${isAnimated ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Header */}
        <div className="p-6 pb-4">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title..."
            maxLength={50}
            className="w-full text-xl font-semibold border-none outline-none bg-transparent placeholder-gray-400"
          />
        </div>
        
        {/* Subtle divider after header */}
        <div className="border-t border-gray-100 mx-6"></div>
        
        {/* Content area */}
        <div className="flex-1 p-6 py-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter note content..."
            className="w-full h-64 resize-none border-none outline-none bg-transparent placeholder-gray-400 leading-relaxed"
          />
        </div>

        {/* Subtle divider before bottom section */}
        <div className="border-t border-gray-100 mx-6"></div>

        {/* Bottom section with buttons */}
        <div className="p-6 pt-4">
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
    </div>
  );
};

export default EditNote;