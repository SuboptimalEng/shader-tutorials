precision lowp float;

void main() {
  // ambient lighting (global illuminance)
  vec3 ambient = vec3(0.5, 0.5, 0.5);

  // lighting = ambient + diffuse + specular
  vec3 lighting = ambient;

  // color = modelColor * lighting
  vec3 modelColor = vec3(1.0, 1.0, 1.0);
  vec3 color = modelColor * lighting;

  gl_FragColor = vec4(color, 1.0);
}