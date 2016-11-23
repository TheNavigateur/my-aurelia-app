define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.attached = function () {
            var sizePx = 600, renderer = new THREE.WebGLRenderer({
                alpha: true,
                antiAlias: true
            }), cssRenderer = new THREE.CSS3DRenderer(), scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(25, sizePx / sizePx, 1, 10000), controls = new THREE.TrackballControls(camera), renderScene = this.renderScene, cubeEdgeLengthPx = sizePx * 1, boxGeometry = new THREE.BoxGeometry(cubeEdgeLengthPx, cubeEdgeLengthPx, cubeEdgeLengthPx), bumpMapsConfigs = [
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
            ], bumpMaps = bumpMapsConfigs.map(function (bumpMapConfig) {
                var bumpMap = new THREE.TextureLoader().load(bumpMapConfig.imagePath);
                bumpMap.anisotropy = 4;
                bumpMap.repeat.set(0.998, 0.998);
                bumpMap.offset.set(0.001, 0.001);
                bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
                bumpMap.format = THREE.RGBFormat;
                return bumpMap;
            }), ambientLight = new THREE.AmbientLight(0x999999), materialConfigs = [
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
            ], materials = materialConfigs.map(function (materialConfig) {
                return new THREE.MeshPhongMaterial({
                    color: materialConfig.color,
                    specular: 0x222222,
                    shininess: 25,
                    bumpMap: bumpMaps[materialConfig.bumpMapIndex],
                    bumpScale: materialConfig.bumpScale,
                    opacity: 1,
                    blending: THREE.NoBlending
                });
            }), mesh = new THREE.Mesh(boxGeometry, new THREE.MeshFaceMaterial(materials)), divEdgeLengthPx = cubeEdgeLengthPx, interactiveFace = this.interactiveFace, interactiveFacsCSS3DObject = new THREE.CSS3DObject(interactiveFace), group = new THREE.Group(), pointLightConfigs = [
                {
                    offsetFromCamera: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                },
                {
                    offsetFromCamera: {
                        x: -1000,
                        y: -1000,
                        z: 0
                    }
                }
            ], pointLights = pointLightConfigs.map(function (pointLightConfig) {
                var pointLight = new THREE.PointLight(0xffffff, 1.3, 10000);
                pointLight.offsetFromCamera = pointLightConfig.offsetFromCamera;
                scene.add(pointLight);
                return pointLight;
            });
            scene.add(ambientLight);
            camera.position.z = sizePx * 4;
            scene.add(camera);
            controls.noZoom = true;
            controls.rotateSpeed = 2.4;
            controls.setStartDrag(0, -0.022);
            interactiveFacsCSS3DObject.position.z = cubeEdgeLengthPx / 2;
            group.add(interactiveFacsCSS3DObject);
            mesh.add(group);
            scene.add(mesh);
            this.addRenderers(sizePx, renderer, cssRenderer);
            interactiveFace.style.width = interactiveFace.style.height = divEdgeLengthPx;
            function animate() {
                controls.update();
                for (var _i = 0, pointLights_1 = pointLights; _i < pointLights_1.length; _i++) {
                    var pointLight = pointLights_1[_i];
                    pointLight.position.set(camera.position.x + pointLight.offsetFromCamera.x, camera.position.y + pointLight.offsetFromCamera.y, camera.position.z + pointLight.offsetFromCamera.z);
                }
                renderScene(scene, camera, renderer, cssRenderer);
                interactiveFace.style.display = camera.position.z > sizePx / 2 ? 'inline' : 'none';
                window.requestAnimationFrame(animate);
            }
            animate();
        };
        App.prototype.addRenderers = function (sizePx) {
            var renderers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                renderers[_i - 1] = arguments[_i];
            }
            for (var _a = 0, renderers_1 = renderers; _a < renderers_1.length; _a++) {
                var renderer = renderers_1[_a];
                renderer.setSize(sizePx, sizePx);
                renderer.domElement.style.position = 'absolute';
                renderer.domElement.style.top = renderer.domElement.style.left = 0;
                document.getElementById('cubePanel').appendChild(renderer.domElement);
            }
        };
        App.prototype.renderScene = function (scene, camera) {
            var renderers = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                renderers[_i - 2] = arguments[_i];
            }
            for (var _a = 0, renderers_2 = renderers; _a < renderers_2.length; _a++) {
                var renderer = renderers_2[_a];
                renderer.render(scene, camera);
            }
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('interactive-face',["require", "exports"], function (require, exports) {
    "use strict";
    var InteractiveFace = (function () {
        function InteractiveFace() {
            this.selectedIndex = 0;
            this.articles = [
                {
                    title: "Java",
                    description: 'Java is a general-purpose computer programming language that is concurrent, class-based, object-oriented, and specifically designed to have as few implementation dependencies as possible. It is intended to let application developers "write once, run anywhere" (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation. Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of computer architecture. As of 2016, Java is one of the most popular programming languages in use, particularly for client-server web applications, with a reported 9 million developers. Java was originally developed by James Gosling at Sun Microsystems (which has since been acquired by Oracle Corporation) and released in 1995 as a core component of Sun Microsystems\' Java platform. The language derives much of its syntax from C and C++, but it has fewer low-level facilities than either of them.'
                },
                {
                    title: "JavaScript",
                    description: 'JavaScript is a high-level, dynamic, untyped, and interpreted programming language. It has been standardized in the ECMAScript language specification. Alongside HTML and CSS, JavaScript is one of the three core technologies of World Wide Web content production; the majority of websites employ it, and all modern Web browsers support it without the need for plug-ins. JavaScript is prototype-based with first-class functions, making it a multi-paradigm language, supporting object-oriented, imperative, and functional programming styles. It has an API for working with text, arrays, dates and regular expressions, but does not include any I/O, such as networking, storage, or graphics facilities, relying for these upon the host environment in which it is embedded.'
                },
                {
                    title: "TypeScript",
                    description: "\n        TypeScript is a free and open-source programming language developed and maintained by Microsoft. It is a strict superset of JavaScript, and adds optional static typing and class-based object-oriented programming to the language. Anders Hejlsberg, lead architect of C# and creator of Delphi and Turbo Pascal, has worked on the development of TypeScript. TypeScript may be used to develop JavaScript applications for client-side or server-side (Node.js) execution.\n        TypeScript is designed for development of large applications and transcompiles to JavaScript. As TypeScript is a superset of JavaScript, any existing JavaScript programs are also valid TypeScript programs.\n        TypeScript supports definition files that can contain type information of existing JavaScript libraries, much like C/C++ header files can describe the structure of existing object files. This enables other programs to use the values defined in the files as if they were statically typed TypeScript entities. There are third-party header files for popular libraries like jQuery, MongoDB, and D3.js. TypeScript headers for the Node.js basic modules are also available, allowing development of Node.js programs within TypeScript.\n        "
                }
            ];
        }
        return InteractiveFace;
    }());
    exports.InteractiveFace = InteractiveFace;
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        longStackTraces: environment_1.default.debug,
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./interactive-face\"></require>\n  <interactive-face ref=\"interactiveFace\"></interactive-face>\n  <div id=\"cubePanel\" style=\"position:relative\"/>\n</template>\n"; });
define('text!interactive-face.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"font-family:'Roboto Thin';display:flex;flex-direction:column;align-items:center;width:400px;height:400px\">\n    <div style=\"color:white;font-size:24px;margin:16px;text-align:center\">What do you want to know about?</div>\n    <select value.bind=\"selectedIndex\" style=\"width:200px;height:50px;font-size:22px\">\n      <option repeat.for=\"article of articles\" value.bind=\"$index\">${article.title}</option>\n    </select>\n    <div repeat.for=\"article of articles\" if.bind=\"selectedIndex==$index\" style=\"overflow:auto;margin-top:25px;flex:1 1;\">\n      <div style=\"color:white;font-size:25px;margin-left:25px;margin-right:25px;margin-bottom:25px\">\n        ${article.description}\n      </div>\n    </div>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map