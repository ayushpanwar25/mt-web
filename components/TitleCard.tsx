import Image from "next/image";
import Link from "next/link";
import { SonarrTitle } from "../types";

export default function TitleCard({ show }: { show: SonarrTitle }) {
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={`/title/${encodeURIComponent(show.tvdbId)}`}>
      <div className="card card-compact w-52 bg-base-100 shadow-xl cursor-pointer	">
        <figure>
          <Image
            src={
              show.remotePoster
                ? show.remotePoster
                : "https://artworks.thetvdb.com/banners/posters/289590-12.jpg"
            }
            alt={show.title}
            width="208px"
            height="306px"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title truncate">{show.title}</h2>
          <p>
            {show.year} | {show.statistics.seasonCount} seasons
          </p>
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
