  
#version 330 compatibility

uniform sampler2D TexUnit;

//Get a very basic texture fragment going for the
//imported photos.

in vec2 vST;

void main () {
    gl_FragColor = vec4(texture2D(TexUnit, vST).rgb, 1.);
}