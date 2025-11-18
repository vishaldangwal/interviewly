import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

// Enhanced Three.js Background Component
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const linesRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.1); // Very subtle background
    mountRef.current.appendChild(renderer.domElement);

    // Create refined floating particles
    const particleCount = 80; // Reduced for subtlety
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const color = new THREE.Color();
      // Professional color palette - mostly subtle blues
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        color.setHex(0x1e40af); // blue-800 - darker, more professional
      } else if (colorChoice < 0.85) {
        color.setHex(0x2563eb); // blue-600
      } else {
        color.setHex(0x3b82f6); // blue-500 - occasional brighter accent
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08, // Smaller, more subtle particles
      vertexColors: true,
      transparent: true,
      opacity: 0.6, // Reduced opacity for subtlety
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create minimal connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x1e40af, // blue-800
      transparent: true,
      opacity: 0.15, // Very subtle lines
    });

    const linePositions = [];
    for (let i = 0; i < particleCount; i += 4) {
      // Connect fewer particles for subtlety
      if (i + 3 < particleCount) {
        linePositions.push(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2],
        );
        linePositions.push(
          positions[(i + 3) * 3],
          positions[(i + 3) * 3 + 1],
          positions[(i + 3) * 3 + 2],
        );
      }
    }

    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3),
    );
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 10; // Further back for more subtle perspective

    sceneRef.current = scene;
    rendererRef.current = renderer;
    particlesRef.current = particles;
    linesRef.current = { lines };

    // Gentle animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.0005; // Slower animation

      if (particles) {
        particles.rotation.x += 0.0005; // Very slow rotation
        particles.rotation.y += 0.0008;

        // Subtle wave effect
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time + i * 0.05) * 0.005; // Smaller wave
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }

      if (lines) {
        lines.rotation.x += 0.0003;
        lines.rotation.y += 0.0004;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

// Enhanced Glitch Text Component
const GlitchText = ({ children, className = "", intensity = "normal" }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const glitchStyles = isGlitching
    ? {
        textShadow:
          intensity === "high"
            ? "0.05em 0 0 #2563eb, -0.03em -0.04em 0 #3b82f6, 0.025em 0.04em 0 #1e40af"
            : "0.02em 0 0 #2563eb, -0.015em -0.02em 0 #3b82f6, 0.01em 0.02em 0 #1e40af",
        animation: "glitch 0.2s infinite",
        transform: `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`,
      }
    : {};

  return (
    <div className={`relative ${className}`} style={glitchStyles}>
      {children}
      <style jsx>{`
        @keyframes glitch {
          0%,
          100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }
      `}</style>
    </div>
  );
};

// Floating Icons Component
const FloatingIcons = () => {
  const icons = ["💼", "🎯", "📊", "🚀", "💡", "⭐"];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-20 animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 2 + index * 0.2, duration: 0.8 }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
};

// Main App Component
export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Floating Icons */}
      {/* <FloatingIcons /> */}

      {/* Subtle Overlay for Depth */}
      <div className="absolute inset-0 bg-black/20 z-5" />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Title with Enhanced Styling */}
        <motion.div
          className="mb-8 transform transition-transform duration-300"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          }}
          variants={titleVariants as any}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <GlitchText
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-white  bg-clip-text text-transparent"
            intensity="high"
          >
            Interviewly
          </GlitchText>
          <div className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white opacity-10 blur-sm">
            Interviewly
          </div>
        </motion.div>

        {/* Enhanced Subheading */}
        <motion.div
          className="mb-8 max-w-4xl"
          variants={subtitleVariants as any}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text mb-4">
            Master Every Interview
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
            AI-Powered Preparation • Real-Time Feedback • Confidence Building
          </p>
        </motion.div>

        {/* Feature Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          variants={containerVariants}
        >
          {[
            "AI-Powered",
            "Real-Time Feedback",
            "Interview Prep",
            "Resume Builder",
            "AI Quiz Builder",
          ].map((tag, index) => (
            <motion.span
              key={tag}
              className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm hover:bg-blue-600/30 transition-all duration-300"
              variants={tagVariants as any}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(37, 99, 235, 0.3)",
                transition: { duration: 0.2 },
              }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Enhanced CTA Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-6">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
            <span className="relative z-10 flex items-center justify-center gap-2">
              🚀 Join Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>

          <button className="group relative px-8 py-4 border-2 border-blue-500 text-blue-400 font-bold text-lg rounded-full overflow-hidden backdrop-blur-sm hover:text-white hover:border-white transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center justify-center gap-2">
              ▶️ Watch Demo
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div> */}

        {/* Stats or Social Proof */}
        {/* <div className="mt-16 flex flex-col sm:flex-row items-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-xl">10K+</span>
            <span>Interviews Practiced</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-600" />
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-xl">95%</span>
            <span>Success Rate</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-600" />
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-xl">4.9★</span>
            <span>User Rating</span>
          </div>
        </div> */}
      </motion.div>

      {/* Scroll Indicator */}
      {/* <ScrollDownIndicator /> */}
    </div>
  );
}
