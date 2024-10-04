(function($){
    'use strict';
    var scene, camera, renderer;

    var container, aspectRatio, HEIGHT, WIDTH, fieldOfView, nearPlane, farPlane, mouseX, mouseY, windowHalfX, windowHalfY, stats, geometry, starStuff, materialOptions, stars;

    init();
    animate();

    function init(){
        container = document.getElementById('starfield-container');
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        aspectRatio = WIDTH / HEIGHT;
        fieldOfView = 90;
        nearPlane = 1;
        farPlane = 1000;
        mouseX = 0;
        mouseY = 0;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = farPlane / 2;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0003);

        starGen();

        if(webGLSupport()){
            renderer = new THREE.WebGLRenderer({ alpha: true });
        } else {
            renderer = new THREE.CanvasRenderer();
        }

        renderer.setSize(WIDTH, HEIGHT);
        renderer.setPixelRatio(window.devicePixelRatio);

        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onMouseMove, false);
    }

    function animate(){
        requestAnimationFrame(animate);
        render();
    }

    function render(){
        camera.position.x += (mouseX - camera.position.x) * 0.005;
        camera.position.y += (-mouseY - camera.position.y) * 0.005;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    function webGLSupport(){
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    }

    function onWindowResize(){
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(WIDTH, HEIGHT);
    }

    function createCanvasMaterial(color, size) {
        var matCanvas = document.createElement('canvas');
        matCanvas.width = matCanvas.height = size;
        var matContext = matCanvas.getContext('2d');
        var texture = new THREE.Texture(matCanvas);
        var center = size / 2;
        matContext.beginPath();
        matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
        matContext.closePath();
        matContext.fillStyle = color;
        matContext.fill();
        texture.needsUpdate = true;
        return texture;
      }

    function starGen(){
        var starQty = 15000;
        geometry = new THREE.Geometry();
        materialOptions = {
            map: createCanvasMaterial('#ffffff', 256),
            size: 1.0,
            transparent: true,
            opacity: 0.5,
            depthWrite: false
        };
    
        starStuff = new THREE.PointCloudMaterial(materialOptions);
    
        for (var i = 0; i < starQty; i++) {
            var starVertex = new THREE.Vector3();
            starVertex.x = Math.random() * 2000 - 1000;
            starVertex.y = Math.random() * 2000 - 1000;
            starVertex.z = Math.random() * 2000 - 1000;
    
            geometry.vertices.push(starVertex);
        }
    
        stars = new THREE.PointCloud(geometry, starStuff);
        scene.add(stars);
    }

    function onMouseMove(e){
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }
})();
