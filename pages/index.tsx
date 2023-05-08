import { getProducts, Product } from '@stripe/firestore-stripe-payments';
import { useRecoilValue } from 'recoil';
import { Movie } from '../typings';
import { modalState } from '../atoms/modalAtom';
import Head from 'next/head';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Modal from '../components/Modal';
import Plans from '../components/Plans';
import Row from '../components/Row';
import useAuth from '../hooks/useAuth';
import useList from '../hooks/useList';
import useSubscription from '../hooks/useSubscription';
import payments from '../lib/stripe';
import requests from '../utils/requests';
import { loadingState } from '../atoms/loadingAtom';
import Loader from '../components/Loader';

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}: Props) => {
  const { user } = useAuth();
  const showModal = useRecoilValue(modalState);
  const loading = useRecoilValue(loadingState);
  const subscription = useSubscription(user);
  const list = useList(user?.uid);

  // if (loading || subscription === null)
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Loader color="fill-gray-400" />
  //     </div>
  //   );

  // if (!subscription) return <Plans products={products} />;

  return (
    <div
      className={`relative h-screen bg-gradient-to-b ${
        showModal && '!h-screen overflow-hidden'
      }`}
    >
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="google-site-verification"
          content="PrfXYvrtm3WKY2e6tgMntACI12qpjrzYETac2YjP_nY"
        />
      </Head>
      <Header />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="現正熱門" movies={trendingNow} />
          <Row title="最高評價" movies={topRated} />
          <Row title="動作驚悚片" movies={actionMovies} />
          {list.length > 0 && <Row title="我的片單" movies={list} />}
          <Row title="喜劇片" movies={comedyMovies} />
          <Row title="恐怖片" movies={horrorMovies} />
          <Row title="浪漫愛情片" movies={romanceMovies} />
          <Row title="紀錄片" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true, // 只顯示 firebase中 active 為 true 的資料
  })
    .then((res) => res)
    .catch((e) => console.log(e.message));
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products,
    },
  };
};
