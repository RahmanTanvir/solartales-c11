'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Sphere, Line, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Data panel component for clickable objects
function DataPanel({ 
  position, 
  data, 
  onClose 
}: { 
  position: [number, number, number];
  data: any;
  onClose: () => void;
}) {
  return (
    <Html position={position}>
      <div className="bg-black/90 border border-blue-400 rounded-lg p-3 text-white text-xs min-w-48 max-w-64">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-blue-400">{data.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>
        <div className="space-y-1">
          <p><span className="text-gray-400">Type:</span> {data.type}</p>
          <p><span className="text-gray-400">Distance:</span> {data.distance}</p>
          <p><span className="text-gray-400">Status:</span> {data.status}</p>
          {data.description && (
            <p className="text-gray-300 text-xs mt-2">{data.description}</p>
          )}
        </div>
      </div>
    </Html>
  );
}

// Planet Orbit Component - handles orbital motion
function PlanetOrbit({ children, speed = 0.01 }: { children: React.ReactNode; speed?: number }) {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += speed;
    }
  });

  return <group ref={orbitRef}>{children}</group>;
}

// Enhanced Planet Component
function Planet({ 
  name, 
  radius, 
  distance, 
  color, 
  emissive, 
  speed = 0.01,
  onClick,
  data 
}: {
  name: string;
  radius: number;
  distance: number;
  color: string;
  emissive: string;
  speed?: number;
  onClick?: () => void;
  data?: any;
}) {
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.02;
    }
  });

  return (
    <>
      {/* Planet */}
      <mesh
        ref={planetRef}
        position={[distance, 0, 0]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Planet Label */}
      <Text
        position={[distance, radius + 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </>
  );
}

// Moon Component
function Moon({ earthPosition }: { earthPosition: [number, number, number] }) {
  const moonRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={moonRef} position={earthPosition}>
      {/* Moon */}
      <mesh position={[0.8, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#C0C0C0" emissive="#404040" emissiveIntensity={0.05} />
      </mesh>
    </group>
  );
}

// ISS and Satellites Component
function Satellites({ earthPosition }: { earthPosition: [number, number, number] }) {
  const issRef = useRef<THREE.Group>(null);
  const satellitesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (issRef.current) {
      issRef.current.rotation.y += 0.05;
    }
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y += 0.04;
    }
  });

  return (
    <group position={earthPosition}>
      {/* ISS */}
      <group ref={issRef}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.03, 0.01, 0.02]} />
          <meshStandardMaterial color="#silver" emissive="#0066ff" emissiveIntensity={0.3} />
        </mesh>
        <Text
          position={[0.5, 0.1, 0]}
          fontSize={0.08}
          color="#0066ff"
          anchorX="center"
        >
          ISS
        </Text>
      </group>

      {/* Other Satellites */}
      <group ref={satellitesRef}>
        {[0.45, 0.55, 0.6].map((distance, i) => (
          <mesh key={i} position={[distance, 0, 0]} rotation={[0, i * Math.PI * 0.7, 0]}>
            <boxGeometry args={[0.01, 0.01, 0.01]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Spacecraft Component
function Spacecraft() {
  const parkerRef = useRef<THREE.Mesh>(null);
  const sohoRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (parkerRef.current) {
      // Parker Solar Probe - close to sun, fast orbit
      const time = state.clock.elapsedTime;
      parkerRef.current.position.x = Math.cos(time * 2) * 2.5;
      parkerRef.current.position.z = Math.sin(time * 2) * 2.5;
    }
    if (sohoRef.current) {
      // SOHO - L1 point, relatively stable
      sohoRef.current.position.x = 3.8;
      sohoRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Parker Solar Probe */}
      <mesh ref={parkerRef}>
        <coneGeometry args={[0.02, 0.06, 6]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.4} />
      </mesh>
      <Text
        position={[2.5, 0.3, 0]}
        fontSize={0.08}
        color="#ff6600"
        anchorX="center"
      >
        Parker Probe
      </Text>

      {/* SOHO Spacecraft */}
      <mesh ref={sohoRef} position={[3.8, 0, 0]}>
        <boxGeometry args={[0.03, 0.02, 0.04]} />
        <meshStandardMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[3.8, 0.2, 0]}
        fontSize={0.08}
        color="#4169E1"
        anchorX="center"
      >
        SOHO
      </Text>
    </group>
  );
}

// Earth's Magnetosphere
function Magnetosphere({ position }: { position: [number, number, number] }) {
  const magnetosphereRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (magnetosphereRef.current) {
      const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      magnetosphereRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.emissiveIntensity = intensity;
        }
      });
    }
  });

  return (
    <group ref={magnetosphereRef} position={position}>
      {/* Simplified Magnetic Field - Just 3 main field lines */}
      {[0, Math.PI * 0.6, Math.PI * 1.4].map((angle, i) => {
        const x = Math.cos(angle) * 0.5;
        const z = Math.sin(angle) * 0.5;
        
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, angle, Math.PI / 4]}>
            <torusGeometry args={[0.3, 0.008, 4, 12]} />
            <meshStandardMaterial
              color="#00ff88"
              transparent
              opacity={0.6}
              emissive="#00ff88"
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}

      {/* Bow Shock - positioned further from Earth */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.5, 0.015, 6, 12]} />
        <meshStandardMaterial
          color="#ff4400"
          transparent
          opacity={0.4}
          emissive="#ff4400"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// Aurora Component
function Aurora({ position }: { position: [number, number, number] }) {
  const auroraRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (auroraRef.current) {
      const time = state.clock.elapsedTime;
      auroraRef.current.rotation.y = time * 0.5;
      auroraRef.current.children.forEach((child: any, i) => {
        if (child.material) {
          child.material.opacity = 0.3 + Math.sin(time * 3 + i) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={auroraRef} position={position}>
      {/* Northern Aurora */}
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#00ff44"
          transparent
          opacity={0.4}
          emissive="#00ff44"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Southern Aurora */}
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#ff0066"
          transparent
          opacity={0.4}
          emissive="#ff0066"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// Enhanced Solar Wind with CME
function EnhancedSolarWind({ cmeActive }: { cmeActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const cmeRef = useRef<THREE.Mesh>(null);
  
  const [positions] = useState(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const radius = 1.8 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  });

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Radial movement from sun
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        const distance = Math.sqrt(x * x + y * y + z * z);
        
        const speed = cmeActive ? 0.05 : 0.02;
        positions[i] += (x / distance) * speed;
        positions[i + 1] += (y / distance) * speed;
        positions[i + 2] += (z / distance) * speed;
        
        // Reset particles that go too far
        if (distance > 15) {
          const newRadius = 1.8 + Math.random() * 2;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          positions[i] = newRadius * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = newRadius * Math.cos(phi);
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // CME Shockwave
    if (cmeRef.current && cmeActive) {
      const time = state.clock.elapsedTime;
      const scale = 1 + (time % 10) * 2;
      cmeRef.current.scale.setScalar(scale);
      const material = cmeRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.opacity = Math.max(0, 0.5 - (time % 10) * 0.05);
      }
    }
  });

  return (
    <group>
      {/* Enhanced Solar Wind Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={2000}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={cmeActive ? 0.08 : 0.04} 
          color={cmeActive ? "#ff4400" : "#ffaa00"} 
          transparent 
          opacity={0.7} 
        />
      </points>

      {/* CME Shockwave */}
      {cmeActive && (
        <mesh ref={cmeRef}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color="#ff2200"
            transparent
            opacity={0.2}
            emissive="#ff4400"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

// Enhanced Solar System Component
function SolarSystem() {
  const [solarFlareActive, setSolarFlareActive] = useState(false);
  const [cmeActive, setCmeActive] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(null);

  // Planet data
  const planetData = {
    venus: {
      name: "Venus",
      type: "Rocky Planet",
      distance: "0.72 AU from Sun",
      status: "Active",
      description: "Hottest planet in our solar system with thick atmosphere."
    },
    earth: {
      name: "Earth",
      type: "Rocky Planet",
      distance: "1.00 AU from Sun",
      status: "Inhabited",
      description: "Our home planet with protective magnetosphere."
    },
    mars: {
      name: "Mars",
      type: "Rocky Planet", 
      distance: "1.52 AU from Sun",
      status: "Exploration Target",
      description: "The Red Planet, target for human exploration."
    },
    jupiter: {
      name: "Jupiter",
      type: "Gas Giant",
      distance: "5.20 AU from Sun", 
      status: "Active",
      description: "Largest planet with powerful magnetic field."
    }
  };

  // Removed main group rotation to fix orbital ring clustering
  // useFrame((state) => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += 0.002;
  //   }
  // });

  useEffect(() => {
    // Simulate solar flare events
    const flareInterval = setInterval(() => {
      setSolarFlareActive(true);
      setTimeout(() => setSolarFlareActive(false), 3000);
    }, 15000);

    // Simulate CME events
    const cmeInterval = setInterval(() => {
      setCmeActive(true);
      setTimeout(() => setCmeActive(false), 8000);
    }, 25000);

    return () => {
      clearInterval(flareInterval);
      clearInterval(cmeInterval);
    };
  }, []);

  return (
    <>
      {/* Sun and Solar Effects */}
      <mesh
        onClick={() => setSelectedObject({
          name: "Sun",
          type: "G-Type Star",
          distance: "0 AU",
          status: solarFlareActive ? "Solar Flare Active" : "Stable",
          description: "Our nearest star, source of all space weather."
        })}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={solarFlareActive ? "#ff6b35" : "#FDB813"}
          emissive={solarFlareActive ? "#ff4500" : "#FDB813"}
          emissiveIntensity={solarFlareActive ? 1.2 : 0.4}
        />
      </mesh>

      {/* Solar Flare Effect */}
      {solarFlareActive && (
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial
            color="#ff4500"
            transparent
            opacity={0.3}
            emissive="#ff6b35"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}

      {/* Sun Label */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.3}
        color="#FDB813"
        anchorX="center"
        anchorY="middle"
      >
        Sun
      </Text>

      {/* Planets with individual orbital groups */}
        <PlanetOrbit speed={0.02}>
          <Planet
            name="Venus"
            radius={0.25}
            distance={3.5}
            color="#FFC649"
            emissive="#FF8C00"
            onClick={() => setSelectedObject(planetData.venus)}
            data={planetData.venus}
          />
        </PlanetOrbit>

        <PlanetOrbit speed={0.015}>
          <Planet
            name="Earth"
            radius={0.3}
            distance={5}
            color="#4F94CD"
            emissive="#1e3a8a"
            onClick={() => setSelectedObject(planetData.earth)}
            data={planetData.earth}
          />
          {/* Moon */}
          <Moon earthPosition={[5, 0, 0]} />
          {/* ISS and Satellites */}
          <Satellites earthPosition={[5, 0, 0]} />
        </PlanetOrbit>

        <PlanetOrbit speed={0.012}>
          <Planet
            name="Mars"
            radius={0.25}
            distance={6.5}
            color="#CD853F"
            emissive="#8B4513"
            onClick={() => setSelectedObject(planetData.mars)}
            data={planetData.mars}
          />
        </PlanetOrbit>

        <PlanetOrbit speed={0.008}>
          <Planet
            name="Jupiter"
            radius={0.8}
            distance={10}
            color="#D2691E"
            emissive="#FF8C00"
            onClick={() => setSelectedObject(planetData.jupiter)}
            data={planetData.jupiter}
          />
        </PlanetOrbit>

        {/* Spacecraft */}
        <Spacecraft />

        {/* Enhanced Solar Wind and CME */}
        <EnhancedSolarWind cmeActive={cmeActive} />

        {/* Data Panel */}
        {selectedObject && (
          <DataPanel
            position={[0, 4, 0]}
            data={selectedObject}
            onClose={() => setSelectedObject(null)}
          />
        )}
    </>
  );
}

interface SolarSystemVisualizationProps {
  className?: string;
  showControls?: boolean;
}

export function SolarSystemVisualization({ 
  className = "", 
  showControls = true 
}: SolarSystemVisualizationProps) {
  const [is3DLoaded, setIs3DLoaded] = useState(false);

  useEffect(() => {
    setIs3DLoaded(true);
  }, []);

  if (!is3DLoaded) {
    return (
      <div className={`${className} bg-black/20 rounded-xl flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Solar System...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className={`${className} relative rounded-xl overflow-hidden border border-white/10`}
    >
      <Canvas
        camera={{ position: [10, 5, 10], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #0f0f1a 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />

        {/* Stars Background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Solar System */}
        <SolarSystem />

        {/* Controls */}
        {showControls && (
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
            minDistance={5}
            maxDistance={30}
          />
        )}
      </Canvas>

      {/* Control Instructions */}
      {showControls && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black/60 p-2 rounded">
          <p>Mouse: Rotate • Scroll: Zoom • Right-click: Pan • Click objects for info</p>
        </div>
      )}

      {/* Space Weather Status */}
      <div className="absolute top-4 right-4 text-xs text-gray-300 bg-black/60 p-3 rounded">
        <h4 className="text-blue-400 font-bold mb-2">Space Weather Status</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Solar Activity: Normal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>Geomagnetic Field: Quiet</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Radiation: Low</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
