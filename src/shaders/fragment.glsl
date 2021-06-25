void main()
        {
            float strength = 0.05/distance(gl_PointCoord, vec2(0.5));
            strength *= 1.5;
            
            gl_FragColor = vec4(strength,strength, strength, strength);
        }