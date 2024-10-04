(function($){
    'use strict';
    var scene, camera, renderer;

    var container, aspectRatio, HEIGHT, WIDTH, fieldOfView, nearPlane, farPlane, mouseX, mouseY, windowHalfX, windowHalfY, stats, geometry, starStuff, materialOptions, stars;

    init();
    animate();

    function init(){
        // Target the starfield container
        container = document.getElementById('starfield-container');
        // Set up the canvas size
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

        // Camera setup
        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = farPlane / 2;

        // Scene setup
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0003);

        // Star generation
        starGen();

        // WebGL renderer
        if(webGLSupport()){
            renderer = new THREE.WebGLRenderer({ alpha: true });
        } else {
            renderer = new THREE.CanvasRenderer();
        }

        renderer.setSize(WIDTH, HEIGHT);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Append the renderer's canvas to the container
        container.appendChild(renderer.domElement);

        // Event listeners
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
        // create exture object from canvas.
        var texture = new THREE.Texture(matCanvas);
        // Draw a circle
        var center = size / 2;
        matContext.beginPath();
        matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
        matContext.closePath();
        matContext.fillStyle = color;
        matContext.fill();
        // need to set needsUpdate
        texture.needsUpdate = true;
        // return a texture made from the canvas
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
    


        // Create material for the stars
        starStuff = new THREE.PointCloudMaterial(materialOptions);
    
        // Generate stars and push them into geometry.vertices
        for (var i = 0; i < starQty; i++) {
            var starVertex = new THREE.Vector3();
            starVertex.x = Math.random() * 2000 - 1000;
            starVertex.y = Math.random() * 2000 - 1000;
            starVertex.z = Math.random() * 2000 - 1000;
    
            geometry.vertices.push(starVertex);
        }
    
        stars = new THREE.PointCloud(geometry, starStuff); // Use PointCloud in r70
        scene.add(stars);
    }

    function onMouseMove(e){
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }
})(jQuery);
