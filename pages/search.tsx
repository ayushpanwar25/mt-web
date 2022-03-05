import useSWR, { useSWRConfig } from "swr";
import { SonarrTitle, ITraktSearch, ITraktTitle } from "../types";
import TitleCard from "../components/TitleCard";
import MTHeader from "../components/MTHeader";
import { debounce, memoize } from "lodash";
import Trakt from "trakt.tv";
import { useState } from "react";
import Layout from "../components/Layout";

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
    <div>
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
          <div className="flex flex-wrap gap-4">
            {data.map((Title: SonarrTitle) => (
              <TitleCard key={Title.tvdbId} show={Title} />
            ))}
          </div>
        )
      ) : (
        <div>Start typing retard</div>
      )}
    </div>
  );
};

/* const trakt = new Trakt({
  client_id: process.env.TRAKT_CLIENT_ID,
  client_secret: process.env.TRAKT_CLIENT_SECRET,
  redirect_uri: null,
  api_url: "https://api.trakt.tv",
  useragent: null,
  pagination: true,
});

const getShows = memoize(async (query: string) => {
  const TraktTitles: ITraktSearch[] = await trakt.search.text({ query: query, type: "show" });
  const ids: number[] = TraktTitles.map((Title: ITraktSearch) => Title.show!.ids.tvdb);

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
