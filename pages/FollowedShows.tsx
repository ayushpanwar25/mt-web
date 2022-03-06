//import useSWR from "swr";
import { SonarrTitle, TVMazeShow } from "../types";
import CardContainer from "../components/CardContainer";
import Layout from "../components/Layout";
import { ReactElement } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const FollowedShows = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <CardContainer shows={data} />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const ids = [
    289590, 281662, 270915, 338186, 368643, 371980, 391153, 329089, 366924,
    279536, 368166,
  ]; //example followed shows(tvdbIds)
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

//TVMAZE
/* export const getServerSideProps: GetServerSideProps = async () => {
	const ids = [
		289590, 281662, 270915, 338186, 368643, 371980, 391153, 329089, 366924,
		279536, 368166,
	]; //example followed shows(tvdbIds)
	const titles: Array<TVMazeShow> = await Promise.all(
		ids.map((id) => fetch(`https://api.tvmaze.com/lookup/shows?thetvdb=${id}`))
	).then((shows) => Promise.all(shows.map((show) => show.json())));
	return { props: { data: titles } };
}; */

FollowedShows.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default FollowedShows;
