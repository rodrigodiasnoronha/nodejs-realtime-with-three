import * as THREE from "/threejs/three.module.js";
import { STLLoader } from "/threejs/STLLoader.js";
import { OrbitControls } from "/threejs/OrbitControls.js";

let scene, camera, renderer, container, controls, object;

let loader = new STLLoader();
loader.load("/models/California office chair.stl", (geometry) => {
  let material = new THREE.MeshLambertMaterial({ color: "#e02" });
  object = new THREE.Mesh(geometry, material);
  object.scale.set(0.08, 0.08, 0.08);
  object.position.set(0, 35, 0);

  init();
});

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#333");

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );
  camera.position.set(-40, 60, 100);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  var helper = new THREE.GridHelper(1200, 60, 0xff3c4a, 0x404040);
  scene.add(helper);

  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 50, 100);
  scene.add(dirLight);

  scene.add(object);

  controls = new OrbitControls(camera, renderer.domElement);

  animate();
  window.addEventListener("resize", onWindowResize, false);
}

const socket = io();

function animate() {
  requestAnimationFrame(animate);
  socket.on("gyr", (data) => {
    let ang = data.split(" ");
    document.getElementById("angles").innerText =
      "X: " + ang[1] + " Y: " + ang[2] + " Z: " + ang[3];

    object.rotation.set(
      (parseInt(ang[1], 10) * Math.PI) / 180,
      (parseInt(ang[3], 10) * Math.PI) / 180,
      (parseInt(ang[2], 10) * Math.PI) / 180
    );
    //console.log((parseInt(ang[1], 10) * Math.PI) / 180);
  });
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
