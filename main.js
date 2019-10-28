// ページ読み込み時に呼び出される
// 対象windowに対してaddEventListener関数
window.addEventListener('load', () => {
    // Viewタブで指定した「draw-area」という名前のcanvasを取得
    // constは再宣言・再代入が禁止の変数宣言
    // 対象documentに対してquerySelector関数(引数はcssセレクタ)
    const canvas = document.querySelector('#draw-area');
    // 描画出来るようにするおまじない
    const context = canvas.getContext('2d');
    // 描画中の座標を保持する
    const lastPosition = { x: null, y: null };
    // 描画中状態を保持する
    // letは再宣言が禁止の変数宣言
    let isDrag = false;
    
    // 現在の線の色を保持する変数(デフォルトは黑)
    let currentColor = '#ffa500';
    
    //バック画像表示
    /*
    let background = new Image()
    //対象backgroundにsrc(ソースコード)をつける
    background.src = "https://1.bp.blogspot.com/-MJ9kxWWrLg4/XLAcxVsOVCI/AAAAAAABSS0/lUn-55yy1wg182e8UZGGP5Xy8cwNrLYtgCLcBGAs/s800/bg_chiheisen_green.jpg"
    background.onload = function(){
      context.drawImage(background,0,0,canvas.width,canvas.height)
    }
    */
    
    // 入力開始
    function dragStart(event) {
      // パスを初期化してドラッグ状態フラグをON
      context.beginPath();
      isDrag = true; 
    }
    
    //関数の引数に入れるのがイベントで、background.onloadのように、ドットの後にするのがイベントハンドラ
    
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
      
      //バック画像表示
      /*
      let background = new Image()
      background.src = "https://1.bp.blogspot.com/-MJ9kxWWrLg4/XLAcxVsOVCI/AAAAAAABSS0/lUn-55yy1wg182e8UZGGP5Xy8cwNrLYtgCLcBGAs/s800/bg_chiheisen_green.jpg"
      context.drawImage(background,0,0,canvas.width,canvas.height)
      */
    }
    
    function draw(x, y) { 
      if(!isDrag) {
        return;
      }
      // 線端の形状を丸く
      context.lineCap = 'round';
      // 線接合部の形状を丸く
      context.lineJoin = 'round';
      // 線の太さ
      context.lineWidth = 5;
      // 線色
      context.strokeStyle = currentColor;
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
    
    function changePenColor() {
      //フォームに入力された値
      code = document.colorform.colorcode.value;
      //カラーコードか判別
      isColorcode = Boolean(code.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/));
      if(isColorcode){
        currentColor = code;
        document.getElementById('pen_color').style.backgroundColor = code;
        context.globalCompositeOperation = 'source-over';
      }
      else{
        alert('カラーコードを入力してください');
      }
    }
    
    function write(){
      context.globalCompositeOperation = 'source-over';
    }
    
    function erase(){
      context.globalCompositeOperation = 'destination-out';
    }
      
    // 初期処理
    function initEventHandler() { 
      //カラーコード入力フォームを取得
      const changePenForm = document.querySelector('#pen_color_form');
      //フォームをsubmitするとchangePenColor関数を呼び出す
      changePenForm.addEventListener('submit', changePenColor);
      
      // Viewタブで指定した全消しボタンを取得
      const penButton = document.querySelector('#use-pen');
      // clickすると「clear」という関数を呼び出す
      penButton.addEventListener('click', write);
      
      // Viewタブで指定した全消しボタンを取得
      const eraserButton = document.querySelector('#use-eraser');
      // clickすると「clear」という関数を呼び出す
      eraserButton.addEventListener('click', erase);
      
      // Viewタブで指定した全消しボタンを取得
      const clearButton = document.querySelector('#clear-button');
      // clickすると「clear」という関数を呼び出す
      clearButton.addEventListener('click', clear);
      
      // PCver
      // マウスの動きに応じてそれぞれの関数を呼び出す
      canvas.addEventListener('mousedown', dragStart);
      canvas.addEventListener('mouseup', dragEnd);
      canvas.addEventListener('mouseout', dragEnd);
      // 移動イベントの場合は、x/y座標を取得して、「draw」関数を呼び出し
      canvas.addEventListener('mousemove', (event) => {
        draw(event.layerX, event.layerY);
      });
      
    }
    
    // 初期処理を呼び出し
    initEventHandler();
  });