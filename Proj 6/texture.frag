#version 330 compatibility

uniform float uKa, uKd, uKs;
uniform vec4 uSpecularColor;
uniform float uShininess;
uniform sampler2D uTexUnit;

const vec4 snow_globe_ground = vec4(0.35, 0.66, 0.41, 1.);
const vec4 glass = vec4(1., 1., 1., 0.2);

flat in vec3 vNf;
in vec3 vNs;
flat in vec3 vLf;
in vec3 vLs;
flat in vec3 vEf;
in vec3 vEs;
in vec2 vST;

in float isglass;

void
main( ){
	vec3 Normal, Light, Eye;
	vec4 fragColor = vec4(texture2D(uTexUnit, vST).rgb, 1.);
	if(isglass > 0.5){
		fragColor = glass;
	}
	
	Normal = normalize(vNs);
	Light = normalize(vLs);
	Eye = normalize(vEs);

	float s = 0.;
	if( dot(Normal, Light) > 0. ){
		s = pow( max( dot(Eye, normalize( 2. * Normal * dot(Normal, Light) - Light )),0. ), uShininess );
	}
	
	gl_FragColor = vec4( (uKa * fragColor).rgb + (uKd * max( dot(Normal,Light), 0. ) * fragColor).rgb + (uKs * s * uSpecularColor).rgb, fragColor.w );
}