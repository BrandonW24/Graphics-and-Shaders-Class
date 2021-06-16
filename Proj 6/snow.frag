#version 330 compatibility

uniform float uKa, uKd;
uniform float uGrAmp;
uniform float uFloorFreq;
uniform bool uFlat, uHalf;

uniform float uTol;
uniform float uAlpha;
uniform bool  uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;


uniform sampler3D Noise3;

const vec4 snow_globe_ground = vec4(0.35, 0.66, 0.41, 1.);
const vec4 GLASS = vec4(1., 1., 1., 1.);

flat in vec3 vNf;
in vec3 vNs;
flat in vec3 vLf;
in vec3 vLs;
flat in vec3 vEf;
in vec3 vEs;

in float vLightIntensity;
in float isglass;
in vec2 vST;
in vec3 MCposition;
in vec3 ECposition;

const vec3 BLACK = vec3( 0., 0., 0. );
const vec3 ORANGE = vec3( 1., 0.5, 0. );

vec3 Rainbow(float);

void main( ){
	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	vec4 fragColor = snow_globe_ground;

	float Ar = uKa/2;
	float Br = uKd/2;

	vec4 nv  = texture3D( Noise3, uFloorFreq * MCposition );
	float n = nv.r + nv.g + nv.b + nv.a;
	n = n - 2.;
	n = uGrAmp * n;

	float sc = float((vST.s/uKa)) * uKa  +  Ar;
	float ds = vST.s - sc;                 
	float tc = float((vST.t/uKd)) * uKd  +  Br;
	float dt = vST.t - tc;                 

	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;        

	ds *= scale;                            
	ds /= Ar;                              

	dt *= scale;                            
	dt /= Br;                              

	float d = ds*ds + dt*dt;
	vec3 theColor = mix(ORANGE, BLACK, smoothstep(1.-uTol, 1.+uTol, d));

	if( uUseChromaDepth )
	{
		float t = (2./3.) * ( ECposition.z - uChromaRed ) / ( uChromaBlue - uChromaRed );//1027
		t = clamp( t, 0., 2./3. );
		theColor = mix(Rainbow(t), BLACK, smoothstep(1.-uTol, 1.+uTol, d));
	}

	if(uAlpha == 0 && theColor == BLACK){
		discard;
	}

  gl_FragColor = vec4(vLightIntensity*theColor,1);

}


vec3 Rainbow( float d ){
	d = clamp( d, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( d - (5./6.) );

        if( d <= (5./6.) )
        {
                r = 6. * ( d - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( d <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( d - (3./6.) );
                b = 1.;
        }

        if( d <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( d - (2./6.) );
        }

        if( d <= (2./6.) )
        {
                r = 1.  -  6. * ( d - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( d <= (1./6.) )
        {
                r = 1.;
                g = 6. * d;
        }

	return vec3( r, g, b );
}