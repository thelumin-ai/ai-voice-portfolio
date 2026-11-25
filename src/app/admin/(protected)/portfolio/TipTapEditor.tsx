'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Unlink,
} from 'lucide-react'
import { useAdminPreferences } from '@/components/admin/AdminPreferencesContext'
import { isSafeHttpUrl } from '@/lib/url'
import { Button } from '@/components/ui/button'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const { preferences } = useAdminPreferences()
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
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] p-4 text-adm-text',
      },
    },
  })

  if (!editor) {
    return (
      <div className="min-h-[240px] rounded-xl border border-adm-border bg-adm-surface-2/40 animate-pulse" />
    )
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

  const toolbarBtn = (active: boolean) =>
    `p-2 rounded-lg transition-colors ${
      active
        ? 'bg-adm-accent-soft text-adm-accent'
        : 'text-adm-muted hover:text-adm-text hover:bg-adm-surface-2'
    }`

  return (
    <div className="border border-adm-border rounded-xl overflow-hidden bg-adm-surface-2/50">
      <div className="flex flex-wrap items-center gap-1 border-b border-adm-border p-2 bg-adm-surface">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          className={toolbarBtn(editor.isActive('bold'))}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          className={toolbarBtn(editor.isActive('italic'))}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
          className={toolbarBtn(editor.isActive('heading', { level: 2 }))}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
          className={toolbarBtn(editor.isActive('bulletList'))}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
          className={toolbarBtn(editor.isActive('orderedList'))}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleLinkBar}
          aria-label="Insert or edit link"
          className={toolbarBtn(editor.isActive('link') || showLinkInput)}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {showLinkInput && (
        <div className="border-b border-adm-border p-3 bg-adm-surface space-y-2">
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
              className="adm-input flex-1 min-w-[200px]"
            />
            <Button type="button" size="sm" onClick={applyLink}>
              Apply
            </Button>
            {editor.isActive('link') && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeLink}
                className="text-adm-danger-text border-adm-danger-border"
              >
                <Unlink className="w-3.5 h-3.5 mr-1" />
                Unlink
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowLinkInput(false)
                setLinkError(null)
              }}
            >
              Cancel
            </Button>
          </div>
          {linkError && <p className="adm-error">{linkError}</p>}
        </div>
      )}

      <div className={preferences.mode === 'dark' ? 'prose-invert' : ''}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
