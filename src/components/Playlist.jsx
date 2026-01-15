import { songs } from "../data/songs";

export const Playlist = ({ playSong }) => {
  return (
    <div className="max-w-75 bg-blue-500 m-auto">
      <h2 className="text-xl text-center">Playlist</h2>
      {songs.map((song) => (
        <div key={song.id} className="flex gap-1 bg-green-400">
          <div className="w-25">
            <img src={song.cover_art} alt={song.title} className="object-cover" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm">
              {song.title} - {song.artist}
            </p>
            <p className="text-sm">{song.duration}</p>
            <button onClick={() => playSong(song.id)} className="border text-sm font-semibold rounded-lg p-1 cursor-pointer">
              Play song
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
