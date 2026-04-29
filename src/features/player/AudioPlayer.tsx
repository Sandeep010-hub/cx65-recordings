import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Select, MenuItem, Stack, Snackbar, Fade, Button } from '@mui/material';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Waveform } from './Waveform';
import { handleDownload } from '../table/RecordingTable';

export const AudioPlayer = () => {
  const { activeRecording, isPlaying, setIsPlaying } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // When a new recording is selected, play it automatically
  useEffect(() => {
    if (activeRecording && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      setIsPlaying(true);
    }
  }, [activeRecording, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // The slider is replaced by the waveform interaction natively, but keep the handler logic if needed elsewhere
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, audioRef.current.duration || 0);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!activeRecording) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Typography variant="body2" color="text.secondary">Select a recording to play</Typography>
      </Box>
    );
  }

  return (
    <Fade in={!!activeRecording} timeout={400}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%', 
        bgcolor: 'white', 
        borderRadius: 2, 
        border: '1px solid', 
        borderColor: 'grey.300', 
        px: { xs: 2, md: 3 }, 
        py: 1.5,
        gap: { xs: 2, md: 0 },
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        {/* Dummy Audio Element */}
        <audio 
          ref={audioRef} 
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
          onTimeUpdate={handleTimeUpdate} 
          onEnded={handleEnded} 
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />

      {/* Info */}
      <Box sx={{ 
        minWidth: { xs: '100%', md: 200 }, 
        flex: { xs: 'none', md: 1 }, 
        overflow: 'hidden', 
        mr: { xs: 0, md: 2 },
        textAlign: { xs: 'center', md: 'left' }
      }}>
        <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: { xs: 'none', sm: 'block' } }}>
          {activeRecording.ani} ... {activeRecording.dnis}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {new Date(activeRecording.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {activeRecording.callFlow} · {activeRecording.agent}
        </Typography>
      </Box>

      {/* Controls & Progress */}
      <Box sx={{ flex: 2, width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <IconButton onClick={skipBackward} size="small"><SkipBack size={20} /></IconButton>
          <IconButton 
            onClick={togglePlayPause} 
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </IconButton>
          <IconButton onClick={skipForward} size="small"><SkipForward size={20} /></IconButton>
        </Stack>
        
        <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ minWidth: 35, textAlign: 'right' }}>{formatTime(currentTime)}</Typography>
          <Box sx={{ flex: 1 }}>
            <Waveform audioRef={audioRef} audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
          </Box>
          <Typography variant="caption" sx={{ minWidth: 35 }}>{formatTime(duration)}</Typography>
        </Stack>
      </Box>

      {/* Extra Controls (Download, Speed) */}
      <Stack direction="row" spacing={2} sx={{ 
        minWidth: { xs: '100%', md: 160 }, 
        justifyContent: { xs: 'center', md: 'flex-end' }, 
        alignItems: 'center', 
        ml: { xs: 0, md: 2 },
        width: { xs: '100%', md: 'auto' }
      }}>
        <Select
          size="small"
          value={playbackRate}
          onChange={(e) => setPlaybackRate(Number(e.target.value))}
          sx={{ height: 32, fontSize: '0.875rem' }}
        >
          <MenuItem value={0.5}>0.5x</MenuItem>
          <MenuItem value={1}>1x</MenuItem>
          <MenuItem value={1.5}>1.5x</MenuItem>
          <MenuItem value={2}>2x</MenuItem>
        </Select>

        <Stack direction="row" spacing={1} sx={{ width: 100, alignItems: 'center' }}>
          <Volume2 size={18} />
          <Slider
            size="small"
            value={volume}
            max={1}
            step={0.01}
            onChange={(_, val) => setVolume(val as number)}
            sx={{ color: 'text.secondary', '& .MuiSlider-thumb': { width: 12, height: 12 } }}
          />
        </Stack>
        
        <Button 
          variant="contained" 
          size="small"
          startIcon={<Download size={16} />}
          onClick={() => {
            setSnackbarOpen(true);
            if (activeRecording) {
              handleDownload('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', `recording_${activeRecording.id}.mp3`);
            }
          }} 
          disabled={!activeRecording}
          sx={{ color: 'white', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, boxShadow: 'none' }}
        >
          Download
        </Button>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Downloading audio..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      </Box>
    </Fade>
  );
};
