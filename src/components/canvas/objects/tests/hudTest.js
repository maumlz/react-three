import * as THREE from 'three';


export default function HudTest(scene,camera){

  const shape = new THREE.Shape();

  shape.moveTo(-1.5, .5);
  shape.lineTo(1.5, .5);
  shape.lineTo(1.5, -.5);
  shape.lineTo(-1.5,-.5)


  //Holes
  var hole1 = new THREE.Path();
  hole1.moveTo(0,0.2)
  hole1.bezierCurveTo(-0.2, 0.6, -0.84, 0.5, -0.85, 0)
  hole1.bezierCurveTo(-0.84, -0.5,-0.2, -0.6, 0, -0.2)
  hole1.bezierCurveTo(0.2, -0.6, 0.84, -0.5, 0.85, 0)
  hole1.bezierCurveTo(0.84, 0.5, 0.2, 0.6, 0, 0.2)

  shape.holes.push(hole1);

  var hole2 = new THREE.Path();
  hole2.arc(.45,0,.45,Math.PI*1.05,Math.PI*2.95)

  const material = new THREE.MeshBasicMaterial({color: 'gray', wireframe: false})
  const geometry = new THREE.ShapeGeometry( shape );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z=camera.position.z-1
  scene.add(mesh)


}
