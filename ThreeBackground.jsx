import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Particle Cloud matching Green & Gold & Pink theme
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#ff007a'); // Pink
    const color2 = new THREE.Color('#facc15'); // Gold
    const color3 = new THREE.Color('#22c55e'); // Green

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;

      const rand = Math.random();
      const chosenColor = rand < 0.4 ? color1 : rand < 0.7 ? color2 : color3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    mainGroup.add(particles);

    // Multiple 3D Orbiting Wireframe Geometries
    const shapeGroup = new THREE.Group();

    // 1. Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(2.8, 0);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-16, 9, -5);
    shapeGroup.add(icoMesh);

    // 2. Torus Ring
    const torusGeo = new THREE.TorusGeometry(3.8, 0.4, 16, 32);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xff007a,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(18, -7, -8);
    shapeGroup.add(torusMesh);

    // 3. Orbiting 3D Cube 1
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const boxMesh1 = new THREE.Mesh(boxGeo, boxMat);
    boxMesh1.position.set(-18, -8, -6);
    shapeGroup.add(boxMesh1);

    // 4. Orbiting 3D Cube 2
    const boxMesh2 = new THREE.Mesh(boxGeo, boxMat);
    boxMesh2.position.set(15, 10, -7);
    shapeGroup.add(boxMesh2);

    mainGroup.add(shapeGroup);

    // Mouse Movement Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      icoMesh.rotation.x = elapsedTime * 0.25;
      icoMesh.rotation.y = elapsedTime * 0.25;
      torusMesh.rotation.x = elapsedTime * 0.2;
      torusMesh.rotation.y = elapsedTime * 0.35;
      boxMesh1.rotation.x = elapsedTime * 0.4;
      boxMesh1.rotation.z = elapsedTime * 0.3;
      boxMesh2.rotation.y = elapsedTime * 0.45;

      particles.rotation.y = elapsedTime * 0.04;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = targetX * 1.8;
      mainGroup.rotation.x = -targetY * 1.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90"
    />
  );
}
