import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import rotateVertexShader from './shaders/rotate/vertex.glsl'
import rotateFragmentShader from './shaders/rotate/fragment.glsl'
import milkyWayVertexShader from './shaders/milkyWay/vertex.glsl'
import milkyWayFragmentShader from './shaders/milkyWay/fragment.glsl'
//import changeGalaxy from './changeGalaxy-animation.js'

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
 * Generate Galaxy
 */
//Parameters
const parameters = {
    count: 10000,
    size: 0.02,
    branches: 5,
    radius: 5,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    //Not set yet from https://codepen.io/ykob/pen/avEpdd?editors=1010
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    },
    getDegree: function (radian) {
        return radian / Math.PI * 180
    },
    getRadian: function (degrees) {
        return degrees * Math.PI / 180
    },
    getSpherical: function (rad1, rad2, r) {
        var x = Math.cos(rad1) * Math.cos(rad2) * r
        var z = Math.cos(rad1) * Math.sin(rad2) * r
        var y = Math.sin(rad1) * r
        return [x, y, z]
    }
}
let geometry = null
let gMaterial = null
let rMaterial = null
let mMaterial = null
let points = null
let generateGalaxy = null

//Material
const generateMaterial = () => {
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
const milkyWayMaterial = () => {
    mMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
        uniforms:
        {
            uSize: { value: 30 * renderer.getPixelRatio() },
            uTime: { value: 0 },

            uBigWavesElevation: { value: 0.2 },
            uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
            uBigWavesSpeed: { value: 0.75 },

            uSmallWavesElevation: { value: 0.15 },
            uSmallWavesFrequency: { value: 3 },
            uSmallWavesSpeed: { value: 0.2 },
            uSmallIterations: { value: 4 }
        },
        vertexShader: milkyWayVertexShader,
        fragmentShader: milkyWayFragmentShader
    })
}

//Geometry
function galaxy() {
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
    generateGalaxy = galaxy
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
    generateGalaxy = star

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
function milkyWay() {

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
    rotateMaterial()
    geometry = new THREE.PlaneGeometry(50, 5, 100, 20)
    generateGalaxy = milkyWay

    /**
     * Points
     */
    points = new THREE.Points(geometry, gMaterial)
    scene.add(points)
}
function donuts() {

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
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Adding GUI
let GUIfolder = gui.addFolder('Tweak Your Galaxy')
//gui.remember(GUIfolder)
GUIfolder.add(parameters, 'size').min(0.01).max(1).step(0.02).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'count').min(1000).max(100000).step(100).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'radius').min(1).max(50).step(1).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
const addGUI = (generate) => {
    GUIfolder.__controllers.forEach(controller => controller.setValue(controller.initialValue))
    gui.removeFolder(GUIfolder)
    GUIfolder = gui.addFolder('Tweak Your Galaxy')
    GUIfolder.add(parameters, 'size').min(0.01).max(1).step(0.02).onFinishChange(generate)
    GUIfolder.add(parameters, 'count').min(1000).max(100000).step(100).onFinishChange(generate)
    GUIfolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generate)
    GUIfolder.add(parameters, 'radius').min(1).max(50).step(1).onFinishChange(generate)
    GUIfolder.add(parameters, 'spin').min(-2).max(2).step(1).onFinishChange(generate)
    GUIfolder.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generate)
    GUIfolder.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generate)
}
/**
 * Raycaster
 */
var titleBtn = document.getElementById("title")

document.addEventListener("dblclick", (e) => raycast(e, changeGalaxy))
titleBtn.onclick = () => {
    changeGalaxy()
    const audioHover = new Audio('/beep.mp3');
    audioHover.play()
    console.log('change galaxy')
}

function raycast(e, func) {

    e.preventDefault()
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    func()
    const audioHover = new Audio('/beep.mp3');
    audioHover.play()
    console.log('change galaxy')
}

/**
 * Change Galaxy
 */
//Dont know how to seperate this func into another file
rotateMaterial()
milkyWayMaterial()
galaxy()

const changeGalaxy = () => {
    if (generateGalaxy === galaxy) {
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
        star()
    }
    else if (generateGalaxy === star) {
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
        milkyWay()
    }
    else if (generateGalaxy === milkyWay) {
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
        donuts()
    }
    else if (generateGalaxy === donuts) {
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
        galaxy()
    }
}
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

    //waving = elapsedTime

    //Update branches
    //current function execute each 5sec with different branches
    //parameters.branches = Math.floor(elapsedTime + 1)
    //console.log(parameters.branches)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()