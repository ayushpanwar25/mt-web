import useSWR from "swr";
import { SonarrTitle } from "../types";
import TitleCard from "../components/TitleCard";
import MTHeader from "../components/MTHeader";

const FollowedShows = () => {
  const ids = [289590, 281662, 270915, 338186, 368643]; //example followed shows(tvdbIds)
  const { data, error } = useSWR([ids], getShows, { revalidateOnFocus: false });

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 justify-left gap-4 content-center">
      <MTHeader />
      <div className="flex flex-wrap gap-4">
        {data.map((Title: SonarrTitle) => (
          <TitleCard key={Title.tvdbId} show={Title} />
        ))}
      </div>
    </div>
  );
};

async function getShows(ids: Array<number>) {
  return await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(
        `http://${process.env.SONARR_URL}/api/v3/series/lookup?term=tvdb:${id}&apikey=${process.env.SONARR_API_KEY}`
      );
      const titleArr = await res.json();
      return titleArr[0];
    })
  );
}

export default FollowedShows;
