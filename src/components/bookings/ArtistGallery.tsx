'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ImageCollageProps {
  bucketName: string;
  userId: string | null;
}

export default function ImageCollage({ bucketName, userId }: ImageCollageProps) {
  const supabase = createClient();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setImages([]);
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);
      const pathPrefix = `${userId}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(pathPrefix, { limit: 6 });

      if (error) {
        console.error('Error fetching images:', error);
        setImages([]);
        setLoading(false);
        return;
      }

      const filesToUse = data.slice(1);

      const urls = filesToUse.map(file =>
        supabase.storage.from(bucketName).getPublicUrl(`${pathPrefix}/${file.name}`).data.publicUrl
      );

      setImages(urls);
      setLoading(false);
    };

    fetchImages();
  }, [bucketName, userId, supabase]);

  if (loading) return <p>Loading images...</p>;
  if (!userId) return <p>No user selected.</p>;
  if (images.length === 0) return <p>No images uploaded yet.</p>;

  // Single row grid: all images side by side, each fills available width equally
  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: `calc((100% - ${(images.length - 1) * 8}px) / ${images.length})`,
        gap: '8px',
        height: '200px',
        overflow: 'hidden',
      }}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`User image ${i + 1}`}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            filter: 'grayscale(100%)',
            transition: 'filter 0.3s ease',
            cursor: 'pointer',
          }}
          loading="lazy"
          onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0%)')}
          onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(100%)')}
        />
      ))}
    </div>
  );
}
