import * as dat from 'dat.gui'
import * as THREE from 'three'
import { Vector2 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { add, substract, setMag, magSquared } from './math.js'
import { Mover, Attractor } from './mover.js'
import { onDocumentMouseMove, mouseMap } from './mouse.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Mouse
//const mouse = new Vector2()
//onDocumentMouseMove()

/**
 * Objects
 */
let attractor
let movers = []

for (let i = 0; i < 8; i++) {
    movers[i] = new Mover(
        new Vector2(Math.random() * 3 - 1, Math.random() * 3 - 0.5),
        new Vector2(0.01, 0),
        new Vector2(0, 0)
    )
}

attractor = new Attractor(
    new Vector2(0, 0),
    scene
)


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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Update Mover
    for (let mover of movers) {
        mover.update()
        mover.show(scene)
        attractor.attract(mover)

    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()