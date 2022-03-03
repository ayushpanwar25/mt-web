import Image from "next/image";
import { SonarrTitle } from "../types";

export default function TitleCard({ show }: { show: SonarrTitle }) {
  return (
    <div className="card card-compact w-52 bg-base-100 shadow-xl">
      <figure>
        <Image
          src={show.remotePoster}
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
  );
}
