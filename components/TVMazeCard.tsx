import Image from "next/image";
import Link from "next/link";
import { TVMazeShow } from "../types";

export default function TVMazeCard({ show }: { show: TVMazeShow }) {
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={`/title/${encodeURIComponent(show.externals.thetvdb)}`}>
      <div className="card card-compact w-52 bg-base-100 shadow-xl cursor-pointer	">
        <figure>
          <Image
            src={
              show.image
                ? show.image.original
                : "https://artworks.thetvdb.com/banners/posters/289590-12.jpg"
            }
            alt={show.name}
            width="208px"
            height="306px"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title truncate">{show.name}</h2>
          <p>{show.premiered.slice(0, 4)}</p>
          <div className="card-actions justify-end">
            {show.genres.map((genre: string) => {
              <div className="badge badge-outline">{genre}</div>;
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
