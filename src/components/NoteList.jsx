import Note from './Note';
import AddNote from './AddNote';

const NoteList = ({ notes, onSaveNote, onDeleteNote, onEditNote, onPinNote }) => {
  return (
    <div className="note-list flex flex-wrap gap-4 justify-start p-10 min-h-[60vh]">
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[20vh]">
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