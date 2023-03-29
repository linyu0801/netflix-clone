import React, { useRef, useState } from 'react';
import { Movie } from '../typings';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Thumbnail from './Thumbnail';
interface Props {
  title: string;
  movies: Movie[];
  // movie: Movie | DocumentData; // 使用 firebase時
}
const Row = ({ title, movies }: Props) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState<Boolean>(false);
  const handleClick = (direction: string) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      <h2
        className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] 
      transition duration-200 hover:text-white md:text-2xl"
      >
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <IoIosArrowBack
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-6 
          cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-125 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => {
            handleClick('left');
          }}
        />
        <div
          className="flex items-center gap-x-0.5 overflow-x-scroll scrollbar-hide md:gap-x-2.5
        md:p-2"
          ref={rowRef}
        >
          {movies.map((movie) => (
            <Thumbnail key={movie.id} movie={movie} />
          ))}
        </div>
        <IoIosArrowForward
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-6 
        cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-125"
          onClick={() => {
            handleClick('right');
          }}
        />
      </div>
    </div>
  );
};

export default Row;

