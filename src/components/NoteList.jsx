import Note from './Note';
import AddNote from './AddNote';

const NoteList = ({ notes, onSaveNote, onDeleteNote, onEditNote, onPinNote }) => {
  return (
    <div
  className="note-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 w-full h-[90vh] max-w-[1600px] mx-auto"
      style={{ width: '100%' }}
    >
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[20vh] col-span-full">
          <div className="text-gray-500 text-lg text-center">
            No notes found.
          </div>
        </div>
      ) : (
        notes.map(note =>
          note.isEditing ? (
            <AddNote
              key={note.id}
              id={note.id}
              initialTitle={note.title}
              initialText={note.text}
              onSave={onSaveNote}
              onDelete={onDeleteNote}
            />
          ) : (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              text={note.text}
              onDelete={onDeleteNote}
              onEdit={onEditNote}
              createdAt={note.createdAt}
              pinned={note.pinned}
              onPin={onPinNote}
            />
          )
        )
      )}
      
    </div>
  );
};

export default NoteList;