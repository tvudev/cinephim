import { useInfiniteQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getExploreMovie, getExploreTV } from "../../services/explore";
import { ItemsPage, ConfigType } from "../../shared/types";
import FilmItem from "../Common/FilmItem";

interface ExploreResultProps {
  currentTab: string;
  config: ConfigType;
}

const ExploreResult: FunctionComponent<ExploreResultProps> = ({
  currentTab,
  config,
}) => {
  const { data: movies, error: errorMovies, fetchNextPage: fetchNextPageMovie } = useInfiniteQuery({
    queryKey: ['explore-result-movie', config],
    queryFn: ({ pageParam = 1 }) => getExploreMovie(pageParam as number, config),
    getNextPageParam: (lastPage: ItemsPage) => {
      if (!lastPage.results.length) return undefined;
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    initialPageParam: 1
  });

  const { data: tvs, error: errorTVs, fetchNextPage: fetchNextPageTv } = useInfiniteQuery({
    queryKey: ['explore-result-tv', config],
    queryFn: ({ pageParam = 1 }) => getExploreTV(pageParam as number, config),
    getNextPageParam: (lastPage: ItemsPage) => {
      if (!lastPage.results.length) return undefined;
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    initialPageParam: 1
  });

  if (errorMovies) return <div>ERROR: {errorMovies.message}</div>;
  if (errorTVs) return <div>ERROR: {errorTVs.message}</div>;

  return (
    <>
      {currentTab === "movie" && (
        <InfiniteScroll
          dataLength={movies?.pages?.reduce((acc, page) => acc + page.results.length, 0) || 0}
          next={fetchNextPageMovie}
          hasMore={!!movies?.pages?.[movies.pages.length - 1]?.total_pages}
          loader={<div>Loading...</div>}
          endMessage={<div>No more results</div>}
        >
          <div className="grid grid-cols-sm md:grid-cols-lg gap-x-8 gap-y-10">
            {movies?.pages?.map(page => 
              page.results.map(item => (
                <FilmItem key={item.id} item={item} />
              ))
            )}
          </div>
        </InfiniteScroll>
      )}
      {currentTab === "tv" && (
        <InfiniteScroll
          dataLength={tvs?.pages?.reduce((acc, page) => acc + page.results.length, 0) || 0}
          next={fetchNextPageTv}
          hasMore={!!tvs?.pages?.[tvs.pages.length - 1]?.total_pages}
          loader={<div>Loading...</div>}
          endMessage={
            <div className="flex flex-col items-center mb-12">
              <LazyLoadImage
                src="/error.png"
                alt="No more results"
                effect="opacity"
                className="w-[600px] object-cover"
              />
              <p className="text-xl mt-5">No more results</p>
            </div>
          }
        >
          <div className="grid grid-cols-sm md:grid-cols-lg gap-x-8 gap-y-10">
            {tvs?.pages?.map(page => 
              page.results.map(item => (
                <FilmItem key={item.id} item={item} />
              ))
            )}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

export default ExploreResult;
