define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.attached = function () {
            var sizePx = 600, renderer = new THREE.WebGLRenderer({
                alpha: true
            }), cssRenderer = new THREE.CSS3DRenderer(), scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(25, sizePx / sizePx, 1, 10000), controls = new THREE.TrackballControls(camera), renderScene = this.renderScene, cubeEdgeLengthPx = sizePx * 1, boxGeometry = new THREE.BoxGeometry(cubeEdgeLengthPx, cubeEdgeLengthPx, cubeEdgeLengthPx), ambientLight = new THREE.AmbientLight(0x999999), materialConfigs = [
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
            ], materials = materialConfigs.map(function (materialConfig) {
                return new THREE.MeshPhongMaterial({
                    color: materialConfig.color,
                    specular: 0x222222,
                    shininess: materialConfig.shininess,
                    normalMap: new THREE.TextureLoader().load(materialConfig.normalMapImagePath),
                    normalScale: new THREE.Vector2(materialConfig.normapMapScale, materialConfig.normapMapScale),
                    opacity: 1,
                    blending: THREE.NoBlending
                });
            }), mesh = new THREE.Mesh(boxGeometry, new THREE.MeshFaceMaterial(materials)), divEdgeLengthPx = cubeEdgeLengthPx, interactiveFace = this.interactiveFace, interactiveFaceCSS3DObject = new THREE.CSS3DObject(interactiveFace), group = new THREE.Group(), pointLightConfigs = [
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
            var meshLineGeometry = new THREE.Geometry();
            for (var j = 0; j < Math.PI; j += 2 * Math.PI / 100) {
                var v = new THREE.Vector3(600 * Math.cos(j), 600 * Math.sin(j), 0);
                meshLineGeometry.vertices.push(v);
            }
            var meshLine = new THREE.MeshLine();
            meshLine.setGeometry(meshLineGeometry);
            var meshLineMaterial = new THREE.MeshLineMaterial({ color: new THREE.Color(0xff00ff) });
            var lineMesh = new THREE.Mesh(meshLine.geometry, meshLineMaterial);
            scene.add(lineMesh);
            scene.add(ambientLight);
            camera.position.z = sizePx * 4;
            scene.add(camera);
            controls.noZoom = true;
            controls.rotateSpeed = 2.4;
            controls.setStartDrag(0, -0.02188);
            interactiveFaceCSS3DObject.position.z = cubeEdgeLengthPx / 2;
            group.add(interactiveFaceCSS3DObject);
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
            var i = 0;
            for (var _a = 0, renderers_2 = renderers; _a < renderers_2.length; _a++) {
                var renderer = renderers_2[_a];
                i++;
                console.log('ABOUT TO RENDER FROM RENDERER ' + i);
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
        InteractiveFace.prototype.attached = function () {
            if (navigator.appVersion.indexOf("Chrome/") != -1) {
                this.articlesDiv.style.transform = 'scale(' + (2 / 3) + ')';
            }
        };
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var MeshLine = (function () {
        function MeshLine() {
            this.positions = [];
            this.previous = [];
            this.next = [];
            this.side = [];
            this.width = [];
            this.indices_array = [];
            this.uvs = [];
            this.counters = [];
            this.geometry = new THREE.BufferGeometry();
            this.widthCallback = null;
        }
        MeshLine.prototype.setGeometry = function (g, c) {
            if (c === void 0) { c = null; }
            this.widthCallback = c;
            this.positions = [];
            this.counters = [];
            if (g instanceof THREE.Geometry) {
                for (var j = 0; j < g.vertices.length; j++) {
                    var v = g.vertices[j];
                    var counterValue = j / g.vertices.length;
                    this.positions.push(v.x, v.y, v.z);
                    this.positions.push(v.x, v.y, v.z);
                    this.counters.push(counterValue);
                    this.counters.push(counterValue);
                }
            }
            if (g instanceof THREE.BufferGeometry) {
            }
            if (g instanceof Float32Array || g instanceof Array) {
                for (var j = 0; j < g.length; j += 3) {
                    var floatsCounterValue = j / g.length;
                    this.positions.push(g[j], g[j + 1], g[j + 2]);
                    this.positions.push(g[j], g[j + 1], g[j + 2]);
                    this.counters.push(floatsCounterValue);
                    this.counters.push(floatsCounterValue);
                }
            }
            this.process();
        };
        MeshLine.prototype.compareV3 = function (a, b) {
            var aa = a * 6;
            var ab = b * 6;
            return (this.positions[aa] === this.positions[ab]) && (this.positions[aa + 1] === this.positions[ab + 1]) && (this.positions[aa + 2] === this.positions[ab + 2]);
        };
        MeshLine.prototype.copyV3 = function (a) {
            var aa = a * 6;
            return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
        };
        MeshLine.prototype.process = function () {
            var l = this.positions.length / 6;
            this.previous = [];
            this.next = [];
            this.side = [];
            this.width = [];
            this.indices_array = [];
            this.uvs = [];
            for (var j = 0; j < l; j++) {
                this.side.push(1);
                this.side.push(-1);
            }
            var w;
            for (var j = 0; j < l; j++) {
                if (this.widthCallback)
                    w = this.widthCallback(j / (l - 1));
                else
                    w = 1;
                this.width.push(w);
                this.width.push(w);
            }
            for (var j = 0; j < l; j++) {
                this.uvs.push(j / (l - 1), 0);
                this.uvs.push(j / (l - 1), 1);
            }
            var v;
            if (this.compareV3(0, l - 1)) {
                v = this.copyV3(l - 2);
            }
            else {
                v = this.copyV3(0);
            }
            this.previous.push(v[0], v[1], v[2]);
            this.previous.push(v[0], v[1], v[2]);
            for (var j = 0; j < l - 1; j++) {
                v = this.copyV3(j);
                this.previous.push(v[0], v[1], v[2]);
                this.previous.push(v[0], v[1], v[2]);
            }
            for (var j = 1; j < l; j++) {
                v = this.copyV3(j);
                this.next.push(v[0], v[1], v[2]);
                this.next.push(v[0], v[1], v[2]);
            }
            if (this.compareV3(l - 1, 0)) {
                v = this.copyV3(1);
            }
            else {
                v = this.copyV3(l - 1);
            }
            this.next.push(v[0], v[1], v[2]);
            this.next.push(v[0], v[1], v[2]);
            for (var j = 0; j < l - 1; j++) {
                var n = j * 2;
                this.indices_array.push(n, n + 1, n + 2);
                this.indices_array.push(n + 2, n + 1, n + 3);
            }
            if (!this.attributes) {
                this.attributes = {
                    position: new THREE.BufferAttribute(new Float32Array(this.positions), 3),
                    previous: new THREE.BufferAttribute(new Float32Array(this.previous), 3),
                    next: new THREE.BufferAttribute(new Float32Array(this.next), 3),
                    side: new THREE.BufferAttribute(new Float32Array(this.side), 1),
                    width: new THREE.BufferAttribute(new Float32Array(this.width), 1),
                    uv: new THREE.BufferAttribute(new Float32Array(this.uvs), 2),
                    index: new THREE.BufferAttribute(new Uint16Array(this.indices_array), 1),
                    counters: new THREE.BufferAttribute(new Float32Array(this.counters), 1)
                };
            }
            else {
                this.attributes.position.copyArray(new Float32Array(this.positions));
                this.attributes.position.needsUpdate = true;
                this.attributes.previous.copyArray(new Float32Array(this.previous));
                this.attributes.previous.needsUpdate = true;
                this.attributes.next.copyArray(new Float32Array(this.next));
                this.attributes.next.needsUpdate = true;
                this.attributes.side.copyArray(new Float32Array(this.side));
                this.attributes.side.needsUpdate = true;
                this.attributes.width.copyArray(new Float32Array(this.width));
                this.attributes.width.needsUpdate = true;
                this.attributes.uv.copyArray(new Float32Array(this.uvs));
                this.attributes.uv.needsUpdate = true;
                this.attributes.index.copyArray(new Uint16Array(this.indices_array));
                this.attributes.index.needsUpdate = true;
            }
            this.geometry.addAttribute('position', this.attributes.position);
            this.geometry.addAttribute('previous', this.attributes.previous);
            this.geometry.addAttribute('next', this.attributes.next);
            this.geometry.addAttribute('side', this.attributes.side);
            this.geometry.addAttribute('width', this.attributes.width);
            this.geometry.addAttribute('uv', this.attributes.uv);
            this.geometry.addAttribute('counters', this.attributes.counters);
            this.geometry.setIndex(this.attributes.index);
        };
        MeshLine.memcpy = function (src, srcOffset, dst, dstOffset, length) {
            var i;
            src = src.subarray || src.slice ? src : src.buffer;
            dst = dst.subarray || dst.slice ? dst : dst.buffer;
            src = srcOffset ? src.subarray ?
                src.subarray(srcOffset, length && srcOffset + length) :
                src.slice(srcOffset, length && srcOffset + length) : src;
            if (dst.set) {
                dst.set(src, dstOffset);
            }
            else {
                for (i = 0; i < src.length; i++) {
                    dst[i + dstOffset] = src[i];
                }
            }
            return dst;
        };
        MeshLine.prototype.advance = function (position) {
            var positions = this.attributes.position.array;
            var previous = this.attributes.previous.array;
            var next = this.attributes.next.array;
            var l = positions.length;
            MeshLine.memcpy(positions, 0, previous, 0, l);
            MeshLine.memcpy(positions, 6, positions, 0, l - 6);
            positions[l - 6] = position.x;
            positions[l - 5] = position.y;
            positions[l - 4] = position.z;
            positions[l - 3] = position.x;
            positions[l - 2] = position.y;
            positions[l - 1] = position.z;
            MeshLine.memcpy(positions, 6, next, 0, l - 6);
            next[l - 6] = position.x;
            next[l - 5] = position.y;
            next[l - 4] = position.z;
            next[l - 3] = position.x;
            next[l - 2] = position.y;
            next[l - 1] = position.z;
            this.attributes.position.needsUpdate = true;
            this.attributes.previous.needsUpdate = true;
            this.attributes.next.needsUpdate = true;
        };
        ;
        return MeshLine;
    }());
    THREE.MeshLine = MeshLine;
    var vertexShaderSource = [
        'precision highp float;',
        '',
        'attribute vec3 position;',
        'attribute vec3 previous;',
        'attribute vec3 next;',
        'attribute float side;',
        'attribute float width;',
        'attribute vec2 uv;',
        'attribute float counters;',
        '',
        'uniform mat4 projectionMatrix;',
        'uniform mat4 modelViewMatrix;',
        'uniform vec2 resolution;',
        'uniform float lineWidth;',
        'uniform vec3 color;',
        'uniform float opacity;',
        'uniform float near;',
        'uniform float far;',
        'uniform float sizeAttenuation;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying vec3 vPosition;',
        'varying float vCounters;',
        '',
        'vec2 fix( vec4 i, float aspect ) {',
        '',
        '    vec2 res = i.xy / i.w;',
        '    res.x *= aspect;',
        '	 vCounters = counters;',
        '    return res;',
        '',
        '}',
        '',
        'void main() {',
        '',
        '    float aspect = resolution.x / resolution.y;',
        '	 float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);',
        '',
        '    vColor = vec4( color, opacity );',
        '    vUV = uv;',
        '',
        '    mat4 m = projectionMatrix * modelViewMatrix;',
        '    vec4 finalPosition = m * vec4( position, 1.0 );',
        '    vec4 prevPos = m * vec4( previous, 1.0 );',
        '    vec4 nextPos = m * vec4( next, 1.0 );',
        '',
        '    vec2 currentP = fix( finalPosition, aspect );',
        '    vec2 prevP = fix( prevPos, aspect );',
        '    vec2 nextP = fix( nextPos, aspect );',
        '',
        '	 float pixelWidth = finalPosition.w * pixelWidthRatio;',
        '    float w = 1.8 * pixelWidth * lineWidth * width;',
        '',
        '    if( sizeAttenuation == 1. ) {',
        '        w = 1.8 * lineWidth * width;',
        '    }',
        '',
        '    vec2 dir;',
        '    if( nextP == currentP ) dir = normalize( currentP - prevP );',
        '    else if( prevP == currentP ) dir = normalize( nextP - currentP );',
        '    else {',
        '        vec2 dir1 = normalize( currentP - prevP );',
        '        vec2 dir2 = normalize( nextP - currentP );',
        '        dir = normalize( dir1 + dir2 );',
        '',
        '        vec2 perp = vec2( -dir1.y, dir1.x );',
        '        vec2 miter = vec2( -dir.y, dir.x );',
        '        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );',
        '',
        '    }',
        '',
        '    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;',
        '    vec2 normal = vec2( -dir.y, dir.x );',
        '    normal.x /= aspect;',
        '    normal *= .5 * w;',
        '',
        '    vec4 offset = vec4( normal * side, 0.0, 1.0 );',
        '    finalPosition.xy += offset.xy;',
        '',
        '	 vPosition = ( modelViewMatrix * vec4( position, 1. ) ).xyz;',
        '    gl_Position = finalPosition;',
        '',
        '}'];
    var fragmentShaderSource = [
        '#extension GL_OES_standard_derivatives : enable',
        'precision mediump float;',
        '',
        'uniform sampler2D map;',
        'uniform float useMap;',
        'uniform float useDash;',
        'uniform vec2 dashArray;',
        'uniform float visibility;',
        'uniform float alphaTest;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying vec3 vPosition;',
        'varying float vCounters;',
        '',
        'void main() {',
        '',
        '    vec4 c = vColor;',
        '	 if( c.a < alphaTest ) discard;',
        '    if( useMap == 1. ) c *= texture2D( map, vUV );',
        '	 if( useDash == 1. ){',
        '	 	 ',
        '	 }',
        '    gl_FragColor = c;',
        '	 gl_FragColor.a *= step(vCounters,visibility);',
        '}'];
    function check(v, d) {
        if (v === undefined)
            return d;
        return v;
    }
    var MeshLineMaterialParameters = (function () {
        function MeshLineMaterialParameters() {
        }
        return MeshLineMaterialParameters;
    }());
    THREE.MeshLineMaterialParameters = MeshLineMaterialParameters;
    var MeshLineMaterial = (function (_super) {
        __extends(MeshLineMaterial, _super);
        function MeshLineMaterial(parameters) {
            if (parameters === void 0) { parameters = {}; }
            var lineWidth = check(parameters.lineWidth, 1), map = check(parameters.map, null), useMap = check(parameters.useMap, 0), color = check(parameters.color, new THREE.Color(0xffffff)), opacity = check(parameters.opacity, 1), resolution = check(parameters.resolution, new THREE.Vector2(1, 1)), sizeAttenuation = check(parameters.sizeAttenuation, 1), near = check(parameters.near, 1), far = check(parameters.far, 1), dashArray = check(parameters.dashArray, []), useDash = (dashArray !== []) ? 1 : 0, visibility = check(parameters.visibility, 1), alphaTest = check(parameters.alphaTest, 0);
            _super.call(this, {
                uniforms: {
                    lineWidth: { type: 'f', value: lineWidth },
                    map: { type: 't', value: map },
                    useMap: { type: 'f', value: useMap },
                    color: { type: 'c', value: color },
                    opacity: { type: 'f', value: opacity },
                    resolution: { type: 'v2', value: resolution },
                    sizeAttenuation: { type: 'f', value: sizeAttenuation },
                    near: { type: 'f', value: near },
                    far: { type: 'f', value: far },
                    dashArray: { type: 'v2', value: new THREE.Vector2(dashArray[0], dashArray[1]) },
                    useDash: { type: 'f', value: useDash },
                    visibility: { type: 'f', value: visibility },
                    alphaTest: { type: 'f', value: alphaTest }
                },
                vertexShader: vertexShaderSource.join('\r\n'),
                fragmentShader: fragmentShaderSource.join('\r\n')
            });
            this.type = 'MeshLineMaterial';
        }
        MeshLineMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.lineWidth = source.lineWidth;
            this.map = source.map;
            this.useMap = source.useMap;
            this.color.copy(source.color);
            this.opacity = source.opacity;
            this.resolution.copy(source.resolution);
            this.sizeAttenuation = source.sizeAttenuation;
            this.near = source.near;
            this.far = source.far;
            return this;
        };
        return MeshLineMaterial;
    }(THREE.RawShaderMaterial));
    THREE.MeshLineMaterial = MeshLineMaterial;
})(THREE || (THREE = {}));

define("meshline", [],function(){});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./app.css\"></require>\n  <require from=\"./interactive-face\"></require>\n  <interactive-face ref=\"interactiveFace\"></interactive-face>\n  <div id=\"cubePanel\" style=\"position:relative\"/>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "@font-face {\n  font-family: 'Roboto Thin';\n  src: url('../Roboto-Thin.ttf');\n}\n"; });
define('text!interactive-face.html', ['module'], function(module) { module.exports = "<template>\n  <div ref=\"articlesDiv\" style=\"font-family:'Roboto Thin';-moz-user-select:none;color:white;display:flex;flex-direction:column;align-items:center;width:600px;height:600px\">\n    <div style=\"font-size:36px;margin:24px;text-align:center\">What do you want to know about?</div>\n    <select value.bind=\"selectedIndex\" style=\"width:300px;height:75px;font-size:33px\">\n      <option repeat.for=\"article of articles\" value.bind=\"$index\">${article.title}</option>\n    </select>\n    <div repeat.for=\"article of articles\" if.bind=\"selectedIndex==$index\" style=\"overflow:auto;margin-top:37.5px;flex:1 1;\">\n      <div style=\"color:white;font-size:37.5px;margin-left:37.5px;margin-right:37.5px;margin-bottom:37.5px\">\n        ${article.description}\n      </div>\n    </div>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map