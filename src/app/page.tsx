import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Contact from "@/components/contact"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  )
}