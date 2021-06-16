#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uNoiseFreq, uNoiseAmp;
uniform float uFloorFreq, uGrAmp;
uniform float uPattFreq, uPattAmp;
uniform float uGlobeHeight;
uniform sampler3D Noise3;
uniform float Timer;
uniform bool uAnimateStyle;
uniform bool uAnimate;
uniform bool  uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;
vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );
out vec2 vST;
out vec3 ECposition;
out vec3 MCposition;
out float vLightIntensity;

out float isglass;

void
main( ){

	vST = gl_MultiTexCoord0.st;
	vec3 ECposition = vec3 (gl_ModelViewMatrix * gl_Vertex);
	vec3 MCposition  = gl_Vertex.xyz;
	vNf = normalize( gl_NormalMatrix * gl_Normal );
	vNs = normalize( gl_NormalMatrix * gl_Normal );
	vLf = eyeLightPosition - ECposition.xyz;
	vLs = eyeLightPosition - ECposition.xyz;
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz;
	vEs = vec3( 0., 0., 0. ) - ECposition.xyz;
	

	vLightIntensity  = abs( dot( normalize(eyeLightPosition - ECposition), vNf ) );

	vec4 per_vertx = gl_Vertex;
	
	float time = 1;
	if(uAnimate){
		time = sin( 3.14 * Timer );
	}
	
	isglass = 0.0;
	
	vec4 snow_noise_norm = texture( Noise3, uNoiseFreq * per_vertx.xyz);
	vec4 snow_noise_freq = texture( Noise3, uFloorFreq * per_vertx.xyz);
	float snow_noise_AMPL = uNoiseAmp * cos((snow_noise_norm.r + snow_noise_norm.g + snow_noise_norm.b + snow_noise_norm.a)) + 0.2 * sin(per_vertx.x * uNoiseFreq * time) * tan(per_vertx.x * uNoiseFreq* time);
	float snow_noise_lowest_FREQ = sin(snow_noise_freq.r + snow_noise_freq.g + snow_noise_freq.b + snow_noise_freq.a) * tan(uGrAmp) * uNoiseAmp * cos((snow_noise_norm.r + snow_noise_norm.g + snow_noise_norm.b + snow_noise_norm.a)) + 0.2 * sin(per_vertx.x * uNoiseFreq * time);
	
	if(per_vertx.y >= uGlobeHeight + snow_noise_lowest_FREQ) {
		isglass = 1.0;
    }
	
	if(uAnimateStyle){
		if(isglass > 0.5) {
			per_vertx.y = per_vertx.y + snow_noise_AMPL;
		}
	}else{
		float snow_rippl = cos(uPattAmp) * sin(uPattFreq * pow(pow(per_vertx.x, 2.) + pow(per_vertx.z, 2.), 0.5) * time);
		if(isglass > 0.5){
			per_vertx.y += snow_rippl;
        }
	}
	
	gl_Position = gl_ModelViewProjectionMatrix * per_vertx;
}