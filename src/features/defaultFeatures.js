import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Load images
 */
function getRandomInt(max) {
    // number between 1 & max
    return (Math.floor(Math.random() * Math.floor(max))) + 1
}

/**
 * Plane
 */
var geometry = new THREE.PlaneGeometry(5, 5, 10, 10)

for (let i = 0; i < 50; i++) {

    //contructor
    const texture = new THREE.TextureLoader().load('./digitalPosts/' + getRandomInt(5) + '.png')
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        specular: 0x9e9e9e,
        shininess: 5,
        reflectivity: 0.5,
        refractionRatio: 0.5
    })
    const digitalPost = new THREE.Mesh(geometry, material)

    //Show
    digitalPost.scale.set(i * 0.001, i * 0.001)
    digitalPost.position.x = i * 2 * Math.random() * 0.01
    digitalPost.position.y = i * 2 * Math.random() * 0.01
    digitalPost.position.z = i * 3 * Math.random() * 0.01
    scene.add(digitalPost)

}

/**
 * Lights
 */
var light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(0, 0, 100).normalize();
scene.add(light)

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
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xfffff0, 1)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()