// Interactive Table Settings / Filter panels with auto demo. Usage: <erp-panel kind="table|filter">
(function () {
  if (customElements.get('erp-panel')) return;
  var CSS = [
    'erp-panel{display:block;width:100%}',
    '.ep-wrap{display:flex;flex-direction:column;gap:16px}',
    '.ep-stage{position:relative;background:#0f0f12;padding:40px 12px;display:flex;justify-content:center;overflow:hidden}',
    '.ep-panel{width:min(320px,100%);height:570px;background:#131a24;border-radius:16px;padding:20px;display:flex;flex-direction:column;font-family:Manrope,sans-serif;color:#e6e9ee;position:relative;user-select:none;box-sizing:border-box}',
    '.ep-head{display:flex;justify-content:space-between;align-items:center;font-size:18px;font-weight:700;margin-bottom:18px;flex-shrink:0}',
    '.ep-x{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;color:#c9ced6;transition:background .15s}',
    '.ep-x:hover{background:#222c3a}',
    '.ep-subt{font-size:12px;font-weight:600;color:#c9ced6;padding:0 8px}',
    '.ep-subd{font-size:12px;color:#7d8794;margin-top:8px;padding:0 8px}',
    '.ep-div{height:1px;background:#2b3442;margin:12px 0;flex-shrink:0}',
    '.ep-scroll{flex:1;overflow:auto;min-height:0;padding-right:10px;margin-right:-10px;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:#2b3442 transparent}',
    '.ep-row{display:flex;align-items:center;gap:12px;height:48px;padding:0 8px;border-radius:8px;transition:background .15s;box-sizing:border-box}',
    '.ep-row:hover{background:#1c2533}',
    '.ep-row.is-drag{background:#3548fe}',
    '.ep-cb{width:22px;height:22px;border-radius:5px;border:1.5px solid #4a5462;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;box-sizing:border-box;transition:background .15s,border-color .15s}',
    '.ep-cb:hover{border-color:#8a93a0}',
    '.ep-cb.on{background:#2238d8;border-color:#2238d8}',
    '.ep-cb.lock{background:#5b6573;border-color:#5b6573;cursor:not-allowed}',
    '.ep-row.is-drag .ep-cb.on{border-color:#fff}',
    '.ep-lbl{flex:1;font-size:14px;font-weight:600}',
    '.ep-lbl.dim{color:#8a93a0}',
    '.ep-ic{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;color:#8a93a0;cursor:pointer;transition:background .15s,color .15s}',
    '.ep-ic:hover{background:#2b3442;color:#fff}',
    '.ep-ic.pinned{color:#fff}',
    '.ep-handle{cursor:grab}',
    '.ep-cal{margin-top:6px;background:#1c2431;border-radius:6px;padding:12px}',
    '.ep-calh{display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;margin-bottom:10px}',
    '.ep-calnav{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;color:#c9ced6;transition:background .15s}',
    '.ep-calnav:hover{background:#2b3442}',
    '.ep-calg{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;text-align:center}',
    '.ep-wd{font-size:11px;font-weight:600;color:#7d8794;padding:4px 0}',
    '.ep-day{font-size:13px;font-weight:600;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;transition:background .15s}',
    '.ep-day:hover{background:#2b3442}',
    '.ep-day.sel,.ep-day.sel:hover{background:#3548fe;color:#fff}',
    '.ep-day.out{color:#4a5462}',
    '.ep-tip{position:absolute;z-index:6;max-width:220px;padding:8px 12px;background:#fff;color:#131a24;font:600 12px/1.4 Manrope,sans-serif;border-radius:6px;pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity .2s,transform .2s cubic-bezier(.2,.7,.2,1)}',
    '.ep-tip.show{opacity:1;transform:none}',
    '.ep-tip::after{content:"";position:absolute;left:14px;top:100%;border:6px solid transparent;border-top-color:#fff}',
    '.ep-noscroll{scrollbar-width:none;padding-right:0;margin-right:0;scrollbar-gutter:auto}',
    '.ep-noscroll::-webkit-scrollbar{display:none}',
    '.ep-row.is-drag .ep-ic{color:#fff}',
    '.ep-row.is-drag .ep-handle{background:rgba(255,255,255,.2)}',
    '.ep-save{margin-top:16px;height:48px;border:0;border-radius:6px;background:#3548fe;color:#fff;font:700 16px Manrope,sans-serif;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;flex-shrink:0;transition:filter .15s,background .2s}',
    '.ep-save:hover{filter:brightness(1.12)}',
    '.ep-save.done{background:#0d6b2b;animation:epPop .45s cubic-bezier(.2,.7,.2,1)}',
    '.ep-save.busy{cursor:default;filter:none}',
    '.ep-spin{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;animation:epSpin .6s linear infinite}',
    '.ep-save.done .ep-ck path{stroke-dasharray:24;stroke-dashoffset:24;animation:epDraw .4s .1s cubic-bezier(.2,.7,.2,1) forwards}',
    '.ep-save.done .ep-lb{animation:epUp .35s cubic-bezier(.2,.7,.2,1)}',
    '@keyframes epSpin{to{transform:rotate(360deg)}}',
    '@keyframes epDraw{to{stroke-dashoffset:0}}',
    '@keyframes epPop{0%{transform:scale(1)}40%{transform:scale(.96)}100%{transform:scale(1)}}',
    '@keyframes epUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '.ep-lab{font-size:13px;font-weight:600;color:#c9ced6;margin:18px 0 8px}',
    '.ep-lab.first{margin-top:0}',
    '.ep-chips{display:flex;flex-direction:column;gap:8px}',
    '.ep-chip{height:28px;border-radius:999px;padding:0 4px 0 12px;display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:600;cursor:pointer;border:1px solid transparent;box-sizing:border-box;transition:background .2s,color .2s,border-color .2s,filter .15s}',
    '.ep-chip:hover{filter:brightness(1.12)}',
    '.ep-eye{width:22px;height:22px;display:flex;align-items:center;justify-content:center}',
    '.ep-field{height:46px;border-radius:6px;background:#1c2431;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-size:15px;color:#fff;cursor:pointer;transition:background .15s}',
    '.ep-field:hover{background:#243042}',
    '.ep-field svg{color:#8a93a0;flex-shrink:0}',
    '.ep-chev{transition:transform .2s;display:flex}',
    '.ep-chev.up{transform:rotate(180deg)}',
    '.ep-menu{margin-top:6px;background:#1c2431;border-radius:6px;padding:4px;display:flex;flex-direction:column}',
    '.ep-opt{padding:10px;border-radius:4px;font-size:14px;cursor:pointer;transition:background .15s}',
    '.ep-opt:hover{background:#2b3442}',
    '.ep-opt.sel{color:#8d9bff}',
    '.ep-mine{display:flex;align-items:center;gap:12px;font-size:14px;font-weight:600;margin-top:20px;cursor:pointer}',
    '.ep-cb2{width:22px;height:22px;border-radius:5px;background:#1c2431;display:flex;align-items:center;justify-content:center;transition:background .15s}',
    '.ep-mine:hover .ep-cb2{background:#2b3442}',
    '.ep-cb2.on,.ep-mine:hover .ep-cb2.on{background:#2238d8}',
    '.ep-fsave{position:absolute;left:20px;right:20px;bottom:20px;margin:0;box-shadow:0 -24px 24px 4px #131a24}',
    '.ep-cursor{position:absolute;left:70%;top:85%;opacity:0;pointer-events:none;z-index:5;transition:left .55s cubic-bezier(.4,0,.2,1),top .55s cubic-bezier(.4,0,.2,1),opacity .3s,transform .12s;transform-origin:0 0;filter:drop-shadow(0 2px 4px rgba(0,0,0,.45))}',
    '.ep-bar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px 16px}',
    '.ep-hint{flex:1 1 220px;min-width:0;font-size:15px;line-height:1.4;color:#999;font-family:Geist,system-ui,sans-serif}',
    ".ep-btn{flex-shrink:0;white-space:nowrap;background:none;border:1px solid #2a2a2e;color:#fff;font-family:'Geist Mono',monospace;font-size:13px;padding:10px 16px;border-radius:0;cursor:pointer;transition:color .2s}",
    '.ep-btn:hover{color:#4493fa}'
  ].join('\n');

  var COLS = ['Order ID', 'Order date', 'Distribution status', 'Distributed volume', 'Counterparty', 'Product', 'Ordered volume', 'Supply contract', 'Trader', 'Assignee', 'Attachments', 'Point of Contact'];
  var LOCKED = ['Distribution status', 'Distributed volume'];
  var STATUS = [['Draft', '#e8eaee', '#1f2937', '#c9ced6'], ['Pending', '#a7c9ad', '#1f3d29', '#a7c9ad'], ['Full', '#0d6b2b', '#fff', '#7b3fe4'], ['Closed', '#a14a06', '#fff', '#f08a2c']];
  var OPTS = {
    'Order ID': ['#453324', '#453344', '#453311', '#453341'],
    'Counterparty': ['Nowa Trading GmbH', 'Alpine Bulk Solutions', 'Horizon Supply Co', 'Nordic Cement Group'],
    'Product': ['CEM I 42.5R', 'CEM II 42.5N', 'White cement', 'Rapid-hardening cement'],
    'Trader': ['M. Kowalski', 'J. Novak', 'L. Dubois'],
    'Ordered volume': ['0 – 10 000 t', '10 000 – 30 000 t', '30 000+ t']
  };
  function svg(d, w, sw) { return '<svg width="' + (w || 16) + '" height="' + (w || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
  var I = {
    x: svg('<path d="M18 6 6 18M6 6l12 12"/>', 18, 2),
    pin: svg('<path d="M12 17v5M8 3h8M9 3v7l-3 4h12l-3-4V3"/>'),
    drag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.6"/><circle cx="15" cy="5" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="19" r="1.6"/><circle cx="15" cy="19" r="1.6"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', 15, 2),
    eyeOff: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>', 15, 2),
    cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', 18),
    chev: svg('<path d="M6 9l6 6 6-6"/>', 16, 2),
    saveCheck: svg('<path d="M5 12.5l4.5 4.5L19 7"/>', 18, 2.4)
  };
  function initial(kind) {
    return kind === 'table'
      ? { pinned: [], order: COLS.slice(), on: {}, dragging: null, saved: false }
      : { hidden: {}, date: '', vals: {}, open: null, mine: false, saved: false, cy: 2026, cm: 3 };
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  customElements.define('erp-panel', class extends HTMLElement {
    connectedCallback() {
      if (this._b) return; this._b = true;
      if (!document.getElementById('erp-panel-css')) { var s = document.createElement('style'); s.id = 'erp-panel-css'; s.textContent = CSS; document.head.appendChild(s); }
      if (!document.getElementById('erp-proto-font')) { var l = document.createElement('link'); l.id = 'erp-proto-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap'; document.head.appendChild(l); }
      var self = this; setTimeout(function () { self.boot(); }, 0);
    }
    disconnectedCallback() { this.run = null; if (this.io) this.io.disconnect(); }
    boot() {
      var self = this;
      this.kind = this.getAttribute('kind') || this.kind || 'table';
      this.s = initial(this.kind);
      this.auto = true;
      this.innerHTML = '<div class="ep-wrap"><div class="ep-stage"><div class="ep-panel"></div>'
        + '<div class="ep-cursor"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 2v18l5-4.8 3.4 7.6 3.2-1.4-3.4-7.4 7.2-.4z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"></path></svg></div></div>'
        + '<div class="ep-bar"><span class="ep-hint"></span><button class="ep-btn">[ Replay ]</button></div></div>';
      this.stage = this.querySelector('.ep-stage');
      this.panel = this.querySelector('.ep-panel');
      this.cursor = this.querySelector('.ep-cursor');
      this.hint = this.querySelector('.ep-hint');
      this.querySelector('.ep-btn').addEventListener('click', function () { self.play(); });
      this.stage.addEventListener('pointerdown', function () { self.stop(); });
      this.panel.addEventListener('click', function (e) {
        if (self.s.dragging) { self.s.dragging = null; self.render(); }
        var el = e.target.closest('[data-act]'); if (!el || !self.panel.contains(el)) return;
        if (el.dataset.act === 'grab') return;
        if (el.dataset.act === 'check' && LOCKED.indexOf(el.dataset.col) > -1) { self.tip(el, 'This column is required and can’t be hidden.'); return; }
        self.act(el.dataset);
      });
      this.panel.addEventListener('dragstart', function (e) {
        var row = e.target.closest('.ep-row'); if (!row) return;
        self.s.dragging = row.dataset.col; row.classList.add('is-drag');
        e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', row.dataset.col); } catch (_) {}
      });
      this.panel.addEventListener('dragover', function (e) { if (self.s.dragging && e.target.closest('.ep-row')) e.preventDefault(); });
      this.panel.addEventListener('drop', function (e) {
        var row = e.target.closest('.ep-row'); if (!row || !self.s.dragging) return;
        e.preventDefault(); self.move(self.s.dragging, row.dataset.col);
      });
      this.panel.addEventListener('dragend', function () { self.s.dragging = null; self.render(); });
      this.render();
      this.io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !self.started) { self.started = true; self.play(); }
      }, { threshold: 0.4 });
      this.io.observe(this.stage);
    }
    tip(el, text) {
      if (!this.tipEl) { this.tipEl = document.createElement('div'); this.tipEl.className = 'ep-tip'; this.stage.appendChild(this.tipEl); }
      var t = this.tipEl, r = el.getBoundingClientRect(), st = this.stage.getBoundingClientRect();
      t.textContent = text; t.classList.remove('show');
      t.style.left = (r.left - st.left - 6) + 'px';
      t.style.top = (r.top - st.top - t.offsetHeight - 10) + 'px';
      requestAnimationFrame(function () { t.classList.add('show'); });
      clearTimeout(this._tt); this._tt = setTimeout(function () { t.classList.remove('show'); }, 2200);
    }
    setHint() {
      this.hint.textContent = this.auto ? 'Demo is playing — click inside to take control.'
        : (this.kind === 'table' ? 'Try it: pin, toggle and drag columns.' : 'Try it: toggle statuses, pick a date and values.');
    }
    move(c, target) {
      var s = this.s;
      if (c === target) return;
      var arr = s.pinned.indexOf(c) > -1 ? s.pinned : s.order;
      if (arr.indexOf(target) < 0) return;
      arr.splice(arr.indexOf(c), 1);
      arr.splice(arr.indexOf(target), 0, c);
      s.dragging = null; this.render();
    }
    act(d) {
      var s = this.s, a = d.act, c = d.col;
      if (a === 'close') { this.s = initial(this.kind); }
      else if (a === 'save') {
        if (s.saving || s.saved) return;
        s.saving = true; s.open = null;
        var self = this; clearTimeout(this._sv);
        this._sv = setTimeout(function () {
          self.s.saving = false; self.s.saved = true; self.render();
          self._sv = setTimeout(function () { self.s.saved = false; self.render(); }, 1600);
        }, 650);
      }
      else if (a === 'pin') {
        var i = s.pinned.indexOf(c);
        if (i > -1) s.pinned.splice(i, 1); else { s.pinned.push(c); s.on[c] = true; }
      }
      else if (a === 'check') {
        if (LOCKED.indexOf(c) > -1) return;
        var j = s.pinned.indexOf(c);
        if (j > -1) { s.pinned.splice(j, 1); s.on[c] = false; } else s.on[c] = !s.on[c];
      }
      else if (a === 'grab') { s.dragging = s.dragging === c ? null : c; }
      else if (a === 'eye') { s.hidden[d.f] = !s.hidden[d.f]; }
      else if (a === 'date') { s.open = s.open === 'date' ? null : 'date'; }
      else if (a === 'calnav') { s.cm += +d.v; if (s.cm < 0) { s.cm = 11; s.cy--; } if (s.cm > 11) { s.cm = 0; s.cy++; } }
      else if (a === 'day') { s.date = d.v; s.open = null; }
      else if (a === 'open') { s.open = s.open === d.f ? null : d.f; }
      else if (a === 'pick') { s.vals[d.f] = s.vals[d.f] === d.v ? '' : d.v; s.open = null; }
      else if (a === 'mine') { s.mine = !s.mine; }
      this.render();
    }
    render() {
      var sc = this.panel.querySelector('.ep-scroll'), top = sc ? sc.scrollTop : 0;
      this.panel.innerHTML = this.kind === 'table' ? this.tableHTML() : this.filterHTML();
      sc = this.panel.querySelector('.ep-scroll'); if (sc) sc.scrollTop = top;
      this.setHint();
    }
    saveBtn(extra) {
      var s = this.s, cls = 'ep-save ' + (extra || '') + (s.saved ? ' done' : '') + (s.saving ? ' busy' : '');
      var inner = s.saving ? '<span class="ep-spin"></span>'
        : s.saved ? '<span class="ep-lb">Saved</span><span class="ep-ck" style="display:flex">' + I.saveCheck + '</span>'
        : 'Save' + I.saveCheck;
      return '<button class="' + cls + '" data-act="save">' + inner + '</button>';
    }
    tableHTML() {
      var s = this.s, self = this;
      function row(c, pinned) {
        var locked = LOCKED.indexOf(c) > -1, checked = pinned || locked || s.on[c];
        return '<div class="ep-row' + (s.dragging === c ? ' is-drag' : '') + '" draggable="true" data-col="' + c + '">'
          + '<span class="ep-cb' + (checked ? ' on' : '') + (locked ? ' lock' : '') + '" data-act="check" data-col="' + c + '">' + (checked ? I.check : '') + '</span>'
          + '<span class="ep-lbl' + (locked ? ' dim' : '') + '">' + c + '</span>'
          + '<span class="ep-ic' + (pinned ? ' pinned' : '') + '" data-act="pin" data-col="' + c + '" style="' + (pinned ? '' : 'transform:rotate(40deg)') + '">' + I.pin + '</span>'
          + '<span class="ep-ic ep-handle" data-act="grab" data-col="' + c + '">' + I.drag + '</span></div>';
      }
      var top = s.pinned.length
        ? '<div class="ep-subt" style="margin-bottom:6px">Pin columns</div>' + s.pinned.map(function (c) { return row(c, true); }).join('')
        : '<div><div class="ep-subt">No pin columns</div><div class="ep-subd">Pin columns to the top to freeze them.</div></div>';
      return '<div class="ep-head"><span>Table Settings</span><span class="ep-x" data-act="close">' + I.x + '</span></div>'
        + '<div style="flex-shrink:0">' + top + '</div><div class="ep-div"></div>'
        + '<div class="ep-scroll">' + s.order.filter(function (c) { return s.pinned.indexOf(c) < 0; }).map(function (c) { return row(c, false); }).join('') + '</div>'
        + this.saveBtn();
    }
    filterHTML() {
      var s = this.s;
      function chip(st) {
        var off = s.hidden[st[0]];
        var style = off ? 'background:transparent;color:#9aa3af;border-color:' + st[3] : 'background:' + st[1] + ';color:' + st[2];
        return '<div class="ep-chip" data-act="eye" data-f="' + st[0] + '" style="' + style + '"><span>' + st[0] + '</span><span class="ep-eye">' + (off ? I.eyeOff : I.eye) + '</span></div>';
      }
      function calHTML() {
        var M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var first = new Date(s.cy, s.cm, 1), start = (first.getDay() + 6) % 7, days = new Date(s.cy, s.cm + 1, 0).getDate(), prev = new Date(s.cy, s.cm, 0).getDate();
        var cells = '';
        for (var i = 0; i < 42; i++) {
          var n = i - start + 1, out = n < 1 || n > days, dn = n < 1 ? prev + n : n > days ? n - days : n;
          if (i >= 35 && start + days <= 35) break;
          var v = String(dn).padStart(2, '0') + '.' + String(s.cm + 1).padStart(2, '0') + '.' + s.cy;
          cells += out ? '<span class="ep-day out">' + dn + '</span>' : '<span class="ep-day' + (s.date === v ? ' sel' : '') + '" data-act="day" data-v="' + v + '">' + dn + '</span>';
        }
        return '<div class="ep-cal"><div class="ep-calh"><span class="ep-calnav" data-act="calnav" data-v="-1" style="transform:rotate(90deg)">' + I.chev + '</span><span>' + M[s.cm] + ' ' + s.cy + '</span><span class="ep-calnav" data-act="calnav" data-v="1" style="transform:rotate(-90deg)">' + I.chev + '</span></div>'
          + '<div class="ep-calg">' + ['Mo','Tu','We','Th','Fr','Sa','Su'].map(function (w) { return '<span class="ep-wd">' + w + '</span>'; }).join('') + cells + '</div></div>';
      }
      function sel(n) {
        var open = s.open === n;
        return '<div class="ep-lab">' + n + '</div><div class="ep-field" data-act="open" data-f="' + n + '"><span>' + (s.vals[n] || '') + '</span><span class="ep-chev' + (open ? ' up' : '') + '">' + I.chev + '</span></div>'
          + (open ? '<div class="ep-menu">' + OPTS[n].map(function (o) { return '<div class="ep-opt' + (s.vals[n] === o ? ' sel' : '') + '" data-act="pick" data-f="' + n + '" data-v="' + o + '">' + o + '</div>'; }).join('') + '</div>' : '');
      }
      return '<div class="ep-head"><span>Filter</span><span class="ep-x" data-act="close">' + I.x + '</span></div>'
        + '<div class="ep-scroll ep-noscroll" style="padding-bottom:80px">'
        + '<div class="ep-lab first">Distribution status</div><div class="ep-chips">' + STATUS.map(chip).join('') + '</div>'
        + '<div class="ep-lab">Order date</div><div class="ep-field" data-act="date"><span>' + s.date + '</span>' + I.cal + '</div>' + (s.open === 'date' ? calHTML() : '')
        + '<div class="ep-div" style="margin-top:20px"></div>'
        + sel('Order ID') + sel('Counterparty') + sel('Product') + sel('Trader')
        + '<div class="ep-mine" data-act="mine"><span class="ep-cb2' + (s.mine ? ' on' : '') + '">' + (s.mine ? I.check : '') + '</span>Show only mine orders</div>'
        + sel('Ordered volume')
        + '</div>' + this.saveBtn('ep-fsave');
    }
    find(sel) { return this.panel.querySelector(sel); }
    async reveal(el) {
      var sc = el.closest('.ep-scroll'); if (!sc) return;
      var r = el.getBoundingClientRect(), b = sc.getBoundingClientRect();
      if (r.top < b.top + 8 || r.bottom > b.bottom - 90) {
        sc.scrollTo({ top: sc.scrollTop + (r.top - b.top) - b.height / 3, behavior: 'smooth' });
        await wait(450);
      }
    }
    async point(sel, id) {
      var el = this.find(sel); if (!el || this.run !== id) return null;
      await this.reveal(el); if (this.run !== id) return null;
      el = this.find(sel);
      var r = el.getBoundingClientRect(), st = this.stage.getBoundingClientRect();
      this.cursor.style.opacity = '1';
      this.cursor.style.left = (r.left - st.left + r.width / 2) + 'px';
      this.cursor.style.top = (r.top - st.top + r.height / 2) + 'px';
      await wait(650); if (this.run !== id) return null;
      this.cursor.style.transform = 'scale(.82)'; await wait(130);
      this.cursor.style.transform = 'scale(1)';
      return this.run === id ? this.find(sel) : null;
    }
    async click(sel, id) {
      var el = await this.point(sel, id); if (!el) return false;
      this.act(el.dataset); await wait(450); return this.run === id;
    }
    stop() {
      if (!this.auto) return;
      this.auto = false; this.run = null; this.cursor.style.opacity = '0'; this.setHint();
    }
    async play() {
      var id = {}; this.run = id; this.auto = true;
      this.s = initial(this.kind); this.render();
      var sc = this.panel.querySelector('.ep-scroll'); if (sc) sc.scrollTop = 0;
      this.cursor.style.transition = 'none'; this.cursor.style.left = '70%'; this.cursor.style.top = '85%';
      this.cursor.offsetWidth; this.cursor.style.transition = '';
      await wait(500);
      var steps = this.kind === 'table'
        ? ['[data-act="pin"][data-col="Order ID"]', '[data-act="pin"][data-col="Order date"]', '[data-act="check"][data-col="Counterparty"]', '[data-act="check"][data-col="Product"]', '[data-act="grab"][data-col="Product"]']
        : ['[data-act="eye"][data-f="Draft"]', '[data-act="eye"][data-f="Pending"]', '[data-act="eye"][data-f="Full"]', '[data-act="date"]', '[data-act="day"][data-v="21.04.2026"]', '[data-act="open"][data-f="Product"]', '[data-act="pick"][data-v="White cement"]'];
      for (var i = 0; i < steps.length; i++) { if (!(await this.click(steps[i], id))) return; }
      if (this.kind === 'table') {
        var target = this.find('[data-col="Counterparty"].ep-row');
        if (target) {
          var r = target.getBoundingClientRect(), st = this.stage.getBoundingClientRect();
          this.cursor.style.top = (r.top - st.top + r.height / 2) + 'px';
          await wait(600); if (this.run !== id) return;
          this.move('Product', 'Counterparty'); await wait(500); if (this.run !== id) return;
        }
      }
      if (!(await this.click('[data-act="save"]', id))) return;
      await wait(900); if (this.run !== id) return;
      this.cursor.style.opacity = '0'; this.auto = false; this.run = null; this.setHint();
    }
  });
})();
