#version 330 compatibility

#define M_PI 3.14159

out vec3  vMCposition;
out vec3  vLight;
out vec3  vEye;
out vec3  normal;
out vec2  vST;


uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

// Noise texture this project is for
uniform sampler3D Noise3; 

//Strength of the waves along the bottom part of the plane
uniform float uA;
uniform float uKa;
//Frequency of the waves along the bottom part of the plane.
uniform float uB;
//Position? of the waves along the bottom part of the plane
uniform float uC;
//Appears to change the wave following the bottom part of the plane
//Changes the wave
uniform float uD;
//Changes waves and amplifies them to occurr over the entire plane if shifted positively.
uniform float uE;


//Given to us in the assignment description
//Condenced the variable definitions into the assignments of the 
// different coordinates
vec3
RotateNormal( float angx, float angy, vec3 n )
{
        
        // How to rotate around the x axis
        float yp =  n.y * cos( angx ) - n.z * sin( angx );    // y'
        n.z      =  n.y * sin( angx ) + n.z * cos( angx );    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x * cos( angy ) + n.z * sin( angy );    // x'
        n.z      = -n.x * sin( angy ) + n.z * cos( angy );    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	//Calculate new vertex position

	//Need to calculate the Z position
	float x = gl_Vertex.x + 1;
	float y = gl_Vertex.y + 1;
	float zCalc = uA * ( cos( 2.* M_PI * uB * x+uC) * exp(-uD*x) ) * ( exp(-uE*y) );

	//Then we use that Z value in the glVertex
	vec4 glVertex = vec4(gl_Vertex.x, gl_Vertex.y, zCalc, gl_Vertex.w);

	vMCposition  = glVertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * glVertex;

	//Segment here given in the assignment description:
	// Getting two noise values

	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

	//Adding in an extra :
	// * ( 2. * M_PI * uB ) * exp(-uD * x)
	// will make it a little bit more detailed

	float shadVec = ( 2. * M_PI * uB ) * exp(-uD * x);

	// Following : K * ( 2. * PI )
	//Following the assignment description to find slopes:
	// float dzdx = K * (Y0-y) * (2.*PI/P) * cos( 2.*PI*x/P )
	// float dzdy = -K * sin( 2.*PI*x/P )


	// Looking at how to get the Z :
	// z = K * (Y0-y) * sin( 2.*PI*x/P )
	float dzdx = uA * ( -cos( 2. * M_PI * uB) * shadVec * cos(2. * M_PI * uB * x+uC) );
	float dzdy = -uA * (  sin( 2. * M_PI * uB) * exp(-uD*x) ) * ( -uE * exp(-uE*y) ); 

	//After that we take the tangent vectors :
	//
	// Tx = (1., 0., dzdx )
	// Ty = (0., 1., dzdy )
	//
	// store them as vec3's
	// given in the assignment description

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	vec3 vecNormals = normalize( cross( Tx, Ty ) );

    normal = RotateNormal(angx, angy, vecNormals);

	//Have to typecast these into vec3's
	//Shoved lighting from notes here.
	vec3 vEyePosition = vec3( gl_ModelViewMatrix * glVertex );
	vec3 vLightPosition = vec3(uLightX, uLightY, uLightZ);

	
	vLight = normalize(vLightPosition - vEyePosition);

	vEye = normalize(vec3(0.0, 0.0, 0.0) - vEyePosition);
}