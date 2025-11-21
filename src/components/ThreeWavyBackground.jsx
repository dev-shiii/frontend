import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeStarfield() {
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ⭐ Scene
    const scene = new THREE.Scene();

    // ⭐ Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
    camera.position.z = 5;

    // ⭐ Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setClearColor(0x000000, 1); // Pure black background
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // ⭐ Starfield
    const starCount = 5000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 2000;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ⭐ Animation
    const animate = () => {
      stars.rotation.y += 0.0005;
      stars.rotation.x += 0.0002;

      camera.position.z -= 0.05;
      if (camera.position.z < -200) camera.position.z = 5;

      renderer.render(scene, camera);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ⭐ Resize Handling
    const handleResize = () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;

      renderer.setSize(newW, newH);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
}
