import Hero from "@/components/home/Hero";
import Problem from "@/components/home/Problem";
import Solutions from "@/components/home/Solutions";
import UseCases from "@/components/home/UseCases";
import Portfolio from "@/components/home/Portfolio";
import HowItWorks from "@/components/home/HowItWorks";
import TechStack from "@/components/home/TechStack";
import About from "@/components/home/About";
import Consultation from "@/components/home/Consultation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black w-full overflow-hidden">
      <Hero />
      <Problem />
      <Solutions />
      <UseCases />
      <Portfolio />
      <HowItWorks />
      <TechStack />
      <About />
      <Consultation />
    </div>
  );
}
