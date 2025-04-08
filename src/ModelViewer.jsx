// ModelViewer.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
