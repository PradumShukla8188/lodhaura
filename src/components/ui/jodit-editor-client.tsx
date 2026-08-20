"use client";

import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { useTheme } from "next-themes";

export default function JoditEditorClient({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const editor = useRef(null);
    const { theme, resolvedTheme } = useTheme();

    const config = useMemo(() => ({
        readonly: false,
        theme: (theme === "dark" || resolvedTheme === "dark") ? "dark" : "default",
        toolbarAdaptive: false,
        height: 400,
        style: {
            background: 'transparent',
            color: 'inherit'
        },
        placeholder: "Start typing your blog content here...",
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'superscript', 'subscript', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'video', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'symbol', 'fullsize', 'print', 'about'
        ],
        uploader: {
            insertImageAsBase64URI: true
        }
    }), [theme, resolvedTheme]);

    return (
        <div className="jodit-wrapper overflow-hidden rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <JoditEditor
                ref={editor}
                value={value}
                config={config}
                onBlur={newContent => onChange(newContent)}
                onChange={() => {}} // We intentionally leave onChange empty to avoid cursor jumping, use onBlur for form state updates
            />
        </div>
    );
}
