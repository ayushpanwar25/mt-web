import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import { SonarrTitle } from "../../types";
import MTHeader from "../../components/MTHeader";

export default function TitlePage() {
  const router = useRouter();
  const { tid } = router.query;
  const { data, error } = useSWR(tid, getShow, { revalidateOnFocus: false });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 justify-left gap-4 content-center">
      <MTHeader />
      <div className="card card-normal w-full bg-base-100 shadow-xl ">
        {!data ? (
          "Loading..."
        ) : (
          <div className="card-body flex-row justify-start">
            <figure>
              <Image
                src={data.remotePoster}
                alt={data.title}
                width="208px"
                height="306px"
              />
            </figure>
            <div className="textwrap">
              <div className="card-title">{data.title}</div>
              <p>{data.overview}</p>
              <div>
                {data.streams.length === 0 ? (
                  "No streams available in India"
                ) : (
                  <div>
                    {Object.keys(data.streams).map((stream) => {
                      return (
                        <p key={stream}>
                          <a href={data.streams[stream].in.link}>{stream}</a>
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

async function getShow(id: number) {
  const res = await fetch(
    `http://${process.env.SONARR_URL}/api/v3/series/lookup?term=tvdb:${id}&apikey=${process.env.SONARR_API_KEY}`
  );
  const titleArr: Array<SonarrTitle> = await res.json();
  const streams = await getStreams(titleArr[0].imdbId);
  return { ...titleArr[0], streams };
}

async function getStreams(imdbId: string) {
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
}
