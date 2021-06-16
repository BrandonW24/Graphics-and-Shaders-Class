  
#version 330 compatibility

in vec3  vMCposition;
in vec3  vLight;
in vec3  vEye;
in vec3  normal;
in vec2  vST;

uniform vec4 uSpecularColor;
uniform vec4 uColor;
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

//Returns a vec4 color calculated from per fragment lighting equations
vec4
lighting()
{
    vec3 norm = normalize(gl_NormalMatrix * normal);
    vec4 ambient, diffuse, spec;

    ambient = uKa * uColor;
    diffuse = uKd * max(dot(norm, vLight), 0.) * uColor;

    if(dot(norm, vLight) > 0.)
    {
        vec3 reflection = normalize(reflect(-vLight, norm));
        spec = uKs * pow(max(dot(vEye, reflection), 0.), uShininess) * uSpecularColor;
    }

    return vec4(ambient.rgb + diffuse.rgb + spec.rgb, 1.);

}

void
main( ) 
{
    gl_FragColor = lighting();
}