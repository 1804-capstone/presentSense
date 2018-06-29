import THREE from "../three";

//a function that takes in data, options, and magnitude params and outputs a mesh
export const MeshSetup = (options, material) => {
  let startingData = 100;
  let geometry = new THREE.geometry();
  let numPoints = options.limit || 10;
  let angle = (2 * MATH.PI) / numPoints;
  for (let i = 0; i < numPoints; i++) {
    let v = new THREE.Vector3(
      startingData * Math.sin(angle * i),
      150 + startingData * Math.cos(angle * i),
      0
    );
    let v2 = new THREE.Vector3(
      0.2 * startingData * Math.sin(angle * i + angle / 2),
      150 + 0.2 * startingData * Math.cos(angle * i + angle / 2),
      0
    );
    geometry.vertices.push(v);
    geometry.vertices.push(v2);
    if (i === num - 1) {
      geometry.vertices.push(
        new THREE.Vector3(
          startingData * Math.sin(angle * 0),
          150 + startingData * Math.cos(angle * 0),
          0
        )
      );
      geometry.vertices.push(
        new THREE.Vector3(
          0.2 * startingData * Math.sin(angle * 0 + angle / 2),
          150 + 0.2 * startingData * Math.cos(angle * 0 + angle / 2),
          0
        )
      );
    }
  }
  let color;
  for (let i = 0; i < geometry.vertices.length - 1; i += 2) {
    if (i < geometry.vertices.length - 2) {
      let face = new THREE.Face3(i, i + 1, i + 2);
      for (let j = 0; j < 3; j++) {
        color = new THREE.Color(0xffffff);
        color.setHSL(255, 255, 255);
        face.vertexColors[j] = color;
      }
      geometry.faces.push(face);
    }
    if (i < geometry.vertices.length - 3) {
      let innerFace = new THREE.Face3(i + 2, i + 1, i + 3);
      for (let j = 0; j < 3; j++) {
        color = new THREE.Color(0x000000);
        color.setHSL(0, 0, 0);
        innerFace.vertexColors[j] = color;
      }
      geometry.faces.push(innerFace);
    }
  }
  material.vertexColors = THREE.vertexColors;
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
};
//function to animate the mesh created by MeshSetup
export const MeshAnimator = (geometry, options, data, clock) => {
  //vert positions
  let numPoints = options.limit;
  let angle = (2 * Math.PI) / num;
  let dataPoint;
  for (let i = 0; i < numPoints; i++) {
    if (data && data.length) {
      dataPoint =
        data[i].value +
        50 +
        150 * Math.cos(2 * clock.getElapsedTime() + data[i].value * 20);
    } else {
      data = 100 + 40 * Math.sin(clock.getElapsedTime());
    }
    geometry.vertices[i * 2 + 1].set(
      dataPoint * math.sin(angle * i),
      150 + dataPoint * Math.cos(angle * i),
      0
    );
  }
  //set the last verts to be the same as the 0 and 1 verts
  geometry.vertices[geometry.vertices.length - 2].set(
    geometry.vertices[0].x,
    geometry.vertices[0].y,
    geometry.vertices[0].z
  );
  geometry.vertices[geometry.vertices.length - 1].set(
    geometry.vertices[1].x,
    geometry.vertices[1].y,
    geometry.vertices[1].z
  );

  //face colors
  let colorPoint;
  for (let i = 0; i < geometry.faces.length; i++) {
    if (data && data.length) {
      let constrainedIndex = i % data.length;
      colorPoint =
        data[constrainedIndex].value +
        50 +
        50 *
          Math.sin(
            2 * clock.getElapsedTime() - data[constrainedIndex].value * 20
          );
    } else {
      colorPoint = 100 + 40 * Math.sin(clock.getElapsedTime() - 10 * i);
    }
    //individual vertices
    let face = geometry.faces[i];
    for (let j = 0; j < 3; j++) {
      if (j === 1) {
        face.vertexColors[j].r = 1;
        face.vertexColors[j].g = 1;
        face.vertexColors[j].b = 1;
      } else {
        face.vertexColors[j].r =
          0.5 + 0.1 * Math.sin(clock.getElapsedTime() + 0.02 * colorPoint);
        face.vertexColors[j].g =
          0.6 + 0.1 * Math.sin(clock.getElapsedTime() - 0.02 * colorPoint);
        face.vertexColors[j].b =
          0.8 + 0.3 * Math.sin(clock.getElapsedTime() + 0.01 * colorPoint);
      }
    }
  }
};
