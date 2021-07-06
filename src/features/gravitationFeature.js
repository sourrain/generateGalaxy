import * as dat from 'dat.gui'
import * as THREE from 'three'
import { Vector2 } from 'three'
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

//Mouse
const mouse = new Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    //console.log(mouse.x + ", " + mouse.y);
}
//Subtraction Vectors: a - b
function substract(a, b) {

    const aArray = [a.x, a.y]
    const bArray = [b.x, b.y]
    const xArray = aArray.map(
        function (item, index) {
            // In this case item correspond to currentValue of array a, 
            // using index to get value from array b
            return item - bArray[index];
        }
    )
    const res = new Vector2(
        xArray[0],
        xArray[1]
    )
    return res

}

//Add Vectors: a + b
function add(a, b) {

    const aArray = [a.x, a.y]
    const bArray = [b.x, b.y]
    const res = new Vector2(
        a.x + b.x,
        a.y + b.y
    )
    return res

}
//const a = new Vector2(-2, 4)
//const b = new Vector2(9, -4)
//console.log(substract(a, b))

//Vector a Magnitude Squared
function magSquared(a) {
    const aArray = [a.x, a.y]
    const magSq = a.x * a.x + a.y * a.y
    return magSq
}
//console.log(magSquared(a))

//Reset the magitude of the vector a
function setMag(a, mag) {
    const aArray = [a.x, a.y]
    const magArray = [mag.x, mag.y]
    const res = new Vector2(
        a.x / Math.abs(a.x) * Math.abs(mag.x),
        a.y / Math.abs(a.y) * Math.abs(mag.y)
    )
    return res
}
//console.log(setMag(b, a))

/**
 * Objects
 */
let attractor
let movers = []
const material = new THREE.MeshBasicMaterial()

//Create Mover
class Mover {
    constructor() {
        const moverMesh = new THREE.Mesh
            (
                new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
                material
            )
        scene.add(moverMesh)
        this.position = new Vector2(0, 0)
        //moverMesh.position.set(this.position.x, this.position.y, 0)

        this.mass = 100
        this.r = this.mass * 2
        this.velocity = new Vector2(Math.random(), Math.random())
        this.acceleration = new Vector2(0, 0)
    }
    applyForce(force) {
        add(force, this.acceleration)
    }
}

//Create Attractor
class Attractor {
    constructor() {
        const attractorMesh = new THREE.Mesh
            (
                new THREE.SphereGeometry(0.5, 32, 32),
                material
            )
        this.position = new Vector2(0, 0)
        this.mass = 100
        this.r = this.mass * 2
        scene.add(attractorMesh)
    }
    attract(mover) {

        //Get a vector that points from mover to the attractor
        const theVector = new Vector2(substract(this.position, mover.position))

        const distanceSquared = magSquared(theVector)
        const massMutation = this.mass * mover.mass
        const G = 5
        //Calculate the magnitude of the force vector based on Gravitational Attraction
        const theforceMag = massMutation / distanceSquared * G

        //Force = theVectorMag * theVectorUnit
        const force = setMag(theVector, theforceMag)
        mover.applyForce(force)
    }
}

//Add Attractor
attractor = new Attractor
//Add Movers
for (let i = 0; i < 8; i++) {
    movers[i] = new Mover
    //Mover.position = new Vector2(i, i)
}

//Mapping value
function mouseMap(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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

        //attractor.attract(mover)

    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()