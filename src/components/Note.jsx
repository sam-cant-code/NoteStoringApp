import { useState } from 'react';
import PinIcon from '../reactIcons/pinIcon.png';
import PinIconFilled from '../reactIcons/pinIconFilled.png';
import DeleteIcon from '../reactIcons/deleteIcon.png';
import EditIcon from '../reactIcons/editIcon.png';
import EditNote from './EditNote';

const Note = ({ id, title, text, createdAt, onDelete, onEdit, pinned, onPin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleNoteClick = (e) => {
    // Prevent modal from opening if clicking an icon or if already open
    if (e.target.tagName === 'IMG' || isModalOpen) return;
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
    setIsEditing(true);
  };

  const handleSave = (id, newTitle, newText) => {
    onEdit(id, newTitle, newText);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

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
          <small className="text-yellow-600 text-xs">{new Date(createdAt).toLocaleString()}</small>
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-auto transform transition-all border border-yellow-200"
            onClick={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <EditNote
                id={id}
                initialTitle={title}
                initialText={text}
                onSave={handleSave}
                onDelete={onDelete}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 break-words text-black">{title}</h2>
                <p className="text-lg mb-6 break-words whitespace-pre-wrap text-black">{text}</p>
                <div className="flex items-center justify-between">
                  <small className="text-black">{new Date(createdAt).toLocaleString()}</small>
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
                      onClick={() => setIsEditing(true)}
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
