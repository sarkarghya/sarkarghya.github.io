import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FunShape = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = null;

    const width = 300;
    const height = 300;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(width, height);
    const currentMount = mountRef.current;
    currentMount.appendChild(renderer.domElement);

    // Create individual triangles instead of a single icosahedron
    const triangles = [];
    const triangleGroup = new THREE.Group();
    
    // Calculate the height of each pyramid (distance from centroid to face)
const pyramidHeight = 0.5 * Math.sqrt(0.5 * (5 + Math.sqrt(5)));

// Create 20 triangular pyramids
for (let i = 0; i < 20; i++) {
    const triangleGeometry = new THREE.BufferGeometry();
    
    // Create equilateral triangle with side length 1
    const a = 1 / (2 * Math.sqrt(3));
    const baseVertices = [
        new THREE.Vector3(0, 1/Math.sqrt(3), 0),
        new THREE.Vector3(-0.5, -a, 0),
        new THREE.Vector3(0.5, -a, 0)
    ];

    // Calculate centroid (apex of pyramid)
    const centroid = new THREE.Vector3(0, 0, pyramidHeight);

    // Create vertices array including centroid connection
    const vertices = new Float32Array([
        // First triangle (base)
        baseVertices[0].x, baseVertices[0].y, baseVertices[0].z,
        baseVertices[1].x, baseVertices[1].y, baseVertices[1].z,
        baseVertices[2].x, baseVertices[2].y, baseVertices[2].z,
        // Three triangles connecting to centroid
        baseVertices[0].x, baseVertices[0].y, baseVertices[0].z,
        baseVertices[1].x, baseVertices[1].y, baseVertices[1].z,
        centroid.x, centroid.y, centroid.z,
        
        baseVertices[1].x, baseVertices[1].y, baseVertices[1].z,
        baseVertices[2].x, baseVertices[2].y, baseVertices[2].z,
        centroid.x, centroid.y, centroid.z,
        
        baseVertices[2].x, baseVertices[2].y, baseVertices[2].z,
        baseVertices[0].x, baseVertices[0].y, baseVertices[0].z,
        centroid.x, centroid.y, centroid.z,
    ]);
    
    triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    triangleGeometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({ 
        color: 0xff69b4,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
        shininess: 100,
        side: THREE.DoubleSide
    });

    const pyramid = new THREE.Mesh(triangleGeometry, material);
    
    // Position and rotate each pyramid to form icosahedron
    const theta = (i / 5) * Math.PI * 2;  // Horizontal angle
    const phi = Math.acos(1 - ((2 * Math.floor(i / 5)) / 2));  // Vertical angle
    
    pyramid.position.set(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
    );
    
    pyramid.lookAt(0, 0, 0);

    
    triangles.push(pyramid);
    triangleGroup.add(pyramid);
}

    

    scene.add(triangleGroup);

    // Lighting
    const frontLight = new THREE.PointLight(0xffffff, 2);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    const topLight = new THREE.PointLight(0xffffff, 2);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    camera.position.z = 5;

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    
    const onMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    mountRef.current.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate group
      triangleGroup.rotation.x += 0.005;
      triangleGroup.rotation.y += 0.001;

      // Update triangle positions based on mouse proximity
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(triangles);

      triangles.forEach((triangle) => {
        const time = Date.now() * 0.001;
        const distanceToMouse = new THREE.Vector2(mouse.x, mouse.y).length();
        const targetExpansionFactor = 0.6 + Math.max(0, 2 - distanceToMouse);
        
        // Initialize expansion factor if it doesn't exist
        if (!triangle.expansionFactor) {
            triangle.expansionFactor = targetExpansionFactor;
        }
        
        // Smoothly interpolate towards target
        const smoothFactor = 0.1;
        triangle.expansionFactor += (targetExpansionFactor - triangle.expansionFactor) * smoothFactor;
        
        // Get original position and scale it
        const normalizedPosition = triangle.position.clone().normalize();
        triangle.position.copy(normalizedPosition.multiplyScalar(triangle.expansionFactor));
    
        // Pulse effect
        triangle.material.opacity = 0.6 + 0.3 * Math.sin(time * 2);
    });
    

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      // Dispose of Three.js resources
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className='about-scence'
      style={{
        width: '300px',
        height: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  );
};

export default FunShape;
