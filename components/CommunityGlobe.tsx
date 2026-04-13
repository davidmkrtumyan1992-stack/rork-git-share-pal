import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const SIZE = 320;

// Three.js globe rendered inside a WebView (native WebGL)
const HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>
  html,body{margin:0;padding:0;background:transparent;overflow:hidden;width:100%;height:100%}
  canvas{display:block}
</style>
</head>
<body>
<div id="m" style="width:100%;height:100%"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script>
(function(){
  var m = document.getElementById('m');
  var W = m.clientWidth, H = m.clientHeight;

  var scene    = new THREE.Scene();
  var camera   = new THREE.PerspectiveCamera(42, W/H, 0.1, 100);
  camera.position.z = 2.8;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setClearColor(0x000000, 0);
  m.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  var d1 = new THREE.DirectionalLight(0xffffff, 0.7);
  d1.position.set(3, 2, 5);
  scene.add(d1);
  var d2 = new THREE.DirectionalLight(0xffffff, 0.3);
  d2.position.set(-3, -2, -5);
  scene.add(d2);

  // Globe mesh
  var geo = new THREE.SphereGeometry(1, 64, 64);
  var tex = new THREE.TextureLoader().load(
    'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_map.png',
    function(t){
      t.generateMipmaps = false;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }
  );
  var mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0xf0eeeb,
    roughness: 1.0,
    metalness: 0.0
  });
  var globe = new THREE.Mesh(geo, mat);
  scene.add(globe);

  // Soft shadow disc
  var shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 48),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.07 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.25;
  scene.add(shadow);

  // Glow shell
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.07, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 })
  ));

  // Community dots — countries using the app
  var LOCS = [
    [55.75,  37.62],   // Россия
    [40.18,  44.50],   // Армения
    [48.21,  16.37],   // Вена
    [40.42,  -3.70],   // Испания
    [56.13,-106.35],   // Канада
    [35.86, 104.20],   // Китай
    [37.09, -95.71],   // США
    [38.96,  35.24]    // Турция
  ];

  function toVec3(lat, lng, r) {
    var phi   = (90 - lat) * Math.PI / 180;
    var theta = (lng + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  var dotGroup = new THREE.Group();
  LOCS.forEach(function(loc) {
    var p = toVec3(loc[0], loc[1], 1.015);

    // Core dot
    var core = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x2A6B50 })
    );
    core.position.copy(p);
    dotGroup.add(core);

    // Glow halo
    var halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.036, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x4AA870, transparent: true, opacity: 0.35 })
    );
    halo.position.copy(p);
    dotGroup.add(halo);
  });
  scene.add(dotGroup);

  // Animation loop
  var SPEED = 0.0022;
  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y    += SPEED;
    dotGroup.rotation.y += SPEED;
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', function() {
    var w = m.clientWidth, h = m.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
</script>
</body>
</html>`;

export function CommunityGlobe() {
  return (
    <View style={styles.wrap}>
      <WebView
        source={{ html: HTML }}
        style={styles.wv}
        scrollEnabled={false}
        javaScriptEnabled
        originWhitelist={['*']}
        androidLayerType="hardware"
        allowsInlineMediaPlayback
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  wv: {
    flex: 1,
    backgroundColor: 'transparent',
    opacity: 0.99,
  },
});
