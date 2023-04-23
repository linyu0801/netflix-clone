import {
  createCheckoutSession,
  getStripePayments,
} from "@stripe/firestore-stripe-payments";
import { getFunctions, httpsCallable } from "@firebase/functions";
import app from "../firebase";

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});

const loadCheckout = async (priceId: string) => {
  await createCheckoutSession(payments, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  })
    .then((snapshot) => window.location.assign(snapshot.url))
    .catch((e) => console.log(e.message));
};

const goToBillingPortal = async () => {
  // 取得當前firebase application instance  可在 firebase extention裡面找到設定
  // us-central1 為 firebase 中 Run Payments with Stripe => Cloud Functions deployment location設定值
  const instance = getFunctions(app, "us-central1");

  const functionRef = httpsCallable(
    instance,
    "ext-firestore-stripe-payments-createPortalLink"
  );
  await functionRef({
    returnUrl: `${window.location.origin}/account`,
  })
    .then(({ data }: any) => window.location.assign(data.url))
    .catch((error) => console.log(error.message));
};

export { loadCheckout, goToBillingPortal };
export default payments;
