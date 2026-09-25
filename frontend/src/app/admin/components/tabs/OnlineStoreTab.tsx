import React from 'react';
import LandingPageSubTab from './onlinestore/LandingPageSubTab';
import ProductPageSubTab from './onlinestore/ProductPageSubTab';
import ReviewsSubTab from './onlinestore/ReviewsSubTab';

export default function OnlineStoreTab(props: any) {
  const { activeTab, customizeSubTab } = props;
  
  return (
    <>
      {activeTab === "online-store" && customizeSubTab === "landing" && <LandingPageSubTab {...props} />}
      {activeTab === "online-store" && customizeSubTab === "product" && <ProductPageSubTab {...props} />}
      {activeTab === "online-store" && customizeSubTab === "reviews" && <ReviewsSubTab {...props} />}
    </>
  );
}
