// Reference from Inigo Quilez: https://iquilezles.org/articles/distfunctions/
float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float opUnion(float d1, float d2) {
  return min(d1, d2);
}

float opSubtraction(float d1, float d2) {
  return max(-d1, d2);
}

float opIntersection(float d1, float d2) {
  return max(d1, d2);
}

float opXor(float d1, float d2) {
  return max(min(d1, d2), -max(d1, d2));
}

float opOnion(in float sdf, in float thickness) {
  return abs(sdf) - thickness;
}

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

float opSmoothSubtraction(float d1, float d2, float k) {
  float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
  return mix(d2, -d1, h) + k * h * (1.0 - h);
}

float opSmoothIntersection(float d1, float d2, float k) {
  float h = clamp(0.5 - 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) + k * h * (1.0 - h);
}

vec3 opSpaceRepetition(in vec3 p, in vec3 s, inout vec3 id) {
  // Reference by IQ, but round function is not available.
  // vec3 q = p - s * round(p / s);
  // return q;

  // old version
  // vec3 q = mod(p + s / 2.0, s) - s / 2.0;
  // return q;

  // new version
  // vec3 q = p - s * (floor(p / s + 0.5));
  // return q;

  // with id
  id = floor(p / s + 0.5);
  vec3 q = p - s * id;
  return q;
}

vec3 opLimitedRepetition(in vec3 p, in float s, in vec3 l, inout vec3 id) {
  // Reference by IQ, but round function is not available.
  // vec3 q = p - s * clamp(round(p / s), -l, l);
  // return primitive(q);

  // vec3 q = p - s * clamp(floor(p / s + 0.5), -l, l);
  // return q;

  id = floor(p / s + 0.5);
  vec3 q = p - s * clamp(id, -l, l);
  return q;
}

// Reference by IQ, but sdf3d primitive is not available.
// float opCheapBend(in sdf3d primitive, in vec3 p) {
//   const float k = 10.0; // or some other amount
//   float c = cos(k * p.x);
//   float s = sin(k * p.x);
//   mat2 m = mat2(c, -s, s, c);
//   vec3 q = vec3(m * p.xy, p.z);
//   return primitive(q);
// }

vec3 opBend(in vec3 p, float bendFactor) {
  float k = bendFactor; // or some other amount
  float c = cos(k * p.x);
  float s = sin(k * p.x);
  mat2 m = mat2(c, -s, s, c);
  vec3 q = vec3(m * p.xy, p.z);
  return q;
}

// Reference by IQ, but sdf3d primitive is not available.
// float opTwist(in sdf3d primitive, in vec3 p) {
//   const float k = 10.0; // or some other amount
//   float c = cos(k * p.y);
//   float s = sin(k * p.y);
//   mat2 m = mat2(c, -s, s, c);
//   vec3 q = vec3(m * p.xz, p.y);
//   return primitive(q);
// }

vec3 opTwist(in vec3 p, float twistFactor) {
  float k = twistFactor; // or some other amount
  float c = cos(k * p.y);
  float s = sin(k * p.y);
  mat2 m = mat2(c, -s, s, c);
  vec3 q = vec3(m * p.xz, p.y);
  return q;
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

// This function needs to be defined in fragment shader.
float map(vec3 p, inout vec3 c);

vec3 calcNormal(vec3 p) {
  vec2 d = vec2(0.001, 0.0);
  vec3 c = vec3(0.0);
  float n = map(p, c);
  float gx = n - map(p - d.xyy, c);
  float gy = n - map(p - d.yxy, c);
  float gz = n - map(p - d.yyx, c);
  return normalize(vec3(gx, gy, gz));
}

vec3 calcLighting(vec3 ro, vec3 n) {
  vec3 lightColor = vec3(1.0);
  vec3 lightSource = vec3(1.0, 1.0, -3.0);
  float diffuseStrength = max(0.0, dot(normalize(lightSource), n));
  vec3 diffuse = diffuseStrength * lightColor;

  vec3 viewSource = normalize(ro);
  vec3 reflectSource = normalize(reflect(-lightSource, n));
  float specularStrength = max(0.0, dot(viewSource, reflectSource));
  specularStrength = pow(specularStrength, 64.0);
  vec3 specular = specularStrength * lightColor;

  // vec3 ambient = vec3(1.0);
  // return ambient * 0.1 + diffuse * 0.7 + specular * 0.2;
  return diffuse * 0.7 + specular * 0.3;
}
