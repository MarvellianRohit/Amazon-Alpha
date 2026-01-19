"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

interface DraggableWidgetProps {
    id: string;
    children: ReactNode;
}

export function DraggableWidget({ id, children }: DraggableWidgetProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : "auto",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 p-1.5 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="h-full">
                {children}
            </div>
        </div>
    );
}
