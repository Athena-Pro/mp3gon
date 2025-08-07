
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { getFFT } from '../services/audioProcessor';

interface MP3gonVisualizerProps {
  buffer: AudioBuffer;
}

export default function MP3gonVisualizer({ buffer }: MP3gonVisualizerProps): React.ReactNode {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buffer || !mountRef.current) return;

    setIsLoading(true);
    setError(null);
    let isCancelled = false;
    
    // Use a timeout to allow the loading state to render before heavy processing
    const timeoutId = setTimeout(() => {
        try {
            if(isCancelled) return;
            
            // --- Three.js Setup ---
            const mount = mountRef.current!;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
            
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            mount.innerHTML = ''; // Clear previous renderer
            mount.appendChild(renderer.domElement);
            
            // --- Lighting ---
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0x00ffff, 1.2);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            const pointLight = new THREE.PointLight(0xff00ff, 1);
            pointLight.position.set(-5, -5, -5);
            scene.add(pointLight);

            // --- Geometry Generation (The MP3gon Tube) ---
            const fftSize = 512;
            const hopSize = fftSize * 2; // More spacing for performance
            const data = buffer.getChannelData(0);
            const timeSegments = Math.floor(data.length / hopSize);
            const freqBins = fftSize / 4; // Use fewer bins for a less noisy shape
            const fft = getFFT(fftSize);
            
            const vertices = [];
            const indices = [];

            const totalLength = 15;
            const baseRadius = 1.5;
            const ampScaling = 2.5;

            const fftWindow = new Float32Array(fftSize);
            for (let i = 0; i < fftSize; i++) {
                fftWindow[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1))); // Hann window
            }

            for (let t = 0; t < timeSegments; t++) {
                const chunk = new Float32Array(fftSize);
                const audioSlice = data.slice(t * hopSize, t * hopSize + fftSize);
                chunk.set(audioSlice);
                for(let i = 0; i < chunk.length; i++) chunk[i] *= fftWindow[i];

                const real = new Float32Array(chunk);
                const imag = new Float32Array(fftSize).fill(0);
                fft(real, imag, false);

                for (let f = 0; f < freqBins; f++) {
                    const mag = Math.sqrt(real[f]**2 + imag[f]**2);
                    const logMag = Math.log10(1 + mag * 50);

                    const angle = (f / freqBins) * 2 * Math.PI;
                    const radius = baseRadius + logMag * ampScaling;

                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    const z = (t / timeSegments) * totalLength - (totalLength / 2);

                    vertices.push(x, y, z);
                }
            }

            for (let t = 0; t < timeSegments - 1; t++) {
                for (let f = 0; f < freqBins; f++) {
                    const i1 = t * freqBins + f;
                    const i2 = t * freqBins + ((f + 1) % freqBins);
                    const i3 = (t + 1) * freqBins + f;
                    const i4 = (t + 1) * freqBins + ((f + 1) % freqBins);
                    
                    indices.push(i1, i3, i2);
                    indices.push(i2, i3, i4);
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({
                color: 0x81e6d9, // teal-300
                metalness: 0.7,
                roughness: 0.3,
                side: THREE.DoubleSide,
            });
            
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                wireframe: true,
                transparent: true,
                opacity: 0.2,
            });

            const mesh = new THREE.Mesh(geometry, material);
            const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
            mesh.add(wireframe);

            scene.add(mesh);
            camera.position.set(totalLength * 0.7, totalLength * 0.7, totalLength);
            camera.lookAt(mesh.position);

            // --- Animation Loop ---
            let animationFrameId: number;
            const animate = () => {
                if(isCancelled) return;
                mesh.rotation.x += 0.002;
                mesh.rotation.y += 0.003;
                renderer.render(scene, camera);
                animationFrameId = requestAnimationFrame(animate);
            };
            animate();
            
            // --- Resize Listener ---
            const handleResize = () => {
                if (!mountRef.current) return;
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
            window.addEventListener('resize', handleResize);

            setIsLoading(false);

            // --- Cleanup on unmount ---
            return () => {
                isCancelled = true;
                window.removeEventListener('resize', handleResize);
                cancelAnimationFrame(animationFrameId);
                renderer.dispose();
                geometry.dispose();
                material.dispose();
                wireframeMaterial.dispose();
            };
        } catch (e) {
            console.error("Error creating MP3gon:", e);
            setError("Could not generate 3D visualization.");
            setIsLoading(false);
        }
    }, 100);

    return () => {
        isCancelled = true;
        clearTimeout(timeoutId);
    };

  }, [buffer]);

  return (
    <div className="relative w-full h-full" aria-label="MP3gon Visualizer">
        {isLoading && (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900/80 z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <p className="mt-3 text-gray-300">Generating MP3gon Geometry...</p>
            </div>
        )}
        {error && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-900/80 z-10">
                <p className="text-red-400">{error}</p>
            </div>
        )}
        <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}