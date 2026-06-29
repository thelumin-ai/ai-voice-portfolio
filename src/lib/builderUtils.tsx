import React from 'react'
import { ProjectElement } from './projectsRepo'

export function renderCustomElements(elements?: ProjectElement[]) {
  if (!elements || elements.length === 0) return null
  return (
    <div className="space-y-4 w-full mt-6 clear-both">
      {elements.map((el) => {
        const styles = el.styles || {}
        const textClass = styles.textColor || ''
        const paddingClass = styles.padding || 'p-2'
        
        switch (el.type) {
          case 'heading': {
            const Tag = (el.content.level || 'h3') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
            const sizeClasses = {
              h1: 'text-3xl sm:text-5xl font-black text-white leading-tight',
              h2: 'text-2xl sm:text-3xl font-black text-white leading-tight',
              h3: 'text-xl font-bold leading-snug',
              h4: 'text-lg font-semibold',
              h5: 'text-base font-semibold',
              h6: 'text-sm uppercase tracking-wider'
            }
            return (
              <Tag 
                key={el.id} 
                id={el.id}
                data-element-id={el.id}
                className={`${sizeClasses[Tag]} ${textClass} ${paddingClass}`}
              >
                {el.content.text}
              </Tag>
            )
          }
          case 'paragraph':
            return (
              <p 
                key={el.id} 
                id={el.id}
                data-element-id={el.id}
                className={`text-sm leading-relaxed ${textClass} ${paddingClass}`}
              >
                {el.content.text}
              </p>
            )
          case 'button':
            return (
              <a
                key={el.id}
                id={el.id}
                data-element-id={el.id}
                href={el.content.url || '#'}
                className={`inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-extrabold text-xs uppercase tracking-wider transition-colors ${paddingClass}`}
              >
                {el.content.label}
              </a>
            )
          case 'image':
            return (
              <div key={el.id} className="overflow-hidden rounded-lg">
                <img
                  id={el.id}
                  data-element-id={el.id}
                  src={el.content.url}
                  alt={el.content.alt || 'Showcase'}
                  className="w-full h-auto object-cover max-w-full"
                />
              </div>
            )
          case 'divider':
            return (
              <div 
                key={el.id} 
                id={el.id}
                data-element-id={el.id}
                style={{
                  borderTop: `${el.content.height || '1px'} ${el.content.style || 'solid'} ${el.content.color || '#c6c6c7'}`
                }}
                className="w-full my-4"
              />
            )
          case 'slider':
            return (
              <div key={el.id} id={el.id} data-element-id={el.id} className="w-full overflow-hidden rounded-xl bg-zinc-900/60 p-4 border border-zinc-800 text-left">
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                  {el.content.items?.map((slide: any, idx: number) => (
                    <div key={idx} className="min-w-[240px] snap-start relative h-36 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-end p-3">
                        <span className="text-[11px] font-bold text-white uppercase">{slide.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          case 'accordion':
            return (
              <div key={el.id} id={el.id} data-element-id={el.id} className="w-full space-y-2 text-left">
                {el.content.items?.map((item: any, idx: number) => (
                  <div key={idx} className="border border-zinc-855 bg-zinc-900/30 rounded-lg p-3">
                    <h5 className="font-bold text-xs text-white mb-1">{item.title}</h5>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )
          case 'form':
            return (
              <div key={el.id} id={el.id} data-element-id={el.id} className="w-full bg-zinc-900/60 p-4 border border-zinc-850 rounded-xl space-y-3 text-left">
                {el.content.fields?.includes('name') && (
                  <input type="text" placeholder="Your Name" className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-[11px]" disabled />
                )}
                {el.content.fields?.includes('email') && (
                  <input type="email" placeholder="Your Email" className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-[11px]" disabled />
                )}
                {el.content.fields?.includes('message') && (
                  <textarea placeholder="Message" rows={2} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-[11px] resize-none" disabled />
                )}
                <button type="button" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] uppercase cursor-not-allowed" disabled>
                  {el.content.btnText || 'Submit'}
                </button>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
