import Portfolio from "@/components/home/Portfolio";

export const metadata = {
    title: "Portfolio | AI Voice Systems",
    description: "Explore all AI voice architectures and automation systems built for industry-leading companies.",
};

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300 pt-16">
            <Portfolio showAll />
        </main>
    );
}
