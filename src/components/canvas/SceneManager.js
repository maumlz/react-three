import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Stats from 'three/examples/jsm/libs/stats.module'
import PU from '../../assets/PU_Logo.png';

// OTROS
import Stars from './objects/others/stars.js'
import Sphere from './objects/others/sphere.js'
// HUD
import HudTest from './objects/tests/hudTest.js'

// Ken's
import posx from './assets/skybox_test/main_skybox/main_skybox_RT.png'
import posy from './assets/skybox_test/main_skybox/main_skybox_UP.png'
import negx from './assets/skybox_test/main_skybox/main_skybox_LF.png'
import negy from './assets/skybox_test/main_skybox/main_skybox_DN.png'
import posz from './assets/skybox_test/main_skybox/main_skybox_FT.png'
import negz from './assets/skybox_test/main_skybox/main_skybox_BK.png'

import { render } from '@testing-library/react';

// stars
// import Star1 from './objects/stars/star1.js'

export default function SceneManager (canvas)  {

  const xElem = document.querySelector('#x');
  const yElem = document.querySelector('#y');
  const zElem = document.querySelector('#z');
  const fpsElem = document.querySelector('#fps');
  // const inout = document.querySelector('#io');

  // let io = [5];

  const clock = new THREE.Clock();
  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  }
  let stats = Stats();
  fpsElem.appendChild(stats.dom)

  const ratio = 1000;

  let loadingManager = new THREE.LoadingManager();

  const scene = buildScene(loadingManager);
  const renderer = buildRender(screenDimensions,canvas);
  const camera = buildCamera(screenDimensions);
  // let back = scene.background;
  const sceneSubjects = createSceneSubjects(screenDimensions,canvas);
  const controls = createControls();

  let loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, screenDimensions.width/screenDimensions.height, 0.1, 1000),
    loader: new THREE.TextureLoader(loadingManager),
    geometry: new THREE.PlaneGeometry(9, 10*.75)
  }

  //let LOADINGMANAGER = null;
  let RECURSOSDESCARGADOS = false;

  loadingManager.onProgress= function(item,loaded,total){
    console.log(item,loaded,total);
  }

  loadingManager.onLoad = function(){
    console.log('loaded all resources');
    RECURSOSDESCARGADOS = true;
  }

  loadingScreen.camera.position.z = 5;
  let material = new THREE.MeshBasicMaterial({
    map: loadingScreen.loader.load(PU)
  });
  let meshSplash = new THREE.Mesh(loadingScreen.geometry,material);

  meshSplash.position.set(0,0,0);
  loadingScreen.camera.lookAt(meshSplash.position);
  loadingScreen.scene.add(meshSplash);

  let light = new THREE.PointLight( 0xffffff, 1, 0 );
  light.position.set(1, 1, 100 );
  loadingScreen.scene.add(light);


  document.addEventListener("keydown", onDocumentKeyDown, false);
  let keyCode;
  function onDocumentKeyDown(event) {
    keyCode = event.which;
    console.log("hola");
    if(keyCode == 71){
      // Place camera on x axis
      controls.target.set(0,0,-55000);
      camera.position.set(0,0,-54000)
    }else{
      controls.target.set(0,0,0);
      camera.position.set(0,0,3500)
    }
  }

  function buildScene(loadingManager) {// Construye la escena, color de fondo
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0,0,.1);
    // scene.fog = new THREE.FogExp2(0x03544e, 0.0001);
    const loader = new THREE.CubeTextureLoader(loadingManager)
    const texture = loader.load([
      posx,negx,posy,negy,posz,negz
    ])
    scene.background = texture;
    return scene;
  }

  function buildRender({ width, height },canvas) {// Llama y ajusta al renderer
    const renderer = new THREE.WebGLRenderer({canvas,alpha: false, antialias:true});
    renderer.setClearColor(0x0000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width,height);
    canvas.parentElement.appendChild(renderer.domElement)
    return renderer;
  }

  function buildCamera({ width, height }) {// Llama y ajusta la cámara
    const fieldOfView = 50;
    const aspectRatio = width/height;
    const nearPlane = 0.1;
    const farPlane = ratio*45;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    scene.add( camera );
    camera.position.z = 3500;
    camera.focus = 1000;
    // var helper = new THREE.CameraHelper( camera );
    return camera;
  }

  function createSceneSubjects(screenDimensions,canvas) {// Aqui se agregan los diferentes objetos del canvas
    const sceneSubjects = [
      new Stars(2000,scene),
      new HudTest(scene,camera),
      new Sphere(scene, new THREE.Vector3(0,0,0))
    ];

    return sceneSubjects;
  }

  function MouseArriba(){
    console.log("Estamos encima de una nebulosa");
  }

  function createControls(){
    //Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    // controls.maxDistance = camera.position.z*1;

    //Add
    return controls;
  }

  function update(){

    if(RECURSOSDESCARGADOS == false){
      //requestAnimationFrame(update);
      renderer.render(loadingScreen.scene,loadingScreen.camera);
      return;
    }else{


      var delta = clock.getDelta();
      controls.update( delta );

      xElem.textContent = camera.position.x.toFixed(3);
      yElem.textContent = camera.position.y.toFixed(3);
      zElem.textContent = camera.position.z.toFixed(3);

      stats.update();
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    const { width, height } = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  function onMouseDown(e) {
    var vectorMouse = new THREE.Vector3(-(window.innerWidth/2-e.clientX)*2/window.innerWidth, (window.innerHeight/2-e.clientY)*2/window.innerHeight, -1/Math.tan(22.5*Math.PI/180)); //22.5 is half of camera frustum angle 45 degree
    vectorMouse.applyQuaternion(camera.quaternion);
    vectorMouse.normalize();
    var vectorObject = new THREE.Vector3(); //vector from camera to object
    // vectorObject.set(sceneSubjects[6].x - camera.position.x, sceneSubjects[6].y - camera.position.y, sceneSubjects[6].z - camera.position.z);
    vectorObject.normalize();
    if (vectorMouse.angleTo(vectorObject)*180/Math.PI < 1) {
      //mouse's position is near object's position
    }
  }

  return {
    update,
    onWindowResize,
    stats
  }
}
