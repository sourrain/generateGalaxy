import rotateVertexShader from './shaders/rotate/vertex.glsl'
import rotateFragmentShader from './shaders/rotate/fragment.glsl'
import milkyWayVertexShader from './shaders/milkyWay/vertex.glsl'
import milkyWayFragmentShader from './shaders/milkyWay/fragment.glsl'

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

export const rotateMaterial = () => {
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

export const milkyWayMaterial = () => {
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