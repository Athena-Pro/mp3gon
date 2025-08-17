import React, { useEffect, useState } from 'react';
import { warpedBufferToUrl } from '../services/playagon';

interface PlayagonPlayerProps {
  buffer: AudioBuffer;
  warp: (t: number) => number;
}

/**
 * Simple player for time-deformed audio buffers (playagons).
 */
export default function PlayagonPlayer({ buffer, warp }: PlayagonPlayerProps): React.ReactNode {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = warpedBufferToUrl(buffer, warp);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [buffer, warp]);

  if (!url) return null;

  return (
    <audio controls src={url} aria-label="Playagon Audio" />
  );
}
