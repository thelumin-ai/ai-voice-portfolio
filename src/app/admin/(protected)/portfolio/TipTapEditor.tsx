'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2, Unlink } from 'lucide-react'
import { isSafeHttpUrl } from '@/lib/url'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
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

  const toggleLinkBar = () => {
    setLinkError(null)
    if (!showLinkInput) {
      const currentHref = editor.getAttributes('link').href
      setLinkUrl(typeof currentHref === 'string' ? currentHref : '')
      setShowLinkInput(true)
    } else {
      setShowLinkInput(false)
    }
  }

  const applyLink = () => {
    const trimmed = linkUrl.trim()
    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setLinkError(null)
      setShowLinkInput(false)
      return
    }
    if (!isSafeHttpUrl(trimmed)) {
      setLinkError('Please enter a valid http:// or https:// URL')
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run()
    setLinkError(null)
    setShowLinkInput(false)
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setLinkUrl('')
    setLinkError(null)
    setShowLinkInput(false)
  }

  return (
    <div className="border border-gray-300 dark:border-zinc-700 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 dark:border-zinc-700 p-2 bg-gray-50 dark:bg-zinc-950">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleLinkBar}
          aria-label="Insert or edit link"
          className={`p-2 rounded ${editor.isActive('link') || showLinkInput ? 'bg-gray-200 dark:bg-zinc-800' : 'hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {showLinkInput && (
        <div className="border-b border-gray-300 dark:border-zinc-700 p-2.5 bg-gray-100/70 dark:bg-zinc-900/90 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value)
                if (linkError) setLinkError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applyLink()
                } else if (e.key === 'Escape') {
                  setShowLinkInput(false)
                  setLinkError(null)
                }
              }}
              placeholder="https://example.com"
              className="flex-1 min-w-[200px] px-2.5 py-1.5 text-xs rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={applyLink}
              className="px-3 py-1.5 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Apply
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={removeLink}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Unlink className="w-3.5 h-3.5" /> Unlink
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false)
                setLinkError(null)
              }}
              className="px-2.5 py-1.5 text-xs font-medium rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
          {linkError && <p className="text-xs text-red-500">{linkError}</p>}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
