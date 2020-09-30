import * as THREE from 'three';
import rock from '../../assets/rock/rock01.jpg'


export default function Sphere(scene, origen){
  //SPHERE
  const geometry = new THREE.SphereBufferGeometry(5, 16, 16);
  const loader = new THREE.TextureLoader();

  const texture = loader.load(
    // resource URL
    rock,

    // onLoad callback
    function ( texture ) {
      // in this example we create the material when the texture is loaded
      const material = new THREE.MeshBasicMaterial( {
        map: texture
      } );
      const sphere = new THREE.Mesh( geometry, material );
      sphere.position.set(origen.x,origen.y,origen.z)
      scene.add( sphere );
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
      console.error( 'An error happened.' );
    }
  );

  // const material = new THREE.MeshBasicMaterial( {color: 'red', wireframe: false} );
  // const material = new THREE.MeshBasicMaterial( {map: texture} );


}
