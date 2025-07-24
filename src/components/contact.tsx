"use client"

import { motion } from "framer-motion"
import { Mail, Github, Linkedin, Twitter } from "lucide-react"

export default function Contact() {
  const socials = [
    {
      name: "Email",
      href: "mailto:hello@clementine.so",
      icon: Mail,
    },
    {
      name: "GitHub",
      href: "https://github.com",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
    },
  ]

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Get In Touch
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            I&apos;m always interested in hearing about new projects and opportunities. 
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            {socials.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{social.name}</span>
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}