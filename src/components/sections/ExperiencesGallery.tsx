'use client'
import { useEffect, useState } from 'react'
import { CircularGallery, GalleryItem } from '@/components/blocks/CircularGallery'

interface GalleryRow {
  id: number
  image_url: string
  alt_text: string
  object_position: string
}

export default function ExperiencesGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experience-gallery')
      .then(r => r.json())
      .then((data: GalleryRow[]) => {
        setItems(
          data.map(row => ({
            photo: {
              url: row.image_url,
              text: row.alt_text,
              pos: row.object_position,
            },
          }))
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F0EDE6', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#a1a1aa', fontSize: '13px' }}>Loading gallery...</p>
      </div>
    )
  }

  if (items.length === 0) return null

  return <CircularGallery items={items} />
}