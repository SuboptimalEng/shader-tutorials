precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

// reference: https://iquilezles.org/articles/distfunctions2d/
float sdBox(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = 2.0 * gl_FragCoord.xy / u_resolution - 1.0;
  uv.x = uv.x * u_resolution.x / u_resolution.y;

  vec3 grey = vec3(0.5);
  vec3 black = vec3(0.0);
  vec3 white = vec3(1.0);

  vec3 color = grey;

  const float halfBoardSize = 4.0;
  float boxWidth = 1.0 / (halfBoardSize * 4.0);
  vec2 boxDimensions = vec2(boxWidth, boxWidth);
  float separationSize = boxWidth + 0.01;

  for (float i = -halfBoardSize; i <= halfBoardSize; i++) {
    for (float j = -halfBoardSize; j <= halfBoardSize; j++) {
      vec2 center = vec2(i, j) * (boxWidth + separationSize);
      float distToBox = sdBox(uv - center, boxDimensions);

      if (mod(i + j, 2.0) <= 0.01) {
        color = distToBox < 0.0 ? white : color;
      } else {
        color = distToBox < 0.0 ? black : color;
      }
    }
  }

  gl_FragColor = vec4(color, 1.0);
}