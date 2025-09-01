import Proyectos from "@/components/Proyectos";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import Servicios from "@/components/Servicios";
import Nosotros from "@/components/Nosotros";
import Footer from "@/components/Footer";


export default function Landing() {
  return (
    <>
      <Header/>
      <main className="p-4">
        <Carousel/>
        <Servicios/>
        <Nosotros/>
        <Proyectos/>
        <Footer/>
      </main>
    </>
  );
}
