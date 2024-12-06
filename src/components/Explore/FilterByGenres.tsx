import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useSearchParams } from "react-router-dom";
import { useCurrentParams } from "../../hooks/useCurrentParams";
import { getRecommendGenres2 } from "../../services/search";
import { getRecommendGenres2Type } from "../../shared/types";

interface FilterByGenresProps {
  currentTab: string;
}

const FilterByGenres: FunctionComponent<FilterByGenresProps> = ({
  currentTab,
}) => {
  const [genres] = useAutoAnimate();
  const queryOptions: UseQueryOptions<
    getRecommendGenres2Type,
    Error,
    getRecommendGenres2Type,
    string[]
  > = {
    queryKey: ["genres"],
    queryFn: getRecommendGenres2,
  };
  const { isLoading, data, isError, error } = useQuery(queryOptions);

  const [searchParam, setSearchParam] = useSearchParams();

  // const currentSearchParams = {} as any;
  // const QUERY_PARAMS_THAT_SHARE_SAME_NAME: { [key: string]: string[] } = {
  //   genre: [],
  // };

  // searchParam.forEach((value, key) => {
  //   if (key in QUERY_PARAMS_THAT_SHARE_SAME_NAME) {
  //     QUERY_PARAMS_THAT_SHARE_SAME_NAME[key].push(value);
  //   }
  //   currentSearchParams[key] = value;
  // });

  const [currentSearchParams] = useCurrentParams();

  if (isError) return <div>ERROR: {error.message}</div>;

  if (isLoading)
    return (
      <div className="mt-20 mb-20 mx-auto h-10 w-10 rounded-full border-[5px] border-dark-darken border-t-transparent animate-spin"></div>
    );

  if (!data) return <div>No genres available</div>;

  const chooseGenre = (genreId: string) => {
    const existingGenres = searchParam.getAll("genre");

    if (existingGenres.includes(genreId)) {
      const newGenres = existingGenres.filter(
        (genre: string) => genre !== genreId
      );
      setSearchParam({
        ...currentSearchParams,
        genre: newGenres,
      });
    } else {
      setSearchParam({
        ...currentSearchParams,
        genre: [...existingGenres, genreId],
      });
    }
  };

  const movieGenres: { id: number; name: string }[] = data.movieGenres;
  const tvGenres: { id: number; name: string }[] = data.tvGenres;

  return (
    <ul
      // @ts-ignore
      ref={genres}
      className="flex gap-3 flex-wrap max-h-[200px] overflow-y-auto"
    >
      {currentTab === "movie" &&
        movieGenres.map((genre: { id: number; name: string }) => (
          <li key={genre.id}>
            <button
              onClick={() => chooseGenre(String(genre.id))}
              className={`px-4 py-1 border border-[#989898] rounded-full hover:brightness-75 transition duration-300 inline-block ${
                searchParam.getAll("genre").includes(String(genre.id)) &&
                "bg-primary text-white"
              }`}
            >
              {genre.name}
            </button>
          </li>
        ))}
      {currentTab === "tv" &&
        tvGenres.map((genre: { id: number; name: string }) => (
          <li key={genre.id}>
            <button
              onClick={() => chooseGenre(String(genre.id))}
              className={`px-4 py-1 border border-[#989898] rounded-full hover:brightness-75 transition duration-300 inline-block ${
                searchParam.getAll("genre").includes(String(genre.id)) &&
                "bg-primary text-white"
              }`}
            >
              {genre.name}
            </button>
          </li>
        ))}
    </ul>
  );
};

export default FilterByGenres;

// to={`/explore?genre=${encodeURIComponent(genre.id)}`}
