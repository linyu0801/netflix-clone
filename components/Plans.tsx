import Link from 'next/link';
import { useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { loadCheckout } from '../lib/stripe';
import { Product } from '@stripe/firestore-stripe-payments';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import Table from './Table';
import Loader from './Loader';

interface Props {
  products: Product[];
}

const Plans = ({ products }: Props) => {
  const { logout, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2]);
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  const subscribeToPlan = () => {
    if (!user) return;

    // stripe 結帳
    loadCheckout(selectedPlan?.prices[0].id!);
    setIsBillingLoading(true);
  };

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>
        <button
          className="text-lg font-medium hover:underline "
          onClick={logout}
        >
          登出
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">選擇適合您的方案</h1>
        <ul>
          <li className="flex items-center gap-x-2 text-lg">
            <BiCheck className="h-7 w-7 text-[#E50914]" /> 盡情觀賞。全無廣告。
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <BiCheck className="h-7 w-7 text-[#E50914]" />
            為您量身打造的推薦片單。
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <BiCheck className="h-7 w-7 text-[#E50914]" />
            可隨時更改方案或取消。
          </li>
        </ul>

        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center justify-end self-end md:w-3/5">
            {products.map((product) => (
              <div
                className={`planBox ${
                  selectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'
                }`}
                key={product.id}
                onClick={() => setSelectedPlan(product)}
              >
                {product.name}
              </div>
            ))}
          </div>

          <Table products={products} selectedPlan={selectedPlan} />

          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? <Loader color="fill-gray-400" /> : 'Subscribe'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Plans;
// https://www.netflix.com/signup/planform
