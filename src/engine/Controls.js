import * as THREE from 'three';

export class GameControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.keys = { w: false, a: false, s: false, d: false, space: false };
    this.mouseWorldPos = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      const code = e.code.toLowerCase();
      if (code === 'keyw' || code === 'arrowup') this.keys.w = true;
      if (code === 'keya' || code === 'arrowleft') this.keys.a = true;
      if (code === 'keys' || code === 'arrowdown') this.keys.s = true;
      if (code === 'keyd' || code === 'arrowright') this.keys.d = true;
      if (code === 'space') this.keys.space = true;
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code.toLowerCase();
      if (code === 'keyw' || code === 'arrowup') this.keys.w = false;
      if (code === 'keya' || code === 'arrowleft') this.keys.a = false;
      if (code === 'keys' || code === 'arrowdown') this.keys.s = false;
      if (code === 'keyd' || code === 'arrowright') this.keys.d = false;
      if (code === 'space') this.keys.space = false;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouseVec, this.camera);
      const hitPoint = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(this.groundPlane, hitPoint);
      if (hitPoint) {
        this.mouseWorldPos.copy(hitPoint);
      }
    });
  }

  getMovementVector() {
    const move = new THREE.Vector3(0, 0, 0);
    if (this.keys.w) move.z -= 1;
    if (this.keys.s) move.z += 1;
    if (this.keys.a) move.x -= 1;
    if (this.keys.d) move.x += 1;
    if (move.lengthSq() > 0) move.normalize();
    return move;
  }
}
