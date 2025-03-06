import React from 'react'
import './song-card.css'
import { FaPlay } from 'react-icons/fa'

const SongCard = ({ setCurrentSong, dialogRef, audioRef, song }) => {
  return (
    <div className='container'>
      <div className='img-div'>
        <img
          className='img'
          src={song.artwork}
          alt='Cover Image'
        />
      </div>
      <div className='details'>
        <span className='title'>{song.title}</span>
        <span className='artist'>{song.artist}</span>
      </div>
      <div
        onClick={() => {
          dialogRef.current.showModal()
          setCurrentSong(parseInt(song.id))
          audioRef.current.play()
        }}
        className='play-icon'
      >
        <FaPlay size={14} />
      </div>
    </div>
  )
}

export default SongCard
