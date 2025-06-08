import Note from './Note';
import AddNote from './AddNote';

const NoteList = ({ notes, onSaveNote, onDeleteNote, onEditNote, onCancelEdit, onPinNote }) => {
  return (
    <div
      className="note-list p-3 sm:p-6 w-full h-[90vh] max-w-[1600px] mx-auto"
      style={{ width: '100%' }}
    >
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[20vh]">
          <div className="text-gray-500 text-lg text-center">
            No notes found.
          </div>
        </div>
      ) : (
        <div 
          className="columns-1 sm:columns-2 md:columns-3 gap-2 sm:gap-4 md:gap-8 space-y-2 sm:space-y-4 md:space-y-8"
          style={{
            columnGap: '0.5rem',
            columnFill: 'balance'
          }}
        >
          {notes.map(note =>
            // Only use AddNote for truly new notes (empty title and text)
            note.isEditing && !note.title && !note.text ? (
              <div key={note.id} className="break-inside-avoid mb-2 sm:mb-4 md:mb-8">
                <AddNote
                  id={note.id}
                  initialTitle={note.title}
                  initialText={note.text}
                  onSave={onSaveNote}
                  onDelete={onDeleteNote}
                />
              </div>
            ) : (
              <div key={note.id} className="break-inside-avoid mb-2 sm:mb-4 md:mb-8">
                <Note
                  id={note.id}
                  title={note.title}
                  text={note.text}
                  onDelete={onDeleteNote}
                  onEdit={onEditNote}
                  onCancelEdit={onCancelEdit}
                  createdAt={note.createdAt}
                  updatedAt={note.updatedAt}
                  pinned={note.pinned}
                  onPin={onPinNote}
                  isEditing={note.isEditing}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NoteList;