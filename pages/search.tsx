import useSWR, { useSWRConfig } from "swr";
import {
  SonarrTitle,
  ITraktSearch,
  ITraktTitle,
  TVMazeShow,
  ITraktWrapper,
} from "../types";
import { debounce, memoize } from "lodash";
import { useState } from "react";
import Layout from "../components/Layout";
import CardContainer from "../components/CardContainer";

type Props = {
  PassedQuery?: string;
};

const Search = ({ PassedQuery = "" }: Props) => {
  const [query, setQuery] = useState(PassedQuery);
  const [touched, setTouched] = useState(false);
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(query, getShows, { revalidateOnFocus: false });

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    setQuery(e.target.value);
    mutate(query);
  }, 500);

  return (
    <div className="pt-24">
      <div className="form-control">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered"
          onChange={handleChange}
        />
      </div>
      {touched ? (
        !data ? (
          error ? (
            <div>{error.message}</div>
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <CardContainer shows={data} />
        )
      ) : null}
    </div>
  );
};

//TRAKT + TVMAZE
/* const getShows = memoize(async (query: string) => {
  const TraktResult = await fetch(
    `https://api.trakt.tv/search/show?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "trakt-api-key": process.env.TRAKT_CLIENT_ID!,
        "trakt-api-version": "2",
        "Content-Type": "application/json",
      },
    }
  );
  const TraktResultJSON: Array<ITraktWrapper> = await TraktResult.json();
  const ids: number[] = TraktResultJSON.map(
    (Wrapper) => Wrapper.show!.ids.tvdb
  );
  const titles: Array<TVMazeShow> = await Promise.all(
    ids.map((id) => fetch(`https://api.tvmaze.com/lookup/shows?thetvdb=${id}`))
  ).then((shows) => Promise.all(shows.map((show) => show.json())));
  return titles.filter((t) => t && t);
}); */

const getShows = memoize(async (query: string) => {
  const res = await fetch(
    `http://${process.env.SONARR_URL}/api/v3/series/lookup?term=${query}&apikey=${process.env.SONARR_API_KEY}`
  );
  const titles: Array<SonarrTitle> = await res.json();
  return titles.slice(0, 16);
});

Search.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Search;
