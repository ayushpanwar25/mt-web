import TitleCard from "./TitleCard";
import { SonarrTitle } from "../types";

const CardContainer = ({ shows }: { shows: Array<SonarrTitle> }) => {
  return (
    <div className="pb-8 flex justify-center flex-wrap gap-8 overflow-y-scroll scroll-smooth max-h-full">
      {shows.map((Title: SonarrTitle) => (
        <TitleCard key={Title.tvdbId} show={Title} />
      ))}
    </div>
  );
};

export default CardContainer;
