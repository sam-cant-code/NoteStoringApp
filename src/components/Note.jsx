import { useState } from 'react';
import PinIcon from '../ReactIcons/pinIcon.png';
import PinIconFilled from '../ReactIcons/pinIconFilled.png';
import DeleteIcon from '../ReactIcons/deleteIcon.png';
import EditIcon from '../ReactIcons/editIcon.png';
import EditNote from './EditNote';

const Note = ({ id, title, text, createdAt, onDelete, onEdit, pinned, onPin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleNoteClick = (e) => {
    if (e.target.tagName === 'IMG') return;
    setIsModalOpen(true);
  };

  const handleSave = (id, newTitle, newText) => {
    onEdit(id, newTitle, newText);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  return (
    <>
      <div 
        className="note bg-yellow-200 rounded-lg p-3 shadow-lg flex flex-col justify-between w-64 min-h-[120px] cursor-pointer hover:shadow-xl transition-shadow"
        onClick={handleNoteClick}
      >
        <h3 className="note-text mb-0.5 break-words overflow-hidden font-medium text-center">
          {title}
        </h3>
        <span className="note-text mb-1 break-words overflow-hidden">
          {text}
        </span>
        <div className="footer flex items-center justify-between">
          <small>{new Date(createdAt).toLocaleString()}</small>
          <div className="flex gap-2">
            <img
              src={pinned ? PinIconFilled : PinIcon}
              alt="PinIcon"
              className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onPin(id);
              }}
              title={pinned ? "Unpin" : "Pin"}
            />
            <img
              src={EditIcon}
              alt="EditIcon"
              className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
            />
            <img
              src={DeleteIcon}
              alt="DeleteButton"
              className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
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
            className="bg-yellow-200 rounded-lg p-6 shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-auto transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            {isEditing ? (
              <EditNote
                id={id}
                initialTitle={title}
                initialText={text}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 break-words">{title}</h2>
                <p className="text-lg mb-6 break-words whitespace-pre-wrap">{text}</p>
                <div className="flex items-center justify-between">
                  <small>{new Date(createdAt).toLocaleString()}</small>
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