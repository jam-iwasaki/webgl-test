// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  /* 基本の処理
  ---------------------------------------------- */
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
  camera.position.set(0, 0, +750);

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  // シーンに追加
  scene.add(directionalLight);

  /* オブジェクト作成
  ---------------------------------------------- */
  // 画像を読み込む
  const loader = new THREE.TextureLoader();
  const labelImgPath = 'assets/images/test-label.jpg';
  const texture = loader.load(labelImgPath);

  // マテリアルの設定
  const labelMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });

  // 瓶のサイズを定義
  const bottleRadiusSize = 50;

  const mouthHeight = 80;
  const neckHeight = 70;
  const labelHeight = 200;
  const bottomHeight = 15;

  // 瓶の口部分
  const mouthGeometry = new THREE.CylinderGeometry(bottleRadiusSize * 0.4, bottleRadiusSize * 0.4, mouthHeight, 32);
  const mouthMesh = new THREE.Mesh(mouthGeometry, bodyMaterial);

  // 瓶のネック部分
  const neckGeometry = new THREE.CylinderGeometry(bottleRadiusSize * 0.4, bottleRadiusSize, neckHeight, 32);
  const neckMesh = new THREE.Mesh(neckGeometry, bodyMaterial);

  // 瓶の中央部（ラベルが貼られる部分）
  const labelGeometry = new THREE.CylinderGeometry(bottleRadiusSize, bottleRadiusSize, labelHeight, 32);
  const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

  // 瓶の底部
  const bottomGeometry = new THREE.CylinderGeometry(bottleRadiusSize, bottleRadiusSize * 0.9, bottomHeight, 32);
  const bottomMesh = new THREE.Mesh(bottomGeometry, bodyMaterial);

  // 瓶をグループ化
  const bottle = new THREE.Group();
  bottle.add(bottomMesh);
  bottle.add(labelMesh);
  bottle.add(neckMesh);
  bottle.add(mouthMesh);
  scene.add(bottle);

  // 全体の位置調整
  mouthMesh.position.y = mouthHeight / 2 + neckHeight + labelHeight + bottomHeight;
  neckMesh.position.y = neckHeight / 2 + labelHeight + bottomHeight;
  labelMesh.position.y = labelHeight / 2 + bottomHeight;
  bottomMesh.position.y = bottomHeight / 2;
  bottle.position.y = -200;

  // 毎フレーム時に実行されるループイベントです
  tick();

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

  /* 内部関数
  ---------------------------------------------- */
  function tick() {
    bottle.rotation.y += 0.005;
    renderer.render(scene, camera); // レンダリング

    requestAnimationFrame(tick);
  }

  // 画像のパスを変更してテクスチャを更新する関数
  function changeLabelImagePath(newPath) {
    const newTexture = loader.load(newPath);
    labelMesh.material.map = newTexture;
    labelMesh.material.needsUpdate = true; // マテリアルの更新を通知
  }
}
