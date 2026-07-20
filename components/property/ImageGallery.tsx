"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, PlayCircle, X } from "lucide-react";

export default function ImageGallery({
  images,
  videoUrl,
  title,
}: {
  images: string[];
  videoUrl?: string | null;
  title: string;
}) {
  const media = [...images, ...(videoUrl ? [videoUrl] : [])];
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const isVideo = (m: string) => m === videoUrl;

  function next() {
    setIndex((i) => (i + 1) % media.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + media.length) % media.length);
  }

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink-soft">
        {isVideo(media[index]) ? (
          <video src={media[index]} controls className="h-full w-full object-cover" />
        ) : (
          <button className="h-full w-full" onClick={() => setLightbox(true)}>
            <Image
              src={media[index]}
              alt={`${title} photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </button>
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-2 text-sand hover:bg-ink/80"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-2 text-sand hover:bg-ink/80"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {media.map((m, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
              i === index ? "border-ember" : "border-transparent"
            }`}
          >
            {isVideo(m) ? (
              <div className="flex h-full w-full items-center justify-center bg-ink text-sand">
                <PlayCircle size={20} />
              </div>
            ) : (
              <Image src={m} alt="" fill className="object-cover" sizes="96px" />
            )}
          </button>
        ))}
      </div>

      {lightbox && !isVideo(media[index]) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 text-sand"
            onClick={() => setLightbox(false)}
          >
            <X size={28} />
          </button>
          <div className="relative h-[85vh] w-full max-w-4xl">
            <Image src={media[index]} alt={title} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </div>
  );
}
