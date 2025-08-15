import Hero from "../components/Hero";
import Portfolio from "../components/Portfolio";
import HeroIntro from "../components/HeroIntro";
import WhyChooseUs from "../components/WhyChooseUs";
import HowToRegisterSection from "../components/HowToRegisterSection";

export default function Landing() {
  return (
    <>
      <Hero />
      <HowToRegisterSection />
      <HeroIntro />
      <Portfolio />
      <WhyChooseUs />
    </>
  );
}
