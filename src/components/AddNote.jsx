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
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 lg:p-8 z-50 transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        ref={containerRef}
        className={`bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl h-full sm:h-auto sm:max-h-[90vh] lg:max-h-[85vh] flex flex-col transition-all duration-300 ${isAnimated ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onBlur={handleBlur}
      >
        
        {/* Header - More compact on mobile */}
        <div className="p-4 sm:p-6 lg:p-8 pb-3 sm:pb-4 lg:pb-6">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title..."
            maxLength={50}
            className="w-full text-lg sm:text-xl lg:text-2xl font-semibold border-none outline-none bg-transparent placeholder-gray-400"
          />
        </div>
        
        {/* Subtle divider after header */}
        <div className="border-t border-gray-100 mx-4 sm:mx-6 lg:mx-8"></div>
        
        {/* Content area - Flexible height on mobile */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 py-3 sm:py-4 lg:py-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter note content..."
            maxLength={200}
            className="w-full h-full min-h-[200px] sm:h-64 lg:h-80 xl:h-96 resize-none border-none outline-none bg-transparent placeholder-gray-400 leading-relaxed text-base lg:text-lg"
          />
        </div>

        {/* Subtle divider before bottom section */}
        <div className="border-t border-gray-100 mx-4 sm:mx-6 lg:mx-8"></div>

        {/* Bottom section with buttons and character count - Mobile-optimized layout */}
        <div className="p-4 sm:p-6 lg:p-8 pt-3 sm:pt-4 lg:pt-6 safe-area-inset-bottom">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            
            {/* Character count - Top on mobile, left on desktop */}
            <small className="text-gray-500 transition-colors duration-200 text-center sm:text-left order-2 sm:order-1">
              {200 - text.length} characters remaining
            </small>
            
            {/* Button group - Bottom on mobile, right on desktop */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 order-1 sm:order-2">
              
              {/* Primary actions - Full width on mobile, grouped on desktop */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium rounded-lg sm:rounded transition-all duration-200 shadow-sm hover:shadow-md transform active:scale-95 text-base sm:text-sm"
                >
                  Save Changes
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-medium rounded-lg sm:rounded transition-all duration-200 shadow-sm hover:shadow-md transform active:scale-95 text-base sm:text-sm"
                >
                  Cancel
                </button>
              </div>
              
              {/* Delete button - Prominent on mobile, compact on desktop */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full sm:w-auto sm:h-8 px-4 py-3 sm:p-0 text-red-500 hover:text-red-600 active:text-red-700 hover:bg-red-50 sm:hover:bg-transparent rounded-lg sm:rounded-none cursor-pointer transition-all duration-200 transform active:scale-95 font-medium sm:font-normal border border-red-200 sm:border-none"
                onClick={handleDelete}
                title="Delete Note"
              >
                <span className="text-lg sm:text-base">🗑️</span>
                <span className="sm:hidden">Delete Note</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;