import * as THREE from 'three'

export default function WonderSystem(scene){

  var material = new THREE.PointsMaterial({
    color: 0xffffcc
  });

  var geometry = new THREE.Geometry();
  var x, y, z;
  for(let i = 0; i<1000;i++){
    x = (Math.random() * 800) - 400;
    y = (Math.random() * 800) - 400;
    z = (Math.random() * 800) - 400;

    geometry.vertices.push(new THREE.Vector3(x, y, z));
  }

  var pointCloud = new THREE.PointCloud(geometry, material);
  scene.add(pointCloud);

  this.update = function(){
    geometry.vertices.forEach((i,j) => {
      var dX, dY, dZ;
      dX = Math.random() * 2 - 1;
      dY = Math.random() * 2 - 1;
      dZ = Math.random() * 2 - 1;

      geometry.colors[j] = new THREE.Color(Math.random(), Math.random(), Math.random());
      });
      geometry.verticesNeedUpdate = true;
      geometry.colorsNeedUpdate = true;
  }
}
