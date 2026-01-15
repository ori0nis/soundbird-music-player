import { useEffect, useRef, useState } from "react";
import { songs } from "../data/songs";
import { Playlist } from "./Playlist";
import { formatTime } from "../utils/formatTime";
import { Button } from "./Button";

export const Player = () => {
  const audioRef = useRef(null);
  const [songNumber, setSongNumber] = useState(0);
  const [shufflePlay, setShufflePlay] = useState(() => {
    return localStorage.getItem("play-mode") === "shuffle-play" ? true : false;
  });
  const [songDuration, setSongDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  /* Button states */
  const [isShuffleActive, setIsShuffleActive] = useState(shufflePlay);
  const [isPlayActive, setIsPlayActive] = useState(false);

  /* const isPauseActive = false; */
  const currentSong = songs[songNumber];

  /* useEffect() flags which song needs to play, makes sure autoplay works */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayActive(true))
        .catch(() => {});
    }
  }, [songNumber]);

  const playSong = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setIsPlayActive(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlayActive(false);
  };

  /* Function to play song depending on Playlist choice */
  const playSongFromPlaylist = (index) => {
    setSongNumber(index);
  };

  const getNextSongIndex = () => {
    if (!shufflePlay) {
      return songNumber === songs.length - 1 ? 0 : songNumber + 1;
    } else {
      let next;

      do {
        next = Math.floor(Math.random() * songs.length);
      } while (next === songNumber && songs.length > 1);

      return next;
    }
  };

  const nextSong = () => {
    const nextIndex = getNextSongIndex();
    setSongNumber(nextIndex);
  };

  const prevSong = () => {
    const prevIndex = songNumber === 0 ? songs.length - 1 : songNumber - 1;
    setSongNumber(prevIndex);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent);

    const timeRemaining = audio.duration - audio.currentTime;
    setSongDuration(timeRemaining);
  };

  const toggleShuffle = () => {
    setShufflePlay((prev) => {
      const newValue = !prev;
      localStorage.setItem("play-mode", newValue ? "shuffle-play" : "sequential-play");
      setIsShuffleActive(newValue);
      return newValue;
    });
  };

  return (
    <div className="m-auto max-w-2xl w-full bg-red-500 flex flex-col gap-40">
      <div className="flex w-fit m-auto gap-4">
        <img src={currentSong.cover_art} alt={currentSong.title} className="rounded-xl w-60 h-auto" />
        <div className="flex flex-col">
          <p>
            {currentSong.title} - {currentSong.artist}
          </p>

          {/* Audio */}
          <audio
            ref={audioRef}
            src={currentSong.src}
            onLoadedMetadata={() => {
              const audio = audioRef.current;
              setSongDuration(audio.duration - audio.currentTime);
            }}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              const nextIndex = getNextSongIndex();
              setSongNumber(nextIndex);
            }}
          />

          {/* Progress bar */}
          <div
            className="h-2 bg-gray-300 rounded-lg mt-4"
            onClick={(e) => {
              const bar = e.currentTarget;
              const width = bar.clientWidth;
              const clickX = e.clientX - bar.getBoundingClientRect().left;
              const clickPercent = clickX / width;
              audioRef.current.currentTime = clickPercent * audioRef.current.duration;
            }}
          >
            <div className="h-2 bg-orange-400 rounded-lg" style={{ width: `${progress}%` }}></div>
          </div>
          <p>{formatTime(songDuration)}</p>

          {/* Control buttons */}
          <div className="grid grid-cols-[50px_50px_50px_50px] gap-1">
            <Button id="prev" onClick={prevSong} />
            <Button id="play" onClick={playSong} isActive={isPlayActive} />
            <Button id="pause" onClick={pauseSong} isActive={!isPlayActive} />
            <Button id="next" onClick={nextSong} />
            <Button id="shuffle" onClick={toggleShuffle} isActive={isShuffleActive} />
            <Button id="plus-5" onClick={() => (audioRef.current.currentTime += 5)} />
            <Button id="minus-5" onClick={() => (audioRef.current.currentTime -= 5)} />
          </div>
        </div>
      </div>

      <Playlist playSong={playSongFromPlaylist} />
    </div>
  );
};
