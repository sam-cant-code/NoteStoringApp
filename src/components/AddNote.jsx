import { useState } from 'react'
import DeleteIcon from '../ReactIcons/deleteIcon.png'

const AddNote = ({ id, onSave, onDelete, initialTitle = '', initialText = '' }) => {
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState(initialText);

    return (
        <div className="note bg-yellow-200 rounded-lg p-3 shadow-lg flex flex-col justify-between w-64 min-h-[120px]">
            <input
                type="text"
                className="rounded-md p-2 mb-0.5 bg-yellow-200 text-gray-800 focus:outline-none"
                placeholder="Enter Title..."
                maxLength={50}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <textarea
                rows="2"
                className="resize-none rounded-md p-2 mb-1 bg-yellow-200 text-gray-800 focus:outline-none"
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
                        className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => onDelete(id)}
                        title="Delete"
                    />
                </div>
            </div>
        </div>
    )
}

export default AddNote