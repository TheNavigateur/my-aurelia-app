export class App {

  attached(){
    const
      sizePx = 600,
      renderer = new THREE.WebGLRenderer(
        {
          alpha: true,
          antiAlias: true
        }
      ),
      cssRenderer = new THREE.CSS3DRenderer(),
      scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(25, sizePx/sizePx, 1, 10000),
      controls = new THREE.TrackballControls(camera),
      renderScene = this.renderScene,
      cubeEdgeLengthPx = sizePx * 1,
      numberOfCubeEdgeSubdivisions = 1,
      boxGeometry = new THREE.BoxGeometry( cubeEdgeLengthPx, cubeEdgeLengthPx, cubeEdgeLengthPx, numberOfCubeEdgeSubdivisions, numberOfCubeEdgeSubdivisions, numberOfCubeEdgeSubdivisions ),
      ambientLight = new THREE.AmbientLight( 0x999999 ),
      materialConfigs = [
        {
          color: 0x4830A0,
          normapMapScale: 1.6,
          normalMapImagePath: "rockpile.jpg",
          shininess: 220
        },
        {
          color: 0x112211,
          normapMapScale: 1.7,
          normalMapImagePath: "cushionnormalmap.png",
          shininess: 25
        },
        {
          color: 0x6662911,
          normapMapScale: 0.06,
          normalMapImagePath: "wavenormalmap.jpg",
          shininess: 100
        },
        {
          color: 0x552800,
          normapMapScale: 0.16,
          normalMapImagePath: "rocknormalmap.jpg",
          shininess: 15
        },
        {
          color: 0x080008,
          normapMapScale: 0.6,
          normalMapImagePath: "bricksnormalmap.png",
          shininess: 40
        },
        {
          color: 0x550011,
          normapMapScale: 2.8,
          normalMapImagePath: "pebblesnormalmap.png",
          shininess: 20
        }
      ],
      normalScale = 19,
      displacementScale = normalScale * 0,
      displacementBias = -displacementScale * 0.7,
      materials =
        materialConfigs.map(
          (materialConfig)=>
            new THREE.MeshPhongMaterial(
              {
                color: 0x888888,
                specular: 0x222222,
                shininess: 300,

                map: new THREE.TextureLoader().load('pavementimage.png'),

                //normalMap: new THREE.TextureLoader().load(materialConfig.normalMapImagePath),
                normalMap: new THREE.TextureLoader().load('pavementnormal.png'),

                normalScale: new THREE.Vector2(normalScale, normalScale),

                //aoMap: new THREE.TextureLoader().load("ao.jpg"),
                //aoMapIntensity: 43,

                displacementMap: new THREE.TextureLoader().load("pavementdisplacement.png"),
                displacementScale: displacementScale,
                displacementBias: displacementBias,

                //bumpMap: new THREE.TextureLoader().load("couchdisplacement.png"),
                //bumpScale: 100,

                opacity: 1,
                blending: THREE.NoBlending
              }
            )
        )
      ,
      mesh = new THREE.Mesh(boxGeometry, materials[1]), //new THREE.MeshFaceMaterial(materials)),
      divEdgeLengthPx = cubeEdgeLengthPx,
      interactiveFace = this.interactiveFace,
      interactiveFaceCSS3DObject = new THREE.CSS3DObject(interactiveFace),
      group = new THREE.Group(),
      pointLightConfigs = [
        {
          offsetFromCamera:{
            x:0,
            y:0,
            z:0
          }
        },
        {
          offsetFromCamera:{
            x:-1000,
            y:-1000,
            z:0
          }
        }
      ],
      pointLights =
        pointLightConfigs.map(
          (pointLightConfig)=>{
            const pointLight = new THREE.PointLight(0xffffff, 1.3, 10000);
            pointLight.offsetFromCamera = pointLightConfig.offsetFromCamera;
            scene.add(pointLight);
            return pointLight;
          }
        )
    ;

    boxGeometry.computeTangents();

    scene.add(ambientLight);
    camera.position.z = sizePx * 4;
    scene.add(camera);
    controls.noZoom = true;
    controls.rotateSpeed = 2.4;
    controls.setStartDrag(0, -0.02188);

    interactiveFaceCSS3DObject.position.z = cubeEdgeLengthPx/2;
    group.add(interactiveFaceCSS3DObject);
    mesh.add(group);
    scene.add(mesh);

    this.addRenderers(sizePx, renderer, cssRenderer);

    interactiveFace.style.width = interactiveFace.style.height = divEdgeLengthPx;

    function animate(){
      controls.update();
      for(const pointLight of pointLights){
        pointLight.position.set(camera.position.x + pointLight.offsetFromCamera.x, camera.position.y + pointLight.offsetFromCamera.y, camera.position.z + pointLight.offsetFromCamera.z);
      }
      renderScene(scene, camera, renderer, cssRenderer);
      interactiveFace.style.display = camera.position.z>sizePx/2 ? 'inline' : 'none';
      window.requestAnimationFrame(animate);
    }

    animate();
  }

  addRenderers(sizePx, ...renderers){
    for(const renderer of renderers){
      renderer.setSize(sizePx, sizePx);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = renderer.domElement.style.left = 0;
      document.getElementById('cubePanel').appendChild(renderer.domElement);
    }
  }

  renderScene(scene, camera, ...renderers){
    for(const renderer of renderers){
      renderer.render(scene, camera );
    }
  }
}
