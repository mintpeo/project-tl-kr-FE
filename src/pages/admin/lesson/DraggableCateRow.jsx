import React from 'react';
import { useSortable } from '@dnd-kit/sortable';

export function SortableCateRow({ cate, index }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cate.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        zIndex: isDragging ? 10 : undefined,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`quiz-list__item cate-row ${isDragging ? 'dragging' : ''}`}
        >
            {/* Tay cầm để kéo */}
            <button type="button" className="cate-row__handle" title="Kéo để đổi vị trí" {...attributes} {...listeners}>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <circle cx="9" cy="6" r="1.6" fill="currentColor" /><circle cx="15" cy="6" r="1.6" fill="currentColor" />
                    <circle cx="9" cy="12" r="1.6" fill="currentColor" /><circle cx="15" cy="12" r="1.6" fill="currentColor" />
                    <circle cx="9" cy="18" r="1.6" fill="currentColor" /><circle cx="15" cy="18" r="1.6" fill="currentColor" />
                </svg>
            </button>

            <span className="cate-row__index">{index + 1}</span>
            <span className="quiz-list__name">{cate.name} - ({cate.lessonsSize})</span>
        </li>
    );
}