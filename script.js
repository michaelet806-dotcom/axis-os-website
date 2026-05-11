/* ═══════════════════════════════════════════════
   AXIS·OS — Vanilla JS
═══════════════════════════════════════════════ */

(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init(){
    initNav();
    initScrollMark();
    initBootTicker();
    initGridFlicker();
    initOpsFloor();
    initPaletteQuery();
    initSectionReveals();
    initForm();
  }

  /* ─── NAV ─── */
  function initNav(){
    const nav = $('#nav'), menu = $('#navMenu'), drawer = $('#drawer');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 12);
    onScroll();
    addEventListener('scroll', onScroll, { passive:true });
    if (!menu || !drawer) return;
    const setOpen = (open) => {
      menu.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      drawer.toggleAttribute('inert', !open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menu.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    $$('a', drawer).forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false); });
  }

  /* ─── SCROLL PROGRESS ─── */
  function initScrollMark(){
    const m = $('#scrollMark');
    if (!m || reduced) return;
    let raf;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      m.style.width = (max > 0 ? (scrollY / max) * 100 : 0).toFixed(2) + '%';
    };
    update();
    addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive:true });
  }

  /* ─── BOOT TICKER (hero) ─── */
  function initBootTicker(){
    const text = $('#bootText');
    if (!text || reduced) return;
    const lines = [
      'axis boot --company "your_co"',
      '[OK] Chief of Staff online · 3 agents',
      '[OK] Security/SRE online · 4 agents',
      '[OK] Engineering online · 12 agents',
      '[OK] Marketing online · 21 agents',
      '[OK] 11 more departments...',
      'axis ready. uptime 99.98% · 87 agents online'
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % lines.length;
      text.textContent = lines[i];
    }, 2200);
  }

  /* ─── GRID FLICKER (hero right side) ─── */
  function initGridFlicker(){
    const tiles = $$('.tile-mini');
    if (!tiles.length || reduced) return;
    setInterval(() => {
      const t = tiles[Math.floor(Math.random() * tiles.length)];
      t.classList.add('is-active');
      setTimeout(() => t.classList.remove('is-active'), 700);
    }, 1500);
  }

  /* ─── OPS FLOOR — streaming agent activity ─── */
  function initOpsFloor(){
    const floor = $('#opsFloor');
    if (!floor) return;
    const cells = $$('.ops__cell', floor);
    const tasksToday = $('#tasksToday');
    let taskCount = 1247;

    // Each agent has a queue of scripted messages
    const scripts = {
      'SALES.outreach':   ['drafted 12 emails to Series A founders... sent.','calling 3 inbound leads — 2 booked.','responded to RFP from acme.com.','outreach to 47 prospects scheduled.','follow-up sent to deal #2284.'],
      'FINANCE.cash':     ['runway: 14.2 months. no anomalies.','reconciled May AP — $48,200 cleared.','monthly close report ready.','vendor invoice flagged for review.','q3 forecast updated.'],
      'LEGAL.review':     ['reviewed MSA from acme corp · 3 flags.','redlined NDA from new vendor.','indemnity clause approved.','export-control check complete.','compliance audit prep done.'],
      'DESIGN.brand':     ['new asset approved: hero_v3.png','brand audit complete · 2 inconsistencies.','5 social variants generated.','icon set ready for review.','typography scale finalized.'],
      'ENG.deploy':       ['shipped v2.4.1 to prod · all tests pass.','rollback ready · zero downtime.','perf regression caught + reverted.','db migration scheduled 2:00 UTC.','dependency upgrade complete.'],
      'MKT.seo':          ['indexed 14 new programmatic pages.','core web vitals: LCP 1.4s.','keyword cluster gain: +127 ranks.','3 backlinks earned this hour.','content brief delivered.'],
      'SECURITY.scan':    ['no anomalies · last scan 4m ago.','3 dependencies patched.','SOC2 evidence collected.','phishing simulation deployed.','firewall rules updated.'],
      'CHIEFOFSTAFF':     ['routed 14 tasks · 0 backlog.','your weekly digest is ready.','3 decisions need your input.','calendar optimized · 2 hrs reclaimed.','team standups summarized.'],
    };
    const indexes = {};
    cells.forEach(c => { indexes[c.dataset.agent] = 0; });

    const renderCell = (cell) => {
      const agent = cell.dataset.agent;
      const queue = scripts[agent] || [];
      const idx = indexes[agent] % queue.length;
      const body = cell.querySelector('[data-msg]');
      const time = cell.querySelector('.ops__cell-time');
      if (body) typewriter(body, queue[idx], 12);
      if (time) {
        const now = new Date();
        time.textContent = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
      }
      cell.classList.add('is-active');
      setTimeout(() => cell.classList.remove('is-active'), 1800);
      indexes[agent]++;
    };

    const typewriter = (el, text, speed) => {
      if (reduced) { el.textContent = text; return; }
      el.textContent = '';
      let i = 0;
      const tick = () => {
        if (i <= text.length) { el.textContent = text.slice(0, i); i++; setTimeout(tick, speed); }
      };
      tick();
    };

    let intervalId;
    const start = () => {
      // Stagger initial render
      cells.forEach((c, i) => setTimeout(() => renderCell(c), i * 380));
      // Then random ones every ~2.5s
      intervalId = setInterval(() => {
        renderCell(cells[Math.floor(Math.random() * cells.length)]);
        if (tasksToday) {
          taskCount += Math.floor(Math.random() * 3) + 1;
          tasksToday.textContent = taskCount.toLocaleString();
        }
      }, 2400);
    };
    const stop = () => clearInterval(intervalId);

    if (reduced) {
      cells.forEach(c => {
        const agent = c.dataset.agent;
        const body = c.querySelector('[data-msg]');
        const time = c.querySelector('.ops__cell-time');
        if (body) body.textContent = scripts[agent][0];
        if (time) time.textContent = '—';
      });
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? start() : stop());
    }, { threshold:0.3 });
    io.observe(floor);
  }

  /* ─── PALETTE QUERY CYCLING ─── */
  function initPaletteQuery(){
    const q = $('#paletteQuery');
    if (!q || reduced) return;
    const queries = [
      'draft a Q4 board update',
      'build the marketing plan for our launch',
      'audit our SOC2 readiness',
      'forecast cash through 2027',
      'review the Acme MSA',
      'design our pricing page',
      'find churn signals in last 90 days',
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % queries.length;
      q.textContent = queries[i];
    }, 3200);
  }

  /* ─── SECTION REVEALS ─── */
  function initSectionReveals(){
    const sections = $$('.section');
    if (!sections.length || reduced) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in-view'); io.unobserve(e.target); }});
    }, { threshold:0.12 });
    sections.forEach(s => io.observe(s));
  }

  /* ─── CONTACT FORM ─── */
  function initForm(){
    const form    = $('#contactForm');
    const btnTxt  = $('#formBtnText');
    const btnLoad = $('#formBtnLoading');
    const okBox   = $('#formSuccess');
    const errBox  = $('#formError');
    const submit  = $('#formSubmit');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        name:     form.name?.value.trim() || '',
        email:    form.email?.value.trim() || '',
        business: form.business?.value.trim() || '',
        type:     form.type?.value || '',
        message:  form.message?.value.trim() || '',
      };
      if (!data.name || !data.email) {
        errBox.hidden = true;
        requestAnimationFrame(() => {
          errBox.textContent = 'Please add your name and email.';
          errBox.hidden = false;
        });
        const target = !data.name ? $('#f-name') : $('#f-email');
        if (target) target.focus();
        return;
      }
      okBox.hidden = true; errBox.hidden = true;
      btnTxt.hidden = true; btnLoad.hidden = false;
      submit.disabled = true; submit.setAttribute('aria-busy','true');
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'axis-os.org' }),
        });
        if (res.ok) { form.reset(); okBox.hidden = false; okBox.setAttribute('tabindex','-1'); okBox.focus(); }
        else throw new Error();
      } catch {
        errBox.hidden = false;
        errBox.innerHTML = 'Something went wrong. Email us at <a href="mailto:hello@axis-os.org">hello@axis-os.org</a>';
      } finally {
        btnTxt.hidden = false; btnLoad.hidden = true;
        submit.disabled = false; submit.removeAttribute('aria-busy');
      }
    });
  }

})();
