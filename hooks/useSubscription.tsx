import { useEffect, useState } from "react";
import {
  onCurrentUserSubscriptionUpdate,
  Subscription,
} from "@stripe/firestore-stripe-payments";
import payments from "../lib/stripe";
import { User } from "firebase/auth";

function useSubscription(user: User | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!user) return;

    onCurrentUserSubscriptionUpdate(payments, (snapshot) => {
      setSubscription(
        snapshot.subscriptions.find(
          (subscription) =>
            subscription.status === "active" ||
            subscription.status === "trialing"
        ) || null
      );
    });
  }, [user]);

  return subscription;
}

export default useSubscription;
