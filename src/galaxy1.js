import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import rotateVertexShader from './shaders/rotate/vertex.glsl'
import rotateFragmentShader from './shaders/rotate/fragment.glsl'
import './raycaster.js'
import { parameters } from './parameters.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.donutsGalaxy')

// Scene
const scene = new THREE.Scene()

/**
 * Generate Galaxy
 */
let geometry = null
let rMaterial = null
let points = null
let generateGalaxy = null

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
function donuts() {

    rotateMaterial()
    geometry = new THREE.BufferGeometry()
    generateGalaxy = donuts

    const positions = new Float32Array(parameters.count * 3)
    const randomness = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count * 1)
    for (let i = 0; i < parameters.count; i++) {

        const i3 = i * 3

        const radius = Math.random() * parameters.radius

        parameters.randomness = 0.05
        parameters.radius = 45
        const innerRadius = 60
        const outRadius = 100
        const space = (i % parameters.branches) / parameters.branches * Math.PI * 2 - 4
        const size = Math.floor(Math.random() * (Math.floor(outRadius) - Math.ceil(innerRadius)) + Math.ceil(innerRadius)) * 0.01
        const sizes = (i % parameters.branches) / parameters.branches * Math.PI * 2 * 0.5

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius * 0.2
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius * 0.2
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius * 0.2

        positions[i3] = Math.cos(radius) * sizes * size
        positions[i3 + 1] = Math.cos(space) * 2 - 0.5
        positions[i3 + 2] = Math.sin(radius) * sizes * size

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

donuts()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    //Update rMaterials
    rMaterial.uniforms.uTime.value = elapsedTime

    //Update rotation
    points.rotation.y = 0.02 * elapsedTime

    //Update branches
    //current function execute each 5sec with different branches

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()