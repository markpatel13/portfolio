// import { Canvas } from '@react-three/fiber'
// import React from 'react'

// const HeroExperience = () => {
//   return (
//     <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>    
//     <ambidentLight intensity={0.5} color="#1a1a40"/>
//     <directionalLight position={[10,10,5]} intensity={1.5}/>
//         <mesh>
//             <boxGeometry args={[5,5,5]}/>
//             <meshStandardMaterial color="orange"/>
//         </mesh>
//     </Canvas>
//   )
// }

// export default HeroExperience
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMediaQuery } from 'react-responsive';
import { Room } from './Room';
import Particles from './Particles';

const RotatingGroup = ({ isMobile }) => {
  const groupRef = useRef(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003; // Adjust speed by changing this value
    }
  });

  return (
    <group
      ref={groupRef}
      scale={isMobile ? 0.7 : 1}
      position={[0, -1.5, 0]}
      rotation={[0, -Math.PI / 3, 0]}
    >
      <Room />
    </group>
  );
};

const HeroExperience = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} color="#1a1a40" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />

        <Particles count={100} />
        <RotatingGroup isMobile={isMobile} />
        
      </Canvas>
    </div>
  )
}

export default HeroExperience

