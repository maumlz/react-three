import * as THREE from  'three'
import spark from '../../assets/spark1.png'

import left from '../../assets/skybox_test/green_nebula_skybox/green_nebula_skybox_RT.png'
import up from '../../assets/skybox_test/green_nebula_skybox/green_nebula_skybox_UP.png'
import right from '../../assets/skybox_test/green_nebula_skybox/green_nebula_skybox_LF.png'
import down from '../../assets/skybox_test/green_nebula_skybox/green_nebula_skybox_DN.png'
import front from '../../assets/skybox_test/green_nebula_skybox/green_nebula_skybox_FT.png'
import back from '../../assets/skybox_test/green_nebula_skybox/green_nebula_skybox_BK.png'

export default function WonderTest(scene, origen){

    function random() { return Math.random() * 2 - 1 }
    function createGeometry( amount, step, dir ) {


      let geometry = new THREE.BufferGeometry();
      let vertices = [];

      for ( var i = 2000; i < amount; i += step ) {

        var angle = i / 12;
        var distance = i / 4;
        var progress = ( i / amount ) * 400 + 0.5;
        const x = progress * random() * random() + Math.sin( angle ) * distance;
        const y = progress + 100
        const z = progress * random() * random() + Math.cos( angle ) * distance;

        const aux = Math.cos(Math.PI*x/3000 + 0.5*Math.PI) * y * 2 + random() * random() * y;
        const newy =  aux * 1;

        if(dir){
          if(z<0){
            // vertices.push(x, newy, z);
            // geometry.vertices.push(new THREE.Vector3(x, newy, z));
          }
          else{
            vertices.push(x, newy, -z);
            // geometry.vertices.push(new THREE.Vector3(x, newy, -z));
          }
        }
        else{
          if(z<0){
            vertices.push(x, -newy, -z);
            // geometry.vertices.push(new THREE.Vector3(x, -newy, -z));
          }
          else{
            vertices.push(x, -newy, z);
            // geometry.vertices.push(new THREE.Vector3(x, -newy, z));
          }
        }

      }


      geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

      return geometry;

    }

    const texture = new THREE.TextureLoader().load(spark);

    // Puntos 1
    let geometry1 = createGeometry( 15000, 5, true );
    let material1 = new THREE.PointsMaterial( {
      size: 200,
      map: texture,
      depthWrite: false,
      transparent: true,
      color: "green"
    } );
    let points1 = new THREE.Points( geometry1, material1 );
    points1.rotation.z = -Math.PI/12;
    points1.position.z = origen.z;
    // points.position.y = 400 * Math.random() - 400;
    scene.add( points1 );

    // Puntos 2
    let geometry2 = createGeometry( 15000, 5, false );
    let material2 = new THREE.PointsMaterial( {
      size: 200,
      map: texture,
      depthWrite: false,
      transparent: true,
      color: "green"
    } );
    let points2 = new THREE.Points( geometry2, material2 );
    points2.rotation.y = Math.PI;
    points2.rotation.z = Math.PI/12;
    points2.position.z = origen.z;
    // points.position.y = 400 * Math.random() - 400;
    scene.add( points2 );

    // Puntos 3
    let geometry3 = createGeometry( 20000, 8, true );
    let material3 = new THREE.PointsMaterial( {
      size: 40,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      color: "green"
    } );
    let points3 = new THREE.Points( geometry3, material3 );
    points3.rotation.z = -Math.PI/12;
    points3.position.z = origen.z;
    // points.position.y = 400 * Math.random() - 400;
    scene.add( points3 );

    // Puntos 4
    let geometry4 = createGeometry( 20000, 8,false );
    let material4 = new THREE.PointsMaterial( {
      size: 40,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      color: "green"
    } );
    let points4 = new THREE.Points( geometry4, material4 );
    points4.rotation.y = Math.PI;
    points4.rotation.z = Math.PI/12;
    points4.position.z = origen.z;
    // points.position.y = 400 * Math.random() - 400;
    scene.add( points4 );

    // Puntos 5
    let geometry5 = createGeometry( 20000, 0.4, true );
    let material5 = new THREE.PointsMaterial( {
      size: 25,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      color: 'green'
    } );
    let points5 = new THREE.Points( geometry5, material5 );
    points5.rotation.z = -Math.PI/12;
    points5.position.z = origen.z;
    // points.position.y = 400 * Math.random() - 400;
    scene.add( points5 );

    // Puntos 6
    let geometry6 = createGeometry( 20000, 0.4,false );
    let material6 = new THREE.PointsMaterial( {
      size: 25,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    } );
    let points6 = new THREE.Points( geometry6, material6 );
    points6.rotation.y = Math.PI;
    points6.rotation.z = Math.PI/12;
    points6.position.z = origen.z;
    // points.position.y = 400 * Math.random() - 400;
    scene.add( points6 );

    // console.log(geometry1.getAttribute('position'));
    let a = geometry1.getAttribute('position')


    const geometry = new THREE.BoxBufferGeometry(3500,3500,3500);

    const loader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({map: loader.load(left), side: THREE.BackSide}),
      new THREE.MeshBasicMaterial({map: loader.load(right), side: THREE.BackSide}),
      new THREE.MeshBasicMaterial({map: loader.load(up), side: THREE.BackSide}),
      new THREE.MeshBasicMaterial({map: loader.load(down), side: THREE.BackSide}),
      new THREE.MeshBasicMaterial({map: loader.load(front), side: THREE.BackSide}),
      new THREE.MeshBasicMaterial({map: loader.load(back), side: THREE.BackSide}),
    ];

    const mesh =  new THREE.Mesh(geometry, materials);
    mesh.position.set(0,0,-55000);

    scene.add(mesh)


    this.update = function(){

      // geometry1.getAttribute('position').forEach((i) => {
      //   var dX, dY, dZ;
      //   dX = Math.random() * 4 - 2;
      //   dY = Math.random() * 4 - 2;
      //   dZ = Math.random() * 4 - 2;
      //
      //   i.add(new THREE.Vector3(dX, dY, dZ));
      // });
      // geometry1.PositionsNeedUpdate = true;

      // geometry3.vertices.forEach((i,j) => {
      //   var dX, dY, dZ;
      //   dX = Math.random() * 2 - 1;
      //   dY = Math.random() * 2 - 1;
      //   dZ = Math.random() * 2 - 1;
      //
      //   i.add(new THREE.Vector3(dX, dY, dZ));
      //   geometry3.colors[j] = new THREE.Color(Math.random(), Math.random(), Math.random());
      // });
      // geometry3.verticesNeedUpdate = true;
      // geometry3.colorsNeedUpdate = true;
      //
      // geometry5.vertices.forEach((i,j) => {
      //   var dX, dY, dZ;
      //   dX = Math.random() * 2 - 1;
      //   dY = Math.random() * 2 - 1;
      //   dZ = Math.random() * 2 - 1;
      //
      //   i.add(new THREE.Vector3(dX, dY, dZ));
      //   geometry5.colors[j] = new THREE.Color(Math.random(), Math.random(), Math.random());
      // });
      // geometry5.verticesNeedUpdate = true;
      // geometry5.colorsNeedUpdate = true;

    }
}
