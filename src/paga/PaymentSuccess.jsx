import { useEffect } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {

  const [params] = useSearchParams();

  useEffect(() => {

    const orderId =
      params.get("orderId");

    const paymentId =
      params.get("id");

    axios.post(

      "https://final-project-production-3b18.up.railway.app/api/payment-success",

      {

        orderId,

        paymentId,

      }

    )

    .then(() => {

      toast.success("Payment Successful");

    });

  }, []);

  return (

    <div>

      <h1>Payment Success </h1>

    </div>

  );

}