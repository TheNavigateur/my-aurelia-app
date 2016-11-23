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
      bumpMapsConfigs = [
        {
          imagePath: "textured-glass-bump-map.jpg"
        },
        {
          imagePath: "7063-bump.jpg"
        },
        {
          imagePath: "leather-bump-map.jpg"
        },
        {
          imagePath: "bumpmap.gif"
        },
        {
          imagePath: "ivybump.jpg"
        },
        {
          imagePath: "volcano_rocks_bump1.jpg"
        }
      ],
      bumpMaps =
        bumpMapsConfigs.map(
          (bumpMapConfig)=>{
            const bumpMap = new THREE.TextureLoader().load(bumpMapConfig.imagePath);
            bumpMap.anisotropy = 4;
            bumpMap.repeat.set( 0.998, 0.998 );
            bumpMap.offset.set( 0.001, 0.001 );
            bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
            bumpMap.format = THREE.RGBFormat;
            return bumpMap;
          }
        )
      ,
      ambientLight = new THREE.AmbientLight( 0x999999 ),
      materialConfigs = [
        {
          color: 0x6662911,
          bumpScale: 10,
          bumpMapIndex: 5
        },
        {
          color: 0x552800,
          bumpScale: 1.5,
          bumpMapIndex: 0
        },
        {
          color: 0x550011,
          bumpScale: 4,
          bumpMapIndex: 2
        },
        {
          color: 0x112211,
          bumpScale: 4,
          bumpMapIndex: 3
        },
        {
          color: 0x080008,
          bumpScale: 4,
          bumpMapIndex: 1
        },
        {
          color: 0x113300,
          bumpScale: 19,
          bumpMapIndex: 4
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
                bumpMap: bumpMaps[materialConfig.bumpMapIndex],
                bumpScale: materialConfig.bumpScale,
                opacity: 1,
                blending: THREE.NoBlending
              }
            )
        )
      ,
      mesh = new THREE.Mesh(boxGeometry, new THREE.MeshFaceMaterial(materials)),
      divEdgeLengthPx = cubeEdgeLengthPx,
      interactiveFace = this.interactiveFace,
      interactiveFacsCSS3DObject = new THREE.CSS3DObject(interactiveFace),
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
    controls.setStartDrag(0, -0.0435);

    interactiveFacsCSS3DObject.position.z = cubeEdgeLengthPx/2;
    group.add(interactiveFacsCSS3DObject);
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
