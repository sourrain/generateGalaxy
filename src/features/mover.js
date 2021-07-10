import * as THREE from 'three'
import { add, substract, divide, setMag, magSquared } from './math.js'

const material = new THREE.MeshBasicMaterial()

/**
 * Create Mover
 */
export class Mover {

    constructor(position, velocity, acceleration) {

        this.position = position
        this.velocity = velocity
        this.acceleration = acceleration
        this.r = this.mass * 2
        this.moverMesh = new THREE.Mesh
            (
                new THREE.BoxBufferGeometry(0.2, 0.2, 0.2),
                material
            )

    }

    applyForce(force) {
        //let f = divide(new THREE.Vector2(2, 6), this.mass, new THREE.Vector2(0, 0))
        //console.log(force)
        this.acceleration = force
        //add(force, this.acceleration, new THREE.Vector2(0, 0)) * 0.00001
    }

    update() {
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
    }

    show(scene) {
        scene.add(this.moverMesh)
        this.moverMesh.position.set(this.position.x, this.position.y, 0)
    }
}


/**
 * Create Attractor
 */
export class Attractor {

    constructor(position, scene) {
        const attractorMesh = new THREE.Mesh
            (
                new THREE.SphereGeometry(0.5, 32, 32),
                material
            )
        this.position = position
        this.r = this.mass * 2
        scene.add(attractorMesh)
    }

    attract(mover) {

        //Get a vector that points from mover to the attractor
        const theVector = substract(this.position, mover.position, new THREE.Vector2(0, 0))
        const distanceSquared = magSquared(theVector)

        const massMutation = 1
        const G = 5

        //Calculate the magnitude of the force vector based on Gravitational Attraction
        const theforceMag = G * (massMutation / distanceSquared) / 10000

        //Force = theVectorMag * theVectorUnit
        const force = setMag(theVector, theforceMag, new THREE.Vector2(0, 0))

        mover.applyForce(force)
    }
}
