import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableLessonRow = ({ lesson, index, truncateText }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lesson.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        backgroundColor: isDragging ? '#f1f5f9' : undefined,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <tr ref={setNodeRef} style={style}>
            {/* Nút nắm kéo thả */}
            <td style={{ width: '50px', textAlign: 'center', cursor: 'grab' }} {...attributes} {...listeners}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
                </svg>
            </td>
            {/* Vị trí mới được sinh tự động theo index + 1 */}
            <td style={{ fontWeight: 'bold', color: 'var(--primary, #2563eb)' }}>{index + 1}</td>
            <td>{truncateText(lesson.name, 30)}</td>
            <td>{lesson.cateName}</td>
            <td colSpan={2} style={{ color: '#64748b', fontSize: '13px' }}>
                Kéo để đổi vị trí
            </td>
        </tr>
    );
};