#version 330 compatibility

uniform sampler2D uTexUnit;

uniform float uScenter;
uniform float uTcenter;
uniform float uRadius;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;

in vec2 vST;

void main ( ) {
    vec2 st = vST;

    float sDist = st.s - uScenter;
    float tDist = st.t - uTcenter;
   // circular lens
    if( ((st.s - uScenter) * (st.s - uScenter)) + ((st.t - uTcenter) * (st.t - uTcenter)) <= (uRadius * uRadius) ) {

        //Attempted to do toon rendering within the lens
//        float mag = sqrt( h*h + v*v );
//        if( mag > uMagFactor ){
//           gl_FragColor= vec4( 0., 0., 0., 1. );
//        }
//        else{
//            rgb.rgb *= uQuantize;
//            rgb.rgb += vec3( .5, .5, .5 );
//            ivec3 irgb = ivec3( rgb.rgb );
//            rgb.rgb = vec3( irgb ) / uQuantize;
//            gl_FragColor= vec4( rgb, 1. );
//        }

        // position of the lens
        st.s -= uScenter;
        st.t -= uTcenter;

        //Magnify factor
        st.s /= uMagFactor;
        st.t /= uMagFactor;

        //Rotation for the lens
        float s = st.s;
        float t = st.t;
        st.s = s*cos(uRotAngle) + t*sin(uRotAngle);
        st.t = -s*sin(uRotAngle) + t*cos(uRotAngle);

        //Bring back to global coordinates
        st.s += uScenter;
        st.t += uTcenter;

        
        //Image sharpening below :
        // lifted straight from slide 15 in the
        // image manipulation notes.

        ivec2 ires = textureSize(uTexUnit, 0);
        float ResS = float(ires.s);
        float ResT = float(ires.t);

        vec2 stp0 = vec2(1. / ResS, 0.);
        vec2 st0p = vec2(0., 1. / ResT);
        vec2 stpp = vec2(1. / ResS, 1. / ResT);
        vec2 stpm = vec2(1. / ResS, -1. / ResT);

        vec3 i00    = texture2D( uTexUnit, st ).rgb;
        vec3 im1m1  = texture2D( uTexUnit, st - stpp ).rgb;
        vec3 ip1p1  = texture2D( uTexUnit, st + stpp ).rgb;
        vec3 im1p1  = texture2D( uTexUnit, st - stpm ).rgb;
        vec3 ip1m1  = texture2D( uTexUnit, st + stpm ).rgb;
        vec3 im10   = texture2D( uTexUnit, st - stp0 ).rgb;
        vec3 ip10   = texture2D( uTexUnit, st + stp0 ).rgb;
        vec3 i0m1   = texture2D( uTexUnit, st - st0p ).rgb;
        vec3 i0p1   = texture2D( uTexUnit, st + st0p ).rgb;

        vec3 target = vec3(0., 0., 0.);
        target += 1.* (im1m1 + ip1m1 + ip1p1 + im1p1);
        target += 2.* (im10 + ip10 + i0m1 + i0p1);
        target += 4. * (i00);
        target /= 16.;

        gl_FragColor = vec4( mix( target, i00, uSharpFactor ), 1. );

    } else {
        gl_FragColor = vec4(texture2D(uTexUnit, st).rgb, 1.);
    }
}