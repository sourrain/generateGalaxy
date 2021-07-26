import { changeGalaxy } from './changeGalaxy.js'
import * as THREE from 'three'

/**
 * Raycaster
 */
var titleBtn = document.getElementById("title")

titleBtn.onclick = () => {
    changeGalaxy()
    const audioHover = new Audio('/beep.mp3');
    audioHover.play()
    console.log('change galaxy')
}

document.addEventListener("dblclick", (e) => raycast(e, changeGalaxy))

export function raycast(e, func) {

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