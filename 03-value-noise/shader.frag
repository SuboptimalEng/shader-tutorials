precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

vec2 cubic(vec2 p) {
  return p * p * (3.0 - 2.0 * p);
}

vec2 quintic(vec2 p) {
  return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
}

float whiteNoise2x1(vec2 p) {
  // return p.x;

  // return fract(p.x * p.y * 1000.0123);

  // generic noise function - replace with something better
  // float random = dot(p, vec2(12.9898, 78.233));
  float random = dot(p, vec2(12., 78.));
  random = sin(random);
  random = random * 43758.5453;
  random = fract(random);
  return random;
}

float valueNoiseFn(vec2 uv) {
  vec2 gridUv = fract(uv);
  vec2 gridId = floor(uv);

  gridUv = quintic(gridUv);

  float botLeft = whiteNoise2x1(gridId);
  float botRight = whiteNoise2x1(gridId + vec2(1.0, 0.0));
  float b = mix(botLeft, botRight, gridUv.x);

  float topLeft = whiteNoise2x1(gridId + vec2(0.0, 1.0));
  float topRight = whiteNoise2x1(gridId + vec2(1.0, 1.0));
  float t = mix(topLeft, topRight, gridUv.x);

  float noise = mix(b, t, gridUv.y);

  return noise;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv = gl_FragCoord.xy / u_resolution.y;

  vec3 color = vec3(1.0);

  // part 1 - create white noise function
  // color = vec3(whiteNoise2x1(uv));

  // part 2.1 - add hidden grid overlay
  // uv = uv * 2.0;
  // uv = uv * 4.0;
  // uv = uv * 8.0;
  // vec2 gridUv = fract(uv);
  // color = vec3(gridUv, 0.0);

  // part 2.2 - set up grid ids
  // vec2 gridId = floor(uv);
  // color = vec3(gridId, 0.0);
  // color = vec3(gridId, 0.0) * 0.25;

  // part 4 - smoothstep uv coordinates to fix rough edges
  // gridUv = smoothstep(0.0, 1.0, gridUv);
  // gridUv = cubic(gridUv);
  // gridUv = quintic(gridUv);

  // part 3.1 - lerp between bottom two coordinates
  // float botLeft = whiteNoise2x1(gridId);
  // float botRight = whiteNoise2x1(gridId + vec2(1.0, 0.0));
  // float b = mix(botLeft, botRight, gridUv.x);
  // color = vec3(b);

  // part 3.2 - lerp between top two coordinates
  // float topLeft = whiteNoise2x1(gridId + vec2(0.0, 1.0));
  // float topRight = whiteNoise2x1(gridId + vec2(1.0, 1.0));
  // float t = mix(topLeft, topRight, gridUv.x);
  // color = vec3(t);

  // part 3.3 - lerp between top and bottom based on y axis
  // float valueNoise = mix(b, t, gridUv.y);
  // color = vec3(valueNoise);

  // part 5 - add layers (a.k.a octaves) of value noise
  uv += u_time / 10.0;
  float vn = valueNoiseFn(uv * 4.0) * 1.0;
  vn += valueNoiseFn(uv * 8.0) * 0.5;
  vn += valueNoiseFn(uv * 16.0) * 0.25;
  vn += valueNoiseFn(uv * 32.0) * 0.125;
  vn += valueNoiseFn(uv * 64.0) * 0.0625;
  vn /= 2.0;
  color = vec3(vn);

  gl_FragColor = vec4(color, 1.0);
}