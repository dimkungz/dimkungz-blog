import { NavBar, HeroSection, Footer } from "./components/MainPage"
import ArticleSection from "./components/ArticleSection"


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
