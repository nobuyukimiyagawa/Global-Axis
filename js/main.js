// Drawer（SPメニュー）
window.addEventListener("load", () => {
    const btn = document.querySelector(".hamburger");
    const drawer = document.querySelector(".drawer");
    if (!btn || !drawer) return;
  
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      drawer.style.display = isOpen ? "none" : "block";
      drawer.setAttribute("aria-hidden", String(isOpen));
    });
  
    // メニュークリックで閉じる
    drawer.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      btn.setAttribute("aria-expanded", "false");
      drawer.style.display = "none";
      drawer.setAttribute("aria-hidden", "true");
    });
});

gsap.registerPlugin(ScrollTrigger);

/* ================================
   1. Scroll Down hint
================================ */
gsap.to(".scroll-hint", {
  autoAlpha: 0,
  scrollTrigger: {
    trigger: ".kv",
    start: "top top+=20",
    end: "bottom top",
    scrub: true
  }
});

/* ================================
   2. 走行用 ScrollTrigger（共通）
================================ */
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: document.body,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: self => {
    const road = document.querySelector(".road-bg");
    if (!road) return;

    road.style.backgroundPositionY =
      `${-self.progress * (document.documentElement.scrollHeight)}px`;
  }
});

/* ================================
   4. トラック：走行中の上下バウンド
================================ */
// 上下バウンド
gsap.to(".truck", {
  y: -8,
  duration: 0.35,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

// 微ロール
gsap.to(".truck", {
  rotation: -1.5,
  duration: 0.6,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

function setRoadHeight() {
  const road = document.querySelector(".road-bg");
  if (!road) return;

  // ページ全体の実高さを取得
  const pageHeight = document.documentElement.scrollHeight;

  road.style.height = `${pageHeight}px`;
}

// 初期化
window.addEventListener("load", setRoadHeight);

// リサイズ時も再計算
window.addEventListener("resize", setRoadHeight);


gsap.registerPlugin(ScrollTrigger);

/* メインコピー */
gsap.to(".kv__title span", {
  y: "0%",
  duration: 0.9,
  ease: "power3.out",
  stagger: 0.05,
  scrollTrigger: {
    trigger: ".kv",
    start: "top 75%",
  }
});

/* サブコピー（少し遅れて・弱め） */
gsap.to(".rm-sub span", {
  y: "0%",
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.08,
  delay: 0.15, // ← ここが主従感
  scrollTrigger: {
    trigger: ".kv",
    start: "top 75%",
  }
});


/**
 * テキストを span で分割（日本語対応）
 */
 function splitTextToSpans(el) {
  const text = el.textContent.trim();
  el.textContent = "";

  [...text].forEach(char => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    el.appendChild(span);
  });
}

/* 対象をすべて処理 */
document.querySelectorAll(".rm-title").forEach(el => {
  splitTextToSpans(el);
});

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".rm-title").forEach(title => {
  gsap.to(title.querySelectorAll("span"), {
    y: "0%",
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.06,
    scrollTrigger: {
      trigger: title,
      start: "top 85%",
    }
  });
});

gsap.utils.toArray(".rm-image").forEach(img => {
  gsap.to(img, {
    scale: 1,
    opacity: 1,
    duration: 1.4,
    ease: "power3.out",
    scrollTrigger: {
      trigger: img,
      start: "top 80%",
    }
  });
});

gsap.registerPlugin(ScrollTrigger);

// 数字アニメーションの関数
function animateCountUp(el) {
  const target = +el.dataset.target;
  const obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration: 2.2,
    ease: "power1.out",
    onUpdate: () => {
      el.textContent = Math.floor(obj.val).toLocaleString();
    }
  });
}

// スクロールトリガーで発火
gsap.utils.toArray(".stat-number").forEach(numEl => {
  ScrollTrigger.create({
    trigger: numEl,
    start: "top 80%",
    onEnter: () => {
      // 1回だけアニメ
      if (!numEl.classList.contains("counted")) {
        numEl.classList.add("counted");
        animateCountUp(numEl);

        // 同時にフェードイン
        gsap.to(numEl, {
          opacity: 1,
          duration: 0.8,
          ease: "power1.out"
        });
      }
    }
  });
});
