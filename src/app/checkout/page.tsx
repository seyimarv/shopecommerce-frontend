"use client";

import PageSpinner from "@/ui/common/components/spinner/page-spinner";
import dynamic from 'next/dynamic';

const DynamicCheckoutTemplate = dynamic(
  () => import('@/ui/checkout'), 
  { 
    ssr: false, 
    loading: () => <PageSpinner /> 
  }
);

const Checkout = () => {
  return (

      <DynamicCheckoutTemplate /> 

  );
};

export default Checkout;
