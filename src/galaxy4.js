import './style.css'
import './modal.js'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './raycaster.js'
import { parameters } from './parameters.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webglGalaxy')

// Scene
const scene = new THREE.Scene()

/**
 * Generate Galaxy
 */
let geometry = null
let gMaterial = null
let points = null

//Material
export const generateMaterial = () => {
    gMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
        uniforms:
        {
            uSize: { value: 30 * renderer.getPixelRatio() },
            uTime: { value: 0 }
        },
        vertexShader: `
            uniform float uSize;
            uniform float uTime;
            attribute float aScale;
            attribute vec3 aRandomness;

        void main()
        {
            /**
             * Position
             */
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            // Randomness
            modelPosition.xyz += aRandomness;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
                   
            gl_Position = projectedPosition;
            /**
             * Size
             */
            gl_PointSize = uSize * aScale;
            gl_PointSize *= (1.0 / - viewPosition.z);
        }
        `,
        fragmentShader: `
        void main()
        {
            float strength = 0.05/distance(gl_PointCoord, vec2(0.5));
            strength *= 1.5;
            
            gl_FragColor = vec4(strength,strength, strength, strength);
        }
        
        `
    })
}
//Geometry
function star() {

    if (points !== null) {
        geometry.dispose()
        if (rMaterial !== null) {
            rMaterial.dispose()
        }
        if (gMaterial !== null) {
            gMaterial.dispose()
        }
        scene.remove(points)
    }
    generateMaterial()

    geometry = new THREE.BufferGeometry()


    const positions = new Float32Array(parameters.count * 3)
    const randomness = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count * 1)

    for (let i = 0; i < parameters.count; i++) {

        const i3 = i * 3

        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        //Star
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = (Math.random() - 0.5) / radius
        positions[i3 + 2] = Math.sin(branchAngle) * radius

        randomness[i3] = randomX
        randomness[i3 + 1] = randomY
        randomness[i3 + 2] = randomZ

        //Scale
        scales[i] = Math.random()

    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    /**
     * Points
     */
    points = new THREE.Points(geometry, gMaterial)

    scene.add(points)
}

/**
 * Sizes
 */
const sizes =
{
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
export const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

star()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()