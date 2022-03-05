import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import { SonarrTitle } from "../../types";
import startCase from "lodash/startCase";
import Layout from "../../components/Layout";
import memoize from "lodash.memoize";

const TitlePage = () => {
  const router = useRouter();
  const { tid } = router.query;
  const { data, error } = useSWR(tid, getShow, { revalidateOnFocus: false });

  return (
    <div className="card card-normal w-full bg-base-100 shadow-xl ">
      {!data ? (
        error ? (
          <div>{error.message}</div>
        ) : (
          <div className="card-body animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="card-body flex-row justify-start">
          {data.remotePoster && (
            <figure>
              <Image
                src={data.remotePoster}
                alt={data.title}
                width="208px"
                height="306px"
              />
            </figure>
          )}

          <div className="textwrap">
            <div className="card-title">{data.title}</div>
            <p>{data.overview}</p>
            <div className="streams">
              {Object.keys(data.streams).map((stream) => (
                <a key={stream} href={data.streams[stream].in.link}>
                  <button className="btn">{startCase(stream)}</button>
                </a>
              ))}
              <a
                href={`https://app.strem.io/shell-v4.4/#/detail/series/${data.imdbId}/`}
              >
                <button className="btn">Stremio</button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getShow = memoize(async (id: number) => {
  const res = await fetch(
    `http://${process.env.SONARR_URL}/api/v3/series/lookup?term=tvdb:${id}&apikey=${process.env.SONARR_API_KEY}`
  );
  const titleArr: Array<SonarrTitle> = await res.json();
  const streams = await getStreams(titleArr[0].imdbId);
  return { ...titleArr[0], streams };
});

const getStreams = memoize(async (imdbId: string) => {
  const res = await fetch(
    `https://streaming-availability.p.rapidapi.com/get/basic?country=in&imdb_id=${imdbId}&output_language=en`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      },
    }
  );
  const title = await res.json();
  return title.streamingInfo;
});

TitlePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TitlePage;
