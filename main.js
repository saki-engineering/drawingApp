// ページ読み込み時に呼び出される
window.addEventListener('load', () => {
  //キャンバス要素の取得
  const canvas = document.querySelector('#draw-area');
  // 描画出来るようにするおまじない
  const context = canvas.getContext('2d');

  const lastPosition = { x: null, y: null }; // 描画中の座標保持
  let isDrag         = false;                //描画中状態を保持(描画中ならtrue)
  let currentColor   = '#ffa500';            //線の色を保持

  
  // 入力開始
  function dragStart(event) {
    // パスを初期化してドラッグ状態フラグをON
    context.beginPath();
    isDrag = true; 
  }
  // 入力終了
  function dragEnd(event) {
    // パスの開始と終了座標を結んで、ドラッグ状態フラグをOFF
    context.closePath(); 
    isDrag = false; 
    lastPosition.x = null; 
    lastPosition.y = null;
  }
  // 描画領域を透明に
  function clear() {
    // 始点x/y座標、終点x/y座標を指定
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  //描画中
  function draw(x, y) { 
    if(!isDrag) return;

    context.lineCap     = 'round';      //線端の形
    context.lineJoin    = 'round';      //線結合部の形状
    context.lineWidth   = 5;            //線の太さ
    context.strokeStyle = currentColor; //線の色

    // 初回タップ時は点
    if (lastPosition.x === null || lastPosition.y === null) {
      context.moveTo(x, y);
    // 既にタップ中は線
    } else {
      context.moveTo(lastPosition.x, lastPosition.y);
    }

    // 現在のパスを輪郭表示して描画
    context.lineTo(x, y);
    context.stroke();

    // 現在のポジションを最終ポジションとして更新
    lastPosition.x = x;
    lastPosition.y = y;
  }
  
  //フォームからペンの色変更
  function changePenColor() {
    //フォームに入力された値
    code = document.colorform.colorcode.value;
    //カラーコードか判別
    isColorcode = Boolean(code.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/));
    if(isColorcode){
      currentColor = code;
      document.querySelector('#pen_color').style.backgroundColor = code;
      context.globalCompositeOperation = 'source-over';
    }
    else{
      alert('カラーコードを入力してください');
    }
  }
  


    
  // 初期処理
  function initEventHandler() { 
    //カラーコード入力フォームを取得→submitでペンの色を変える
    const changePenForm = document.querySelector('#pen_color_form');
    changePenForm.addEventListener('submit', changePenColor);
    
    // ペンに切り替え
    const penRadioButton = document.querySelector('#use-pen');
    penRadioButton.addEventListener('click', () =>{
      context.globalCompositeOperation = 'source-over';
    });
    // 消しゴムに切り替え
    const eraserRadioButton = document.querySelector('#use-eraser');
    eraserRadioButton.addEventListener('click', () =>{
      context.globalCompositeOperation = 'destination-out';
    });
    
    // Viewタブで指定した全消しボタンを取得→クリックでクリア
    const clearButton = document.querySelector('#clear-button');
    clearButton.addEventListener('click', clear);
    

    // マウスの動きに応じてそれぞれの関数を呼び出す
    canvas.addEventListener('mousedown', dragStart);
    canvas.addEventListener('mouseup', dragEnd);
    canvas.addEventListener('mouseout', dragEnd);
    canvas.addEventListener('mousemove', (event) => {
      draw(event.layerX, event.layerY);
    });
    
  }

  function initColorPalette() {
    const joe = colorjoe.rgb('color-palette', currentColor);

    // ドキュメント: https://github.com/bebraw/colorjoe#event-handling
    joe.on('done', color => {
      currentColor = color.hex();
    });
  }
  
  // 初期処理を呼び出し
  initEventHandler();

  // カラーパレット情報を初期化する
  initColorPalette();
});