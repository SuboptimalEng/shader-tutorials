precision mediump float;

// #extension GL_GOOGLE_include_directive : enable
#include "../common/functions.glsl"

// shapes
float sdRoundBox(vec3 p, vec3 b, float r);
// space
float opUnion(float d1, float d2);
vec3 opBend(in vec3 p, float bendFactor);
vec3 opSpaceRepetition(in vec3 p, in vec3 s, inout vec3 id);
// lighting
vec3 calcNormal(vec3 p);
vec3 calcLighting(vec3 ro, vec3 n);
// functions
mat2 rotate(float angle);

// constants
float MAX_DIST = 100.0;
float MIN_DIST = 0.0001;

// colors
vec3 BLACK = vec3(0.0);
vec3 WHITE = vec3(1.0);
vec3 RED = vec3(1.0, 0.0, 0.0);
vec3 MAGENTA = vec3(1.0, 0.0, 1.0);

// uniforms
uniform float u_time;
uniform vec2 u_resolution;

float whiteKey(vec3 p) {
  float y = 2.0;
  float x = y / 4.0;
  float z = y / 10.0;
  float d = sdRoundBox(p, vec3(x, y, z), 0.1) * .5;
  return d;
}

float blackKey(vec3 p) {
  float y = 1.2;
  float x = y / 4.0;
  float z = y / 8.0;
  float d = sdRoundBox(p, vec3(x, y, z), 0.1) * 0.5;
  return d;
}

float map(vec3 p, inout vec3 c) {
  // bend piano
  p = opBend(p, (sin(u_time) * 0.5) * 0.25);
  p.xzy = opBend(p.xzy, 0.05);

  vec3 whiteKeyId;
  vec3 q = opSpaceRepetition(p, vec3(1.1, 0.0, 0.0), whiteKeyId);
  q.y = q.y + sin(u_time + whiteKeyId.x * 0.5);

  vec3 blackKeyId;
  vec3 qb = opSpaceRepetition(p - vec3(0.5, 0.8, -0.25), vec3(1.0, 0.0, 0.0), blackKeyId);
  qb.y = qb.y + sin(u_time + blackKeyId.x * 0.5);

  // pressing keys progress
  float speed = 4.0;
  float amplitude = 0.05;
  vec3 axisPoint = vec3(0.0, 2.0, 0.0);
  if (whiteKeyId.x == 2.0) {
    q -= axisPoint;
    q.yz = q.yz * rotate((sin(u_time * speed) * 0.5 + 0.5) * amplitude);
    q += axisPoint;
  }
  if (blackKeyId.x == -3.0) {
    qb -= axisPoint;
    qb.yz = qb.yz * rotate((sin(u_time * speed) * 0.5 + 0.5) * amplitude);
    qb += axisPoint;
  }

  float wk = whiteKey(q);
  float bk = blackKey(qb);

  float m = mod(blackKeyId.x, 7.0);
  bk = m == 0.0 || m == 3.0 ? 20.0 : bk;
  c = wk < bk ? WHITE : BLACK;
  if (wk < bk) {
    if (mod(whiteKeyId.x, 7.0) == 2.0) {
      c = mix(WHITE, RED, smoothstep(0.1, 0.15, sin(u_time * 4.0) * 0.5 + 0.5));
    }
  } else {
    if (mod(blackKeyId.x, 7.0) == 4.0) {
      c = mix(BLACK, RED, smoothstep(0.1, 0.2, sin(u_time * 4.0) * 0.5 + 0.5));
    }
  }

  float d = opUnion(wk, bk);
  return d;
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
  vec3 ro = vec3(0.0, 0.0, -4.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  float td = 0.0; // total distance

  vec3 c;
  vec3 n;
  float steps = 0.0;
  for (int i = 0; i < 100; i++) {
    vec3 p = ro + rd * td;
    float d = map(p, c);
    steps = float(i);
    if (td > MAX_DIST || d < abs(MIN_DIST)) {
      break;
    }
    td += d;
  }

  vec3 color = MAGENTA;
  if (td < MAX_DIST) {
    vec3 p = ro + rd * td;
    n = calcNormal(p);
    color = c * calcLighting(ro, n);
  }

  // uncomment each one to see different color styles
  // color = vec3(td * 0.05);
  color = steps < 80.0 ? pow(vec3(steps * 0.01) * color, vec3(0.25)) : pow(color * steps * 0.1, vec3(0.1));
  // color = pow(vec3(steps * 0.01) * color * steps, vec3(0.125));
  // color = td < 100.0 ? pow(vec3(steps * 0.01), vec3(0.25)) : color * steps * 0.01;
  // color = td < 100.0 ? pow(vec3(steps * 0.01) * color, vec3(0.125)) : color * steps * 0.01;
  // color = td < 100.0 ? pow(vec3(steps * 0.01), vec3(0.25)) * n : color * steps * 0.01;

  // add gamma correction
  color = pow(color, vec3(1.0 / 2.2));

  gl_FragColor = vec4(color, 1.0);
}