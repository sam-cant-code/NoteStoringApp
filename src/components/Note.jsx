import { useState } from 'react';
import PinIcon from '../reactIcons/pinIcon.png';
import PinIconFilled from '../reactIcons/pinIconFilled.png';
import DeleteIcon from '../reactIcons/deleteIcon.png';
import EditIcon from '../reactIcons/editIcon.png';
import EditNote from './EditNote';

const Note = ({ id, title, text, createdAt, updatedAt, onDelete, onEdit, onCancelEdit, pinned, onPin, isEditing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingLocal, setIsEditingLocal] = useState(false);

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
        className="note bg-white rounded-xl p-4 shadow-lg flex flex-col justify-between w-70 min-h-[180px] max-h-[260px] cursor-pointer hover:shadow-2xl transition-shadow border border-yellow-200"
        onClick={handleNoteClick}
      >
        <h3 className="note-text mb-1 break-words overflow-hidden font-bold text-black text-center text-base leading-tight">
          {title}
        </h3>
        <span className="note-text mb-2 break-words overflow-hidden text-black text-sm leading-snug line-clamp-5">
          {text}
        </span>
        <div className="footer flex items-center justify-between mt-2">
          <small className="text-yellow-600 text-xs">
            {getTimeDisplay()}
          </small>
          <div className="flex gap-2">
            <img
              src={pinned ? PinIconFilled : PinIcon}
              alt="PinIcon"
              className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onPin(id);
              }}
              title={pinned ? "Unpin" : "Pin"}
            />
            <img
              src={EditIcon}
              alt="EditIcon"
              className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
              onClick={handleEditClick}
            />
            <img
              src={DeleteIcon}
              alt="DeleteButton"
              className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to delete this note?")) {
                  onDelete(id);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal - only show if not in database editing mode */}
      {isModalOpen && !isEditing && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-auto transform transition-all border border-yellow-200"
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
                <h2 className="text-2xl font-bold mb-4 break-words text-black">{title}</h2>
                <p className="text-lg mb-6 break-words whitespace-pre-wrap text-black">{text}</p>
                <div className="flex items-center justify-between">
                  <small className="text-black">
                    {getTimeDisplay()}
                  </small>
                  <div className="flex gap-4 items-center">
                    <img
                      src={pinned ? PinIconFilled : PinIcon}
                      alt="PinIcon"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => onPin(id)}
                      title={pinned ? "Unpin" : "Pin"}
                    />
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => setIsEditingLocal(true)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="DeleteButton"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
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