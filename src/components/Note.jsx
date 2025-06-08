import { useState } from 'react';
import PinIcon from '../reactIcons/pinIcon.png';
import PinIconFilled from '../reactIcons/pinIconFilled.png';
import DeleteIcon from '../reactIcons/deleteIcon.png';
import EditIcon from '../reactIcons/editIcon.png';
import EditNote from './EditNote';

const Note = ({ id, title, text, createdAt, updatedAt, onDelete, onEdit, onCancelEdit, pinned, onPin, isEditing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [isPinAnimating, setIsPinAnimating] = useState(false);

  // Function to get relative time
  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  // Function to get time display text
  const getTimeDisplay = () => {
    if (updatedAt && updatedAt !== createdAt) {
      return `Edited ${getRelativeTime(updatedAt)}`;
    } else {
      return `Created ${getRelativeTime(createdAt)}`;
    }
  };

  const handleNoteClick = (e) => {
    // Prevent modal from opening if clicking an icon, if already open, or if in database edit mode
    if (e.target.tagName === 'IMG' || isModalOpen || isEditing) return;
    setIsModalOpen(true);
    setIsEditingLocal(true); // Automatically go to edit mode
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    // Don't open local edit if already in database edit mode
    if (isEditing) return;
    
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
    setIsEditingLocal(true);
  };

  const handleSave = (id, newTitle, newText) => {
    onEdit(id, newTitle, newText);
    setIsEditingLocal(false);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditingLocal(false);
  };

  const handleCancelEdit = () => {
    setIsEditingLocal(false);
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    setIsPinAnimating(true);
    onPin(id);
    // Reset animation state after animation completes
    setTimeout(() => setIsPinAnimating(false), 300);
  };

  // If the note is in editing mode from database, show EditNote directly
  if (isEditing) {
    return (
      <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-auto transform transition-all border border-yellow-200">
          <EditNote
            id={id}
            initialTitle={title}
            initialText={text}
            onSave={handleSave}
            onDelete={onDelete}
            onCancel={() => {
              // Only reset editing state in database - no modal cleanup needed
              onCancelEdit(id);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`note bg-white rounded-xl p-2 sm:p-4 shadow-lg flex flex-col w-full cursor-pointer transition-all duration-300 ease-in-out border ${
          pinned 
            ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white shadow-xl transform hover:scale-105 hover:shadow-2xl ring-2 ring-yellow-200 ring-opacity-50' 
            : 'border-yellow-200 hover:shadow-2xl hover:border-yellow-300 hover:bg-gradient-to-br hover:from-yellow-25 hover:to-white'
        } ${isPinAnimating ? 'animate-pulse scale-105' : ''}`}
        onClick={handleNoteClick}
      >
        <h3 className={`note-text mb-1 break-words overflow-hidden font-bold text-center text-sm sm:text-base leading-tight transition-colors duration-200 ${
          pinned ? 'text-yellow-800' : 'text-black'
        }`}>
          {title}
        </h3>
        <span className={`note-text mb-2 sm:mb-4 break-words text-xs sm:text-sm leading-snug whitespace-pre-wrap transition-colors duration-200 ${
          pinned ? 'text-yellow-700' : 'text-black'
        }`}>
          {text}
        </span>
        <div className="footer flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto pt-1 gap-2 sm:gap-0">
          {/* Icons row - always at top on mobile, right side on desktop */}
          <div className="flex gap-1 sm:gap-2 justify-end sm:justify-end order-1 sm:order-2">
            <div className="relative">
              <img
                src={pinned ? PinIconFilled : PinIcon}
                alt="PinIcon"
                className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer transition-all duration-300 ease-in-out ${
                  pinned 
                    ? 'scale-110 rotate-12 filter brightness-110 drop-shadow-md hover:scale-125 hover:rotate-[20deg]' 
                    : 'hover:scale-110 hover:rotate-6'
                } ${isPinAnimating ? 'animate-bounce scale-125 rotate-12' : ''}`}
                onClick={handlePinClick}
                title={pinned ? "Unpin" : "Pin"}
              />
              {pinned && (
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-ping"></div>
              )}
            </div>
            <img
              src={EditIcon}
              alt="EditIcon"
              className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={handleEditClick}
            />
            <img
              src={DeleteIcon}
              alt="DeleteButton"
              className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:scale-110 hover:filter hover:brightness-110 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to delete this note?")) {
                  onDelete(id);
                }
              }}
            />
          </div>
          {/* Time stamp - below icons on mobile, left side on desktop */}
          <small className={`text-xs transition-colors duration-200 text-right sm:text-left order-2 sm:order-1 ${
            pinned ? 'text-yellow-600 font-medium' : 'text-yellow-600'
          }`}>
            {getTimeDisplay()}
          </small>
        </div>
      </div>

      {/* Modal - only show if not in database editing mode */}
      {isModalOpen && !isEditing && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className={`bg-white rounded-lg p-4 sm:p-6 shadow-2xl w-[95%] sm:w-[90%] max-w-2xl max-h-[80vh] overflow-auto transform transition-all border ${
              pinned ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white' : 'border-yellow-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {isEditingLocal ? (
              <EditNote
                id={id}
                initialTitle={title}
                initialText={text}
                onSave={handleSave}
                onDelete={onDelete}
                onCancel={() => {
                  // Close the modal completely when canceling local edit
                  setIsEditingLocal(false);
                  setIsModalOpen(false);
                }}
              />
            ) : (
              // This view mode is now rarely used since we go directly to edit
              <>
                <h2 className={`text-xl sm:text-2xl font-bold mb-4 break-words transition-colors duration-200 ${
                  pinned ? 'text-yellow-800' : 'text-black'
                }`}>{title}</h2>
                <p className={`text-base sm:text-lg mb-6 break-words whitespace-pre-wrap transition-colors duration-200 ${
                  pinned ? 'text-yellow-700' : 'text-black'
                }`}>{text}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <small className={`transition-colors duration-200 order-2 sm:order-1 text-right sm:text-left ${
                    pinned ? 'text-yellow-600 font-medium' : 'text-black'
                  }`}>
                    {getTimeDisplay()}
                  </small>
                  <div className="flex gap-3 sm:gap-4 items-center justify-end sm:justify-start order-1 sm:order-2">
                    <div className="relative">
                      <img
                        src={pinned ? PinIconFilled : PinIcon}
                        alt="PinIcon"
                        className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-all duration-300 ease-in-out ${
                          pinned 
                            ? 'scale-110 rotate-12 filter brightness-110 drop-shadow-md hover:scale-125 hover:rotate-[20deg]' 
                            : 'hover:scale-110 hover:rotate-6'
                        }`}
                        onClick={handlePinClick}
                        title={pinned ? "Unpin" : "Pin"}
                      />
                      {pinned && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-110 transition-transform duration-200"
                      onClick={() => setIsEditingLocal(true)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="DeleteButton"
                      className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-110 hover:filter hover:brightness-110 transition-all duration-200"
                      onClick={() => {
                        handleCloseModal();
                        onDelete(id);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Note;