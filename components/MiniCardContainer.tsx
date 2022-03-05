import TVMazeCard from "../components/TVMazeCard";
import { TVMazeShow } from "../types";

const MiniCardContainer = ({ shows }: { shows: Array<TVMazeShow> }) => {
  return (
    <div className="pt-24 pb-8 flex justify-center flex-wrap gap-8 overflow-y-scroll scroll-smooth max-h-full">
      {shows.map((Title: TVMazeShow) => (
        <TVMazeCard key={Title.externals.thetvdb} show={Title} />
      ))}
    </div>
  );
};

export default MiniCardContainer;
