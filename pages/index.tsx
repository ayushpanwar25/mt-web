import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import Trakt from "trakt.tv";
import Layout from "../components/Layout";
import CardContainer from "../components/CardContainer";
import { SonarrTitle, ITraktSearch } from "../types";

const Home = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <CardContainer shows={data} />;
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
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
