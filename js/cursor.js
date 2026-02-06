
window.addEventListener("load", () => {
  const cursor = document.getElementById("cursor-drone");
  if (!cursor) return;

  // マウス座標
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // 現在のカーソル位置
  let currentX = mouseX;
  let currentY = mouseY;

  // マウス移動イベント
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // システムカーソルが表示されないように念のためCSSクラスをつけるなどの処理も可能
    // (CSSで body { cursor: none } しているので基本OK)
  });

  // リンクホバー時のエフェクト (拡大 + 回転速度アップなど)
  // 動的に要素が増える場合も考慮し、mouseenter/leaveはdelegateするか、
  // あるいはシンプルに既存要素にだけつけるか。今回は既存要素のみ。
  const hoverSelector = "a, button, input, textarea, label, .js-hover";
  
  document.querySelectorAll(hoverSelector).forEach(el => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, { 
        scale: 1.4, 
        duration: 0.3, 
        ease: "back.out(1.7)" 
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, { 
        scale: 1, 
        duration: 0.3, 
        ease: "power2.out" 
      });
    });
  });

  // アニメーションループ (GSAP ticker)
  gsap.ticker.add(() => {
    // 追従のスムーズさ (0.1: 遅い 〜 1.0: 即時)
    // ドローンの「浮遊感」を出すため、少し遅れさせる
    const dt = 0.15; 
    
    // 差分
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;

    // 位置更新 (線形補間)
    currentX += dx * dt;
    currentY += dy * dt;

    // 傾き (Velocity based tilt)
    // 移動量が大きいほど傾く
    const tilt = dx * 2.0; 
    const rotation = Math.max(-25, Math.min(25, tilt));

    // GSAPで適用
    // xPercent: -50, yPercent: -50 で中心基準にする
    gsap.set(cursor, {
      x: currentX,
      y: currentY,
      rotation: rotation,
      xPercent: -50,
      yPercent: -50,
    });
  });
});
