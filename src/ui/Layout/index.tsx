import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Banner
        announcements={[
          "🎁 FREE STICKER SET ON ORDERS OVER $60!",
          "🚚 Enjoy FREE shipping on all orders above $100!",
          "🔥 Limited-time sale: Get 20% off on all items!",
          "🎉 New arrivals just dropped! Check them out now!",
        ]}
      />
      <Header />
      {children}
      <Footer />
    </>
  );
}
