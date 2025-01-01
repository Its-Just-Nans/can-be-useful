function mobileCheck() {
    if (typeof navigator !== "undefined") {
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth < 600
        );
    }
    return null;
}

// Namespace for errors
const error = function () {
    Array.prototype.unshift.call(arguments, "[VANTA]");
    return console.error.apply(this, arguments);
};

class VantaBase {
    constructor(userOptions = {}) {
        this.resize = this.resize.bind(this);
        this.animationLoop = this.animationLoop.bind(this);
        this.restart = this.restart.bind(this);
        this.options = Object.assign(
            {
                minHeight: 200,
                minWidth: 200,
                scale: 1,
                scaleMobile: 1,
            },
            this.defaultOptions
        );

        if (userOptions instanceof HTMLElement || typeof userOptions === "string") {
            userOptions = { el: userOptions };
        }
        Object.assign(this.options, userOptions);

        if (this.options.THREE) {
            THREE = this.options.THREE; // Optionally use a custom build of three.js
        }

        // Set element
        this.el = this.options.el;
        if (this.el == null) {
            error('Instance needs "el" param!');
        } else if (!(this.options.el instanceof HTMLElement)) {
            const selector = this.el;
            this.el = document.querySelector(selector);
            if (!this.el) {
                error("Cannot find element", selector);
                return;
            }
        }

        this.prepareEl();
        this.initThree();
        this.setSize(); // Init needs size

        try {
            this.init();
        } catch (e) {
            // FALLBACK - just use color
            error("Init error", e);
            if (this.renderer && this.renderer.domElement) {
                this.el.removeChild(this.renderer.domElement);
            }
            return;
        }

        // After init
        this.resize();
        this.animationLoop();

        // Event listeners
        const ad = window.addEventListener;
        ad("resize", this.resize);
        window.requestAnimationFrame(this.resize); // Force a resize after the first frame
    }

    setOptions(userOptions = {}) {
        Object.assign(this.options, userOptions);
    }

    prepareEl() {
        let i, child;
        // wrapInner for text nodes, so text nodes can be put into foreground
        if (typeof Node !== "undefined" && Node.TEXT_NODE) {
            for (i = 0; i < this.el.childNodes.length; i++) {
                const n = this.el.childNodes[i];
                if (n.nodeType === Node.TEXT_NODE) {
                    const s = document.createElement("span");
                    s.textContent = n.textContent;
                    n.parentElement.insertBefore(s, n);
                    n.remove();
                }
            }
        }
        // Set foreground elements
        for (i = 0; i < this.el.children.length; i++) {
            child = this.el.children[i];
            if (getComputedStyle(child).position === "static") {
                child.style.position = "relative";
            }
            if (getComputedStyle(child).zIndex === "auto") {
                child.style.zIndex = 1;
            }
        }
        // Set canvas and container style
        if (getComputedStyle(this.el).position === "static") {
            this.el.style.position = "relative";
        }
    }

    applyCanvasStyles(canvasEl, opts = {}) {
        Object.assign(canvasEl.style, {
            position: "absolute",
            zIndex: 0,
            top: 0,
            left: 0,
            background: "",
        });
        if (this.options.pixelated) {
            canvasEl.style.imageRendering = "pixelated";
        }
        Object.assign(canvasEl.style, opts);
        canvasEl.classList.add("vanta-canvas");
    }

    initThree() {
        if (!THREE.WebGLRenderer) {
            console.warn("[VANTA] No THREE defined on window");
            return;
        }
        // Set renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.el.appendChild(this.renderer.domElement);
        this.applyCanvasStyles(this.renderer.domElement);
        if (isNaN(this.options.backgroundAlpha)) {
            this.options.backgroundAlpha = 1;
        }

        this.scene = new THREE.Scene();
    }

    getCanvasElement() {
        if (this.renderer) {
            return this.renderer.domElement; // three.js
        }
        if (this.p5renderer) {
            return this.p5renderer.canvas; // p5
        }
    }

    getCanvasRect() {
        const canvas = this.getCanvasElement();
        if (!canvas) return false;
        return canvas.getBoundingClientRect();
    }

    setSize() {
        this.scale || (this.scale = 1);
        if (mobileCheck() && this.options.scaleMobile) {
            this.scale = this.options.scaleMobile;
        } else if (this.options.scale) {
            this.scale = this.options.scale;
        }
        this.width = Math.max(this.el.offsetWidth, this.options.minWidth);
        this.height = Math.max(this.el.offsetHeight, this.options.minHeight);
    }

    resize() {
        this.setSize();
        if (this.camera) {
            this.camera.aspect = this.width / this.height;
            if (typeof this.camera.updateProjectionMatrix === "function") {
                this.camera.updateProjectionMatrix();
            }
        }
        if (this.renderer) {
            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(window.devicePixelRatio / this.scale);
        }
        typeof this.onResize === "function" ? this.onResize() : void 0;
    }

    isOnScreen() {
        const elHeight = this.el.offsetHeight;
        const elRect = this.el.getBoundingClientRect();
        const scrollTop =
            window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
        const offsetTop = elRect.top + scrollTop;
        const minScrollTop = offsetTop - window.innerHeight;
        const maxScrollTop = offsetTop + elHeight;
        return minScrollTop <= scrollTop && scrollTop <= maxScrollTop;
    }

    animationLoop() {
        // Step time
        this.t || (this.t = 0);
        // Uniform time
        this.t2 || (this.t2 = 0);

        // Normalize animation speed to 60fps
        const now = performance.now();
        if (this.prevNow) {
            let elapsedTime = (now - this.prevNow) / (1000 / 60);
            elapsedTime = Math.max(0.2, Math.min(elapsedTime, 5));
            this.t += elapsedTime;

            this.t2 += (this.options.speed || 1) * elapsedTime;
            if (this.uniforms) {
                this.uniforms.iTime.value = this.t2 * 0.016667; // iTime is in seconds
            }
        }
        this.prevNow = now;

        // Only animate if element is within view
        if (this.isOnScreen() || this.options.forceAnimate) {
            if (typeof this.onUpdate === "function") {
                this.onUpdate();
            }
            if (this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
                this.renderer.setClearColor(this.options.backgroundColor, this.options.backgroundAlpha);
            }
            // if (this.stats) this.stats.update()
            // if (this.renderStats) this.renderStats.update(this.renderer)
            if (this.fps && this.fps.update) this.fps.update();
            if (typeof this.afterRender === "function") this.afterRender();
        }
        return (this.req = window.requestAnimationFrame(this.animationLoop));
    }

    restart() {
        // Restart the effect without destroying the renderer
        if (this.scene) {
            while (this.scene.children.length) {
                this.scene.remove(this.scene.children[0]);
            }
        }
        if (typeof this.onRestart === "function") {
            this.onRestart();
        }
        this.init();
    }

    init() {
        if (typeof this.onInit === "function") {
            this.onInit();
        }
        // this.setupControls()
    }

    destroy() {
        if (typeof this.onDestroy === "function") {
            this.onDestroy();
        }
        const rm = window.removeEventListener;
        rm("resize", this.resize);
        window.cancelAnimationFrame(this.req);

        const scene = this.scene;
        if (scene && scene.children) {
            clearThree(scene);
        }
        if (this.renderer) {
            if (this.renderer.domElement) {
                this.el.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
            this.scene = null;
        }
    }
}

function clearThree(obj) {
    // https://stackoverflow.com/questions/30359830/how-do-i-clear-three-js-scene/48722282
    while (obj.children && obj.children.length > 0) {
        clearThree(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
        // in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach((prop) => {
            if (!obj.material[prop]) return;
            if (obj.material[prop] !== null && typeof obj.material[prop].dispose === "function") {
                obj.material[prop].dispose();
            }
        });
        obj.material.dispose();
    }
}

function rn(start = 0, end = 1) {
    return start + Math.random() * (end - start);
}

class Waves extends VantaBase {
    static initClass() {
        this.prototype.ww = 100;
        this.prototype.hh = 80;
        this.prototype.waveNoise = 7; // Choppiness of water
    }
    constructor(userOptions = {}) {
        super(userOptions);
    }

    getMaterial() {
        const options = {
            color: this.options.color,
            shininess: this.options.shininess,
            flatShading: true,
            side: THREE.DoubleSide,
        };
        return new THREE.MeshPhongMaterial(options);
    }

    onInit() {
        let i, j;
        const CELLSIZE = 18;
        const material = this.getMaterial();
        const geometry = new THREE.BufferGeometry();

        // Add vertices
        this.gg = [];
        const points = [];
        for (i = 0; i <= this.ww; i++) {
            this.gg[i] = [];
            for (j = 0; j <= this.hh; j++) {
                const id = points.length;
                const newVertex = new THREE.Vector3(
                    (i - this.ww * 0.5) * CELLSIZE,
                    rn(0, this.waveNoise) - 10,
                    (this.hh * 0.5 - j) * CELLSIZE
                );
                points.push(newVertex);
                this.gg[i][j] = id;
            }
        }
        geometry.setFromPoints(points);

        // Add faces
        // a b
        // c d <-- Looking from the bottom right point
        const indices = [];
        for (i = 1; i <= this.ww; i++) {
            for (j = 1; j <= this.hh; j++) {
                let face1, face2;
                const d = this.gg[i][j];
                const b = this.gg[i][j - 1];
                const c = this.gg[i - 1][j];
                const a = this.gg[i - 1][j - 1];
                const ri = (s, e) => Math.floor(s + Math.random() * (e - s + 1));
                if (ri(0, 1)) {
                    face1 = [a, b, c];
                    face2 = [b, c, d];
                } else {
                    face1 = [a, b, d];
                    face2 = [a, c, d];
                }
                indices.push(...face1, ...face2);
            }
        }
        geometry.setIndex(indices);

        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane);

        // LIGHTS
        const ambience = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(ambience);

        const pointLight = new THREE.PointLight(0xffffff, 0.9);
        pointLight.position.set(-100, 250, -100);
        this.scene.add(pointLight);

        // CAMERA
        this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 50, 10000);

        const xOffset = -10;
        const zOffset = -10;
        this.cameraPosition = new THREE.Vector3(0, 800, 0);
        this.cameraTarget = new THREE.Vector3(150 + xOffset, -30, 200 + zOffset);
        this.camera.position.copy(this.cameraPosition);
        this.scene.add(this.camera);
    }

    onUpdate() {
        // Update options
        let diff;
        this.plane.material.color.set(this.options.color);
        this.plane.material.shininess = this.options.shininess;
        this.camera.ox = this.cameraPosition.x / this.options.zoom;
        this.camera.oy = this.cameraPosition.y / this.options.zoom;
        this.camera.oz = this.cameraPosition.z / this.options.zoom;

        if (this.controls != null) {
            this.controls.update();
        }

        const c = this.camera;
        if (Math.abs(c.tx - c.position.x) > 0.01) {
            diff = c.tx - c.position.x;
            c.position.x += diff * 0.02;
        }
        if (Math.abs(c.ty - c.position.y) > 0.01) {
            diff = c.ty - c.position.y;
            c.position.y += diff * 0.02;
        }
        if (Math.abs(c.tz - c.position.z) > 0.01) {
            diff = c.tz - c.position.z;
            c.position.z += diff * 0.02;
        }

        c.lookAt(0, 0, 0);

        // WAVES
        this.oy = this.oy || {};
        for (let i = 0; i < this.plane.geometry.attributes.position.array.length; i += 3) {
            const v = {
                x: this.plane.geometry.attributes.position.array[i],
                y: this.plane.geometry.attributes.position.array[i + 1],
                z: this.plane.geometry.attributes.position.array[i + 2],
                oy: this.oy[i],
            };
            if (!v.oy) {
                // INIT
                this.oy[i] = v.y;
            } else {
                const s = this.options.waveSpeed;
                const crossChop = Math.sqrt(s) * Math.cos(-v.x - v.z * 0.7); // + s * (i % 229) / 229 * 5
                const delta = Math.sin(s * this.t * 0.02 - s * v.x * 0.025 + s * v.z * 0.015 + crossChop);
                const trochoidDelta = Math.pow(delta + 1, 2) / 4;
                v.y = v.oy + trochoidDelta * this.options.waveHeight;
                this.plane.geometry.attributes.position.array[i + 1] = v.y;
            }
        }

        this.plane.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
        this.plane.geometry.computeVertexNormals();
        this.plane.geometry.attributes.position.needsUpdate = true;

        if (this.wireframe) {
            this.wireframe.geometry.fromGeometry(this.plane.geometry);
            this.wireframe.geometry.computeFaceNormals();
        }
    }
}

Waves.prototype.defaultOptions = {
    shininess: 30,
    waveHeight: 15,
    waveSpeed: 1,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x0,
};
Waves.initClass();

const start = async (el = "#waves") => {
    if (!document.querySelector(el)) {
        const el = document.createElement("div");
        el.id = "waves";
        el.style.position = "absolute";
        el.style.top = "0";
        el.style.left = "0";
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.zIndex = "-1";
        document.body.prepend(el);
    }
    if (typeof THREE === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
        script.onload = () => {
            THREE = window.THREE;
            start();
        };
        document.head.appendChild(script);
        return;
    }
    new Waves({
        el: el,
    });
};
start();
