#version 330 compatibility

//carry over the values from glib
uniform float uAd;
uniform float uBd;
uniform float uTol;

in float vLightIntensity;

in vec2 vST;
in vec4 vColor;


vec3 WHITE = vec3( 1., 1., 1. );


void

//Given elliptical dots equation from slide 13 if the stripes springs and dots slideshow

main()
{
    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    float s = vST.s;
    float t = vST.t;

    int numins = int(s / uAd);
    int numint = int(t / uBd);

    float s_c = (numins * uAd) + Ar;
    float t_c = (numint * uBd) + Br;

    //Following the elliptical equation from slide 13 here too
    // similar to how :
    //float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, rfrac ) -
    //smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, rfrac ); // “smoothpulse”
    // We envoke Edots here :

    float Edots = (((s - s_c) / Ar) * ((s - s_c) / Ar)) +
                    (((t - t_c) / Br) * ((t - t_c) / Br));
    
    float frag = smoothstep( 1. - uTol, 1. + uTol, Edots );
    

    gl_FragColor = mix(vec4(vLightIntensity * vColor.rgb, 1.), vec4(vLightIntensity * WHITE, 1.), frag);
}