import { Provider } from "@/lib/providers";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <div className="flex flex-col min-h-screen">
        <Banner />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </Provider>
  );
}
