#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uNoiseFreq, uNoiseAmp;
uniform float uFloorFreq, uGrAmp;
uniform float uPattFreq, uPattAmp;
uniform float uGlobeHeight;
uniform sampler3D Noise3;
uniform float Timer;
uniform bool uGlobeStyle;

flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;
vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

out float isglass;

void main( ){
	
	isglass = 0.0;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

	vNf = normalize( gl_NormalMatrix * gl_Normal );
	vNs = normalize( gl_NormalMatrix * gl_Normal );

	vLf = eyeLightPosition - ECposition.xyz;
	vLs = eyeLightPosition - ECposition.xyz;

	vEf = vec3( 0., 0., 0. ) - ECposition.xyz;
	vEs = vec3( 0., 0., 0. ) - ECposition.xyz;
	
	vec4 per_vertx = gl_Vertex;
	vec4 globNrm = texture( Noise3, uNoiseFreq * per_vertx.xyz);
	vec4 globFrq = texture( Noise3, uFloorFreq * per_vertx.xyz);
	float globe_noise = uNoiseAmp * cos((globNrm.r + globNrm.g + globNrm.b + globNrm.a) - 2.) + 0.2 * sin(per_vertx.x * uNoiseFreq);
	float globe_bottom_noise = sin(globFrq.r + globFrq.g + globFrq.b + globFrq.a - 2.) * tan(uGrAmp) * uNoiseAmp * cos((globNrm.r + globNrm.g + globNrm.b + globNrm.a) - 2.) + 0.2 * sin(per_vertx.x * uNoiseFreq);
	
	if(per_vertx.y >= uGlobeHeight + globe_bottom_noise){
		isglass = 1.0;
	}
	
	if(uGlobeStyle){
		if(isglass > 0.5) {
			per_vertx.y = per_vertx.y + globe_noise;
		}
	}else{
		float radius = pow(pow(per_vertx.x, 2.) + pow(per_vertx.z, 2.), 0.5);
		float globe_rip = uPattAmp * sin(uPattFreq * radius);
		if(isglass > 0.5)
			per_vertx.y = per_vertx.y + globe_rip;
	}
	
	gl_Position = gl_ModelViewProjectionMatrix * per_vertx;
}