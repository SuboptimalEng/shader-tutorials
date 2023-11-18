precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_texture_0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.x = uv.x * u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.0);
  color = vec3(uv, 0.0);

  // note: add this to VS Code settings.json when using the glsl canvas extension
  // "glsl-canvas.textures": {
  //   "0": "./shader-tutorials/09-gaussian-blur/mario.png",
  // },

  vec4 texture = texture2D(u_texture_0, uv);
  color = texture.rgb;

  // vec2 imageResolution = vec2(100, 100);
  // vec2 imageResolution = vec2(2832, 2744);
  vec2 imageResolution = vec2(283.2, 274.4);
  vec2 texelSize = 1.0 / imageResolution;

  // const float kernelSize = 0.0;
  const float kernelSize = 1.0;
  // const float kernelSize = 2.0;
  // const float kernelSize = 3.0;
  vec3 boxBlurColor = vec3(0.0);
  // note: if kernelSize == 1.0, then boxBlurDivisor == 9.0
  float boxBlurDivisor = pow(2.0 * kernelSize + 1.0, 2.0);
  for (float i = -kernelSize; i <= kernelSize; i++) {
    for (float j = -kernelSize; j <= kernelSize; j++) {
      vec4 texture = texture2D(u_texture_0, uv + vec2(i, j) * texelSize);
      boxBlurColor = boxBlurColor + texture.rgb;
    }
  }
  boxBlurColor = boxBlurColor / boxBlurDivisor;
  color = boxBlurColor;

  float gaussianDivisor = 16.0;
  vec3 gaussianBlurColor = vec3(0.0);
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(-1, 1) * texelSize).rgb * 1.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(0, 1) * texelSize).rgb * 2.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(1, 1) * texelSize).rgb * 1.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(-1, 0) * texelSize).rgb * 2.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(0, 0) * texelSize).rgb * 4.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(1, 0) * texelSize).rgb * 2.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(-1, -1) * texelSize).rgb * 1.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(0, -1) * texelSize).rgb * 2.0;
  gaussianBlurColor += texture2D(u_texture_0, uv + vec2(1, -1) * texelSize).rgb * 1.0;
  gaussianBlurColor = gaussianBlurColor / gaussianDivisor;
  color = gaussianBlurColor;

  gl_FragColor = vec4(color, 1.0);
}