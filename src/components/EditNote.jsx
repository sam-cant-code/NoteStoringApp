import { useState, useEffect, useRef } from 'react';
import DeleteIcon from '../reactIcons/deleteIcon.png';


const EditNote = ({ id, initialTitle, initialText, onSave, onDelete, onCancel }) => {
  const [title, setTitle] = useState(initialTitle || '');
  const [text, setText] = useState(initialText || '');
  const [isAnimated, setIsAnimated] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsAnimated(true), 10);
    // Small delay to ensure the component is rendered before focusing
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim() === '' && text.trim() === '') return;
    onSave(id, title, text);
  };

  const handleCancel = () => {
    setTitle(initialTitle || '');
    setText(initialText || '');
    setIsAnimated(false);
    setTimeout(() => onCancel?.(), 200);
  };

  const handleDelete = () => {
    setIsAnimated(false);
    setTimeout(() => onDelete(id), 200);
  };

  const backdropVariants = {
    hidden: { 
      opacity: 0,
      backdropFilter: 'blur(0px)'
    },
    visible: { 
      opacity: 1,
      backdropFilter: 'blur(8px)'
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out ${
      isAnimated ? 'opacity-100' : 'opacity-0'
    }`} style={{
      backdropFilter: isAnimated ? 'blur(8px)' : 'blur(0px)'
    }}>
      <div className={`bg-white rounded-lg p-6 shadow-2xl w-[90%] max-w-2xl transform transition-all duration-400 ${
        isAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-80 translate-y-12'
      }`} style={{
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Header */}
        <div className="relative mb-4">
          <input
            ref={titleInputRef}
            type="text"
            className={`w-full text-2xl font-bold bg-white rounded p-2 focus:outline-none transition-all duration-200 focus:bg-gray-50 transform ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{
              transitionDelay: isAnimated ? '200ms' : '0ms'
            }}
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
            className={`w-full text-lg bg-white rounded p-2 focus:outline-none resize-none transition-all duration-200 focus:bg-gray-50 transform ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{
              transitionDelay: isAnimated ? '300ms' : '0ms'
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter note content..."
          />
        </div>

        {/* Bottom section with buttons */}
        <div className={`flex items-center justify-end transition-all duration-300 ${
          isAnimated ? 'opacity-100' : 'opacity-0'
        }`} style={{
          transitionDelay: isAnimated ? '400ms' : '0ms'
        }}>
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
              <img
                src={DeleteIcon}
                alt="DeleteButton"
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => {
                  handleCloseModal();
                  onDelete(id);
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNote;