import { useEffect, useState } from 'react';
import PinIcon from '../ReactIcons/pinIcon.png'
import PinIconFilled from '../ReactIcons/pinIconFilled.png'
import DeleteIcon from '../ReactIcons/deleteIcon.png'
import EditIcon from '../ReactIcons/editIcon.png'

function formatTimeAgo(createdAt) {
    const now = Date.now();
    const diff = now - createdAt;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

const Note = ({ id, title, text, createdAt, onDelete, onEdit, pinned, onPin }) => {
    const [, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    return(
    <div className='note bg-yellow-200 rounded-lg p-6 shadow-lg flex flex-col justify-between w-64 min-h-[120px]'>
        <h3 className="note-text mb-1 break-words overflow-hidden font-medium mx-auto">{title}</h3>
        <span className='note-text mb-2 break-words overflow-hidden'>{text}</span>
        <div className='footer flex items-center justify-between'>
            <small>{formatTimeAgo(createdAt)}</small>
            <div className="flex gap-2">
                <img
                    src={pinned ? PinIconFilled : PinIcon}
                    alt="PinIcon"
                    className={`w-4 h-4 cursor-pointer hover:scale-110 transition-transform`}
                    onClick={() => onPin(id)}
                    title={pinned ? "Unpin" : "Pin"}
                />
                <img
                    src={EditIcon}
                    alt="EditIcon"
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => onEdit(id)}
                />
                <img
                    src={DeleteIcon}
                    alt="DeleteButton"
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => onDelete(id)}
                />
            </div>
        </div>
    </div>
)
}

export default Note