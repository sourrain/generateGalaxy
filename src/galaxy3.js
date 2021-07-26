import './style.css'
import './modal.js'
import { rotateVertexShader } from './shaders/rotate/vertex.glsl'
import { rotateFragmentShader } from './shaders/rotate/fragment.glsl'
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
let rMaterial = null
let points = null

//Material
const rotateMaterial = () => {
    rMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
        uniforms:
        {
            uSize: { value: 30 * renderer.getPixelRatio() },
            uTime: { value: 0 }
        },
        vertexShader: rotateVertexShader,
        fragmentShader: rotateFragmentShader
    })
}

//Geometry
function galaxy() {

    rotateMaterial()

    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const randomness = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count * 1)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        parameters.spin = 1
        parameters.randomness = 0.2
        parameters.randomnessPower = 3
        parameters.radius = 5

        // Position
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

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
    points = new THREE.Points(geometry, rMaterial)
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

galaxy()

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