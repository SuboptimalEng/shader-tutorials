precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

// https://iquilezles.org/articles/distfunctions2d/
float sdfCircle(vec2 p, float r) {
  // note: sqrt(pow(p.x, 2.0) + pow(p.y, 2.0)) - r;
  return length(p) - r;
}

void main() {
  // note: set up uv coordinates
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv = uv - 0.5;
  uv = uv * u_resolution / 100.0;

  // note: set up basic colors
  vec3 black = vec3(0.0);
  vec3 white = vec3(1.0);
  vec3 red = vec3(1.0, 0.0, 0.0);
  vec3 blue = vec3(0.65, 0.85, 1.0);
  vec3 orange = vec3(0.9, 0.6, 0.3);
  vec3 color = black;
  color = vec3(uv.x, uv.y, 0.0);

  // note: draw circle sdf
  float radius = 2.5;
  float radius = 3.0;
  vec2 center = vec2(0.0, 0.0);
  // center = vec2(sin(2.0 * u_time), 0.0);
  float distanceToCircle = sdfCircle(uv - center, radius);
  color = distanceToCircle > 0.0 ? orange : blue;

  // note: adding a black outline to the circle
  // color = color * exp(distanceToCircle);
  // color = color * exp(2.0 * distanceToCircle);
  // color = color * exp(-2.0 * abs(distanceToCircle));
  color = color * (1.0 - exp(-2.0 * abs(distanceToCircle)));
  // color = color * (1.0 - exp(-5.0 * abs(distanceToCircle)));
  // color = color * (1.0 - exp(-5.0 * abs(distanceToCircle)));

  // note: adding waves
  // color = color * 0.8 + color * 0.2;
  // color = color * 0.8 + color * 0.2 * sin(distanceToCircle);
  // color = color * 0.8 + color * 0.2 * sin(50.0 * distanceToCircle);
  color = color * 0.8 + color * 0.2 * sin(50.0 * distanceToCircle - 4.0 * u_time);

  // note: adding white border to the circle
  // color = mix(white, color, step(0.1, distanceToCircle));
  // color = mix(white, color, step(0.1, abs(distanceToCircle)));
  color = mix(white, color, smoothstep(0.0, 0.1, abs(distanceToCircle)));

  // note: thumbnail?
  // color = mix(white, color, abs(distanceToCircle));
  // color = mix(white, color, 2.0 * abs(distanceToCircle));
  // color = mix(white, color, 4.0 * abs(distanceToCircle));

  gl_FragColor = vec4(color, 1.0);
}
