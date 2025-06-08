import { useState, useEffect, useRef } from 'react';

const AddNote = ({ id, onSave, onDelete, onCancel, initialTitle = '', initialText = '', isVisible = true }) => {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);
  const [isAnimated, setIsAnimated] = useState(false);
  const titleInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      titleInputRef.current?.focus();
      // Trigger entrance animation
      setTimeout(() => setIsAnimated(true), 10);
    }
  }, [isVisible]);

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim() === '' && text.trim() === '') {
      // If both are empty, just cancel/delete
      onDelete(id);
      return;
    }
    const finalTitle = title.trim() ? title : 'Untitled Note';
    onSave(id, finalTitle, text);
  };

  const handleCancel = () => {
    // Reset to initial values
    setTitle(initialTitle);
    setText(initialText);
    // Call the cancel callback if provided, otherwise delete the note
    if (onCancel) {
      onCancel();
    } else {
      onDelete(id);
    }
  };

  const handleDelete = () => {
    setIsAnimated(false);
    setTimeout(() => onDelete(id), 200);
  };

  const handleBlur = (e) => {
    // Check if the new focus target is still within our form
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget;
    
    // If focus is moving to an element within our form, don't auto-save
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }
    
    // Only auto-save on blur if there's content and no explicit cancel/save action
    if (relatedTarget && (
      relatedTarget.textContent === 'Save Changes' || 
      relatedTarget.textContent === 'Cancel' ||
      relatedTarget.title === 'Delete Note'
    )) {
      return; // Don't auto-save if user clicked on action buttons
    }
    
    if (title.trim() || text.trim()) {
      const finalTitle = title.trim() ? title : 'Untitled Note';
      onSave(id, finalTitle, text);
    } else {
      onDelete(id);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        ref={containerRef}
        className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col transition-all duration-300 ${isAnimated ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onBlur={handleBlur}
      >
        
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
            maxLength={200}
            className="w-full h-64 resize-none border-none outline-none bg-transparent placeholder-gray-400 leading-relaxed"
          />
        </div>

        {/* Subtle divider before bottom section */}
        <div className="border-t border-gray-100 mx-6"></div>

        {/* Bottom section with buttons and character count */}
        <div className="p-6 pt-4">
          <div className="flex items-center justify-between">
            <small className="text-gray-500 transition-colors duration-200">
              {200 - text.length} characters remaining
            </small>
            
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

export default AddNote;