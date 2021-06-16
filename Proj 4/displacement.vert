#version 330 compatibility

#define M_PI 3.14159

out vec3  vMC;
out vec3  vEs;
out vec3  vNs;

//From last assignment, removed lighting
//Frequency of the waves along the bottom part of the plane.
uniform float uB;
//Position? of the waves along the bottom part of the plane
uniform float uC;
//Appears to change the wave following the bottom part of the plane
//Changes the wave
uniform float uD;
//Changes waves and amplifies them to occurr over the entire plane if shifted positively.
uniform float uE;
uniform float uK;
uniform float uP;

void main(){
	//Calculate new vertex position
    float x, y, z, w;
    x = gl_Vertex.x;
    y = gl_Vertex.y;

    z = uK * ( cos(2.*M_PI*uB* ( x + 1) + uC) * exp(-uD*( x + 1) ) * ( exp(-uE*( y + 1 )) ));
    w = gl_Vertex.w;

	vec4 vertex = vec4(x, y, z, w);

	vMC = vertex.xyz;
	vEs  = (gl_ModelViewMatrix * vertex).xyz;

	float xV = vertex.x + 1;
	float yV = vertex.y + 1;

	// Looking at how to get the Z :
	// z = K * (Y0 - y) * sin( 2. * PI * x/P )
	float shadVec = ( 2. * M_PI * uB ) * exp(-uD * x);
	float dzdx = uK * ( -cos( 2. * M_PI * uB) * shadVec * cos(2. * M_PI * uB * xV + uC) );
	float dzdy = -uK * (  sin( 2. * M_PI * uB) * exp(-uD * xV) ) * ( -uE * exp(-uE * yV) ); 

	//Tangent Vectors
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	vec3 normals = normalize(cross(Tx, Ty));

    vNs = normalize(gl_NormalMatrix * normals);
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}