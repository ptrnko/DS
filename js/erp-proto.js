// Interactive distribution prototype — ported from petrenko-anastasiia.com/cases/erp-core.html
(function () {
  if (customElements.get('erp-proto')) return;
  var CSS = "#erp-proto [data-act]{transition:background .15s ease,filter .15s ease,border-color .15s ease}\n#erp-proto [data-act=\"cell\"]:hover{background:#d9deef !important}\n#erp-proto [data-act=\"openModal\"]:hover,#erp-proto [data-act=\"addContract\"]:hover{background:#2b3a4f !important}\n#erp-proto [data-act=\"menuContract\"]:hover,#erp-proto [data-act=\"toggleContract\"]:hover,#erp-proto [data-act=\"toggleAll\"]:hover{filter:brightness(1.35)}\n#erp-proto [data-act=\"reset\"]:hover,#erp-proto [data-act=\"closeModal\"]:hover,#erp-proto [data-act=\"saveModal\"]:hover,#erp-proto [data-act=\"openFilter\"]:hover,#erp-proto [data-act=\"closeFilter\"]:hover,#erp-proto [data-act=\"status\"]:hover{filter:brightness(1.12)}\n#erp-proto [data-act=\"modalRow\"]:hover{background:#eef1f8 !important}\n#erp-proto .dp-card{transition:background .18s ease}\n#erp-proto .dp-card:hover{background:#222c3a !important}";
  function boot(mount) {

    var UP = '', IC = '../assets/erp-core/icons/';

    var ROWS = [
      ['453324','22.12.2025','Nowa Trading GmbH','CEM I 42.5R',20000,0,'SC-2025-201'],
      ['453344','22.12.2025','Cemex Distribution Ltd','Rapid-hardening cement',5500,0,'SC-2025-202'],
      ['453311','20.12.2025','Alpine Bulk Solutions','White cement',10500,0,'SC-2025-118'],
      ['453298','18.12.2025','Eastern Cargo Partners','CEM I 42.5R',44500,44500,'SC-2025-204'],
      ['453341','19.12.2025','Horizon Supply Co','CEM II 42.5N',8000,0,'SC-2025-207'],
      ['453276','16.12.2025','Nordic Cement Group','White cement',12000,5000,'SC-2025-093'],
      ['453265','14.12.2025','Atlas Logistics B.V.','CEM II 42.5N',34500,0,'SC-2025-015'],
      ['453251','12.12.2025','Meridian Trade House','CEM I 42.5R',44500,44500,'SC-2025-061'],
      ['453242','10.12.2025','Baltica Bulk Ltd','Rapid-hardening cement',21000,8000,'SC-2025-033'],
      ['453230','08.12.2025','Vostok Materials AG','White cement',12000,8000,'SC-2025-004'],
      ['453219','05.12.2025','Prime Cement Holdings','CEM I 42.5R',34500,0,'SC-2025-090'],
      ['453207','03.12.2025','Delta Supply Partners','CEM II 42.5N',44500,44500,'SC-2025-022'],
      ['453196','28.11.2025','Adriatic Cargo Group','White cement',21000,10000,'SC-2025-045'],
      ['453184','24.11.2025','Fortis Distribution S.A.','CEM I 42.5R',12000,12000,'SC-2025-062'],
      ['453172','19.11.2025','Kronos Bulk Trading','Rapid-hardening cement',34500,12000,'SC-2025-023'],
      ['453160','12.11.2025','Solaris Trade Ltd','CEM II 42.5N',44500,44500,'SC-2025-011']
    ];
    var RANK = { 1: 0, 0: 1, 2: 2, 4: 3 };
    var CONTRACTS = [
      { key: 'nowa', name: 'Nowa - 22.12.2025', chip: '#459340', vol: 12000 },
      { key: 'artika', name: 'Artika - 19.12.2025', chip: '#459870', vol: 19000 },
      { key: 'lukka', name: 'Lukka - 01.11.2025', chip: '#459220', vol: 10000 },
      { key: 'skyblue', name: 'Sky Blue - 12.12.2025', chip: '#459800', vol: 8000 }
    ];
    var TONE = {
      green: { iconBg: '#2f4a37', distColor: '#2bc24a', arrows: IC + 'arrows-green.svg' },
      orange: { iconBg: 'linear-gradient(135deg,#e8590c,#f5a30b)', distColor: '#f2a516', arrows: IC + 'arrows-amber.svg' },
      grey: { iconBg: '#2b333e', distColor: '#ffffff', arrows: IC + 'arrows-white.svg' }
    };
    var STATUS = { Draft: ['#e8eaee', '#374151'], Pending: ['#a7c9ad', '#1f5130'], Full: ['#0d6b2b', '#ffffff'] };

    function initial() {
      return { included: [0], clist: [{ key: 'nowa', base: 'nowa' }], menuFor: null, menuHover: null, flash: null,
        checked: { nowa: true, artika: true, lukka: false, skyblue: true }, cells: { '453324|nowa': '500,000' },
        active: null, modal: false, sel: {}, filterOpen: false, hidden: {}, cursor: { x: 900, y: 560, show: false, down: false }, auto: false };
    }
    var state = Object.assign(initial(), { scale: 0.6 });
    var tok = null, started = false, mounted = true, boardEl, cursorEl, scaleEl, rootEl;

    function num(v) { return parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.')) || 0; }
    function fmt3(n) { return n.toLocaleString('ru-RU', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace(/[  ]/g, ' ') + ' t'; }
    function fmt(n) { return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[  ]/g, ' '); }
    function tone(d, v) { return d <= 0 ? 'grey' : d >= v ? 'green' : 'orange'; }
    function sumBy(cells, test) { return Object.keys(cells).reduce(function (a, k) { return a + (test(k) ? num(cells[k]) : 0); }, 0); }
    function orderOf(i) { var r = ROWS[i]; return { key: r[0], title: 'Order - ' + r[1], chip: '#' + r[0], vol: r[4], rank: RANK[i] != null ? RANK[i] : 10 + i }; }
    function addNext(list) { var next = CONTRACTS.find(function (c) { return !list.some(function (x) { return x.base === c.key; }); }); return next ? list.concat([{ key: next.key, base: next.key }]) : list; }
    function copyOf(s, key) {
      var i = s.clist.findIndex(function (x) { return x.key === key; });
      if (i < 0) return { menuFor: null };
      var src = s.clist[i], nk = src.base + '~' + Date.now();
      var clist = s.clist.slice(0, i + 1).concat([{ key: nk, base: src.base }], s.clist.slice(i + 1));
      var checked = Object.assign({}, s.checked); checked[nk] = s.checked[key] != null ? s.checked[key] : s.checked[src.base];
      return { clist: clist, menuFor: null, menuHover: null, flash: nk, checked: checked };
    }

    function setState(patch) {
      var p = typeof patch === 'function' ? patch(state) : patch;
      var keys = Object.keys(p);
      Object.assign(state, p);
      if (keys.length === 1 && keys[0] === 'cursor') { renderCursor(); return; }
      renderBoard(); renderCursor();
    }

    function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    var CUBE = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"></path><path d="M3 7l9 5 9-5M12 12v10"></path></svg>';
    var DOTS = function (fill) { return '<svg width="3" height="9" viewBox="0 0 3 9"><circle cx="1.5" cy="1.2" r="1.1" fill="' + fill + '"></circle><circle cx="1.5" cy="4.5" r="1.1" fill="' + fill + '"></circle><circle cx="1.5" cy="7.8" r="1.1" fill="' + fill + '"></circle></svg>'; };
    var CHK = function (op) { return '<svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:' + op + '"><path d="M2 6.5l2.6 2.5L10 3"></path></svg>'; };
    var PLUS = '<svg width="11" height="11" viewBox="0 0 12 12" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M6 1v10M1 6h10"></path></svg>';

    function derive() {
      var s = state;
      var orders = s.included.map(orderOf).sort(function (a, b) { return a.rank - b.rank; }).slice(0, 4);
      var contracts = s.clist.map(function (c) { var base = CONTRACTS.find(function (x) { return x.key === c.base; }); return Object.assign({}, base, { key: c.key, base: c.base }); });
      var kd = {}; contracts.forEach(function (k) { kd[k.key] = sumBy(s.cells, function (c) { return c.split('|')[1] === k.key; }); });
      var ac = s.active ? orders.findIndex(function (o) { return o.key === s.active.o; }) : -1;
      var ar = s.active ? contracts.findIndex(function (k) { return k.key === s.active.c; }) : -1;
      return { orders: orders, contracts: contracts, kd: kd, ac: ac, ar: ar };
    }

    var pModal = false, pMenu = null, pFilter = false, pOrders = {}, pContracts = {};
    function renderBoard() {
      var s = state, d = derive(), orders = d.orders, contracts = d.contracts, kd = d.kd, ac = d.ac, ar = d.ar;
      var html = '';
      // Entrance animations only play on first appearance, never on a re-render,
      // otherwise every setState (e.g. each typed character) re-flashes the whole board.
      var aModal = (s.modal && !pModal) ? 'animation:dpPop .3s ease both;' : '';
      var aBg = (s.modal && !pModal) ? 'animation:dpFade .25s ease both;' : '';
      var aFilter = (s.filterOpen && !pFilter) ? 'animation:dpSlide .3s ease both;' : '';
      var aMenu = (s.menuFor && s.menuFor !== pMenu) ? 'animation:dpPop .2s ease both;' : '';
      var curOrders = {}, curContracts = {};

      /* top bar */
      html += '<div style="position:absolute;left:0;top:0;width:1288px;height:40px;background:#111821;display:flex;align-items:stretch">'
        + '<img src="' + IC + 'menu.svg" alt="" style="width:46px;height:40px;object-fit:fill">'
        + '<div style="padding:0 22px;display:flex;align-items:center;font-size:12.5px;color:#e6ebf1;border-left:1px solid #1d2531">Contracts (8)</div>'
        + '<div style="padding:0 22px;display:flex;align-items:center;font-size:12.5px;color:#e6ebf1;border-left:1px solid #1d2531">Orders (65)</div>'
        + '<div style="padding:0 22px;display:flex;align-items:center;font-size:12.5px;color:#e6ebf1;border-left:1px solid #1d2531;background:#0b1017">Distribution</div>'
        + '<div style="flex:1"></div>'
        + '<div style="width:43px;display:flex;align-items:center;justify-content:center;border-left:1px solid #1d2531"><img src="' + IC + 'settings.svg" alt="" style="width:18px;height:18px"></div>'
        + '<div style="width:43px;display:flex;align-items:center;justify-content:center;border-left:1px solid #1d2531"><img src="' + IC + 'bell.svg" alt="" style="width:15px;height:16px"></div>'
        + '<div style="width:43px;display:flex;align-items:center;justify-content:center;border-left:1px solid #1d2531"><img src="' + IC + 'avatar.png" alt="" style="width:21px;height:21px;border-radius:50%;object-fit:cover"></div>'
        + '</div>';

      /* breadcrumbs */
      html += '<div style="position:absolute;left:0;top:40px;width:1288px;height:21px;background:#1a2230;display:flex;align-items:stretch;font-size:9.5px">'
        + '<div style="padding:0 10px 0 15px;display:flex;align-items:center;gap:14px;color:#aab4bf">Product list <span style="color:#6f7986">&rsaquo;</span></div>'
        + '<div style="padding:0 10px;display:flex;align-items:center;gap:10px;background:#212a37;color:#fff">Distribution <img src="' + IC + 'pin.svg" alt="" style="width:9px;height:9px"></div>'
        + '</div>';

      /* title bar */
      html += '<div style="position:absolute;left:0;top:61px;width:1288px;height:54px;background:#273241;display:flex;align-items:center;padding:0 20px;box-sizing:border-box;gap:8px">'
        + '<div style="flex:1;font-size:22px;font-weight:700;letter-spacing:-0.01em">Order-level product distribution</div>'
        + '<div style="height:21px;display:flex;align-items:center;background:#1e2835;border-radius:3px;font-size:9.5px;padding-right:10px;gap:7px"><span style="width:21px;height:21px;border-radius:3px;background:#0b1220;display:flex;align-items:center;justify-content:center"><img src="' + IC + 'calendar.svg" alt="" style="width:13px;height:13px"></span>01.11.2025 - 01.01.2026</div>'
        + '<div style="height:21px;display:flex;align-items:center;background:#1e2835;border-radius:3px;font-size:9.5px;padding-right:10px;gap:7px"><span style="width:21px;height:21px;border-radius:3px;background:#0b1220;display:flex;align-items:center;justify-content:center"><img src="' + IC + 'info.svg" alt="" style="width:13px;height:13px"></span>Cement</div>'
        + '<div style="height:22px;margin-left:12px;display:flex;align-items:center;gap:5px;background:#3548fe;border-radius:3px;font-size:9.5px;padding:0 7px 0 8px">Filter <img src="' + IC + 'filter.svg" alt="" style="width:12px;height:12px"></div>'
        + '</div>';

      /* distribution label */
      html += '<div style="position:absolute;left:10px;top:126px;width:258px;height:72px;background:#1d2531;border-radius:10px;display:flex;align-items:center;padding-left:11px;box-sizing:border-box;font-size:12px;font-weight:700;color:#5f6977;letter-spacing:0.02em">DISTRIBUTION</div>';

      /* order columns */
      html += '<div style="position:absolute;left:278px;top:126px;display:flex;gap:7px">';
      orders.forEach(function (o) {
        var dd = sumBy(s.cells, function (k) { return k.split('|')[0] === o.key; });
        var t = TONE[tone(dd, o.vol)];
        var bd = s.active && s.active.o === o.key ? '#3548fe' : 'transparent';
        var oNew = pOrders[o.key] ? '' : 'animation:dpIn .45s ease both;'; curOrders[o.key] = 1;
        html += '<div class="dp-card" style="width:235px;height:72px;box-sizing:border-box;background:#1d2531;border-radius:10px;border:1.5px solid ' + bd + ';padding:9px 10px 9px 11px;display:flex;flex-direction:column;' + oNew + 'cursor:pointer;transition:border-color .2s,background .18s">'
          + '<div style="display:flex;align-items:center;gap:6px"><span style="flex:1;font-size:12px;font-weight:700">' + esc(o.title) + '</span><span style="font-size:9px;color:#9aa3ad;border:1px solid #4a525e;border-radius:3px;padding:1px 6px">' + esc(o.chip) + '</span><span style="width:14px;height:14px;border-radius:3px;background:#262f3b;display:flex;align-items:center;justify-content:center">' + DOTS('#aab4bf') + '</span></div>'
          + '<div style="font-size:9px;color:#8e98a4;margin-top:2px">Ordered quantity</div>'
          + '<div style="margin-top:auto;height:20px;background:#18202a;border-radius:3px;display:flex;align-items:center;gap:6px;font-size:9.5px;font-weight:600"><span style="width:20px;height:20px;border-radius:3px;background:' + t.iconBg + ';display:flex;align-items:center;justify-content:center">' + CUBE + '</span><span>' + fmt3(o.vol) + '</span><img src="' + t.arrows + '" alt="" style="width:11px;height:11px"><span style="color:' + t.distColor + '">' + fmt3(dd) + '</span></div>'
          + '</div>';
      });
      html += '<div data-act="openModal" style="width:33px;height:72px;background:#1d2531;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer">' + PLUS + '</div>';
      html += '</div>';

      /* contract column */
      html += '<div style="position:absolute;left:10px;top:208px;width:258px;height:401px;overflow:hidden;display:flex;flex-direction:column;gap:11px">';
      contracts.forEach(function (k) {
        var on = !!(s.checked[k.key] != null ? s.checked[k.key] : s.checked[k.base]);
        var mOn = s.menuFor === k.key;
        var t = TONE[tone(kd[k.key], k.vol)];
        var bd = (s.active && s.active.c === k.key) || s.flash === k.key ? '#3548fe' : 'transparent';
        var kNew = pContracts[k.key] ? '' : 'animation:dpIn .45s ease both;'; curContracts[k.key] = 1;
        html += '<div class="dp-card" style="height:110px;flex:none;box-sizing:border-box;background:#1d2531;border-radius:10px;border:1.5px solid ' + bd + ';padding:10px 10px 9px;display:flex;flex-direction:column;' + kNew + 'transition:border-color .2s,background .18s">'
          + '<div style="display:flex;align-items:center;gap:6px">'
          + '<div data-act="toggleContract" data-arg="' + k.key + '" style="width:14px;height:14px;box-sizing:border-box;border-radius:3px;background:' + (on ? '#1d33d1' : 'transparent') + ';border:1px solid ' + (on ? '#1d33d1' : '#6b7480') + ';display:flex;align-items:center;justify-content:center;cursor:pointer;margin-right:3px">' + CHK(on ? 1 : 0) + '</div>'
          + '<span style="flex:1;font-size:12px;font-weight:700">' + esc(k.name) + '</span>'
          + '<span style="font-size:9px;color:#9aa3ad;border:1px solid #4a525e;border-radius:3px;padding:1px 6px">' + esc(k.chip) + '</span>'
          + '<span data-act="menuContract" data-arg="' + k.key + '" style="width:14px;height:14px;border-radius:3px;background:' + (mOn ? '#3548fe' : '#262f3b') + ';display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s">' + DOTS(mOn ? '#ffffff' : '#aab4bf') + '</span>'
          + '</div>'
          + '<div style="margin:3px 0 0 23px;font-size:9px;color:#8e98a4">Supply contract / Cement bulk</div>'
          + '<div style="margin-top:11px;height:20px;background:#18202a;border-radius:3px;display:flex;align-items:center;gap:6px;font-size:9.5px;font-weight:600"><span style="width:20px;height:20px;border-radius:3px;background:' + t.iconBg + ';display:flex;align-items:center;justify-content:center">' + CUBE + '</span><span>' + fmt3(k.vol) + '</span><img src="' + t.arrows + '" alt="" style="width:11px;height:11px"><span style="color:' + t.distColor + '">' + fmt3(kd[k.key]) + '</span></div>'
          + '<div style="margin-top:4px;height:18px;background:#18202a;border-radius:3px;display:flex;align-items:center;padding:0 10px;font-size:9px;color:#8e98a4">Unit price = Index + Logistics – Discount</div>'
          + '</div>';
      });
      if (CONTRACTS.some(function (c) { return !s.clist.some(function (x) { return x.base === c.key; }); }))
        html += '<div data-act="addContract" style="height:33px;flex:none;background:#1d2531;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer">' + PLUS + '</div>';
      html += '</div>';

      /* grid */
      html += '<div style="position:absolute;left:278px;top:208px;width:1000px;height:401px;background:#f0f1f3;border-radius:10px 10px 0 0;overflow:hidden;display:flex"><div style="width:968px;display:flex;flex-direction:column">';
      for (var r = 0; r < 4; r++) {
        html += '<div style="display:flex;height:121px;flex:none">';
        for (var c = 0; c < 4; c++) {
          var o = orders[c], k = contracts[r], has = !!(o && k);
          var key = has ? o.key + '|' + k.key : '';
          var focus = r === ar && c === ac;
          var base = c % 2 ? '#e3e4e8' : '#f0f1f3';
          var bg = focus ? '#c4cae8' : ((r === ar && c < ac) || (c === ac && r < ar)) ? '#dadded' : base;
          var inner = '';
          if (has) {
            var val = s.cells[key] != null ? s.cells[key] : '0';
            inner = '<div style="width:198px;height:26px;box-sizing:border-box;background:#fff;border:1px solid ' + (focus ? '#3548fe' : '#d9dbe0') + ';border-radius:4px;padding:0 8px;display:flex;align-items:center;font-size:11px;color:#1b2129">' + esc(val) + (focus ? '<span style="width:1px;height:13px;background:#1b2129;margin-left:1px;animation:dpBlink 1s steps(1) infinite"></span>' : '') + '</div>';
          }
          html += '<div ' + (has ? 'data-act="cell" data-arg="' + o.key + '|' + k.key + '" ' : '') + 'style="width:242px;height:121px;box-sizing:border-box;background:' + bg + ';border-bottom:1px dotted #a7acb4;display:flex;align-items:center;justify-content:center;transition:background .25s;cursor:' + (has ? 'pointer' : 'default') + '">' + inner + '</div>';
        }
        html += '</div>';
      }
      html += '</div><div style="flex:1;display:flex;justify-content:center;padding-top:10px"><div style="width:3px;height:380px;border-radius:2px;background:#d6d9de"><div style="width:3px;height:90px;border-radius:2px;background:#b5bac2"></div></div></div></div>';

      /* footer */
      var onC = contracts.filter(function (k) { return !!(s.checked[k.key] != null ? s.checked[k.key] : s.checked[k.base]); });
      var volume = onC.reduce(function (a, k) { return a + k.vol; }, 0);
      var distV = onC.reduce(function (a, k) { return a + kd[k.key]; }, 0);
      var barW = (volume ? Math.min(100, distV / volume * 100) : 0).toFixed(1) + '%';
      html += '<div style="position:absolute;left:0;top:609px;width:1288px;height:83px;background:#131a24">'
        + '<div style="position:absolute;left:20px;top:22px"><div style="font-size:7px;font-weight:700;color:#9aa3ae;letter-spacing:0.06em">VOLUME BY SUPPLY CONTRACT</div><div style="margin-top:4px;font-size:22px;font-weight:700">' + fmt(volume) + '<span style="color:#8a93a0;font-weight:600"> t</span></div></div>'
        + '<div style="position:absolute;left:368px;top:22px;width:551px"><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:700"><span>' + fmt(distV) + '<span style="color:#8a93a0;font-weight:600"> t</span></span><span>' + fmt(Math.max(volume - distV, 0)) + '<span style="color:#8a93a0;font-weight:600"> t</span></span></div>'
        + '<div style="margin-top:5px;height:4px;border-radius:2px;background:#2a3442;overflow:hidden"><div style="height:4px;width:' + barW + ';background:linear-gradient(90deg,#d9480f,#f5b301);border-radius:2px;transition:width .6s ease"></div></div>'
        + '<div style="margin-top:5px;display:flex;justify-content:space-between;font-size:6.5px;font-weight:700;letter-spacing:0.06em"><span style="color:#f2a516">DISTRIBUTED</span><span style="color:#9aa3ae">REMAINDER FOR DISTRIBUTION</span></div></div>'
        + '<div style="position:absolute;right:20px;top:28px;display:flex;gap:8px"><div data-act="reset" style="width:81px;height:27px;border-radius:3px;background:#273449;display:flex;align-items:center;justify-content:center;gap:8px;font-size:11.5px;font-weight:600;cursor:pointer">Cancel <svg width="8" height="8" viewBox="0 0 10 10" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M1 1l8 8M9 1L1 9"></path></svg></div>'
        + '<div style="width:81px;height:27px;border-radius:3px;background:#3548fe;display:flex;align-items:center;justify-content:center;gap:8px;font-size:11.5px;font-weight:600;cursor:pointer">Save ' + CHK(1) + '</div></div>'
        + '</div>';

      /* contract ⋯ menu */
      var menuIdx = contracts.findIndex(function (k) { return k.key === s.menuFor; });
      if (menuIdx >= 0 && menuIdx < 3) {
        var menuTop = 208 + 121 * Math.max(menuIdx, 0) + 30;
        var mi = [['edit', 'Edit', 'M4 20h4L19 9l-4-4L4 16v4z'], ['copy', 'Copy', 'M12 4l9 5-9 5-9-5 9-5zM3 14l9 5 9-5'], ['delete', 'Delete', 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13']];
        html += '<div data-act="closeMenu" style="position:absolute;inset:0;z-index:40"></div>';
        html += '<div style="position:absolute;left:256px;top:' + menuTop + 'px;width:120px;box-sizing:border-box;background:#1f2226;border-radius:8px;padding:5px;box-shadow:0 10px 26px rgba(0,0,0,0.5);z-index:41;display:flex;flex-direction:column;gap:2px;' + aMenu + '">';
        mi.forEach(function (m) {
          var on = s.menuHover === m[0];
          html += '<div data-act="menuPick" data-arg="' + m[0] + '" data-hov="' + m[0] + '" style="height:24px;border-radius:5px;padding:0 8px;display:flex;align-items:center;justify-content:space-between;font-size:10.5px;background:' + (on ? '#3548fe' : 'transparent') + ';color:' + (on ? '#ffffff' : '#8b8e94') + ';cursor:pointer;transition:background .15s,color .15s"><span>' + m[1] + '</span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + m[2] + '"></path></svg></div>';
        });
        html += '</div>';
      }

      /* modal */
      if (s.modal) {
        var rowDist = function (r) { return r[5] + sumBy(s.cells, function (k) { return k.split('|')[0] === r[0]; }); };
        var rowStatus = function (r) { var dd = rowDist(r); return dd <= 0 ? 'Draft' : dd >= r[4] ? 'Full' : 'Pending'; };
        var vis = ROWS.map(function (r, i) { return { r: r, i: i }; }).filter(function (x) { return !s.hidden[rowStatus(x.r)]; });
        var allSel = vis.length > 0 && vis.every(function (x) { return s.sel[x.i]; });
        html += '<div data-act="closeModal" style="position:absolute;inset:0;background:rgba(6,9,14,0.72);' + aBg + '"></div>';
        html += '<div style="position:absolute;left:34px;top:34px;width:1220px;height:622px;background:#fff;border-radius:14px;overflow:hidden;color:#111827;' + aModal + 'display:flex;flex-direction:column">';
        html += '<div style="height:46px;flex:none;box-sizing:border-box;padding:0 27px;border-bottom:1px solid #e7e9ed;display:flex;align-items:center;justify-content:space-between"><span style="font-size:13.5px;font-weight:600">Order list</span><img data-act="closeModal" src="' + IC + 'close.svg" alt="Close" style="width:20px;height:20px;cursor:pointer"></div>';
        html += '<div style="margin-top:14px;height:28px;flex:none;padding:0 27px;display:flex;align-items:center;gap:6px"><span style="flex:1;font-size:11px;color:#6b7280">Select one or more orders to include in the distribution plan.</span><div style="width:28px;height:28px;background:#eef0f3;border-radius:4px;display:flex;align-items:center;justify-content:center"><img src="' + IC + 'search.svg" alt="" style="width:17px;height:17px"></div><div data-act="openFilter" style="width:72px;height:28px;background:#eef0f3;border-radius:4px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:11.5px;font-weight:600;color:#243a53;cursor:pointer">Filter <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="#243a53" stroke-width="1.7" stroke-linejoin="round"><path d="M3 4h14l-5.3 6v5.6L8.3 14v-4z"></path></svg></div></div>';
        html += '<div style="margin:14px 27px 0;flex:1;min-height:0;display:flex;flex-direction:column">';
        html += '<div style="display:grid;grid-template-columns:40px 132px 140px 141px 141px 141px 141px 149px 1fr;height:27px;flex:none;align-items:center;background:#e4e9f0;font-size:8.5px;color:#4b5563"><div style="display:flex;justify-content:center"><div data-act="toggleAll" style="width:13px;height:13px;box-sizing:border-box;border-radius:3px;background:' + (allSel ? '#3548fe' : '#ffffff') + ';border:1px solid ' + (allSel ? '#3548fe' : '#c9cdd4') + ';cursor:pointer"></div></div><span>Order ID</span><span>Order date</span><span>Counterparty</span><span>Product</span><span>Ordered volume</span><span>Distributed volume</span><span>Distribution status</span><span>Supply contract</span></div>';
        vis.forEach(function (x, n) {
          var on = !!s.sel[x.i], status = rowStatus(x.r), st = STATUS[status];
          html += '<div data-act="modalRow" data-arg="' + x.i + '" style="display:grid;grid-template-columns:40px 132px 140px 141px 141px 141px 141px 149px 1fr;height:27px;flex:none;align-items:center;background:' + (n % 2 ? '#f5f6f8' : '#ffffff') + ';font-size:9.5px;cursor:pointer">'
            + '<div style="display:flex;justify-content:center"><div style="width:13px;height:13px;box-sizing:border-box;border-radius:3px;background:' + (on ? '#3548fe' : '#ffffff') + ';border:1px solid ' + (on ? '#3548fe' : '#c9cdd4') + ';display:flex;align-items:center;justify-content:center">' + CHK(on ? 1 : 0) + '</div></div>'
            + '<span><span style="border:1px solid #cfd3da;border-radius:3px;padding:2px 6px;font-size:8.5px">' + esc(x.r[0]) + '</span></span>'
            + '<span>' + esc(x.r[1]) + '</span><span>' + esc(x.r[2]) + '</span><span>' + esc(x.r[3]) + '</span><span>' + fmt3(x.r[4]) + '</span><span>' + fmt3(rowDist(x.r)) + '</span>'
            + '<span><span style="background:' + st[0] + ';color:' + st[1] + ';border-radius:8px;padding:2px 7px;font-size:8px">' + status + '</span></span>'
            + '<span><span style="border:1px solid #cfd3da;border-radius:3px;padding:2px 6px;font-size:8.5px">' + esc(x.r[6]) + '</span></span>'
            + '</div>';
        });
        html += '</div>';
        html += '<div style="height:27px;flex:none;margin:14px 27px 20px;display:flex;justify-content:flex-end;gap:8px;color:#fff"><div data-act="closeModal" style="width:82px;height:27px;border-radius:3px;background:#273449;display:flex;align-items:center;justify-content:center;gap:8px;font-size:11.5px;font-weight:600;cursor:pointer">Cancel <svg width="8" height="8" viewBox="0 0 10 10" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M1 1l8 8M9 1L1 9"></path></svg></div><div data-act="saveModal" style="width:82px;height:27px;border-radius:3px;background:#3548fe;display:flex;align-items:center;justify-content:center;gap:8px;font-size:11.5px;font-weight:600;cursor:pointer">Save ' + CHK(1) + '</div></div>';
        if (s.filterOpen) {
          var statuses = [['Draft', '#eef0f3', '#1b2129'], ['Pending', '#8db39a', '#ffffff'], ['Full', '#0f6e2d', '#ffffff'], ['Closed', '#b24b07', '#ffffff']];
          html += '<div style="position:absolute;right:7px;top:7px;bottom:7px;width:218px;box-sizing:border-box;background:#1d2430;border-radius:14px;padding:14px;color:#fff;display:flex;flex-direction:column;' + aFilter + 'box-shadow:-10px 0 30px rgba(0,0,0,0.25)">';
          html += '<div style="height:24px;flex:none;display:flex;align-items:center;justify-content:space-between"><span style="font-size:13px;font-weight:700">Filter</span><svg data-act="closeFilter" width="11" height="11" viewBox="0 0 10 10" stroke="#fff" stroke-width="1.4" stroke-linecap="round" style="cursor:pointer"><path d="M1 1l8 8M9 1L1 9"></path></svg></div>';
          html += '<div style="flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column"><div style="margin-top:16px;line-height:13px;font-size:9.5px;font-weight:600;color:#d8dde4">Distribution status</div><div style="margin-top:8px;display:flex;flex-direction:column;gap:5px">';
          statuses.forEach(function (ss) {
            var off = !!s.hidden[ss[0]];
            html += '<div data-act="status" data-arg="' + ss[0] + '" style="height:17px;box-sizing:border-box;border-radius:4px;background:' + ss[1] + ';color:' + ss[2] + ';opacity:' + (off ? 0.35 : 1) + ';padding:0 8px;display:flex;align-items:center;justify-content:space-between;font-size:9px;font-weight:600;cursor:pointer;transition:opacity .2s"><span>' + ss[0] + '</span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle><path d="M3 3l18 18" style="opacity:' + (off ? 1 : 0) + '"></path></svg></div>';
          });
          html += '</div>';
          html += '<div style="margin-top:14px;font-size:9.5px;font-weight:600;color:#d8dde4">Order date</div><div style="margin-top:5px;height:27px;flex:none;background:#262e3a;border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 8px"><img src="' + IC + 'calendar.svg" alt="" style="width:15px;height:15px;opacity:0.6"></div>';
          html += '<div style="margin-top:14px;height:1px;flex:none;background:#2c3542"></div>';
          html += '<div style="margin-top:14px;font-size:9.5px;font-weight:600;color:#d8dde4">Order ID</div><div style="margin-top:5px;height:27px;flex:none;background:#262e3a;border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 9px"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#8e98a4" stroke-width="1.4" stroke-linecap="round"><path d="M2 6.5L5 3.5l3 3"></path></svg></div>';
          html += '<div style="margin-top:14px;font-size:9.5px;font-weight:600;color:#d8dde4">Counterparty</div><div style="margin-top:5px;height:27px;flex:none;background:#262e3a;border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 9px"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#8e98a4" stroke-width="1.4" stroke-linecap="round"><path d="M2 6.5L5 3.5l3 3"></path></svg></div>';
          html += '<div style="margin-top:14px;font-size:9.5px;font-weight:600;color:#8e98a4">Product</div><div style="margin-top:5px;height:27px;flex:none;background:#262e3a;border-radius:4px;display:flex;align-items:center;justify-content:space-between;padding:0 9px 0 13px;font-size:11px">White cement<svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#8e98a4" stroke-width="1.4" stroke-linecap="round"><path d="M2 6.5L5 3.5l3 3"></path></svg></div>';
          html += '<div style="margin-top:14px;font-size:9.5px;font-weight:600;color:#d8dde4">Trader</div><div style="margin-top:5px;height:27px;flex:none;background:#262e3a;border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 9px"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#8e98a4" stroke-width="1.4" stroke-linecap="round"><path d="M2 6.5L5 3.5l3 3"></path></svg></div>';
          html += '<div style="margin-top:14px;display:flex;align-items:center;gap:9px;font-size:9.5px;font-weight:600;color:#d8dde4"><span style="width:12px;height:12px;border-radius:3px;background:#262e3a"></span>Show only my orders</div>';
          html += '<div style="margin-top:14px;font-size:9.5px;font-weight:600;color:#d8dde4">Ordered volume</div><div style="margin-top:5px;height:27px;flex:none;background:#262e3a;border-radius:4px"></div>';
          html += '</div>';
          html += '<div data-act="closeFilter" style="height:28px;flex:none;margin-top:12px;background:#3548fe;border-radius:4px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:11.5px;font-weight:600;cursor:pointer">Save ' + CHK(1) + '</div>';
          html += '</div>';
        }
        html += '</div>';
      }

      pModal = !!s.modal; pMenu = s.menuFor || null; pFilter = !!s.filterOpen;
      pOrders = curOrders; pContracts = curContracts;
      boardEl.innerHTML = html;
    }

    function renderCursor() {
      var c = state.cursor;
      cursorEl.style.left = c.x + 'px';
      cursorEl.style.top = c.y + 'px';
      cursorEl.style.opacity = c.show ? 1 : 0;
      cursorEl.style.transform = 'scale(' + (c.down ? 0.82 : 1) + ')';
    }

    /* ---- actions (delegated) ---- */
    function act(name, arg) {
      switch (name) {
        case 'openModal': setState(function (p) { var sel = {}; p.included.forEach(function (i) { sel[i] = true; }); return { modal: true, filterOpen: false, sel: sel }; }); break;
        case 'closeModal': setState({ modal: false, filterOpen: false }); break;
        case 'saveModal': setState(function (p) { var inc = Object.keys(p.sel).filter(function (k) { return p.sel[k]; }).map(Number); return { modal: false, filterOpen: false, included: inc.length ? inc : p.included }; }); break;
        case 'openFilter': setState({ filterOpen: true }); break;
        case 'closeFilter': setState({ filterOpen: false }); break;
        case 'toggleAll': setState(function (p) {
          var rowDist = function (r) { return r[5] + sumBy(p.cells, function (k) { return k.split('|')[0] === r[0]; }); };
          var rowStatus = function (r) { var dd = rowDist(r); return dd <= 0 ? 'Draft' : dd >= r[4] ? 'Full' : 'Pending'; };
          var vis = ROWS.map(function (r, i) { return { r: r, i: i }; }).filter(function (x) { return !p.hidden[rowStatus(x.r)]; });
          var allSel = vis.length > 0 && vis.every(function (x) { return p.sel[x.i]; });
          var sel = Object.assign({}, p.sel); vis.forEach(function (x) { sel[x.i] = !allSel; }); return { sel: sel };
        }); break;
        case 'modalRow': setState(function (p) { var sel = Object.assign({}, p.sel); sel[arg] = !sel[arg]; return { sel: sel }; }); break;
        case 'status': setState(function (p) { var hidden = Object.assign({}, p.hidden); hidden[arg] = !hidden[arg]; return { hidden: hidden }; }); break;
        case 'toggleContract': setState(function (p) { var ch = Object.assign({}, p.checked); ch[arg] = !p.checked[arg]; return { checked: ch }; }); break;
        case 'menuContract': setState(function (p) { return { menuFor: p.menuFor === arg ? null : arg, menuHover: null }; }); break;
        case 'closeMenu': setState({ menuFor: null, menuHover: null }); break;
        case 'menuPick': setState(function (p) {
          if (arg === 'copy') return copyOf(p, p.menuFor);
          if (arg === 'delete' && p.clist.length > 1) return { clist: p.clist.filter(function (x) { return x.key !== p.menuFor; }), menuFor: null };
          return { menuFor: null };
        }); break;
        case 'addContract': setState(function (p) { return { clist: addNext(p.clist) }; }); break;
        case 'cell': setState({ active: { o: arg.split('|')[0], c: arg.split('|')[1] } }); break;
        case 'reset': tok = null; setState(Object.assign(initial(), { scale: state.scale })); break;
      }
    }

    /* ---- autoplay ---- */
    function play() {
      var my = {}; tok = my;
      var ok = function () { return mounted && tok === my; };
      var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
      var set = function (p) { if (ok()) setState(p); };
      var mv = function (x, y, ms) { set(function (s) { return { cursor: Object.assign({}, s.cursor, { x: x, y: y, show: true }) }; }); return wait(ms == null ? 650 : ms); };
      var click = function () { set(function (s) { return { cursor: Object.assign({}, s.cursor, { down: true }) }; }); return wait(150).then(function () { set(function (s) { return { cursor: Object.assign({}, s.cursor, { down: false }) }; }); return wait(120); }); };
      (async function () {
        setState(Object.assign(initial(), { scale: state.scale, auto: true }));
        await wait(600); if (!ok()) return;
        await mv(538, 162); if (!ok()) return; await click();
        set({ modal: true, sel: { 0: true }, filterOpen: false, hidden: {} }); await wait(900);
        await mv(1191, 108); if (!ok()) return; await click(); set({ filterOpen: true }); await wait(700);
        await mv(1138, 168.5); if (!ok()) return; await click(); set(function (s) { return { hidden: Object.assign({}, s.hidden, { Full: true }) }; }); await wait(700);
        await mv(1138, 621); if (!ok()) return; await click(); set({ filterOpen: false }); await wait(600);
        var picks = [[1, 1], [2, 2], [3, 4]];
        for (var pi = 0; pi < picks.length; pi++) {
          await mv(75, 163 + 27 * picks[pi][0] + 13.5, 500); if (!ok()) return; await click();
          (function (idx) { set(function (s) { var sel = Object.assign({}, s.sel); sel[idx] = true; return { sel: sel }; }); })(picks[pi][1]);
          await wait(250);
        }
        await mv(1186, 622.5); if (!ok()) return; await click();
        set(function (s) { return { modal: false, included: Object.keys(s.sel).filter(function (k) { return s.sel[k]; }).map(Number) }; }); await wait(900);
        for (var n = 1; n < 4; n++) {
          await mv(139, 208 + 121 * n + 16.5, 600); if (!ok()) return; await click();
          set(function (s) { return { clist: addNext(s.clist) }; }); await wait(450);
        }
        var cols = ['453344', '453324', '453311', '453341'], rws = ['nowa', 'artika', 'lukka', 'skyblue'];
        var seq = [[0, 0, '2 000,000'], [0, 1, '4 000,000'], [0, 2, '3 000,000'], [0, 3, '1 500,000'], [1, 0, '3 500,000'], [1, 2, '7 500,000'], [1, 3, '2 000,000'], [1, 1, '6 000,000']];
        for (var i = 0; i < seq.length; i++) {
          var rr = seq[i][0], cc = seq[i][1], v = seq[i][2], key = cols[cc] + '|' + rws[rr];
          await mv(278 + 242 * cc + 90, 208 + 121 * rr + 64, 480); if (!ok()) return; await click();
          (function (key2, ok2) { set(function (s) { var cells = Object.assign({}, s.cells); cells[key2] = ''; return { active: { o: ok2.o, c: ok2.c }, cells: cells }; }); })(key, { o: cols[cc], c: rws[rr] });
          for (var j = 1; j <= v.length; j++) {
            await wait(55); if (!ok()) return;
            (function (key3, slice) { set(function (s) { var cells = Object.assign({}, s.cells); cells[key3] = slice; return { cells: cells }; }); })(key, v.slice(0, j));
          }
          await wait(200);
        }
        await wait(500);
        await mv(250, 227, 600); if (!ok()) return; await click();
        set({ menuFor: 'nowa', menuHover: null }); await wait(500);
        await mv(300, 255, 350); set({ menuHover: 'edit' });
        await mv(316, 281, 400); if (!ok()) return; set({ menuHover: 'copy' }); await wait(450); await click();
        set(function (s) { return copyOf(s, 'nowa'); }); await wait(1600);
        set({ flash: null });
        await mv(1000, 560, 700);
        set(function (s) { return { cursor: Object.assign({}, s.cursor, { show: false }), auto: false }; });
      })();
    }

    function stopAuto() { if (state.auto) { tok = null; setState(function (p) { return { auto: false, cursor: Object.assign({}, p.cursor, { show: false }) }; }); } }

    /* ---- build shell ---- */
    mount.innerHTML =
      '<div id="dp-shell" style="display:flex;flex-direction:column;gap:16px;width:100%;color:#fff;margin:0 auto">'
      + '<div id="dp-root" style="position:relative;width:100%;height:' + Math.round(692 * state.scale) + 'px;overflow:hidden;border-radius:10px;background:#131a24">'
      + '<div id="dp-scale" style="position:absolute;left:0;top:0;width:1288px;height:692px;transform:scale(' + state.scale + ');transform-origin:0 0;background:#131a24;font-family:\'Manrope\',sans-serif;color:#fff;overflow:hidden;user-select:none">'
      + '<div id="dp-board"></div>'
      + '<div id="dp-cursor" style="position:absolute;left:900px;top:560px;opacity:0;transform:scale(1);transform-origin:0 0;transition:left .55s cubic-bezier(.4,0,.2,1),top .55s cubic-bezier(.4,0,.2,1),opacity .3s,transform .12s;pointer-events:none;z-index:50;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.45))"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 2v18l5-4.8 3.4 7.6 3.2-1.4-3.4-7.4 7.2-.4z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"></path></svg></div>'
      + '</div></div>'
      + '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px 16px"><span id="dp-hint" style="flex:1 1 260px;min-width:0;font-size:15px;line-height:1.4;color:#999"></span><div style="display:flex;gap:8px;flex-shrink:0;white-space:nowrap"><button id="dp-full" style="background:none;border:1px solid #2a2a2e;color:#fff;font-family:\'Geist Mono\',monospace;font-size:13px;padding:10px 16px;border-radius:0;cursor:pointer">[ Fullscreen ↗ ]</button><button id="dp-replay" style="background:none;border:1px solid #2a2a2e;color:#fff;font-family:\'Geist Mono\',monospace;font-size:13px;padding:10px 16px;border-radius:0;cursor:pointer">[ Replay ]</button></div></div>'
      + '</div>';

    rootEl = mount.querySelector('#dp-root');
    scaleEl = mount.querySelector('#dp-scale');
    boardEl = mount.querySelector('#dp-board');
    cursorEl = mount.querySelector('#dp-cursor');
    var hintEl = mount.querySelector('#dp-hint');

    function updateHint() { hintEl.textContent = state.auto ? 'Demo is playing — click inside to take control.' : 'Try it: add orders and contracts with +, open Filter, click any cell.'; }

    rootEl.addEventListener('pointerdown', stopAuto);
    rootEl.addEventListener('click', function (e) {
      var el = e.target.closest('[data-act]'); if (!el || !rootEl.contains(el)) return;
      e.stopPropagation();
      act(el.getAttribute('data-act'), el.getAttribute('data-arg'));
    });
    rootEl.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-hov]'); if (!el) return;
      var id = el.getAttribute('data-hov');
      if (state.menuHover !== id) setState({ menuHover: id });
    });
    mount.querySelector('#dp-replay').addEventListener('click', function () { started = true; play(); });
    var host = mount.parentElement, shellEl = mount.querySelector('#dp-shell'), fullBtn = mount.querySelector('#dp-full'), isFull = false;
    function setFull(on) {
      isFull = on;
      host.style.cssText = on ? 'display:flex;position:fixed;inset:0;z-index:1000;background:#0a0a0c;align-items:center;justify-content:center;padding:32px;width:auto' : 'display:block;width:100%';
      shellEl.style.width = on ? 'min(100%, calc((100vh - 130px) * 1288 / 692))' : '100%';
      fullBtn.textContent = on ? '[ Close × ]' : '[ Fullscreen ↗ ]';
      document.documentElement.style.overflow = on ? 'hidden' : '';
      fit();
    }
    fullBtn.addEventListener('click', function () { setFull(!isFull); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isFull) setFull(false); });
    [fullBtn, mount.querySelector('#dp-replay')].forEach(function (b) { b.onmouseenter = function () { b.style.color = '#4493fa'; }; b.onmouseleave = function () { b.style.color = '#fff'; }; });

    var origSetState = setState;
    setState = function (p) { origSetState(p); updateHint(); };

    function fit() { var w = rootEl.clientWidth; state.scale = w / 1288; scaleEl.style.transform = 'scale(' + state.scale + ')'; rootEl.style.height = Math.round(692 * state.scale) + 'px'; }

    renderBoard(); renderCursor(); updateHint(); fit();
    if ('ResizeObserver' in window) { new ResizeObserver(fit).observe(rootEl); } else { window.addEventListener('resize', fit); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; play(); } }, { threshold: 0.4 });
      io.observe(rootEl);
    } else { started = true; play(); }
  
  }
  customElements.define('erp-proto', class extends HTMLElement {
    connectedCallback() {
      if (this._booted) return; this._booted = true;
      if (!document.getElementById('erp-proto-css')) { var s = document.createElement('style'); s.id = 'erp-proto-css'; s.textContent = CSS; document.head.appendChild(s); }
      if (!document.getElementById('erp-proto-font')) { var l = document.createElement('link'); l.id = 'erp-proto-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap'; document.head.appendChild(l); }
      this.style.display = 'block'; this.style.width = '100%';
      var m = document.createElement('div'); m.id = 'erp-proto'; m.style.width = '100%'; this.appendChild(m);
      boot(m);
    }
  });
})();
