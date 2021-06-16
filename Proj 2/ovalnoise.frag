#version 330 compatibility

//carry over the values from glib
uniform float uAd;
uniform float uBd;
uniform float uTol;

in float vLightIntensity;

in vec2 vST;
in vec4 vColor;

// must define uNoiseAmp
//  uNoiseFreq
// uAlpha

uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
in vec3 vMCposition;



vec3 WHITE = vec3( 1., 1., 1. );

uniform sampler3D Noise3;

void

//We were given the llpitical dots with tolerance and noise
// in slide 25 of our lecture notes on noise
//

main()
{

    vec4 c0 = vec4(vec3(0.9) * vLightIntensity, 1.);					// Dot color
	vec4 c1 = vec4(vec3(1., 0., 1.) * vLightIntensity, uAlpha);		// Background color

    //given noise vector definitiuon
	vec4 noiseVector = texture3D( Noise3, uNoiseFreq*vMCposition );

	float n = noiseVector.r + noiseVector.g + noiseVector.b + noiseVector.a; 

    //Normalize
	n = n - 2.;
	
    //Apply noise amp
	n = n * uNoiseAmp; 

    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    float s = vST.s;
    float t = vST.t;

    int numins = int(s / uAd);
    int numint = int(t / uBd);

    float s_c = (numins * uAd) + Ar;
    float t_c = (numint * uBd) + Br;

	//This segment can be found in the slides previously stated above.

	float sc = float(numins) * uAd  +  Ar;
	float ds = vST.s - sc;                   // wrt ellipse center
	float tc = float(numint) * uBd  +  Br;
	float dt = vST.t - tc;                   // wrt ellipse center

	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

	ds *= scale;                            // scale by noise factor
	ds /= Ar;                               // ellipse equation

	dt *= scale;                            // scale by noise factor
	dt /= Br;                               // ellipse equation

	float d = ds*ds + dt*dt;
	
	
	vec4 color = mix(c0, c1, smoothstep(1 - uTol, 1 + uTol, d));

    //Extra credit uAlpha discard here!
    
	if(uAlpha == 0.) {
		if(color == c1) {
			discard;
		}
	}
	
	gl_FragColor = color;
}