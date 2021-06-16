import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

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
 * Galaxy
 */
const parameters = {
    count: 10000,
    size: 0.02,
    branches: 3,
    radius: 5,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    num: 4,
    //Not set yet from https://codepen.io/ykob/pen/avEpdd?editors=1010
    getRandomInt: function(min, max){
        return Math.floor(Math.random() * (max - min)) + min
      },
      getDegree: function(radian) {
        return radian / Math.PI * 180
      },
      getRadian: function(degrees) {
        return degrees * Math.PI / 180
      },
      getSpherical: function(rad1, rad2, r) {
        var x = Math.cos(rad1) * Math.cos(rad2) * r
        var z = Math.cos(rad1) * Math.sin(rad2) * r
        var y = Math.sin(rad1) * r
        return [x, y, z]
      }
}
let geometry = null
let material = null
let points = null

/**
* Material
*/
material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})
const generateGalaxy = () => {
    /**
     * Distroy old galaxy
     */
    if (points != null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {

        const i3 = i * 3
        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const spinAngle = radius * parameters.spin

        //Galaxy
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    /**
         * Points
         */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
generateGalaxy()
const generateStar = () => {
    /**
     * Distroy old galaxy
     */
    if (points != null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {

        const i3 = i * 3

        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const spinAngle = radius * parameters.spin

        //Star
  
            parameters.radius = 45

            positions[i3] = Math.cos(radius)
            positions[i3 + 1] = Math.pow(Math.random(), parameters.randomnessPower) * 0.1 * (Math.random() < 0.5 ? 1 : -1)
            positions[i3 + 2] = Math.sin(radius)
        
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
const generateStarRiver = () => {
    /**
     * Distroy old galaxy
     */
    if (points != null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {

        const i3 = i * 3

        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const spinAngle = radius * parameters.spin
        //River
       
            parameters.count = 10000
            parameters.spin = 0
            parameters.randomness = 0.5
            parameters.randomnessPower = 4

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * radius - 1.6
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

            positions[i3] = randomX * 8
            positions[i3 + 1] = Math.sin(randomX * 20) * 0.4 + randomZ
            positions[i3 + 2] = randomX / 2 + randomY
     
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
const generateDonuts = () => {
    /**
     * Distroy old galaxy
     */
    if (points != null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {

        const i3 = i * 3

        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const spinAngle = radius * parameters.spin
        //Donuts
        parameters.randomness = 0.05
            parameters.radius = 45
            const innerRadius = 60
            const outRadius = 100
            const space = (i % parameters.num) / parameters.num * Math.PI * 2 - 5
            const size = Math.floor(Math.random() * (Math.floor(outRadius) - Math.ceil(innerRadius)) + Math.ceil(innerRadius)) * 0.01
            const sizes = (i % parameters.num) / parameters.num * Math.PI * 2 * 0.5

            positions[i3] = Math.cos(radius) * sizes * size
            positions[i3 + 1] = Math.cos(space)
            positions[i3 + 2] = Math.sin(radius) * sizes * size
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
//Current clicked galaxy shape
let currentShape = null
//Link to galaxy shape
document.querySelector('#galaxy').addEventListener('click', () => {
    generateGalaxy();
    currentShape=generateGalaxy
})
document.querySelector('#star').addEventListener('click', () => {
    generateStar();
    currentShape=generateStar
})
document.querySelector('#starRiver').addEventListener('click', () => {
    generateStarRiver();
    currentShape = generateStarRiver
})
document.querySelector('#donuts').addEventListener('click', () => {
    generateDonuts();
    currentShape = generateDonuts
})
console.log(currentShape)
//GUI
gui.add(parameters, 'count').min(1000).max(100000).step(100).onFinishChange(currentShape)
gui.add(parameters, 'size').min(0.01).max(1).step(0.02).onFinishChange(currentShape)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(currentShape)
gui.add(parameters, 'radius').min(1).max(50).step(1).onFinishChange(currentShape)
gui.add(parameters, 'spin').min(-2).max(2).step(1).onFinishChange(currentShape)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(currentShape)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(currentShape)
gui.add(parameters, 'num').min(1).max(10).step(1).onFinishChange(currentShape)
/**
 * Sizes
 */
const sizes = {
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
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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