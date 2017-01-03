
export class App {

  attached(){
    const
      sizePx = 600,
      renderer = new THREE.WebGLRenderer(
        {
          alpha: true
        }
      ),
      //cssRenderer = new THREE.CSS3DRenderer(),
      scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(25, sizePx/sizePx, 1, 10000),
      controls = new THREE.TrackballControls(camera),
      renderScene = this.renderScene,
      cubeEdgeLengthPx = sizePx * 1,
      boxGeometry = new THREE.BoxGeometry( cubeEdgeLengthPx, cubeEdgeLengthPx, cubeEdgeLengthPx ),
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
      materials =
        materialConfigs.map(
          (materialConfig)=>
            new THREE.MeshPhongMaterial(
              {
                color: materialConfig.color,
                specular: 0x222222,
                shininess: materialConfig.shininess,
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

    var meshLineGeometry = new THREE.Geometry();
    for( var j = 0; j < Math.PI; j += 2 * Math.PI / 100 ) {
      var v = new THREE.Vector3( Math.cos( j ), Math.sin( j ), 0 );
      meshLineGeometry.vertices.push( v );
    }

    var meshLine = new THREE.MeshLine();
    meshLine.setGeometry(meshLineGeometry);

    var meshLineMaterial = new THREE.MeshLineMaterial();

    var lineMesh = new THREE.Mesh( meshLine.geometry, meshLineMaterial ); // this syntax could definitely be improved!
    scene.add( lineMesh );

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

    this.addRenderers(
      sizePx,
      renderer
      //,
      //cssRenderer
    );

    interactiveFace.style.width = interactiveFace.style.height = divEdgeLengthPx;

    function animate(){
      controls.update();
      for(const pointLight of pointLights){
        pointLight.position.set(camera.position.x + pointLight.offsetFromCamera.x, camera.position.y + pointLight.offsetFromCamera.y, camera.position.z + pointLight.offsetFromCamera.z);
      }
      renderScene(
        scene,
        camera,
        renderer//,
        //cssRenderer
      );
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
    let i = 0;
    for(const renderer of renderers){
      i++;
      console.log('ABOUT TO RENDER FROM RENDERER ' + i);
      renderer.render(scene, camera );
    }
  }
}
