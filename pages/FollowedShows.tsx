//import useSWR from "swr";
import { SonarrTitle, TVMazeShow } from "../types";
//import TitleCard from "../components/TitleCard";
import MiniCardContainer from "../components/MiniCardContainer";
import Layout from "../components/Layout";
import { ReactElement } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

/* const FollowedShows = () => {
  const ids = [289590, 281662, 270915, 338186, 368643]; //example followed shows(tvdbIds)
  const { data, error } = useSWR([ids], getShows, { revalidateOnFocus: false });

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-wrap gap-4">
      {data.map((Title: SonarrTitle) => (
        <TitleCard key={Title.tvdbId} show={Title} />
      ))}
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
} */

const FollowedShows = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <MiniCardContainer shows={data} />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const ids = [
    289590, 281662, 270915, 338186, 368643, 371980, 391153, 329089, 366924,
    279536, 368166,
  ]; //example followed shows(tvdbIds)
  const titles: Array<TVMazeShow> = await Promise.all(
    ids.map((id) => fetch(`https://api.tvmaze.com/lookup/shows?thetvdb=${id}`))
  ).then((shows) => Promise.all(shows.map((show) => show.json())));
  return { props: { data: titles } };
};

FollowedShows.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default FollowedShows;
