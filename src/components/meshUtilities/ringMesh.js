import THREE from "./three";

//a function that takes in data, options, and magnitude params and outputs a mesh
export const GeometrySetup = (options, scale = 1, zIndex = 1) => {
  let startingData = 100 * scale;
  let geometry = new THREE.Geometry();
  let numPoints = options.limit;
  let angle = (2 * Math.PI) / numPoints;
  for (let i = 0; i < numPoints; i++) {
    let v = new THREE.Vector3(
      startingData * Math.sin(angle * i),
      0 + startingData * Math.cos(angle * i),
      zIndex
    );
    let v2 = new THREE.Vector3(
      0.2 * startingData * Math.sin(angle * i + angle / 2),
      0 + 0.2 * startingData * Math.cos(angle * i + angle / 2),
      zIndex
    );
    geometry.vertices.push(v);
    geometry.vertices.push(v2);
    if (i === numPoints - 1) {
      geometry.vertices.push(
        new THREE.Vector3(
          startingData * Math.sin(angle * 0),
          0 + startingData * Math.cos(angle * 0),
          zIndex
        )
      );
      geometry.vertices.push(
        new THREE.Vector3(
          0.2 * startingData * Math.sin(angle * 0 + angle / 2),
          0 + 0.2 * startingData * Math.cos(angle * 0 + angle / 2),
          zIndex
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

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
};

//function to animate the mesh created by MeshSetup
export const MeshAnimator = (
  geometry,
  options,
  data,
  clock,
  scale = 1,
  zIndex
) => {
  //vert positions

  let numPoints = data.length;
  let angle = (2 * Math.PI) / numPoints;
  let dataPoint;
  let dataPoint2;
  let constrainedIndex;
  // console.log(
  //   "GEOMETRY LEN",
  //   geometry.vertices.length,
  //   options.limit,
  //   data.length
  // );
  for (let i = 0; i < Math.floor(geometry.vertices.length / 2) - 1; i++) {
    if (data && data.length) {
      if (data.length <= numPoints) {
        constrainedIndex = i % data.length;
      } else {
        constrainedIndex = i;
      }
      dataPoint =
        data[constrainedIndex].value * scale +
        100 +
        100 *
          Math.cos(
            2 * clock.getElapsedTime() + data[constrainedIndex].value * 2
          );
      dataPoint2 =
        0.5 * data[constrainedIndex].value * scale +
        0.5 *
          data[constrainedIndex].value *
          scale *
          Math.sin(
            1 * clock.getElapsedTime() + data[constrainedIndex].value * 1
          );
    } else {
      dataPoint = 100 + 40 * Math.sin(2 * clock.getElapsedTime());
      dataPoint2 = 40 + 40 * Math.cos(clock.getElapsedTime());
    }

    geometry.vertices[Math.max(i * 2 - 2, 0)].set(
      dataPoint * Math.sin(angle * i),
      0 + dataPoint * Math.cos(angle * i),
      zIndex
    );

    geometry.vertices[i * 2 + 1].set(
      dataPoint2 * Math.sin(angle * i),
      0 + dataPoint2 * Math.cos(angle * i),
      zIndex
    );
  }

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

export const HeartMeshAnimator = (
  geometry,
  options,
  data,
  clock,
  scale = 1,
  zIndex
) => {
  //vert positions

  let numPoints = options.limit || data.length;
  let angle = (2 * Math.PI) / numPoints;
  let dataPoint;
  let dataPoint2;
  let constrainedIndex;
  for (let i = 0; i < numPoints; i++) {
    if (data && data.length) {
      if (data.length < numPoints) {
        constrainedIndex = i % data.length;
      } else {
        constrainedIndex = i;
      }
      dataPoint =
        data[constrainedIndex].value * scale +
        100 +
        100 *
          Math.cos(
            2 * clock.getElapsedTime() + data[constrainedIndex].value * 2
          );
      dataPoint2 =
        50 +
        0.5 * data[constrainedIndex].value * scale +
        0.5 *
          data[constrainedIndex].value *
          scale *
          Math.sin(
            1 * clock.getElapsedTime() + data[constrainedIndex].value * 1
          );
    } else {
      dataPoint = 100 + 40 * Math.sin(2 * clock.getElapsedTime());
      dataPoint2 = 40 + 40 * Math.cos(clock.getElapsedTime());
    }

    geometry.vertices[i * 2].set(
      dataPoint * Math.sin(angle * i),
      0 + dataPoint * Math.cos(angle * i),
      zIndex
    );

    geometry.vertices[i * 2 + 1].set(
      dataPoint2 * Math.sin(angle * i),
      0 + dataPoint2 * Math.cos(angle * i),
      zIndex
    );
  }

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

  let colorPoint;
  let dataValue;
  let vertColor = {};
  for (let i = 0; i < geometry.faces.length; i++) {
    if (data && data.length) {
      let constrainedIndex = i % data.length;
      dataValue = data[constrainedIndex].value;
      colorPoint =
        dataValue +
        50 +
        50 * Math.sin(2 * clock.getElapsedTime() - dataValue * 20);
    } else {
      console.log("No data???");
      dataValue = 100;
      colorPoint = 100 + 40 * Math.sin(clock.getElapsedTime() - 10 * i);
    }
    //individual vertices
    let face = geometry.faces[i];
    vertColor[i] = {
      r: 0.5 + 0.1 * Math.sin(clock.getElapsedTime() + 0.2 * dataValue),
      g: 0.6 + 0.1 * Math.sin(clock.getElapsedTime() - 0.2 * dataValue),
      b: 0.8 + 0.3 * Math.sin(clock.getElapsedTime() + 0.1 * dataValue)
    };
    // for (let j = 0; j < 3; j++) {
    //   if (i % 2 === 0) {
    //     face.vertexColors[j].r = 1;
    //     face.vertexColors[j].g = 1;
    //     face.vertexColors[j].b = 1;
    //     if(

    //     )
    //   } else {
    //     //outer double vertex
    //     face.vertexColors[j].r = vertColor[i].r;
    //     face.vertexColors[j].g = vertColor[i].g;
    //     face.vertexColors[j].b = vertColor[i].b;
    //   }
    // }
    for (let j = 0; j < 3; j++) {
      if (j === 1 && i % 2 === 0) {
        //inner single vertex
        face.vertexColors[j].r = 1;
        face.vertexColors[j].g = 1;
        face.vertexColors[j].b = 1;
      } else if (i % 2 === 1) {
        if (j === 2 || j === 1) {
          //inner double vertex
          face.vertexColors[j].r = 1;
          face.vertexColors[j].g = 1;
          face.vertexColors[j].b = 1;
        } else {
          //outer single vertex
          face.vertexColors[j].r = vertColor[i].r;
          face.vertexColors[j].g = vertColor[i].g;
          face.vertexColors[j].b = vertColor[i].b;
        }
      } else {
        // face.vertexColors[j].r =
        //   0.5 + 0.1 * Math.sin(clock.getElapsedTime() + 0.2 * dataValue);
        // face.vertexColors[j].g =
        //   0.6 + 0.1 * Math.sin(clock.getElapsedTime() - 0.2 * dataValue);
        // face.vertexColors[j].b =
        //   0.8 + 0.3 * Math.sin(clock.getElapsedTime() + 0.1 * dataValue);
        // face.vertexColors[j].r = 0;
        // face.vertexColors[j].g = 0;
        // face.vertexColors[j].b = 0;
        if (i > 0) {
          face.vertexColors[j].r = vertColor[i - 1].r;
          face.vertexColors[j].g = vertColor[i - 1].g;
          face.vertexColors[j].b = vertColor[i - 1].b;
        } else {
          face.vertexColors[j].r = vertColor[i].r;
          face.vertexColors[j].g = vertColor[i].g;
          face.vertexColors[j].b = vertColor[i].b;
        }
      }
    }
  }
};

export const MoodMeshAnimator = (
  geometry,
  options,
  data,
  clock,
  scale = 1,
  zIndex = 1
) => {
  //vert positions

  let numPoints = data.length;
  let angle = (2 * Math.PI) / numPoints;
  let dataPoint;
  let dataPoint2;
  let constrainedIndex;
  for (let i = 0; i < numPoints; i++) {
    if (data && data.length) {
      if (data.length < numPoints) {
        constrainedIndex = i % data.length;
      } else {
        constrainedIndex = i;
      }
      dataPoint =
        data[constrainedIndex].value * scale * 3 +
        100 +
        80 *
          Math.cos(
            2 * clock.getElapsedTime() +
              data[constrainedIndex].value * 2 -
              5 * i
          );
      dataPoint2 =
        data[constrainedIndex].value * scale * 3 +
        100 +
        80 *
          Math.sin(
            2 * clock.getElapsedTime() +
              data[constrainedIndex].value * 2 +
              1 * i
          );
    } else {
      dataPoint = 100 + 40 * Math.sin(2 * clock.getElapsedTime());
      dataPoint2 = 40 + 40 * Math.cos(clock.getElapsedTime());
    }
    if (geometry.vertices && geometry.vertices[i * 2]) {
      geometry.vertices[i * 2].set(
        dataPoint * Math.sin(angle * i),
        0 + dataPoint * Math.cos(angle * i),
        zIndex
      );
    }
    if (geometry.vertices && geometry.vertices[i * 2 + 1]) {
      geometry.vertices[i * 2 + 1].set(
        dataPoint2 * Math.sin(angle * i),
        0 + dataPoint2 * Math.cos(angle * i),
        zIndex
      );
    }
  }

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

  let dataValue;
  let vertColor = {};
  for (let i = 0; i < geometry.faces.length; i++) {
    if (data && data.length) {
      let constrainedIndex = i % data.length;
      dataValue = data[constrainedIndex].value;
      colorPoint =
        dataValue +
        50 +
        50 * Math.sin(2 * clock.getElapsedTime() - dataValue * 20);
    } else {
      console.log("No data???");
      dataValue = 100;
      colorPoint = 100 + 40 * Math.sin(clock.getElapsedTime() - 10 * i);
    }
    //individual vertices
    let face = geometry.faces[i];
    vertColor[i] = {
      r: 0.5 + 0.1 * Math.sin(clock.getElapsedTime() - 2 * dataValue),
      g: 0.6 + 0.1 * Math.sin(clock.getElapsedTime() + 2 * dataValue),
      b: 0.8 + 0.3 * Math.sin(clock.getElapsedTime() + 3 * dataValue)
    };
    for (let j = 0; j < 3; j++) {
      if (i % 2 === 0) {
        if (j === 1) {
          //inner single
          face.vertexColors[j].r = 1;
          face.vertexColors[j].g = 1;
          face.vertexColors[j].b = 1;
        } else {
          //outer double
          //left
          if (j === 0 && i > 0) {
            face.vertexColors[j].r = vertColor[i - 1].r;
            face.vertexColors[j].g = vertColor[i - 1].g;
            face.vertexColors[j].b = vertColor[i - 1].b;
          } else {
            face.vertexColors[j].r = vertColor[i].r;
            face.vertexColors[j].g = vertColor[i].g;
            face.vertexColors[j].b = vertColor[i].b;
          }
          //right
        }
      } else {
        //outer single vertex
        if (j === 0) {
          if (i > 0) {
            face.vertexColors[j].r = vertColor[i - 1].r;
            face.vertexColors[j].g = vertColor[i - 1].g;
            face.vertexColors[j].b = vertColor[i - 1].b;
          } else {
            face.vertexColors[j].r = vertColor[i].r;
            face.vertexColors[j].g = vertColor[i].g;
            face.vertexColors[j].b = vertColor[i].b;
          }
        } else {
          //inner double
          face.vertexColors[j].r = 1;
          face.vertexColors[j].g = 1;
          face.vertexColors[j].b = 1;
        }
      }
    }
    for (let j = 0; j < 3; j++) {
      if (j === 1 && i % 2 === 0) {
        //inner single vertex
        face.vertexColors[j].r = 1;
        face.vertexColors[j].g = 1;
        face.vertexColors[j].b = 1;
      } else if (i % 2 === 1) {
        if (j === 2 || j === 1) {
          //inner double vertex
          face.vertexColors[j].r = 1;
          face.vertexColors[j].g = 1;
          face.vertexColors[j].b = 1;
        } else {
          //outer single vertex
          face.vertexColors[j].r = vertColor[i].r;
          face.vertexColors[j].g = vertColor[i].g;
          face.vertexColors[j].b = vertColor[i].b;
        }
      } else {
        if (i > 0) {
          face.vertexColors[j].r = vertColor[i - 1].r;
          face.vertexColors[j].g = vertColor[i - 1].g;
          face.vertexColors[j].b = vertColor[i - 1].b;
        } else {
          face.vertexColors[j].r = vertColor[i].r;
          face.vertexColors[j].g = vertColor[i].g;
          face.vertexColors[j].b = vertColor[i].b;
        }
      }
    }
  }
};
