import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Modal";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "../atoms/modalAtom";
import { Element, Genre, Movie } from "../typings";
import ReactPlayer from "react-player/lazy";
import { FaCheck, FaPlay, FaPlus } from "react-icons/fa";
import { HiOutlineThumbUp } from "react-icons/hi";
import { BsVolumeUp, BsVolumeMute } from "react-icons/bs";
import useAuth from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [muted, setMuted] = useState(true);
  const [addedToList, setAddedToList] = useState(false);
  const { user } = useAuth();
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

  const toastStyle = {
    background: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "15px",
    borderRadius: "9999px",
    maxWidth: "1000px",
  };

  useEffect(() => {
    if (!movie) return;

    const getMovie = async () => {
      // append_to_response=videos 回傳影片 只適用回傳單一影片時
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      )
        .then((res) => res.json())
        .catch((e) => console.log(e));
      console.log(data);

      if (data?.videos) {
        const trailerData = data.videos.results.find(
          (el: Element) => el.type === "Trailer"
        );
        setTrailer(trailerData?.key || "");
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
    };
    getMovie();
  }, [movie]);

  const handleClose = () => {
    setShowModal(false);
    setMovie(null);
    toast.dismiss();
  };

  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, "customers", user.uid, "myList"),
        (snapshot) => setMovies(snapshot.docs)
      );
    }
  }, [db, movie?.id]);

  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  );
  useEffect(() => {
    console.log({ addedToList });
  }, [addedToList]);

  // myList 為 customer 內的一個欄位紀錄 customer 收藏的影片
  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!)
      );

      toast(`${movie?.title || movie?.original_name}已從我的收藏移除`, {
        duration: 8000,
        style: toastStyle,
      });
    } else {
      await setDoc(
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!),
        {
          ...movie,
        }
      );

      toast(`${movie?.title || movie?.original_name}已新增到我的收藏`, {
        duration: 8000,
        style: toastStyle,
      });
    }
  };

  return (
    <Dialog
      open={showModal}
      onClose={handleClose}
      className=" fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll
      rounded-md scrollbar-hide "
    >
      <>
        <Toaster position="bottom-center" />
        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818]
          hover:bg-[#181818]"
        >
          {/* <AiOutlineClose className="w-6" />           */}
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.707 6.293a1 1 0 011.414 0L12 10.586l3.293-3.293a1 1 0 111.414 1.414L13.414 12l3.293 3.293a1 1 0 01-1.414 1.414L12 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 12 7.293 8.707a1 1 0 010-1.414z"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            muted={muted}
          />
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button
                className="transision flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold
              text-black hover:bg-[#e6e6e6]"
              >
                <FaPlay className="h-8 w-7 text-black" />
                播放
              </button>
              <button className="modalButton " onClick={handleList}>
                {addedToList ? (
                  <FaCheck className="h-7 w-7" />
                ) : (
                  <FaPlus className="h-7 w-7" />
                )}
              </button>
              <button className="modalButton ">
                <HiOutlineThumbUp className="h-7 w-7" />
              </button>
            </div>
            <button
              className="modalButton"
              onClick={() => setMuted((prev) => !prev)}
            >
              {muted ? (
                <BsVolumeMute className="h-7 w-7" />
              ) : (
                <BsVolumeUp className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg ">
            <div className="flex items-center space-x-2 text-sm ">
              <p className="font-semibold text-green-400">
                {movie!.vote_average * 10}% 適合您
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div
                className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5
              text-xs"
              >
                高畫質
              </div>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres: </span>
                  {genres.map((genre) => genre.name).join(", ")}
                </div>
                <div>
                  <span className="text-[gray]">Original language: </span>
                  {movie?.original_language}
                </div>
                <div>
                  <span className="text-[gray]">Total votes: </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Dialog>
  );
};

export default Modal;
