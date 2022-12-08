precision lowp float;

// varying vec4 v_normal;

void main() {
  // ambient lighting (global illuminance)
  // vec3 ambient = vec3(0.5, 0.5, 0.5);

  // diffuse (lambertian) lighting
  // lightColor, lightSource, normal, diffuseStrength
  // vec3 normal = normalize(v_normal.xyz);
  // vec3 lightColor = vec3(1.0, 1.0, 1.0); // color - white
  // vec3 lightSource = vec3(1.0, 0.0, 0.0); // coord - (1, 0, 0)
  // float diffuseStrength = max(0.0, dot(lightSource, normal));
  // vec3 diffuse = diffuseStrength * lightColor;

  // diffuse light left
  // vec3 lightColor2 = vec3(1.0, 0.0, 0.0); // color - red
  // vec3 lightSource2 = vec3(-1.0, 0.0, 0.0); // coord - (-1, 0, 0)
  // float diffuseStrength2 = max(0.0, dot(lightSource2, normal));
  // vec3 diffuse2 = diffuseStrength2 * lightColor2;

  // lighting = ambient + diffuse + specular
  vec3 lighting = vec3(1.0, 1.0, 1.0); // color - white
  // lighting = ambient;
  // lighting = ambient * 0.0 + diffuse;
  // lighting = ambient * 0.0 + diffuse + diffuse2;

  // color = modelColor * lighting
  vec3 modelColor = vec3(1.0, 1.0, 1.0); // color - white
  vec3 color = modelColor * lighting;

  gl_FragColor = vec4(color, 1.0);
}