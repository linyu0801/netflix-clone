import { Product } from "@stripe/firestore-stripe-payments";
import { BsCheck2 } from "react-icons/bs";

interface Props {
  products: Product[];
  selectedPlan: Product | null;
}

function Table({ products, selectedPlan }: Props) {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <tr className="tableRow">
          <td className="tableDataTitle">月費</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? "text-[#E50914]"
                  : "text-[gray]"
              }`}
              key={product.id}
            >
              ${product.prices[0].unit_amount! / 100}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">畫質</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? "text-[#E50914]"
                  : "text-[gray]"
              }`}
              key={product.id}
            >
              {product.metadata.videoQuality}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">解析度</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? "text-[#E50914]"
                  : "text-[gray]"
              }`}
              key={product.id}
            >
              {product.metadata.resolution}
            </td>
          ))}
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">在電視、電腦、手機和平板電腦上觀賞</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? "text-[#E50914]"
                  : "text-[gray]"
              }`}
              key={product.id}
            >
              {product.metadata.portability === "true" && (
                <BsCheck2 className="inline-block h-8 w-8" />
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
