import * as THREE from "three";

export const screenToWorld = (x, y, camera, width, height) => {
  //console.log("params", x, y, camera, width, height);
  // let newPosition = new THREE.Vector3();
  // let normalizedX = (x / width) * 2 - 1;
  // let normalizedY = ((y - height) / height) * 2 + 1;
  // newPosition.set(normalizedX, -normalizedY, 0);
  // newPosition.unproject(camera);
  // let dir = newPosition.sub(camera.position).normalize();
  // console.log("dir?", dir);
  // let distance = -camera.position.z / dir.z;
  // let pos = camera.position.clone().add(dir.multiplyScalar(distance));
  // console.log("pos?", pos);
  // // return pos;
  // // let vector = new THREE.Vector3(x - width / 2, y, 0.5);
  // // vector.unproject(camera);
  // // let dir = vector.sub(camera.position).normalize();
  // // let distance = -camera.position.z / dir.z;
  // // console.log("DIST, camera", distance, camera.position.clone());
  // // console.log("NEW DIR", dir.multiplyScalar(distance), camera.position);
  // // // let pos = camera.position.clone().add(dir.multiplyScalar(distance));
  // // console.log("POS", pos.x, pos.y);
  // // // pos.set(pos.x, pos.y, 0);
  // // console.log("POS", pos);
  // //return pos;
  // let newDir = dir.multiplyScalar(distance);
  // let newPos = camera.position.x
  // return newDir;
  let posX = (x / width) * 2 - 1;
  let posY = -(y / height) * 2 + 1;
  // Make the sphere follow the mouse
  var vector = new THREE.Vector3(posX, posY, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  let dist = dir.multiplyScalar(distance);
  console.log("DIST,", dir, dist);
  //var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  let pos = new THREE.Vector3(
    camera.position.x + dist.x,
    camera.position.y + dist.y,
    0
  );
  return pos;
};

export default class CameraHelper {
  constructor() {
    this.m_vPos = new THREE.Vector3();
    this.m_vDir = new THREE.Vector3();
  }

  Compute(nMouseX, nMouseY, Camera, vOutPos, width, height) {
    let vPos = this.m_vPos;
    let vDir = this.m_vDir;

    vPos
      .set(-1.0 + (2.0 * nMouseX) / width, 1.0 - (2.0 * nMouseY) / height, 0.5)
      .unproject(Camera);

    // Calculate a unit vector from the camera to the projected position
    vDir
      .copy(vPos)
      .sub(Camera.position)
      .normalize();

    // Project onto z=0
    let flDistance = -Camera.position.z / vDir.z;
    console.log("**", flDistance);
    vOutPos
      .copy(Camera.position)
      .add(vDir.multiplyScalar((flDistance * width) / 3));
  }
}
