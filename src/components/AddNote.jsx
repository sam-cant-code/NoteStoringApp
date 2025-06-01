import { useState } from 'react'
import DeleteIcon from '../ReactIcons/deleteIcon.png'

const AddNote = ({ id, onSave, onDelete, initialTitle = '', initialText = '' }) => {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialText);

    return (
        <div className="add-note bg-yellow-100 rounded-lg p-4 shadow-md flex flex-col justify-between w-64 max-w-xs min-h-[150px]">
            <input
                type="text"
                className="rounded-md p-2 mb-1 bg-yellow-100 text-gray-800 focus:outline-none"
                placeholder="Enter Title..."
                maxLength={50}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <textarea
                rows="3"
                className="resize-none rounded-md p-2 mb-0.5 bg-yellow-100 text-gray-800 focus:outline-none"
                placeholder="Enter note content..."
                maxLength={200}
                value={text}
                onChange={e => setText(e.target.value)}
            ></textarea>
            <div className="footer flex items-center justify-between">
                <small className="text-gray-500">{200 - text.length} remaining</small>
                <div className="flex items-center gap-2">
                    <button
                        className="save bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-1 rounded transition-colors"
                        onClick={() => onSave(id, title, text)}
                        disabled={!title.trim() && !text.trim()}
                    >
                        Save
                    </button>
                    <img
                        src={DeleteIcon}
                        alt="DeleteButton"
                        className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => onDelete(id)}
                        title="Delete"
                    />
                </div>
            </div>
        </div>
    )
}

export default AddNote