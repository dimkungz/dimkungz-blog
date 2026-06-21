import { NavBar, HeroSection, ArticleSection, Footer } from "./components/AllComponents"

function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </div>
  )
}

export default App
