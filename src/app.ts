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
      boxGeometry = new THREE.BoxGeometry( cubeEdgeLengthPx, cubeEdgeLengthPx, cubeEdgeLengthPx ),
      ambientLight = new THREE.AmbientLight( 0x999999 ),
      materialConfigs = [
        {
          color: 0x6662911,
          normapMapScale: 0.13,
          normalMapImagePath: "wavenormalmap.jpg"
        },
        {
          color: 0x552800,
          normapMapScale: 0.05,
          normalMapImagePath: "rocknormalmap.jpg"
        },
        {
          color: 0x550011,
          normapMapScale: 1.8,
          normalMapImagePath: "pebblesnormalmap.png"
        },
        {
          color: 0x112211,
          normapMapScale: 1.4,
          normalMapImagePath: "cushionnormalmap.png"
        },
        {
          color: 0x080008,
          normapMapScale: 0.6,
          normalMapImagePath: "bricksnormalmap.png"
        },
        {
          color: 0x113300,
          normapMapScale: 0.9,
          normalMapImagePath: "golfballnormalmap.jpg"
        }
      ],
      materials =
        materialConfigs.map(
          (materialConfig)=>
            new THREE.MeshPhongMaterial(
              {
                color: materialConfig.color,
                specular: 0x222222,
                shininess: 25,
                normalMap: new THREE.TextureLoader().load(materialConfig.normalMapImagePath),
                normalScale: new THREE.Vector2(materialConfig.normapMapScale, materialConfig.normapMapScale),
                opacity: 1,
                blending: THREE.NoBlending
              }
            )
        )
      ,
      mesh = new THREE.Mesh(boxGeometry, new THREE.MeshFaceMaterial(materials)),
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
