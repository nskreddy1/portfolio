import './index.css'
import { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'

// Animated Particles Background
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 150)})`
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

// Animated Counter Hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref }
}

// Navigation Component
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="nav-logo">
          <span className="logo-text">SUNIL</span>
          <span className="logo-dot">.</span>
        </a>
        <ul className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link" onClick={() => setMobileMenuOpen(false)}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a href="mailto:naragantisunilkumar@gmail.com" className="btn btn-primary btn-nav">
            Hire Me
          </a>
          <div className="nav-social">
            <a
              href="https://www.linkedin.com/in/sunilkumarnaraganti/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-link"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://github.com/SunilKumar2112"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-link"
              aria-label="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
        <div
          className={`nav-mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

// Hero Component
const Hero = () => {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const stats = [
    { value: 5, suffix: '+', label: 'Microservices Built' },
    { value: 85, suffix: '%+', label: 'Test Coverage' },
    { value: 99, suffix: '%', label: 'System Uptime' },
  ]

  return (
    <section className="hero">
      <ParticleBackground />
      <div className="hero-bg"></div>
      <div className="hero-content">
        <div className="hero-badge animate-fadeInUp">
          <span className="badge-dot"></span>
          Available for Freelance Projects
        </div>
        <div className="hero-greeting animate-fadeInUp">
          <span>👋</span> {getGreeting()}!
        </div>
        <h1 className="hero-name animate-fadeInUp">
          I'm <span className="gradient-text">Sunil Kumar</span>
        </h1>
        <p className="hero-title animate-fadeInUp">
          <span className="typed-text">Full Stack Developer</span> specializing in
          <span className="highlight"> Microservices</span> &
          <span className="highlight"> Cloud-Native</span> Solutions
        </p>
        <p className="hero-description animate-fadeInUp">
          I help businesses build <strong>scalable, production-grade applications</strong> that handle high-volume traffic with 99%+ availability.
          Let's transform your vision into robust digital solutions.
        </p>
        <div className="hero-cta animate-fadeInUp">
          <a href="#projects" className="btn btn-primary btn-lg">
            <span>View My Projects</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className="btn btn-secondary btn-lg">
            <span>Let's Discuss Your Project</span>
          </a>
        </div>
        <div className="hero-stats animate-fadeInUp">
          {stats.map((stat) => {
            const { count, ref } = useCounter(stat.value)
            return (
              <div key={stat.label} className="hero-stat" ref={ref}>
                <div className="hero-stat-value">{count}{stat.suffix}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <div className="scroll-indicator"></div>
      </div>
    </section>
  )
}

// Trust Badges Component
const TrustBadges = () => {
  const badges = [
    { icon: '☁️', text: 'Azure Certified' },
    { icon: '🌐', text: 'GCP Certified' },
    { icon: '⚛️', text: 'React Expert' },
    { icon: '🏆', text: 'Award Winner' },
  ]

  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-badges">
          {badges.map((badge) => (
            <div key={badge.text} className="trust-badge">
              <span className="trust-icon">{badge.icon}</span>
              <span className="trust-text">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About Component
const About = () => {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">
            Turning Complex Problems into <span className="gradient-text">Elegant Solutions</span>
          </h2>
        </div>
        <div className="about-content">
          <div className="about-image">
            <div className="about-image-wrapper">
              <div className="about-image-inner">
                <div className="profile-initials">SK</div>
              </div>
              <div className="about-image-ring"></div>
            </div>
          </div>
          <div className="about-text">
            <p className="about-intro">
              As a <strong>Software Engineer at Zensar Technologies</strong>, I specialize in building
              enterprise-grade microservices that power high-volume production systems. My expertise spans
              the full stack, from Spring Boot backends to React frontends.
            </p>
            <div className="about-highlights">
              <div className="about-highlight glass-card">
                <div className="about-highlight-icon">🎯</div>
                <div className="about-highlight-content">
                  <h4>99%+ System Availability</h4>
                  <p>Building fault-tolerant architectures that never let you down</p>
                </div>
              </div>
              <div className="about-highlight glass-card">
                <div className="about-highlight-icon">🧪</div>
                <div className="about-highlight-content">
                  <h4>80%+ Code Coverage</h4>
                  <p>Comprehensive testing for production confidence</p>
                </div>
              </div>
              <div className="about-highlight glass-card">
                <div className="about-highlight-icon">☁️</div>
                <div className="about-highlight-content">
                  <h4>Cloud-Native Expert</h4>
                  <p>Azure & GCP certified with Docker expertise</p>
                </div>
              </div>
              <div className="about-highlight glass-card">
                <div className="about-highlight-icon">🎓</div>
                <div className="about-highlight-content">
                  <h4>B.Tech CSE Graduate</h4>
                  <p>N.B.K.R Institute with First Class Distinction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Services Component
const Services = () => {
  const services = [
    {
      icon: '⚙️',
      title: 'Backend Development',
      description: 'Scalable microservices with Spring Boot, REST APIs, and enterprise patterns.',
      features: ['Spring Boot', 'Microservices', 'REST APIs', 'Groovy']
    },
    {
      icon: '🎨',
      title: 'Frontend Development',
      description: 'Modern, responsive UIs with React, TypeScript, and state-of-the-art tooling.',
      features: ['React', 'TypeScript', 'Chakra UI', 'CSS3']
    },
    {
      icon: '☁️',
      title: 'Cloud & DevOps',
      description: 'Cloud-native deployments with CI/CD pipelines and container orchestration.',
      features: ['Azure', 'GCP', 'Docker', 'Jenkins']
    },
    {
      icon: '🧪',
      title: 'Quality Assurance',
      description: 'Comprehensive testing strategies ensuring production-ready code delivery.',
      features: ['JUnit 5', 'Mockito', 'TestContainers', 'TDD']
    }
  ]

  return (
    <section id="skills" className="section services">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Services</span>
          <h2 className="section-title">
            What I Can <span className="gradient-text">Deliver</span> For You
          </h2>
          <p className="section-subtitle">
            End-to-end development solutions tailored to your business needs
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="service-card glass-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-features">
                {service.features.map((feature) => (
                  <span key={feature} className="service-feature">{feature}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Experience Component
const Experience = () => {
  const achievements = [
    'Owned development of multiple Spring Boot microservices handling high-volume production traffic with 99%+ availability',
    'Led testing initiatives by implementing JUnit and Mockito test suites, achieving 80%+ code coverage',
    'Designed a fault-tolerant retry mechanism for critical order-processing workflow, eliminating manual interventions',
    'Diagnosed and fixed service-layer logic bugs, improving system reliability and user experience',
    'Built Groovy-based backend integrations enabling real-time UI notifications'
  ]

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Experience</span>
          <h2 className="section-title">
            Where I've Made <span className="gradient-text">Impact</span>
          </h2>
        </div>
        <div className="experience-timeline">
          <div className="experience-card glass-card">
            <div className="experience-header">
              <div className="experience-company-info">
                <div className="company-logo">Z</div>
                <div>
                  <div className="experience-company">Zensar Technologies</div>
                  <div className="experience-role">Junior Software Engineer</div>
                </div>
              </div>
              <div className="experience-meta">
                <div className="experience-date">
                  <span className="date-badge">Feb 2025 – Present</span>
                </div>
                <div className="experience-location">📍 Bengaluru, India</div>
              </div>
            </div>
            <ul className="experience-achievements">
              {achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Projects Component with Real Images
const Projects = () => {
  const projects = [
    {
      title: 'E-Commerce Microservices Platform',
      description: 'A production-ready e-commerce backend with 5 independently deployable microservices, featuring service discovery, secure JWT authentication, and comprehensive testing.',
      tech: ['Spring Boot', 'React', 'MySQL', 'Docker', 'Spring Cloud', 'Eureka'],
      features: [
        '5 microservices with Spring Cloud',
        'JWT auth with role-based access',
        '85% test coverage',
        'Containerized with Docker'
      ],
      image: '/ecommerce.png',
      github: 'https://github.com/SunilKumar2112/ecommerce-microservices',
      category: 'Backend'
    },
    {
      title: 'Cineverse - Entertainment Platform',
      description: 'A high-performance movie and TV show discovery app with React Query for efficient caching, infinite scrolling, and a 95+ Lighthouse score.',
      tech: ['React', 'TypeScript', 'Chakra UI', 'React Query', 'TMDB API'],
      features: [
        'Infinite scrolling & debounced search',
        'Genre-based filtering',
        '95+ Lighthouse performance',
        'Automatic CI/CD on Vercel'
      ],
      image: '/cineverse.png',
      github: 'https://github.com/SunilKumar2112/Cineverse',
      live: 'https://cine-verse-eight.vercel.app/',
      category: 'Frontend'
    }
  ]

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Real-world applications demonstrating technical excellence and problem-solving
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.title} className="project-card glass-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-overlay">
                  <span className="project-category">{project.category}</span>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <ul className="project-features">
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className="project-tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    View Code
                  </a>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link project-link-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Certifications Component
const Certifications = () => {
  const certifications = [
    {
      name: 'Azure Fundamentals (AZ-900)',
      issuer: 'Microsoft',
      icon: '☁️',
      color: '#0078d4'
    },
    {
      name: 'Google Cloud Digital Leader',
      issuer: 'Google Cloud',
      icon: '🌐',
      color: '#4285f4'
    },
    {
      name: 'Frontend Developer (React)',
      issuer: 'HackerRank',
      icon: '⚛️',
      color: '#61dafb'
    },
    {
      name: 'SQL & Python',
      issuer: 'Infosys Springboard',
      icon: '💾',
      color: '#00bcd4'
    }
  ]

  return (
    <section id="certifications" className="section certifications">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Credentials</span>
          <h2 className="section-title">
            <span className="gradient-text">Certifications</span> & Recognition
          </h2>
        </div>
        <div className="certifications-grid">
          {certifications.map((cert) => (
            <div key={cert.name} className="cert-card glass-card">
              <div className="cert-icon" style={{ background: `${cert.color}20`, color: cert.color }}>
                {cert.icon}
              </div>
              <div className="cert-info">
                <div className="cert-name">{cert.name}</div>
                <div className="cert-issuer">{cert.issuer}</div>
              </div>
              <div className="cert-badge">✓ Verified</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Achievements Component
const Achievements = () => {
  const achievements = [
    {
      icon: '🥇',
      title: '1st Prize - "Coffee with Java"',
      description: 'Coding Competition by Computer Society of India',
      type: 'Competition'
    },
    {
      icon: '🥈',
      title: '2nd Prize - Tech Spark & Techno Philia',
      description: 'Technical event showcasing problem-solving excellence',
      type: 'Competition'
    },
    {
      icon: '👔',
      title: 'Event Lead - TECHVYUHA',
      description: 'Organized technical symposium with 200+ participants',
      type: 'Leadership'
    },
    {
      icon: '🎤',
      title: 'Speaker - SRUJANA 2K19',
      description: 'Presented on "Graph Theory Applications"',
      type: 'Speaking'
    }
  ]

  return (
    <section id="achievements" className="section achievements">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Recognition</span>
          <h2 className="section-title">
            Achievements & <span className="gradient-text">Leadership</span>
          </h2>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div key={achievement.title} className="achievement-card glass-card">
              <div className="achievement-type">{achievement.type}</div>
              <div className="achievement-icon">{achievement.icon}</div>
              <h4 className="achievement-title">{achievement.title}</h4>
              <p className="achievement-description">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Team Section
const Team = () => {
  const teamMembers = [
    {
      name: 'Neeli Manikanta',
      role: 'Full Stack Developer',
      description: 'Expert in building enterprise-grade web and mobile applications with focus on school management systems and automation.',
      portfolio: 'https://neelimanikantaportfolio.onrender.com/',
      initials: 'NM'
    }
  ]

  return (
    <section id="team" className="section team">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Collaborators</span>
          <h2 className="section-title">
            Meet The <span className="gradient-text">Team</span>
          </h2>
          <p className="section-subtitle">
            Talented professionals I collaborate with on large-scale projects
          </p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <a
              key={member.name}
              href={member.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="team-card glass-card"
            >
              <div className="team-avatar">
                <span>{member.initials}</span>
              </div>
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-description">{member.description}</p>
              </div>
              <div className="team-link">
                View Portfolio →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CtaSection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content glass-card">
          <h2 className="cta-title">
            Ready to <span className="gradient-text">Elevate</span> Your Project?
          </h2>
          <p className="cta-description">
            Let's discuss how I can help you build scalable, production-grade solutions that drive business growth.
          </p>
          <div className="cta-buttons">
            <a href="mailto:naragantisunilkumar@gmail.com" className="btn btn-primary btn-lg">
              Start a Conversation
            </a>
            <a href="https://www.linkedin.com/in/sunilkumarnaraganti/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Component
const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h2 className="section-title">
            Let's Build Something <span className="gradient-text">Amazing</span>
          </h2>
          <p className="section-subtitle">
            Available for freelance projects and exciting opportunities
          </p>
        </div>
        <div className="contact-content">
          <div className="contact-card glass-card">
            <div className="contact-icon">✉️</div>
            <h3>Email</h3>
            <a href="mailto:naragantisunilkumar@gmail.com">naragantisunilkumar@gmail.com</a>
          </div>
          <div className="contact-card glass-card">
            <div className="contact-icon">📱</div>
            <h3>Phone</h3>
            <a href="tel:+918328510888">+91-8328510888</a>
          </div>
          <div className="contact-card glass-card">
            <div className="contact-icon">📍</div>
            <h3>Location</h3>
            <span>Bengaluru, India</span>
          </div>
        </div>
        <div className="contact-social">
          <a href="https://www.linkedin.com/in/sunilkumarnaraganti/" target="_blank" rel="noopener noreferrer" className="contact-social-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <a href="https://github.com/SunilKumar2112" target="_blank" rel="noopener noreferrer" className="contact-social-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">SUNIL<span>.</span></span>
            <p>Building exceptional digital experiences</p>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#skills">Services</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Naraganti Sunil Kumar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TrustBadges />
        <About />
        <Services />
        <Experience />
        <Projects />
        <Certifications />
        <Achievements />
        <Team />
        <CtaSection />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}

export default App
