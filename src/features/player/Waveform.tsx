import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Box } from '@mui/material';

interface WaveformProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSrc: string | null;
}

export const Waveform = ({ audioRef, audioSrc }: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !audioRef.current) return;

    // Generate a beautiful, realistic-looking dummy waveform peak array
    const generatePeaks = () => {
      const peaks = [];
      for (let i = 0; i < 150; i++) {
        // Create a wave-like pattern with Math.sin and random noise
        const val = Math.abs(Math.sin(i * 0.15)) * 0.4 + Math.random() * 0.6;
        peaks.push(val);
      }
      return peaks;
    };

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      media: audioRef.current,
      waveColor: '#A5D6A7', // Light Emerald
      progressColor: '#2F9A4E', // Emerald
      height: 40,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      normalize: true,
      cursorWidth: 0,
    });

    // Provide pre-computed peaks and a dummy duration so it renders instantly without CORS fetch
    wavesurferRef.current.load(audioSrc || '', [generatePeaks()], 372);

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioRef, audioSrc]);

  return <Box ref={containerRef} sx={{ width: '100%', minWidth: 50, cursor: 'pointer' }} />;
};
