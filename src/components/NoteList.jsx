import Note from './Note.jsx'
import AddNote from './AddNote.jsx'

const NoteList = ({ notes, onSaveNote, onDeleteNote, onEditNote }) => {
    return (
        <div className="note-list flex flex-wrap gap-4 justify-start p-4 min-h-[60vh]">
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full min-h-[40vh]">
                    <div className="text-gray-500 text-lg text-center">
                        No notes.<br />
                        Click <span className="font-bold text-yellow-600 text-xl">+</span> to add a new note.
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
                            

                        />
                    )
                )
            )}
        </div>
    )
}

export default NoteList