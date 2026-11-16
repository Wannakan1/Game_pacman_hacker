(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    rnd = (n) => (Math.random() * n) | 0;
  const bg = $("#bg"),
    bx = bg.getContext("2d"),
    cv = $("#game"),
    g = cv.getContext("2d");
  const D = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    K = {},
    QT = 12,
    MAXHP = 130;
  let W = 0,
    H = 0,
    T = 36,
    C = 35,
    R = 25,
    grid = [],
    dots = null,
    mz = null,
    state = "menu",
    scr = "menu",
    prev = "menu",
    live = false,
    P,
    pol = [],
    items = [],
    bul = [],
    pts = [],
    rings = [],
    time = 0,
    score = 0,
    got = 0,
    total = 0,
    lvl = 0,
    endMode = "",
    endT = 0,
    fwT = 0,
    sirK = -1,
    bits = "",
    qn = 0,
    qAt = 15,
    sh = 0,
    toastT = 0,
    cur = null,
    answered = false,
    qi = [],
    t0 = 0,
    quizOn = false,
    chase = false,
    stepT = 0,
    hudT = 0,
    rf = 0,
    best = 0,
    drops = [],
    lastPun = -1,
    cx = 0,
    cy = 0,
    flip = 0;
  try {
    best = +localStorage.hmBest || 0;
  } catch (e) {}

  /* question|correct|wrong|wrong|explanation */
  const Q =
    `รหัสผ่านแบบไหนปลอดภัยที่สุด?|Tr#9kLm!2vQx|12345678|password|ยาว ผสมตัวอักษร ตัวเลข สัญลักษณ์ และเดาไม่ได้
Phishing (ฟิชชิ่ง) คืออะไร?|การปลอมเป็นองค์กรเพื่อหลอกเอาข้อมูล|การล้างไวรัส|การสำรองข้อมูล|มิจฉาชีพส่งลิงก์หรือเว็บปลอมเพื่อให้เรากรอกข้อมูลสำคัญ
ได้ SMS บอกว่าถูกรางวัลให้กดลิงก์รับเงิน ควรทำอย่างไร?|ไม่กดและลบทิ้ง|รีบกดลิงก์|ส่งต่อให้เพื่อน|มักเป็นการหลอกลวง (Scam) ไม่มีใครแจกเงินฟรี
2FA คืออะไร?|การยืนยันตัวตนสองขั้นตอน|ใช้รหัสผ่านเดิมสองครั้ง|แอปแต่งรูป|เพิ่มชั้นป้องกัน แม้รหัสผ่านรั่วก็ยังเข้าบัญชีไม่ได้
ไวรัสคอมพิวเตอร์คืออะไร?|โปรแกรมอันตรายที่แพร่กระจายและสร้างความเสียหาย|ชิปความจำ|พัดลมระบายความร้อน|ไวรัสแอบติดไปกับไฟล์หรือโปรแกรมแล้วทำให้เครื่องเสียหาย
Antivirus ทำหน้าที่อะไร?|ตรวจจับและกำจัดมัลแวร์|เพิ่มความเร็วเน็ต|ชาร์จแบตเตอรี่|ช่วยสแกนหาโปรแกรมอันตรายและกำจัดก่อนสร้างความเสียหาย
ควรใช้รหัสผ่านเดียวกันทุกเว็บไซต์ไหม?|ไม่ควร ควรใช้ต่างกัน|ควร เพราะจำง่าย|ควรถ้าเป็นเว็บดัง|ถ้าเว็บหนึ่งรั่ว บัญชีอื่นจะถูกยึดตามไปด้วย
ข้อมูลใดไม่ควรโพสต์สาธารณะ?|เลขบัตรประชาชนและที่อยู่บ้าน|รูปอาหาร|เพลงที่ชอบ|ข้อมูลส่วนตัวอาจถูกนำไปสวมรอยหรือหลอกลวงได้
Firewall คืออะไร?|ระบบกรองการเชื่อมต่อเข้าออกเครือข่าย|กำแพงบ้าน|โปรแกรมเล่นเกม|Firewall ช่วยบล็อกการเชื่อมต่อที่น่าสงสัย
Ransomware ทำอะไร?|ล็อกไฟล์แล้วเรียกค่าไถ่|แสดงโฆษณา|เร่งความเร็วเครื่อง|เจ้าของไฟล์จะเปิดไม่ได้จนกว่าจะจ่ายเงิน ซึ่งไม่ควรจ่าย
ใช้ Wi-Fi สาธารณะควรระวังอะไร?|หลีกเลี่ยงทำธุรกรรมการเงิน|ปลอดภัยเสมอ|เข้าธนาคารได้ตามปกติ|ผู้ไม่หวังดีอาจดักข้อมูลในเครือข่ายเดียวกันได้
HTTPS ต่างจาก HTTP อย่างไร?|เข้ารหัสข้อมูลระหว่างทาง|โหลดเร็วกว่า|ฟรีเสมอ|HTTPS ช่วยให้คนกลางอ่านข้อมูลของเราไม่ได้
Social Engineering คืออะไร?|การหลอกล่อให้คนเปิดเผยข้อมูล|การเจาะระบบด้วยโค้ด|การซ่อมคอมพิวเตอร์|โจมตีที่ "คน" แทนที่จะโจมตีเครื่อง
White Hat Hacker คือใคร?|แฮกเกอร์ที่ทดสอบระบบโดยได้รับอนุญาต|โจรขโมยข้อมูล|ผู้สร้างไวรัส|ช่วยหาช่องโหว่เพื่อให้ระบบปลอดภัยขึ้น
มีคนโทรมาขอรหัส OTP ควรทำอย่างไร?|ไม่บอกและวางสาย|บอกให้เร็วที่สุด|ส่งรูปบัตรให้|OTP ห้ามบอกใคร แม้อ้างว่าเป็นธนาคารหรือตำรวจ
ทำไมต้องอัปเดตซอฟต์แวร์?|เพื่อแก้ช่องโหว่ความปลอดภัย|ทำให้เครื่องช้าลง|ไม่มีประโยชน์|การอัปเดตมักปิดช่องโหว่ที่แฮกเกอร์ใช้โจมตี
ได้ไฟล์ .exe แนบอีเมลจากคนแปลกหน้า ควรทำอย่างไร?|ไม่เปิดและลบทิ้ง|เปิดดูทันที|ส่งต่อให้เพื่อน|ไฟล์ .exe อาจเป็นมัลแวร์
Backup (สำรองข้อมูล) สำคัญเพราะอะไร?|กู้ข้อมูลได้เมื่อเครื่องพังหรือโดนล็อกไฟล์|ทำให้เน็ตเร็ว|ทำให้แบตอึด|มีสำเนาไว้อีกที่ ไม่ต้องกลัวข้อมูลหาย
Trojan (โทรจัน) คืออะไร?|โปรแกรมปลอมตัวเป็นของดีแต่แอบทำอันตราย|ม้าไม้โบราณ|โปรแกรมบีบอัดไฟล์|เหมือนม้าไม้เมืองทรอย ดูไม่อันตรายแต่ซ่อนภัยไว้ข้างใน
Brute Force คืออะไร?|การลองสุ่มรหัสผ่านทุกแบบจนเจอ|การส่งอีเมลหลอก|การล้างแคช|รหัสผ่านที่ยาวและซับซ้อนช่วยป้องกันได้
Password Manager ช่วยอะไร?|เก็บและสร้างรหัสผ่านที่แข็งแรง|เล่นเกมให้|ดาวน์โหลดเร็วขึ้น|ทำให้ใช้รหัสผ่านไม่ซ้ำกันได้โดยไม่ต้องจำทั้งหมด
สัญญาณของเว็บไซต์ปลอมคือข้อใด?|ชื่อโดเมนสะกดแปลกๆ|โหลดเร็ว|ภาพสวย|เว็บปลอมมักเลียนแบบชื่อจริงแต่สะกดผิดเล็กน้อย
Spyware คืออะไร?|โปรแกรมแอบสอดแนมกิจกรรมของผู้ใช้|โปรแกรมแต่งเสียง|โปรแกรมตัดต่อวิดีโอ|อาจแอบขโมยรหัสผ่านและข้อมูลส่วนตัว
Deepfake คืออะไร?|ภาพหรือเสียงปลอมที่สร้างด้วย AI|ภาพความละเอียดสูง|เกมสามมิติ|ควรตรวจสอบแหล่งที่มาก่อนเชื่อวิดีโอที่น่าตกใจ
ควรแชร์รหัสผ่านให้เพื่อนสนิทไหม?|ไม่ควร|ควร ถ้าสนิทจริง|ควร ถ้าเปลี่ยนทีหลัง|รหัสผ่านเป็นความลับส่วนตัว ไม่ควรให้ใคร
Malware ย่อมาจากอะไร?|Malicious Software|Main Software|Many Wares|แปลว่าซอฟต์แวร์ประสงค์ร้าย
ถูกกลั่นแกล้งออนไลน์ (Cyberbullying) ควรทำอย่างไร?|เก็บหลักฐานและแจ้งผู้ใหญ่หรือแพลตฟอร์ม|โต้ตอบด้วยคำหยาบ|เงียบและทนไว้|หลักฐานช่วยให้แพลตฟอร์มและผู้ใหญ่ช่วยจัดการได้
แอปไฟฉายขอสิทธิ์อ่านรายชื่อผู้ติดต่อ ควรทำอย่างไร?|ปฏิเสธสิทธิ์|อนุญาตทั้งหมด|ลบเครื่อง|แอปควรขอสิทธิ์เท่าที่จำเป็นกับการทำงานเท่านั้น
Encryption (การเข้ารหัส) คืออะไร?|แปลงข้อมูลให้คนไม่มีกุญแจอ่านไม่ได้|ลบไฟล์ถาวร|บีบอัดไฟล์|แม้ข้อมูลถูกขโมยไป ก็อ่านไม่ออกถ้าไม่มีกุญแจ
Botnet คืออะไร?|เครือข่ายเครื่องที่ถูกยึดและสั่งการจากไกล|เครือข่ายร้านค้า|เกมออนไลน์|เครื่องที่ติดมัลแวร์อาจถูกใช้โจมตีคนอื่นโดยไม่รู้ตัว`.split(
      "\n",
    );
  const PU = [
    ["🤸", "โดดตบ 5 ครั้ง"],
    ["🏋️", "ลุกนั่ง 5 ครั้ง"],
    ["🎤", "ร้องเพลง 20 วินาที"],
    ["💃", "เต้น 15 วินาที"],
    ["🤖", "ทำท่าหุ่นยนต์ 10 วินาที"],
    ["🗣️", "บอกรักเเฟน,เพือน 5 ครั้ง"],
    ["🦩", "ยืนขาเดียว 10 วินาที"],
    ["🤪", "ทำหน้าตลก 10 วินาที"],
    ["🔊", "ทำเสียงหุ่นยนต์ 15 วินาที"],
    ["🐸", "กระโดด 5 ครั้ง"],
  ];

  /* ---------- audio ---------- */
  let AC,
    mg,
    sg,
    muted = false,
    vol = { m: 0.5, s: 0.7 },
    ms = 0;
  try {
    Object.assign(vol, JSON.parse(localStorage.hmVol || "{}"));
  } catch (e) {}
  function initA() {
    if (AC) {
      if (AC.state === "suspended") AC.resume();
      return;
    }
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      mg = AC.createGain();
      sg = AC.createGain();
      mg.connect(AC.destination);
      sg.connect(AC.destination);
      setV();
    } catch (e) {
      AC = null;
    }
  }
  function setV() {
    if (!AC) return;
    mg.gain.value = muted ? 0 : vol.m * 0.3;
    sg.gain.value = muted ? 0 : vol.s * 0.5;
  }
  function tone(f, d, ty, v, f2, at, dst) {
    if (!AC) return;
    const t = AC.currentTime + (at || 0),
      o = AC.createOscillator(),
      n = AC.createGain();
    o.type = ty || "square";
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    n.gain.setValueAtTime(v || 0.3, t);
    n.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(n);
    n.connect(dst || sg);
    o.start(t);
    o.stop(t + d + 0.03);
  }
  const seq = (a, d, ty, v) =>
    a.forEach((f, i) => tone(f, d, ty, v, 0, i * d * 0.9));
  const S = {
    step: () => tone(90, 0.05, "triangle", 0.12, 60),
    code: () => tone(flip ? 1100 : 800, 0.05, "square", 0.1),
    pick: () => seq([500, 750], 0.07, "triangle", 0.25),
    ok: () => seq([523, 784, 1046], 0.1, "triangle", 0.3),
    bad: () => tone(200, 0.4, "sawtooth", 0.3, 70),
    emp: () => {
      tone(200, 0.6, "sawtooth", 0.3, 1600);
      seq([784, 988, 1318, 1568], 0.09, "triangle", 0.3);
    },
    tick: () => tone(1000, 0.04, "square", 0.12),
    hit: () => {
      tone(150, 0.35, "sawtooth", 0.4, 40);
      tone(900, 0.15, "square", 0.25, 200);
    },
    shoot: () => tone(1200, 0.18, "sawtooth", 0.25, 200),
    zap: () => {
      for (let i = 0; i < 6; i++)
        tone(300 + rnd(900), 0.06, "square", 0.25, 0, i * 0.05);
    },
    win: () =>
      seq([523, 659, 784, 1046, 784, 1046, 1318], 0.14, "triangle", 0.35),
    lose: () => seq([392, 330, 262, 196, 131], 0.2, "sawtooth", 0.3),
    menu: () => tone(700, 0.06, "square", 0.15, 1000),
    empty: () => tone(150, 0.08, "square", 0.2),
    alarm: () => seq([500, 350, 500, 350], 0.1, "sawtooth", 0.25),
  };
  const snd = (n) => {
    try {
      S[n]();
    } catch (e) {}
  };
  const BS = [55, 55, 82.4, 55, 73.4, 73.4, 98, 73.4],
    AR = [220, 262, 330, 392, 294, 349, 440, 349];
  function music() {
    const c = state === "play" && chase;
    if (AC && !muted && state !== "pause") {
      const i = ms % 8;
      tone(BS[i] * (c ? 2 : 1), 0.2, "sawtooth", 0.5, 0, 0, mg);
      if (c || ms % 2)
        tone(
          AR[(ms * (c ? 3 : 1)) % 8] * (c ? 2 : 1),
          0.12,
          "square",
          0.18,
          0,
          0,
          mg,
        );
      if (ms % 4 === 0) tone(60, 0.15, "sine", 0.8, 30, 0, mg);
    }
    ms++;
    setTimeout(music, c ? 130 : 210);
  }
  music();

  /* ---------- maze ---------- */
  const solid = (x, y) =>
    x < 0 || y < 0 || x >= C || y >= R || grid[y][x] === 1;
  function bfs(sx, sy, tx, ty) {
    const prv = new Int16Array(C * R).fill(-1),
      s = sy * C + sx,
      t = ty * C + tx,
      q = [s];
    prv[s] = s;
    for (let i = 0; i < q.length; i++) {
      const c = q[i];
      if (c === t) break;
      const x = c % C,
        y = (c / C) | 0;
      for (const [a, b] of D) {
        const nx = x + a,
          ny = y + b;
        if (solid(nx, ny)) continue;
        const n = ny * C + nx;
        if (prv[n] >= 0) continue;
        prv[n] = c;
        q.push(n);
      }
    }
    if (prv[t] < 0) return null;
    const p = [];
    let c = t;
    while (c !== s) {
      p.push(c);
      c = prv[c];
    }
    return p.reverse();
  }
  function metrics() {
    T = Math.max(26, Math.min(46, Math.floor(Math.min(W, H) / 11)));
  }
  function layout() {
    W = innerWidth;
    H = innerHeight;
    bg.width = cv.width = W;
    bg.height = cv.height = H;
    drops = Array.from({ length: Math.ceil(W / 16) }, () => rnd(H / 16));
    if (grid.length) {
      buildM();
      cam(1);
    }
  }
  function buildM() {
    metrics();
    mz = document.createElement("canvas");
    mz.width = C * T;
    mz.height = R * T;
    const m = mz.getContext("2d");
    m.fillStyle = "rgba(3,14,8,.85)";
    m.fillRect(0, 0, mz.width, mz.height);
    m.strokeStyle = "rgba(0,255,102,.12)";
    m.lineWidth = 1;
    for (let y = 0; y < R; y++)
      for (let x = 0; x < C; x++) {
        if (grid[y][x]) continue;
        if ((x * 7 + y * 13) % 6 === 0) {
          m.beginPath();
          m.moveTo(x * T + 4, y * T + T / 2);
          m.lineTo(x * T + T / 2, y * T + T / 2);
          m.lineTo(x * T + T / 2, y * T + T - 4);
          m.stroke();
        }
      }
    for (let y = 0; y < R; y++)
      for (let x = 0; x < C; x++)
        if (grid[y][x]) {
          m.fillStyle = "#04180c";
          m.fillRect(x * T, y * T, T, T);
        }
    m.strokeStyle = "#00ff66";
    m.lineWidth = 2;
    m.shadowColor = "#00ff66";
    m.shadowBlur = 8;
    m.beginPath();
    for (let y = 0; y < R; y++)
      for (let x = 0; x < C; x++)
        if (grid[y][x])
          for (const [a, b] of D) {
            const nx = x + a,
              ny = y + b;
            if (nx >= 0 && ny >= 0 && nx < C && ny < R && !grid[ny][nx]) {
              const X = x * T,
                Y = y * T;
              if (a === 1) {
                m.moveTo(X + T, Y);
                m.lineTo(X + T, Y + T);
              } else if (a === -1) {
                m.moveTo(X, Y);
                m.lineTo(X, Y + T);
              } else if (b === 1) {
                m.moveTo(X, Y + T);
                m.lineTo(X + T, Y + T);
              } else {
                m.moveTo(X, Y);
                m.lineTo(X + T, Y);
              }
            }
          }
    m.stroke();
  }
  function init() {
    C = W >= H ? 35 : 25;
    R = W >= H ? 25 : 35;
    grid = Array.from({ length: R }, () => Array(C).fill(1));
    const st = [[1, 1]];
    grid[1][1] = 0;
    while (st.length) {
      const [x, y] = st[st.length - 1];
      const d = D.map(([a, b]) => [a * 2, b * 2]).filter(([a, b]) => {
        const nx = x + a,
          ny = y + b;
        return (
          nx > 0 && ny > 0 && nx < C - 1 && ny < R - 1 && grid[ny][nx] === 1
        );
      });
      if (!d.length) {
        st.pop();
        continue;
      }
      const [a, b] = d[rnd(d.length)];
      grid[y + b / 2][x + a / 2] = 0;
      grid[y + b][x + a] = 0;
      st.push([x + a, y + b]);
    }
    // Pac-Man style loops
    for (let y = 1; y < R - 1; y++)
      for (let x = 1; x < C - 1; x++)
        if (
          grid[y][x] === 1 &&
          Math.random() < 0.32 &&
          ((x % 2 === 0 && y % 2 === 1 && !grid[y][x - 1] && !grid[y][x + 1]) ||
            (x % 2 === 1 && y % 2 === 0 && !grid[y - 1][x] && !grid[y + 1][x]))
        )
          grid[y][x] = 0;
    // centre room
    const mx = C >> 1,
      my = R >> 1;
    for (let y = my - 1; y <= my + 1; y++)
      for (let x = mx - 3; x <= mx + 3; x++)
        if (x > 0 && y > 0 && x < C - 1 && y < R - 1) grid[y][x] = 0;
    buildM();
    dots = new Uint8Array(C * R);
    total = 0;
    for (let y = 1; y < R - 1; y++)
      for (let x = 1; x < C - 1; x++)
        if (
          !grid[y][x] &&
          !(x === 1 && y === 1) &&
          !(Math.abs(x - mx) <= 3 && Math.abs(y - my) <= 1)
        ) {
          dots[y * C + x] = 1 + ((x + y) & 1);
          total++;
        }
    const fl = [];
    for (let y = 1; y < R - 1; y++)
      for (let x = 1; x < C - 1; x++)
        if (!grid[y][x] && Math.hypot(x - 1, y - 1) > 4) fl.push([x, y]);
    fl.sort(() => Math.random() - 0.5);
    items = [];
    const put = (t, c) => {
      if (c) items.push({ t, x: c[0] + 0.5, y: c[1] + 0.5 });
    };
    const gi = fl.findIndex(([x, y]) => Math.hypot(x - 1, y - 1) < 12);
    put("gun", gi >= 0 ? fl.splice(gi, 1)[0] : fl.pop());
    for (let i = 0; i < 6; i++) put("ammo", fl.pop());
    for (let i = 0; i < 5; i++) put("heart", fl.pop());
    P = {
      x: 1.5,
      y: 1.5,
      hp: MAXHP,
      ammo: 0,
      gun: false,
      fx: 1,
      fy: 0,
      inv: 0,
      fcd: 0,
      mv: false,
      boost: 0,
    };
    pol = [
      [-2, 0],
      [2, 0],
      [0, -1],
      [0, 1],
    ].map(([a, b], i) => ({
      x: mx + a + 0.5,
      y: my + b + 0.5,
      path: null,
      mode: 0,
      mem: 0,
      t: 0,
      stun: 0,
      pause: 1 + i * 1.6,
      dir: 1,
    }));
    bul = [];
    pts = [];
    rings = [];
    time = 0;
    score = 0;
    got = 0;
    lvl = 0;
    bits = "";
    qn = 0;
    qAt = 25 + rnd(15);
    toastT = 0;
    chase = false;
    cam(1);
  }
  function cam(snap) {
    const mw = C * T,
      mh = R * T,
      tx = P.x * T - W / 2,
      ty = P.y * T - H / 2 + 22;
    const nx = mw <= W ? (mw - W) / 2 : Math.max(0, Math.min(mw - W, tx)),
      ny = mh <= H ? (mh - H) / 2 : Math.max(-24, Math.min(mh - H + 10, ty));
    if (snap) {
      cx = nx;
      cy = ny;
    } else {
      cx += (nx - cx) * 0.15;
      cy += (ny - cy) * 0.15;
    }
  }

  /* ---------- helpers ---------- */
  const hit = (x, y, r) =>
    solid(Math.floor(x - r), Math.floor(y - r)) ||
    solid(Math.floor(x + r), Math.floor(y - r)) ||
    solid(Math.floor(x - r), Math.floor(y + r)) ||
    solid(Math.floor(x + r), Math.floor(y + r));
  function mv(e, dx, dy, r = 0.3) {
    e.x += dx;
    if (hit(e.x, e.y, r)) e.x -= dx;
    e.y += dy;
    if (hit(e.x, e.y, r)) e.y -= dy;
  }
  function burst(o, c, n = 14, sp = 3) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28,
        v = Math.random() * sp;
      pts.push({
        x: o.x,
        y: o.y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        l: 0.4 + Math.random() * 0.5,
        c,
      });
    }
  }
  const ftxt = (o, t, c) =>
    pts.push({ x: o.x, y: o.y - 0.4, vx: 0, vy: -1.2, l: 1, c, t });
  function toast(m) {
    const e = $("#toast");
    e.textContent = m;
    e.classList.remove("hide");
    toastT = 2.4;
  }
  function flash(c, o = 0.5) {
    const f = $("#flash");
    f.style.transition = "none";
    f.style.background = c;
    f.style.opacity = o;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        f.style.transition = "opacity .45s";
        f.style.opacity = 0;
      }),
    );
  }
  function glitch(cb) {
    const f = $("#fx");
    f.classList.remove("on");
    void f.offsetWidth;
    f.classList.add("on");
    setTimeout(cb, 250);
  }
  function fire() {
    if (state !== "play") return;
    if (!P.gun) {
      toast("ยังไม่มีปืน! หาปืนช็อต 🔫 ในแมพ");
      snd("empty");
      return;
    }
    if (P.ammo <= 0) {
      toast("กระสุนหมด! หาแบตเตอรี่ ⚡ เพิ่ม");
      snd("empty");
      return;
    }
    if (P.fcd > 0) return;
    P.ammo--;
    P.fcd = 0.35;
    bul.push({ x: P.x, y: P.y, dx: P.fx, dy: P.fy, l: 1.2 });
    snd("shoot");
    burst(P, "#88ffff", 6);
  }

  /* ---------- update ---------- */
  function upd(dt) {
    time += dt;
    P.inv -= dt;
    P.fcd -= dt;
    P.boost -= dt;
    const mx0 = (K.KeyD ? 1 : 0) - (K.KeyA ? 1 : 0),
      my0 = (K.KeyS ? 1 : 0) - (K.KeyW ? 1 : 0);
    P.mv = !!(mx0 || my0);
    if (P.mv) {
      const l = Math.hypot(mx0, my0),
        mx = mx0 / l,
        my = my0 / l,
        sp = (P.boost > 0 ? 7.4 : 4.8) * dt;
      P.fx = mx;
      P.fy = my;
      mv(P, mx * sp, my * sp);
      stepT -= dt;
      if (stepT <= 0) {
        snd("step");
        stepT = P.boost > 0 ? 0.18 : 0.28;
      }
      if (P.boost > 0)
        pts.push({ x: P.x, y: P.y, vx: 0, vy: 0, l: 0.35, c: "#44ddff" });
    }
    // collect code
    const ti = (P.y | 0) * C + (P.x | 0),
      dv = dots[ti];
    if (dv) {
      dots[ti] = 0;
      got++;
      score += 10;
      flip ^= 1;
      snd("code");
      const b = dv - 1;
      bits = (bits + b).slice(-8);
      pts.push({
        x: (P.x | 0) + 0.5,
        y: (P.y | 0) + 0.5,
        vx: 0,
        vy: -1.5,
        l: 0.5,
        c: "#00ff66",
        t: "" + b,
      });
      burst({ x: (P.x | 0) + 0.5, y: (P.y | 0) + 0.5 }, "#00ff66", 4, 1.5);
      if (got >= total) {
        win();
        return;
      }
      const lv = Math.floor((got / total) * 4);
      if (lv > lvl) {
        lvl = lv;
        toast("⚠️ ตำรวจวิ่งเร็วขึ้น!");
        snd("alarm");
        flash("#ff3333");
      }
      if (++qn >= qAt && !quizOn) {
        qn = 0;
        qAt = 30 + rnd(21);
        openQuiz();
      }
    }
    items = items.filter((it) => {
      if (Math.hypot(it.x - P.x, it.y - P.y) > 0.55) return true;
      if (it.t === "gun") {
        P.gun = true;
        P.ammo = Math.min(9, P.ammo + 3);
        snd("pick");
        burst(it, "#88ffff", 20);
        toast("🔫 ได้ปืนช็อตไฟฟ้า! กด SPACE เพื่อยิง");
      } else if (it.t === "ammo") {
        if (P.ammo >= 9) return true;
        P.ammo = Math.min(9, P.ammo + 2);
        snd("pick");
        burst(it, "#88ffff", 12);
        toast("⚡ กระสุน +2");
      } else {
        if (P.hp >= MAXHP) return true;
        P.hp = Math.min(MAXHP, P.hp + 30);
        snd("pick");
        burst(it, "#00ff66", 12);
        toast("💚 HP +30");
      }
      return false;
    });
    bul = bul.filter((b) => {
      b.l -= dt;
      if (b.l <= 0) return false;
      for (let i = 0; i < 3; i++) {
        b.x += (b.dx * 11 * dt) / 3;
        b.y += (b.dy * 11 * dt) / 3;
        if (solid(Math.floor(b.x), Math.floor(b.y))) {
          burst(b, "#88ffff", 8);
          return false;
        }
        for (const e of pol)
          if (e.stun <= 0 && Math.hypot(e.x - b.x, e.y - b.y) < 0.55) {
            e.stun = 5;
            e.path = null;
            e.mode = 0;
            score += 50;
            snd("zap");
            burst(e, "#88ffff", 26, 4);
            burst(e, "#ffff66", 10, 3);
            ftxt(e, "STUN!", "#88ffff");
            return false;
          }
      }
      return true;
    });
    chase = false;
    for (const e of pol) {
      if (e.stun > 0) {
        e.stun -= dt;
        continue;
      }
      if (e.pause > 0) {
        e.pause -= dt;
        continue;
      }
      const dist = Math.hypot(P.x - e.x, P.y - e.y);
      e.t -= dt;
      if (e.t <= 0) {
        e.t = 0.3;
        const pt = bfs(e.x | 0, e.y | 0, P.x | 0, P.y | 0);
        if (pt && pt.length <= 12 && dist < 10) {
          e.mode = 1;
          e.mem = 3;
          e.path = pt;
        } else if (e.mode === 1) {
          e.mem -= 0.3;
          if (e.mem <= 0) {
            e.mode = 0;
            e.path = null;
          } else if (pt && pt.length <= 18) e.path = pt;
        }
        if (e.mode === 0 && (!e.path || !e.path.length)) {
          const tx = 1 + rnd(C - 2),
            ty = 1 + rnd(R - 2);
          if (!grid[ty][tx]) e.path = bfs(e.x | 0, e.y | 0, tx, ty);
        }
      }
      if (e.mode === 1) chase = true;
      if (e.path && e.path.length) {
        const c = e.path[0],
          tx = (c % C) + 0.5,
          ty = ((c / C) | 0) + 0.5,
          dx = tx - e.x,
          dy = ty - e.y,
          d = Math.hypot(dx, dy),
          sp =
            (e.mode ? 3 + 1.3 * (got / total) : 2 + 0.6 * (got / total)) * dt;
        if (d <= sp) {
          e.x = tx;
          e.y = ty;
          e.path.shift();
        } else {
          e.x += (dx / d) * sp;
          e.y += (dy / d) * sp;
        }
      }
      if (dist < 0.65 && P.inv <= 0) {
        P.hp = Math.max(0, P.hp - 20);
        P.inv = 1.5;
        e.pause = 1.2;
        e.path = null;
        sh = 10;
        snd("hit");
        flash("#ff0000");
        burst(P, "#ff3333", 24, 4);
        ftxt(P, "-20", "#ff5555");
        const l = dist || 1;
        mv(P, ((P.x - e.x) / l) * 0.6, ((P.y - e.y) / l) * 0.6);
        if (P.hp <= 0) {
          lose();
          return;
        }
      }
    }
    pts = pts.filter((p) => {
      p.l -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.g || 0) * dt;
      return p.l > 0;
    });
    rings = rings.filter((r) => {
      r.l -= dt;
      r.r += dt * 16;
      return r.l > 0;
    });
    sh = Math.max(0, sh - dt * 30);
    cam();
    if (toastT > 0) {
      toastT -= dt;
      if (toastT <= 0) $("#toast").classList.add("hide");
    }
    hudT -= dt;
    if (hudT <= 0) {
      hudT = 0.08;
      hud();
    }
  }
  function hud() {
    $("#hp").style.width = (P.hp / MAXHP) * 100 + "%";
    $("#kc").textContent = `💾 ${got}/${total} ${bits}`;
    $("#qc").textContent =
      (P.gun ? `🔫 ⚡${P.ammo}` : "🔫 ไม่มีปืน") +
      (P.boost > 0 ? ` 🚀${Math.ceil(P.boost)}s` : "");
    $("#sc").textContent = `SCORE ${score} | BEST ${best}`;
  }

  /* ---------- characters ---------- */
  function hacker(c, x, y, s, m, t) {
    const u = s / 10,
      w = m === "walk" ? Math.sin(t * 12) : 0,
      b = m === "walk" ? -Math.abs(w) * 0.25 : Math.sin(t * 3) * 0.15,
      gc = m === "hurt" ? "#ff3333" : "#00ff66";
    c.save();
    c.translate(x, y);
    c.scale(u, u);
    if (m === "lose") {
      c.rotate(0.2);
      c.translate(0.5, 0.3);
    }
    c.lineCap = "round";
    c.shadowColor = gc;
    c.shadowBlur = 12;
    c.lineWidth = 0.22;
    c.strokeStyle = gc;
    c.fillStyle = "#0b0b0b";
    c.fillRect(-1.6 + w * 0.5, -1.6, 1.2, 1.6);
    c.fillRect(0.4 - w * 0.5, -1.6, 1.2, 1.6);
    const arm = (x1, y1, x2, y2) => {
      c.strokeStyle = gc;
      c.lineWidth = 1.25;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
      c.strokeStyle = "#0b0b0b";
      c.lineWidth = 0.95;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    };
    if (m === "win") {
      const j = Math.sin(t * 8) * 0.6;
      arm(-2.2, -4.6, -3.4, -8.6 + j);
      arm(2.2, -4.6, 3.4, -8.6 - j);
    } else if (m === "lose") {
      arm(-2.2, -4.4, -2.8, -1.2);
      arm(2.2, -4.4, 2.8, -1.2);
    } else {
      arm(-2.2, -4.6 + b, -2.8, -2.8 - w * 0.5);
      arm(2.2, -4.6 + b, 2.8, -2.8 + w * 0.5);
    }
    c.lineWidth = 0.22;
    c.strokeStyle = gc;
    c.fillStyle = "#0b0b0b";
    c.beginPath();
    c.moveTo(-2.7, -1.5);
    c.lineTo(-2.1, -5.4 + b);
    c.lineTo(2.1, -5.4 + b);
    c.lineTo(2.7, -1.5);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.moveTo(0, -5.2 + b);
    c.lineTo(0, -1.7);
    c.stroke();
    c.beginPath();
    c.arc(0, -6.6 + b, 2.7, 0, 7);
    c.fill();
    c.stroke();
    c.shadowBlur = 0;
    c.fillStyle = "#f5f5f5";
    c.beginPath();
    c.ellipse(0, -6.4 + b, 1.6, 2, 0, 0, 7);
    c.fill();
    c.fillStyle = "rgba(255,120,120,.7)";
    c.beginPath();
    c.arc(-1, -6 + b, 0.3, 0, 7);
    c.arc(1, -6 + b, 0.3, 0, 7);
    c.fill();
    c.strokeStyle = "#000";
    c.lineWidth = 0.25;
    c.beginPath();
    c.moveTo(-1.2, -7 + b);
    c.lineTo(-0.3, -6.6 + b);
    c.moveTo(1.2, -7 + b);
    c.lineTo(0.3, -6.6 + b);
    c.stroke();
    c.fillStyle = "#000";
    c.beginPath();
    c.moveTo(-1.3, -5.9 + b);
    c.quadraticCurveTo(0, -6.6 + b, 1.3, -5.9 + b);
    c.quadraticCurveTo(0, -5.7 + b, -1.3, -5.9 + b);
    c.fill();
    c.beginPath();
    c.ellipse(0, -5 + b, 0.22, 0.4, 0, 0, 7);
    c.fill();
    c.restore();
  }
  function cop(c, x, y, s, t, st) {
    const u = s / 10,
      w = st ? 0 : Math.sin(t * 10) * 0.7;
    c.save();
    c.translate(x, y);
    c.scale(u, u);
    c.lineWidth = 0.22;
    c.shadowColor = "#39f";
    c.shadowBlur = 8;
    c.fillStyle = "#1b2f66";
    c.strokeStyle = "#3399ff";
    c.fillRect(-1.5 + w * 0.4, -1.6, 1.2, 1.6);
    c.fillRect(0.3 - w * 0.4, -1.6, 1.2, 1.6);
    c.beginPath();
    c.rect(-2.4, -5.6, 4.8, 4.2);
    c.fill();
    c.stroke();
    c.fillStyle = "#ffd23f";
    c.fillRect(0.7, -4.8, 0.9, 0.9);
    c.fillStyle = "#000";
    c.fillRect(-2.4, -2.7, 4.8, 0.5);
    c.fillStyle = "#f2c9a0";
    c.beginPath();
    c.arc(0, -6.5, 1.9, 0, 7);
    c.fill();
    c.fillStyle = "#16224a";
    c.fillRect(-2.2, -8.6, 4.4, 1.5);
    c.fillRect(-2.7, -7.3, 5.4, 0.5);
    c.fillStyle = "#111";
    c.fillRect(-1, -6.7, 0.5, 0.5);
    c.fillRect(0.5, -6.7, 0.5, 0.5);
    const r = Math.sin(t * 12) > 0,
      sc = r ? "#ff3333" : "#3399ff";
    c.fillStyle = sc;
    c.shadowColor = sc;
    c.shadowBlur = 18;
    c.fillRect(-0.8, -9.5, 1.6, 0.9);
    c.globalAlpha = 0.2;
    c.beginPath();
    c.arc(0, -9, 3.6, 0, 7);
    c.fill();
    c.globalAlpha = 1;
    if (st) {
      c.strokeStyle = "#88ffff";
      c.shadowColor = "#88ffff";
      c.lineWidth = 0.2;
      for (let k = 0; k < 3; k++) {
        c.beginPath();
        let ax = -3,
          ay = -9 + k * 3;
        c.moveTo(ax, ay);
        for (let j = 0; j < 5; j++) {
          ax += 1.2;
          ay += (Math.random() - 0.5) * 2;
          c.lineTo(ax, ay);
        }
        c.stroke();
      }
    }
    c.restore();
  }

  /* ---------- draw ---------- */
  function draw() {
    g.clearRect(0, 0, W, H);
    if (!live || !mz) return;
    g.save();
    g.translate(
      -Math.round(cx) + (sh > 0 ? rnd(sh * 2) - sh : 0),
      -Math.round(cy) + (sh > 0 ? rnd(sh * 2) - sh : 0),
    );
    g.drawImage(mz, 0, 0);
    g.textAlign = "center";
    const x0 = Math.max(0, Math.floor(cx / T)),
      x1 = Math.min(C - 1, Math.ceil((cx + W) / T)),
      y0 = Math.max(0, Math.floor(cy / T)),
      y1 = Math.min(R - 1, Math.ceil((cy + H) / T));
    g.font = `bold ${T * 0.34}px monospace`;
    g.fillStyle = "#00ff66";
    g.shadowColor = "#00ff66";
    g.shadowBlur = 6;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const v = dots[y * C + x];
        if (v) {
          g.globalAlpha = 0.65 + 0.35 * Math.sin(t0 * 4 + x * 0.7 + y);
          g.fillText(
            v === 1 ? "0" : "1",
            (x + 0.5) * T,
            (y + 0.5) * T + T * 0.12,
          );
        }
      }
    g.globalAlpha = 1;
    g.shadowBlur = 0;
    for (const it of items) {
      const X = it.x * T,
        Y = it.y * T + Math.sin(t0 * 4 + it.x) * T * 0.05;
      g.shadowColor = "#8ff";
      g.shadowBlur = 12;
      g.font = `${T * 0.55}px serif`;
      g.fillText(
        it.t === "gun" ? "🔫" : it.t === "ammo" ? "⚡" : "💚",
        X,
        Y + T * 0.2,
      );
      g.shadowBlur = 0;
    }
    for (const e of pol)
      cop(g, e.x * T, e.y * T + T * 0.45, T * 0.95, t0, e.stun > 0);
    if (
      (P.inv <= 0 || Math.floor(t0 * 14) % 2) &&
      !(endMode === "lose" && endT > 0.25)
    ) {
      const X = P.x * T,
        Y = P.y * T;
      if (P.boost > 0) {
        g.strokeStyle = "#44ddff";
        g.shadowColor = "#44ddff";
        g.shadowBlur = 18;
        g.lineWidth = 3;
        g.globalAlpha = 0.6;
        g.beginPath();
        g.arc(X, Y, T * (0.55 + Math.sin(t0 * 14) * 0.06), 0, 7);
        g.stroke();
        g.globalAlpha = 1;
        g.shadowBlur = 0;
      }
      hacker(
        g,
        X,
        Y +
          T * 0.45 -
          (endMode === "win" ? Math.abs(Math.sin(t0 * 7)) * T * 0.3 : 0),
        T * 0.95,
        endMode === "win"
          ? "win"
          : endMode === "lose"
            ? "hurt"
            : P.inv > 0.9
              ? "hurt"
              : P.mv
                ? "walk"
                : "idle",
        t0,
      );
      if (P.gun) {
        g.fillStyle = "#88ffff";
        g.shadowColor = "#88ffff";
        g.shadowBlur = 8;
        g.fillRect(
          X + P.fx * T * 0.35 - 3,
          Y + P.fy * T * 0.35 - T * 0.05 - 3,
          6,
          6,
        );
        g.shadowBlur = 0;
      }
    }
    for (const b of bul) {
      const X = b.x * T,
        Y = b.y * T;
      g.shadowColor = "#8ff";
      g.shadowBlur = 14;
      g.strokeStyle = "#cff";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(X, Y);
      for (let i = 1; i < 5; i++)
        g.lineTo(
          X - b.dx * i * T * 0.12 + (Math.random() - 0.5) * T * 0.2,
          Y - b.dy * i * T * 0.12 + (Math.random() - 0.5) * T * 0.2,
        );
      g.stroke();
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(X, Y, T * 0.1, 0, 7);
      g.fill();
      g.shadowBlur = 0;
    }
    for (const r of rings) {
      if (r.r <= 0) continue;
      g.globalAlpha = Math.max(0, r.l / 0.9);
      g.strokeStyle = "#44ffff";
      g.shadowColor = "#44ffff";
      g.shadowBlur = 20;
      g.lineWidth = 5;
      g.beginPath();
      g.arc(r.x * T, r.y * T, r.r * T, 0, 7);
      g.stroke();
    }
    g.shadowBlur = 0;
    for (const p of pts) {
      g.globalAlpha = Math.min(1, p.l * 2);
      g.fillStyle = p.c;
      if (p.t !== undefined) {
        g.font = `bold ${T * 0.5}px monospace`;
        g.fillText(p.t, p.x * T, p.y * T);
      } else g.fillRect(p.x * T - 2, p.y * T - 2, 4, 4);
    }
    g.globalAlpha = 1;
    g.restore();
  }
  const CH = "01010101アイウエオカキク<>{}#$%&";
  function rain() {
    bx.fillStyle = "rgba(5,5,5,.12)";
    bx.fillRect(0, 0, W, H);
    bx.font = "16px monospace";
    for (let i = 0; i < drops.length; i++) {
      bx.fillStyle = Math.random() < 0.04 ? "#cfc" : "#0a7a3a";
      bx.fillText(CH[rnd(CH.length)], i * 16, drops[i] * 16);
      if (drops[i] * 16 > H && Math.random() > 0.97) drops[i] = 0;
      drops[i]++;
    }
  }
  function hero(id, m) {
    const c = $("#" + id),
      x = c.getContext("2d");
    x.clearRect(0, 0, 160, 200);
    hacker(x, 80, 190, 170, m, t0);
  }
  let last = 0,
    tk = 0;
  function loop(ts) {
    try {
      const dt = Math.min(0.05, (ts - last) / 1000 || 0);
      last = ts;
      t0 += dt;
      if (state === "play") upd(dt);
      else if (state === "quiz") quizTick(dt);
      else if (state === "end" && endMode) endUpd(dt);
      draw();
      if (rf++ % 3 === 0) rain();
      if (scr === "menu") hero("hero1", "idle");
      else if (scr === "over") hero("hero2", "lose");
      else if (scr === "win") hero("hero3", "win");
    } catch (e) {
      console.error(e);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- flow ---------- */
  function show(id) {
    scr = id;
    $$(".scr").forEach((e) => e.classList.toggle("hide", e.id !== id));
  }
  const touch =
    matchMedia("(pointer:coarse)").matches || "ontouchstart" in window;
  function hudShow(b) {
    $("#hud").classList.toggle("hide", !b);
    $("#dpad").classList.toggle("hide", !(b && touch));
    $("#fire").classList.toggle("hide", !(b && touch));
    if (!b) $("#toast").classList.add("hide");
  }
  function saveBest() {
    if (score > best) {
      best = score;
      try {
        localStorage.hmBest = best;
      } catch (e) {}
    }
    $("#best").textContent = "BEST SCORE: " + best;
  }
  function begin() {
    endMode = "";
    cv.style.filter = "";
    quizOn = false;
    init();
    live = true;
    state = "play";
    show(null);
    hudShow(true);
    hud();
  }
  function lose() {
    state = "end";
    endMode = "lose";
    endT = 0;
    fwT = 0;
    sirK = -1;
    quizOn = false;
    snd("lose");
    saveBest();
    sh = 28;
    flash("#ff0000");
    hud();
    burst(P, "#ff3333", 70, 7);
    for (let i = 0; i < 24; i++)
      pts.push({
        x: P.x,
        y: P.y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 5,
        l: 1.6,
        c: "#ff3333",
        t: "" + rnd(2),
        g: 8,
      });
    ftxt(P, "CAUGHT!", "#ff3333");
    cv.style.filter = "grayscale(1) brightness(.7)";
    $("#os").textContent =
      `เก็บโค้ดได้ ${got}/${total} | คะแนน ${score} | BEST ${best}`;
    setTimeout(() => {
      if (state === "end")
        glitch(() => {
          hudShow(false);
          show("over");
        });
    }, 1700);
  }
  function win() {
    state = "end";
    endMode = "win";
    endT = 0;
    fwT = 0;
    quizOn = false;
    P.inv = 0;
    for (const e of pol) {
      e.stun = 99;
      e.path = null;
    }
    score += 1000 + Math.max(0, 600 - Math.floor(time)) * 3;
    saveBest();
    snd("win");
    hud();
    flash("#00ff66");
    rings.push({ x: P.x, y: P.y, r: 0, l: 0.9 });
    burst(P, "#00ff66", 80, 8);
    $("#ws").textContent =
      `เก็บโค้ดครบ ${total} ตัว! คะแนน ${score} | เวลา ${Math.floor(time)} วินาที | BEST ${best}`;
    setTimeout(() => {
      if (state === "end")
        glitch(() => {
          hudShow(false);
          show("win");
        });
    }, 1700);
  }
  function firework() {
    const x = (cx + W * (0.15 + Math.random() * 0.7)) / T,
      y = (cy + H * (0.15 + Math.random() * 0.5)) / T,
      c = ["#00ff66", "#44ffff", "#ffff66", "#ff66ff", "#ff9933"][rnd(5)];
    snd("pick");
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * 6.283,
        v = 3 + Math.random() * 2;
      pts.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        l: 1.1,
        c,
        g: 3,
      });
    }
    for (let i = 0; i < 8; i++)
      pts.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        l: 1.4,
        c: "#ffffff",
        t: "" + rnd(2),
        g: 2,
      });
  }
  function endUpd(dt) {
    endT += dt;
    pts = pts.filter((p) => {
      p.l -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.g || 0) * dt;
      return p.l > 0;
    });
    rings = rings.filter((r) => {
      r.l -= dt;
      r.r += dt * 16;
      return r.l > 0;
    });
    sh = Math.max(0, sh - dt * 30);
    fwT -= dt;
    if (endMode === "win") {
      if (fwT <= 0) {
        fwT = 0.35;
        firework();
      }
      for (let i = 0; i < 2; i++)
        pts.push({
          x: (cx + rnd(W)) / T,
          y: (cy - 10) / T,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2 + Math.random() * 3,
          l: 3,
          c: ["#00ff66", "#44ffff", "#ffff66", "#ff66ff"][rnd(4)],
        });
    } else {
      if (fwT <= 0) {
        fwT = 0.06;
        pts.push({
          x: (cx + rnd(W)) / T,
          y: cy / T,
          vx: 0,
          vy: 4 + Math.random() * 3,
          l: 2.5,
          c: "#ff3333",
          t: "" + rnd(2),
        });
      }
      const k = Math.floor(endT * 2);
      if (endT < 2 && k !== sirK) {
        sirK = k;
        flash(k % 2 ? "#ff2222" : "#2266ff", 0.25);
      }
    }
  }
  function rollP() {
    let i;
    do i = rnd(PU.length);
    while (i === lastPun);
    lastPun = i;
    $("#pe").textContent = PU[i][0];
    $("#pt").textContent = PU[i][1];
    const c = $("#card");
    c.style.animation = "none";
    void c.offsetWidth;
    c.style.animation = "";
  }
  function nextQ() {
    if (qi.length >= Q.length) qi = [];
    let i;
    do i = rnd(Q.length);
    while (qi.includes(i));
    qi.push(i);
    return Q[i].split("|");
  }
  function openQuiz() {
    state = "quiz";
    quizOn = true;
    const q = nextQ(),
      o = [0, 1, 2].sort(() => Math.random() - 0.5);
    cur = { q, o, t: QT };
    answered = false;
    $("#q").textContent = q[0];
    $$(".ans").forEach((b, i) => {
      b.textContent = "123"[i] + ". " + q[1 + o[i]];
      b.className = "ans";
    });
    $("#qtb").style.width = "100%";
    $("#fb").textContent = "";
    $("#next").classList.add("hide");
    show("battle");
    snd("menu");
  }
  function answer(i) {
    if (answered || !cur) return;
    answered = true;
    const ok = i >= 0 && cur.o[i] === 0,
      B = $$(".ans");
    if (B[i]) B[i].classList.add(ok ? "ok" : "bad");
    if (ok) {
      score += 150;
      for (const e of pol) {
        e.stun = Math.max(e.stun, 2);
        e.path = null;
        e.mode = 0;
      }
      P.boost = 5;
      rings.push({ x: P.x, y: P.y, r: 0, l: 0.9 });
      rings.push({ x: P.x, y: P.y, r: -2, l: 0.9 });
      burst(P, "#44ffff", 50, 7);
      snd("ok");
      snd("emp");
      flash("#00ffff");
      $("#fb").textContent =
        "✅ ถูกต้อง! 👮 ตำรวจทุกนายหยุดชั่วครู่ 2 วินาที + 🚀 วิ่งเร็ว 5 วินาที — " +
        cur.q[4];
    } else {
      B[cur.o.indexOf(0)].classList.add("ok");
      snd("bad");
      flash("#ff0000");
      $("#fb").textContent =
        (i < 0 ? "⏰ หมดเวลา! " : "❌ ผิด! ") +
        'คำตอบที่ถูกคือ "' +
        cur.q[1] +
        '" — ' +
        cur.q[4] +
        " (ตำรวจยังไล่ตามอยู่!)";
    }
    $("#next").classList.remove("hide");
  }
  function closeQ() {
    if (state !== "quiz") return;
    quizOn = false;
    state = "play";
    show(null);
  }
  function quizTick(dt) {
    if (!quizOn || !cur) return;
    if (answered) return;
    cur.t -= dt;
    $("#qtb").style.width = Math.max(0, (cur.t / QT) * 100) + "%";
    if (cur.t < 3 && (tk -= dt) <= 0) {
      tk = 0.5;
      snd("tick");
    }
    if (cur.t <= 0) answer(-1);
  }
  function updMute() {
    $$(".mt").forEach(
      (b) =>
        (b.textContent =
          (muted ? "🔇" : "🔊") +
          (b.closest("#settings") ? (muted ? " UNMUTE" : " MUTE") : "")),
    );
  }
  function act(a, el) {
    switch (a) {
      case "start":
      case "restart":
      case "retry":
        snd("menu");
        glitch(begin);
        break;
      case "how":
        prev = scr;
        show("how");
        break;
      case "set":
        prev = scr;
        show("settings");
        break;
      case "back":
        show(prev);
        break;
      case "pause":
        if (state === "play") {
          state = "pause";
          show("pause");
        }
        break;
      case "resume":
        if (state === "pause") {
          state = "play";
          show(null);
        }
        break;
      case "menu":
        state = "menu";
        live = false;
        hudShow(false);
        saveBest();
        show("menu");
        break;
      case "mute":
        muted = !muted;
        setV();
        updMute();
        break;
      case "fs":
        try {
          document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen();
        } catch (e) {}
        break;
      case "ans":
        answer(+el.dataset.i);
        break;
      case "next":
        closeQ();
        break;
      case "topun":
        show("punish");
        rollP();
        break;
      case "again":
        rollP();
        snd("menu");
        break;
    }
  }

  /* ---------- input ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]");
    if (b) {
      initA();
      act(b.dataset.a, b);
      b.blur();
    }
  });
  addEventListener("keydown", (e) => {
    if (["KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code))
      e.preventDefault();
    if (e.repeat) return;
    K[e.code] = 1;
    if (e.code === "Space") {
      initA();
      fire();
    }
    if (state === "quiz") {
      if (/^(Digit|Numpad)[123]$/.test(e.code)) answer(+e.code.slice(-1) - 1);
      else if (answered && (e.code === "Space" || e.code === "Enter")) closeQ();
    }
    if (e.code === "KeyP" || e.code === "Escape")
      act(state === "play" ? "pause" : state === "pause" ? "resume" : "");
  });
  addEventListener("keyup", (e) => {
    K[e.code] = 0;
    if (e.code === "Space") e.preventDefault();
  });
  addEventListener("blur", () => {
    for (const k in K) K[k] = 0;
    if (state === "play") act("pause");
  });
  $$("#dpad b").forEach((b) => {
    const k = b.dataset.k;
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      initA();
      K[k] = 1;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((v) =>
      b.addEventListener(v, () => (K[k] = 0)),
    );
  });
  $("#fire").addEventListener("pointerdown", (e) => {
    e.preventDefault();
    initA();
    fire();
  });
  $("#vm").value = vol.m;
  $("#vs").value = vol.s;
  const sv = () => {
    vol.m = +$("#vm").value;
    vol.s = +$("#vs").value;
    setV();
    try {
      localStorage.hmVol = JSON.stringify(vol);
    } catch (e) {}
  };
  $("#vm").oninput = $("#vs").oninput = sv;
  $("#vs").onchange = () => {
    initA();
    snd("pick");
  };
  addEventListener("resize", layout);
  layout();
  $("#best").textContent = "BEST SCORE: " + best;
  requestAnimationFrame(loop);
})();
