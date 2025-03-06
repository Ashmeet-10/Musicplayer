import { useRef, useState } from 'react'
import './app.css'
import data from './assets/songs'
import SongCard from './components/song-card/song-card'
import { FaPlayCircle } from 'react-icons/fa'
import { FaBackward } from 'react-icons/fa'
import { FaForward } from 'react-icons/fa'
import { FaCirclePause } from 'react-icons/fa6'
import { FaShuffle } from 'react-icons/fa6'
import { RxLoop } from 'react-icons/rx'
import { IoIosCloseCircleOutline } from 'react-icons/io'

function App() {
  const audioRef = useRef()
  const dialogRef = useRef()
  const songs = data
  const [playing, setPlaying] = useState(false)
  const [durationPlayed, setDurationPlayed] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [currentSong, setCurrentSong] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [loop, setLoop] = useState(false)

  const timeUpdate = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time - minutes * 60)
    const currentTime =
      str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2)
    return currentTime
  }

  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  const handlePlayPause = () => {
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const handlePrevClick = () => {
    if (currentSong === 0) {
      setCurrentSong(() => songs.length - 1)
    } else setCurrentSong((val) => val - 1)
  }

  const handleNextClick = () => {
    if(shuffle){
      playRandomSong()
      return
    }
    if (currentSong === songs.length - 1) {
      setCurrentSong(0)
    } else setCurrentSong((val) => val + 1)
  }

  const playRandomSong = () => {
    while (1) {
      const randomNumber = Math.floor(Math.random() * songs.length)
      if (randomNumber !== currentSong) {
        setCurrentSong(randomNumber)
        return
      }
    }
  }

  return (
    <div className='app'>
      <h1>Music player</h1>
      <div className='playlist-container'>
        {songs.map((song) => (
          <SongCard
            setCurrentSong={setCurrentSong}
            dialogRef={dialogRef}
            audioRef={audioRef}
            song={song}
            key={song.id}
          />
        ))}
      </div>
      <dialog ref={dialogRef} className='dialog'>
        <div className='playing image'>
          <img
            src={songs[currentSong].artwork}
            width={300}
            height={300}
            alt=''
          />
        </div>
        <div className='div2'>
          <div className='song-details'>
            <span className='title'>{songs[currentSong].title}</span>
            <span className='description'>by {songs[currentSong].artist}</span>
          </div>
          <span>
            {timeUpdate(durationPlayed)} / {timeUpdate(totalDuration)}
          </span>
          <input
            type='range'
            className='playtime'
            min='0'
            max='100'
            onChange={(e) => {
              const percentage = parseInt(e.target.value)
              const newTime = (percentage / 100) * totalDuration
              audioRef.current.currentTime = newTime
              setDurationPlayed(newTime)
            }}
            value={
              totalDuration
                ? Math.floor((durationPlayed / totalDuration) * 100)
                : 0
            }
            name='progress'
            id='progress'
          />
          <div className='buttons'>
            <FaShuffle
              onClick={() => {
                if (shuffle) {
                  setShuffle(false)
                } else {
                  setShuffle(true)
                  setLoop(false)
                }
              }}
              className={shuffle ? 'button-active' : 'button-inactive'}
              size={20}
            />
            <FaBackward onClick={handlePrevClick} size={25} color='#27AE60' />
            {!playing && (
              <FaPlayCircle
                onClick={handlePlayPause}
                size={50}
                color='#27AE60'
              />
            )}
            {playing && (
              <FaCirclePause
                onClick={handlePlayPause}
                size={50}
                color='#27AE60'
              />
            )}
            <FaForward onClick={handleNextClick} size={25} color='#27AE60' />
            <RxLoop
              onClick={() => {
                if (loop) {
                  setLoop(false)
                } else {
                  setLoop(true)
                  setShuffle(false)
                }
              }}
              className={loop ? 'button-active' : 'button-inactive'}
              size={20}
            />
          </div>
          <div className=''>
            <audio
              ref={audioRef}
              // onDurationChange={(e) => e.target.duration = durationPlayed}
              src={songs[currentSong].url}
              onPlay={(e) => {
                setPlaying(true)
                setTotalDuration(Math.floor(e.target.duration))
              }}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) =>
                setDurationPlayed(Math.floor(e.target.currentTime))
              }
              onEnded={() => {
                if (loop) {
                  audioRef.current.play()
                } else if (shuffle) {
                  playRandomSong()
                } else {
                  handleNextClick()
                }
              }}
              // controls
              autoPlay
            />
          </div>
        </div>
        <IoIosCloseCircleOutline className='close-button' size={30} onClick={() => dialogRef.current.close()} />
      </dialog>
    </div>
  )
}

export default App
