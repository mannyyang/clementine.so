"use client"

import { motion } from "framer-motion"

export default function About() {
  const skills = [
    "React", "Next.js", "TypeScript", "Node.js", 
    "Tailwind CSS", "PostgreSQL", "GraphQL", "AWS"
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            About Me
          </h2>
          
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p>
              I&apos;m a passionate developer focused on creating beautiful, functional web experiences. 
              With a strong foundation in modern web technologies, I enjoy tackling complex problems 
              and turning ideas into reality.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring new technologies, contributing to open source, 
              or sharing knowledge with the developer community.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-center">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}