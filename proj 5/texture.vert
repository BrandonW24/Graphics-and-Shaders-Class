#version 330 compatibility

//Get a very very very basic texture vertex going
out vec2 vST;

void main () {
    vST = gl_MultiTexCoord0.st;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}