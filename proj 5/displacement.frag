#version 330 compatibility


//Supplied by the sample fragment shader at :
// http://web.engr.oregonstate.edu/~mjb/cs557/Projects/proj04.html
in vec3  vMC;
in vec3  vEs;
in vec3  vNs;

const vec3  WHITE = vec3( 1.,1.,1.);

uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;
uniform float uEta;
uniform sampler3D Noise3;
uniform float uNoiseAmp, uNoiseFreq;
uniform float uMix;

//Removed all lighting from fragment shader
//Similar to that from assignment 3 but this time it
// keeps track of nvx and nvy within the rotate function

vec3
RotateNormal( vec3 n ){
        //Had to move these here since they were being wonky
        // and being seen as undefined in the main function?
        
        vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
        vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );

        //X angle direction
	    float angx = nvx.r + nvx.g + nvx.b + nvx.a;
        angx = angx - 2.;
	    angx *= uNoiseAmp;

        //Y angle direction
	    float angy = nvy.r + nvy.g + nvy.b + nvy.a;
        angy = angy - 2.;				// -1. -> 1.
	    angy *= uNoiseAmp;

        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;

        return normalize( n );
}

void main( ) {
   
    vec3 Normal = normalize(vNs);
    //Based mostly on the sample fragment shader given.
    //Utilize built in reflect functions,
    // texturecube function call :
    // https://thebookofshaders.com/glossary/?search=textureCube
  
    vec3 reflectVector = reflect( vEs, Normal );
	vec3 reflectcolor = textureCube(uReflectUnit, reflectVector ).rgb;
	vec3 refractVector = refract( vEs, Normal, uEta );
	vec3 refractcolor = textureCube( uRefractUnit, refractVector ).rgb;

	refractcolor = mix( refractcolor, WHITE, 0.30 );
	gl_FragColor = vec4( mix( reflectcolor, refractcolor, uMix ),  1. );
    
}