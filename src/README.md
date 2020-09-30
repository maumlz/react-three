# README
## Jerarquía

- `components/canvas` contiene todos los componentes de el `canvas`.
- `components/canvas/main.js` y `components/canvas/SceneManager.js` vínculan `react` con `threejs` y manejan todas las configuraciones del ambiente **3D**
- `components/canvas/objects` contiene los scripts de los diferentes objetos. y `assets`
es para guardar cualquier cosa extra como texturas, imagenes, modelos, etc.


## TODO
- [ ] Implementación de nebulosas
- [ ] HUD ?
- [ ] Estrellas/sistemas de contenido
- [ ] Probar otro tipo de luces
- [ ] Responsive-height de Canvas

## Para Pablo
- Revisa el `SceneManager.js` y `stars.js` cualquier duda me dices
- Hay que revisar la responsividad, no me gustó como se ajustan el `header` y `footer` [Revisa aquí para hacerlo sin cel](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode).
- Agregué al `.gitignore` los archivos `yarn.lock`, `package-lock.json` y `package.json`
- Ya de aqui hay que utilizar `branches`
- **INSTALA THREE EN TU PROYECTO**

![brrr](https://i.redd.it/ym5ssnmmalk51.png "brrrr")

## 3 de Septiembre 2020
### TODO
- Probar camaras.

## 4 de Sep 2020
### TODO
- Tamaño de los div
- Recortar logo

## Junta 5 Septiembre
- Hover en planeta/muestra `metadata`

## Partes de nebulosa 15 Septiembre 2020
- `nebulabox.js` para el skybox y la generación de `fog`
- `nebulosa.js` para la vista inicial con la rotacion
- `nebula.js` para los puntos
Crear script que junte los 3 y generalice la creacion de las nebulosas


## 16 de sep 2020
- Wonder como anillo
- matriz de modelo

## 18 de Sep 2020
Michael Chang - [Making 100,000 Stars](https://www.html5rocks.com/en/tutorials/casestudies/100000stars/)

> Field of view (or FOV) for the camera is also dynamic. As one pulls outwards, the field of view widens, taking in more and more of the galaxy. The opposite is true when moving inwards towards a star, the field of view narrows. This allows the camera to view things that are infinitesimal (in comparison to the galaxy) by squishing the FOV down to something of a god-like magnifying glass without having to deal with near-plane clipping issues."

[Data Set](http://astronexus.com/hyg/)
1. **StarID**: The database primary key from a larger "master database" of stars.
2. ~**HD**: The star's ID in the Henry Draper catalog, if known.~
3. ~**HR**: The star's ID in the Harvard Revised catalog, which is the same as its number in the Yale Bright Star Catalog.~
4. ~**Gliese**: The star's ID in the third edition of the Gliese Catalog of Nearby Stars.~
5. ~**BayerFlamsteed**: The Bayer / Flamsteed designation, from the Fifth Edition of the Yale Bright Star Catalog. This is a combination of the two designations. The Flamsteed number, if present, is given first; then a three-letter abbreviation for the Bayer Greek letter; the Bayer superscript number, if present; and finally, the three-letter constellation abbreviation. Thus Alpha Andromedae has the field value "21Alp And", and Kappa1 Sculptoris (no Flamsteed number) has "Kap1Scl".~
6. ~**RA, Dec**: The star's right ascension and declination, for epoch 2000.0. Stars present only in the Gliese Catalog, which uses 1950.0 coordinates, have had these coordinates precessed to 2000.~
7. ~**ProperName**: A common name for the star, such as "Barnard's Star" or "Sirius". I have taken these names primarily from the Hipparcos project's web site, which lists representative names for the 150 brightest stars and many of the 150 closest stars. I have added a few names to this list. Most of the additions are designations from catalogs mostly now forgotten (e.g., Lalande, Groombridge, and Gould ["G."]) except for certain nearby stars which are still best known by these designations.~
8. ~**Distance**: The star's distance in parsecs, the most common unit in astrometry. To convert parsecs to light years, multiply by 3.262. A value of 10000000 indicates missing or dubious (e.g., negative) parallax data in Hipparcos.~
9. ~**Mag**: The star's apparent visual magnitude.~
10. ~**AbsMag**: The star's absolute visual magnitude (its apparent magnitude from a distance of 10 parsecs).~
11. ~**Spectrum**: The star's spectral type, if known.~
12. ~**ColorIndex**: The star's color index (blue magnitude - visual magnitude), where known.~
13. *** X,Y,Z**: The Cartesian coordinates of the star, in a system based on the equatorial coordinates as seen from Earth. +X is in the direction of the vernal equinox (at epoch 2000), +Z towards the north celestial pole, and +Y in the direction of R.A. 6 hours, declination 0 degrees.
14. *** VX,VY,VZ**: The Cartesian velocity components of the star, in the same coordinate system described immediately above. They are determined from the proper motion and the radial velocity (when known). The velocity unit is parsecs per year; these are small values (around 10-5 to 10-6), but they enormously simplify calculations using parsecs as base units for celestial mapping.


```
let render_fs, render_vs, simulation_fs, simulation_vs;
{
  render_fs =
  `
  uniform vec2 nearFar;
  uniform vec3 small;
  uniform vec3 big;

  varying float size;
  void main()
  {
    gl_FragColor = vec4( small, .2 );

    if( size > 1. )
    {
      gl_FragColor = vec4( big * vec3( 1. - length( gl_PointCoord.xy-vec2(.5) ) ) * 1.5, .95 );
    }
  }`;

  render_vs =
  `//float texture containing the positions of each particle
  uniform sampler2D positions;
  uniform vec2 nearFar;
  uniform float pointSize;

  varying float size;
  void main() {

    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, position.xy ).xyz;

    //pos now contains the position of a point in space taht can be transformed
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    //size
    gl_PointSize = size = max( 1., ( step( 1. - ( 1. / 512. ), position.x ) ) * pointSize );
  }`;

  simulation_fs =
  `
  varying vec2 vUv;
  uniform sampler2D texture;
  uniform float timer;
  uniform float frequency;
  uniform float amplitude;
  uniform float maxDistance;

  //
  // Description : Array and textureless GLSL 2D simplex noise function.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  float noise(vec2 v)
  {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
      -0.577350269189626,  // -1.0 + 2.0 * C.x
      0.024390243902439); // 1.0 / 41.0
      // First corner
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);

      // Other corners
      vec2 i1;
      //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
      //i1.y = 1.0 - i1.x;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      // x0 = x0 - 0.0 + 0.0 * C.xx ;
      // x1 = x0 - i1 + 1.0 * C.xx ;
      // x2 = x0 - 1.0 + 2.0 * C.xx ;
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;

      // Permutations
      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));

      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;

      // Gradients: 41 points uniformly over a line, mapped onto a diamond.
      // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

      // Normalise gradients implicitly by scaling m
      // Approximation of: m *= inversesqrt( a0*a0 + h*h );
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

      // Compute final noise value at P
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    vec3 curl(float	x,	float	y,	float	z)
    {

      float	eps	= 1., eps2 = 2. * eps;
      float	n1,	n2,	a,	b;

      x += timer * .05;
      y += timer * .05;
      z += timer * .05;

      vec3	curl = vec3(0.);

      n1	=	noise(vec2( x,	y	+	eps ));
      n2	=	noise(vec2( x,	y	-	eps ));
      a	=	(n1	-	n2)/eps2;

      n1	=	noise(vec2( x,	z	+	eps));
      n2	=	noise(vec2( x,	z	-	eps));
      b	=	(n1	-	n2)/eps2;

      curl.x	=	a	-	b;

      n1	=	noise(vec2( y,	z	+	eps));
      n2	=	noise(vec2( y,	z	-	eps));
      a	=	(n1	-	n2)/eps2;

      n1	=	noise(vec2( x	+	eps,	z));
      n2	=	noise(vec2( x	+	eps,	z));
      b	=	(n1	-	n2)/eps2;

      curl.y	=	a	-	b;

      n1	=	noise(vec2( x	+	eps,	y));
      n2	=	noise(vec2( x	-	eps,	y));
      a	=	(n1	-	n2)/eps2;

      n1	=	noise(vec2(  y	+	eps,	z));
      n2	=	noise(vec2(  y	-	eps,	z));
      b	=	(n1	-	n2)/eps2;

      curl.z	=	a	-	b;

      return	curl;
    }

    void main() {

      vec3 pos = texture2D( texture, vUv ).xyz;

      vec3 tar = pos + curl( pos.x * frequency, pos.y * frequency, pos.z * frequency ) * amplitude;

      float d = length( pos-tar ) / maxDistance;
      pos = mix( pos, tar, pow( d, 5. ) );

      gl_FragColor = vec4( pos, 1. );

    }`;

    simulation_vs =
    `
    varying vec2 vUv;
    varying float fragDepth;
    void main() {
      vUv = vec2(uv.x, uv.y);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`;
  }
```


## September 25
- Footer errors

## TODO September 28
- [ ] Test Ken's Skyboxes & background.
- [ ] Check the shaders on `threejs/test.html`.
- [ ] Particle system for wonder or a shader?.
- [ ] Adapt Pablo's splash screen with the nebulas.

### Explosion shader analysis

**Vertex** Shader
1. uv assigned to vUv
2. Noise generated varying with time
3. float displacement which is gonna deform the original shape
4. Assign new positions

**Fragment** Shader
1. Random offset generated
2. get color of the gradient using the offset and the noise
3. New color assigned

### Fog/Nebula Shader analysis

**Vertex** Shader
1. Assign uv's
2. changes the vElevation (varying) for the fragmentShader
3. Assigns position


**Fragment** Shader
1. computes a hue
2.



## Nebulas positions & skyboxes edges.
- **Anger**
  - x: -1300, y: 1000, z: 700
  - speed: 0.009
- **Sadness**
  - x: -1300, y: -700, z: 500
  - speed: 0.001
- **Joy**
  - x: -800, y: 1000, z: 300
  - speed: 0.004
- **Love**
  - x: 2000, y: 500, z: 500
  - speed: 0.005
- **Empowerment**
  - x: 1000, y: -800, z: 600
  - speed: 0.006

## Wonder Particle

- **Position** - to describe where the particle is
- **Velocity** - to describe where the particle is headed and how fast
- **Age** - the number of seconds the particle has been alive
- **Life** - the number of seconds the particle should stay alive
