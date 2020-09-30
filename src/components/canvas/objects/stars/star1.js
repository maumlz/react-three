import * as THREE from 'three'
// import nube from '../assets/smoke.png'
import { Color } from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import lensflare0 from 'three/examples/jsm/textures/lensflare/lensflare0.png'
import lensflare3 from 'three/examples/jsm/textures/lensflare/lensflare3.png'

export default function Star1(scene,origen){
  //LENSFLARE
  var textureLoader = new THREE.TextureLoader();

  var textureFlare0 = textureLoader.load( lensflare0 );
  var textureFlare3 = textureLoader.load( lensflare3 );

  var light = new THREE.PointLight( "orange", 1.5, 10, 2 );
  light.position.x = origen.x;
  light.position.y = origen.y;
  light.position.z = origen.z+450;
  var lensflare = new Lensflare();
  //
  lensflare.addElement( new LensflareElement( textureFlare0, 100, 0 ) );
  lensflare.addElement( new LensflareElement( textureFlare3, 12, 0 ) );
  lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
  //
  light.add( lensflare );

  scene.add(light)
  //LENSFLARE - end
}
