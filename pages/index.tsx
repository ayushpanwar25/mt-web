import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import Trakt from "trakt.tv";
import Layout from "../components/Layout";
//import TitleCard from "../components/TitleCard";
//import TVMazeCard from "../components/TVMazeCard";
import MiniCardContainer from "../components/MiniCardContainer";
import { SonarrTitle, ITraktSearch, TVMazeShow } from "../types";

/* const Home = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="flex flex-wrap gap-4">
      {data.map((Title: SonarrTitle) => (
        <TitleCard key={Title.tvdbId} show={Title} />
      ))}
    </div>
  );
};

const trakt = new Trakt({
  client_id: process.env.TRAKT_CLIENT_ID,
  client_secret: process.env.TRAKT_CLIENT_SECRET,
  redirect_uri: null,
  api_url: "https://api.trakt.tv",
  useragent: null,
  pagination: true,
});

export const getServerSideProps: GetServerSideProps = async () => {
  const TraktResult: ITraktSearch = await trakt.shows.trending({
    page: 1,
    limit: 32,
  });
  const ids: number[] = TraktResult.data.map(
    (Wrapper) => Wrapper.show!.ids.tvdb
  );
  const titles: Array<SonarrTitle> = await Promise.all(
    ids.map((id) =>
      fetch(
        `http://${process.env.SONARR_URL}/api/v3/series/lookup?term=tvdb:${id}&apikey=${process.env.SONARR_API_KEY}`
      )
    )
  )
    .then((res) => Promise.all(res.map((r) => r.json())))
    .then((res) => res.map((r) => r[0]));
  return { props: { data: titles } };
}; */

const Home = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <MiniCardContainer shows={data} />;
};

const trakt = new Trakt({
  client_id: process.env.TRAKT_CLIENT_ID,
  client_secret: process.env.TRAKT_CLIENT_SECRET,
  redirect_uri: null,
  api_url: "https://api.trakt.tv",
  useragent: null,
  pagination: true,
});

export const getServerSideProps: GetServerSideProps = async () => {
  const TraktResult: ITraktSearch = await trakt.shows.trending({
    page: 1,
    limit: 32,
  });
  const ids: number[] = TraktResult.data.map(
    (Wrapper) => Wrapper.show!.ids.tvdb
  );
  const titles: Array<TVMazeShow> = await Promise.all(
    ids.map((id) => fetch(`https://api.tvmaze.com/lookup/shows?thetvdb=${id}`))
  ).then((shows) => Promise.all(shows.map((show) => show.json())));
  return { props: { data: titles } };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
