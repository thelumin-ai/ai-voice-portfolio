'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2 } from 'lucide-react'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert sm:prose-base focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 dark:border-zinc-700 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 dark:border-zinc-700 p-2 bg-gray-50 dark:bg-zinc-950">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
