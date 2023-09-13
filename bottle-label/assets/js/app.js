// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // サイズを指定
  const width = 960;
  const height = 540;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);

  // ジオメトリを作成（円柱）
  const geometry = new THREE.CylinderGeometry(200, 200, 350, 30);
  // 画像を読み込む
  const loader = new THREE.TextureLoader();
  const labelImgPath = 'assets/images/test-label.jpg';
  const texture = loader.load(labelImgPath);
  // マテリアルを作成
  const material = new THREE.MeshStandardMaterial({ map: texture });
  //メッシュを作成
  const mesh = new THREE.Mesh(geometry, material);
  //シーンにメッシュを適用
  scene.add(mesh);

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  // シーンに追加
  scene.add(directionalLight);

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera); // レンダリング

    requestAnimationFrame(tick);
  }

  // 画像のパスを変更してテクスチャを更新する関数
  function changeLabelImagePath(newPath) {
    const newTexture = loader.load(newPath);
    mesh.material.map = newTexture;
    mesh.material.needsUpdate = true; // マテリアルの更新を通知
  }

  // クリックで画像変更
  const imgUpload = document.getElementById('img-upload');
  const changeBtn = document.getElementById('change-btn');
  if (!imgUpload || !changeBtn) return;

  changeBtn.addEventListener('click', function () {
    console.log(imgUpload.files);
    const file = imgUpload.files[0];
    if (!file) return;

    // FileReaderを使用して、選択されたファイルを読み込む
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result; // 画像のデータURLを取得
      changeLabelImagePath(imageUrl); // この関数でThree.jsのテクスチャを更新
    };
    reader.readAsDataURL(file);
  });
}
