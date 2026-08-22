/* Blue Sky Vacation — Availability Request widget.
   Calendar date picker -> pax/package -> single contact -> auto WhatsApp handoff + done animation.
   No automated supplier check. No payment. WhatsApp confirms manually. */
(function(){
  var CSS = "\
  .bsvb-overlay{position:fixed;inset:0;background:rgba(15,20,24,.55);z-index:1000;display:none;align-items:flex-start;justify-content:center;padding:4vh 1rem;overflow-y:auto;}\
  .bsvb-overlay.open{display:flex;}\
  .bsvb-modal{background:var(--paper,#fff);max-width:560px;width:100%;border:1px solid var(--line,#DCE7F0);margin:auto 0;font-family:'Barlow',sans-serif;color:var(--text,#1E293B);}\
  .bsvb-head{padding:1.4rem 1.6rem;border-bottom:1px solid var(--line,#DCE7F0);display:flex;align-items:center;justify-content:space-between;}\
  .bsvb-title{font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:1.3rem;}\
  .bsvb-step-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent-700,#075985);font-weight:600;margin-bottom:.2rem;}\
  .bsvb-close{background:none;border:none;font-size:1.4rem;line-height:1;cursor:pointer;color:var(--muted,#64748B);padding:.2rem .4rem;}\
  .bsvb-close:hover{color:var(--text,#1E293B);}\
  .bsvb-body{padding:1.6rem;}\
  .bsvb-field{margin-bottom:1.1rem;}\
  .bsvb-field label{display:block;font-size:.82rem;font-weight:600;margin-bottom:.35rem;}\
  .bsvb-field select,.bsvb-field input{width:100%;padding:.65rem .8rem;border:1px solid var(--line,#DCE7F0);font-family:'Barlow',sans-serif;font-size:.95rem;background:#fff;color:var(--text,#1E293B);}\
  .bsvb-field select:focus,.bsvb-field input:focus{outline:2px solid var(--accent,#4AADE8);outline-offset:1px;}\
  .bsvb-row{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;}\
  .bsvb-actions{display:flex;justify-content:space-between;gap:.8rem;margin-top:1.4rem;}\
  .bsvb-btn{font-family:'Barlow',sans-serif;font-size:.9rem;font-weight:600;padding:.75rem 1.4rem;border-radius:2px;border:1px solid transparent;cursor:pointer;white-space:nowrap;}\
  .bsvb-btn-primary{background:var(--accent-700,#075985);color:#fff;}\
  .bsvb-btn-primary:hover{background:var(--accent-900,#053A54);}\
  .bsvb-btn-ghost{background:none;border-color:var(--line,#DCE7F0);color:var(--text,#1E293B);}\
  .bsvb-btn-ghost:hover{border-color:var(--accent,#4AADE8);color:var(--accent-700,#075985);}\
  .bsvb-btn[disabled]{opacity:.5;cursor:not-allowed;}\
  .bsvb-note{font-size:.82rem;color:var(--muted,#64748B);margin-top:1rem;line-height:1.5;}\
  .bsvb-note strong{color:var(--text,#1E293B);}\
  .bsvb-disclaimer{background:var(--accent-100,#E0F2FE);border:1px solid var(--accent-300,#38BDF8);padding:.9rem 1.1rem;font-size:.85rem;color:var(--text,#1E293B);margin-top:1.4rem;text-align:left;line-height:1.5;}\
  .bsvb-cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.7rem;}\
  .bsvb-cal-nav{background:none;border:1px solid var(--line,#DCE7F0);width:30px;height:30px;cursor:pointer;font-size:1rem;line-height:1;}\
  .bsvb-cal-nav:hover{border-color:var(--accent,#4AADE8);color:var(--accent-700,#075985);}\
  .bsvb-cal-nav[disabled]{opacity:.35;cursor:not-allowed;}\
  .bsvb-cal-month{font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:1.05rem;}\
  .bsvb-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:.25rem;}\
  .bsvb-cal-dow{text-align:center;font-size:.68rem;color:var(--muted,#64748B);font-weight:600;text-transform:uppercase;padding-bottom:.3rem;}\
  .bsvb-cal-day{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:.85rem;border:1px solid transparent;background:none;cursor:default;color:var(--muted,#64748B);position:relative;}\
  .bsvb-cal-day.empty{visibility:hidden;}\
  .bsvb-cal-day.avail{cursor:pointer;color:var(--text,#1E293B);border-color:var(--line,#DCE7F0);}\
  .bsvb-cal-day.avail:hover{border-color:var(--accent,#4AADE8);background:var(--accent-100,#E0F2FE);}\
  .bsvb-cal-day.selected{background:var(--accent-700,#075985);border-color:var(--accent-700,#075985);color:#fff;}\
  .bsvb-cal-dot{width:4px;height:4px;border-radius:50%;background:var(--accent,#4AADE8);margin-top:1px;}\
  .bsvb-cal-day.selected .bsvb-cal-dot{background:#fff;}\
  .bsvb-cal-legend{font-size:.78rem;color:var(--muted,#64748B);margin-top:.6rem;min-height:1.2em;}\
  .bsvb-done{text-align:center;padding:1rem 0 .5rem;}\
  .bsvb-check{width:64px;height:64px;border-radius:50%;background:var(--accent-100,#E0F2FE);display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem;animation:bsvb-pop .4s ease;}\
  .bsvb-check svg{width:32px;height:32px;}\
  .bsvb-check path{stroke:var(--accent-700,#075985);stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:48;stroke-dashoffset:48;animation:bsvb-draw .5s .2s ease forwards;}\
  @keyframes bsvb-pop{0%{transform:scale(0);}70%{transform:scale(1.08);}100%{transform:scale(1);}}\
  @keyframes bsvb-draw{to{stroke-dashoffset:0;}}\
  .bsvb-done h3{font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:1.6rem;margin-bottom:.6rem;}\
  .bsvb-done p{color:var(--muted,#64748B);font-size:.95rem;margin-bottom:.4rem;}\
  .bsvb-wa-fallback{font-size:.82rem;margin-top:.9rem;}\
  .bsvb-wa-fallback a{color:var(--accent-700,#075985);font-weight:600;}\
  @media(max-width:520px){.bsvb-row{grid-template-columns:1fr;}}\
  ";
  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  var EMAILJS_SERVICE_ID = 'service_6ynhgqm';
  var EMAILJS_TEMPLATE_ID = 'template_0de7zs6';
  var EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_f2w5y07';
  var EMAILJS_PUBLIC_KEY = 'LOiHDI9-0a5X_jl2I';
  var emailjsReady = null;
  function loadEmailJs(){
    if(emailjsReady) return emailjsReady;
    emailjsReady = new Promise(function(resolve, reject){
      if(window.emailjs){ resolve(window.emailjs); return; }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = function(){ try{ window.emailjs.init({publicKey: EMAILJS_PUBLIC_KEY}); resolve(window.emailjs); }catch(e){ reject(e); } };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return emailjsReady;
  }

  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MON3 = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};

  function parseDateStr(s){
    var m = /^(\d{1,2})\s+([A-Za-z]{3})[A-Za-z]*\s+(\d{4})/.exec((s||'').trim());
    if(!m) return null;
    var mon = MON3[m[2].toLowerCase().slice(0,3)];
    if(mon===undefined) return null;
    return new Date(parseInt(m[3],10), mon, parseInt(m[1],10));
  }
  function fmtDate(d){
    var dd = ('0'+d.getDate()).slice(-2);
    return dd + ' ' + MONTHS[d.getMonth()].slice(0,3) + ' ' + d.getFullYear();
  }
  function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

  function BSVBooking(config){
    this.cfg = Object.assign({
      tripName: 'Trip', waNumber: '60198787790', dates: [], packageOptions: [], maxPax: 8
    }, config);
    this.availDates = [];
    this.isDaily = false;
    (this.cfg.dates||[]).forEach(function(d){
      var parsed = parseDateStr(d.date);
      if(parsed) this.availDates.push({d: parsed, price: d.price});
      else this.isDaily = true;
    }, this);
    if(!this.availDates.length) this.isDaily = true;
    this.state = { date:'', pkg:'', pax:1, contact:{name:'',dob:'',email:'',phone:'',remarks:''} };
    this._build();
  }

  BSVBooking.prototype._build = function(){
    var self = this;
    this.overlay = el('div','bsvb-overlay');
    this.modal = el('div','bsvb-modal');
    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);
    this.overlay.addEventListener('click', function(e){ if(e.target===self.overlay) self.close(); });
  };

  BSVBooking.prototype.open = function(preset){
    this.step=1;
    this.state = Object.assign({date:'',pkg:'',pax:1,contact:{name:'',dob:'',email:'',phone:'',remarks:''}}, preset||{});
    var today = new Date();
    this._calMonth = this.availDates.length ? new Date(this.availDates[0].d.getFullYear(), this.availDates[0].d.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1);
    this._renderStep1();
    this.overlay.classList.add('open');
    document.body.style.overflow='hidden';
  };
  BSVBooking.prototype.close = function(){ this.overlay.classList.remove('open'); document.body.style.overflow=''; };

  BSVBooking.prototype._shell = function(labelText, titleText, bodyEl){
    var self = this;
    this.modal.innerHTML = '';
    var head = el('div','bsvb-head');
    var headText = el('div','', '<div class="bsvb-step-label">'+esc(labelText)+'</div><div class="bsvb-title">'+esc(titleText)+'</div>');
    var close = el('button','bsvb-close','&times;');
    close.onclick = function(){ self.close(); };
    head.appendChild(headText); head.appendChild(close);
    var body = el('div','bsvb-body');
    body.appendChild(bodyEl);
    this.modal.appendChild(head);
    this.modal.appendChild(body);
  };

  BSVBooking.prototype._monthBounds = function(){
    var today = new Date(); today.setHours(0,0,0,0);
    if(this.availDates.length){
      var min = this.availDates.reduce(function(a,b){ return b.d<a?b.d:a; }, this.availDates[0].d);
      var max = this.availDates.reduce(function(a,b){ return b.d>a?b.d:a; }, this.availDates[0].d);
      return { min: new Date(min.getFullYear(), min.getMonth(), 1), max: new Date(max.getFullYear(), max.getMonth(), 1) };
    }
    var maxFar = new Date(today.getFullYear(), today.getMonth()+12, 1);
    return { min: new Date(today.getFullYear(), today.getMonth(), 1), max: maxFar };
  };

  BSVBooking.prototype._renderCalendar = function(container){
    var self = this;
    container.innerHTML = '';
    var bounds = this._monthBounds();
    var head = el('div','bsvb-cal-head');
    var prev = el('button','bsvb-cal-nav','&#8249;');
    var label = el('div','bsvb-cal-month', MONTHS[this._calMonth.getMonth()] + ' ' + this._calMonth.getFullYear());
    var next = el('button','bsvb-cal-nav','&#8250;');
    prev.disabled = this._calMonth <= bounds.min;
    next.disabled = this._calMonth >= bounds.max;
    prev.onclick = function(){ if(!prev.disabled){ self._calMonth = new Date(self._calMonth.getFullYear(), self._calMonth.getMonth()-1, 1); self._renderCalendar(container); } };
    next.onclick = function(){ if(!next.disabled){ self._calMonth = new Date(self._calMonth.getFullYear(), self._calMonth.getMonth()+1, 1); self._renderCalendar(container); } };
    head.appendChild(prev); head.appendChild(label); head.appendChild(next);
    container.appendChild(head);

    var grid = el('div','bsvb-cal-grid');
    ['S','M','T','W','T','F','S'].forEach(function(dow){ grid.appendChild(el('div','bsvb-cal-dow', dow)); });
    var y = this._calMonth.getFullYear(), m = this._calMonth.getMonth();
    var firstDow = new Date(y,m,1).getDay();
    var daysInMonth = new Date(y,m+1,0).getDate();
    var today = new Date(); today.setHours(0,0,0,0);
    var legend = el('div','bsvb-cal-legend','');

    for(var i=0;i<firstDow;i++) grid.appendChild(el('div','bsvb-cal-day empty'));
    for(var day=1; day<=daysInMonth; day++){
      var thisDate = new Date(y,m,day);
      var cell = el('div','bsvb-cal-day');
      cell.appendChild(document.createTextNode(day));
      var matchInfo = null;
      var isAvail = false;
      if(self.isDaily){
        isAvail = thisDate >= today;
      } else {
        matchInfo = self.availDates.find(function(a){ return sameDay(a.d, thisDate); });
        isAvail = !!matchInfo;
      }
      if(isAvail){
        cell.classList.add('avail');
        if(matchInfo) cell.appendChild(el('div','bsvb-cal-dot'));
        if(self.state.date && self.state.date.indexOf(fmtDate(thisDate))===0) cell.classList.add('selected');
        cell.onclick = function(d, info){ return function(){
          self.state.date = fmtDate(d) + (info ? ' (' + info.price + ')' : '');
          self._renderCalendar(container);
          legend.textContent = info ? ('Available — ' + info.price) : ('Selected: ' + fmtDate(d));
        }; }(thisDate, matchInfo);
      }
      grid.appendChild(cell);
    }
    container.appendChild(grid);
    container.appendChild(legend);
    if(this.state.date) legend.textContent = 'Selected: ' + this.state.date;
  };

  BSVBooking.prototype._renderStep1 = function(){
    var self = this;
    var body = el('div');
    var calWrap = el('div','bsvb-field');
    calWrap.appendChild(el('label','', this.isDaily ? 'Pick a date (book any day)' : 'Pick your departure date'));
    var calBox = el('div');
    calWrap.appendChild(calBox);
    body.appendChild(calWrap);
    this._renderCalendar(calBox);

    if(this.cfg.packageOptions && this.cfg.packageOptions.length){
      var pkgField = el('div','bsvb-field');
      pkgField.appendChild(el('label','', 'Package / hotel'));
      var pkgSel = el('select');
      this.cfg.packageOptions.forEach(function(p){ var o=el('option','',esc(p)); o.value=p; pkgSel.appendChild(o); });
      if(this.state.pkg) pkgSel.value = this.state.pkg;
      pkgField.appendChild(pkgSel);
      body.appendChild(pkgField);
      this._pkgSel = pkgSel;
    }

    var paxField = el('div','bsvb-field');
    paxField.appendChild(el('label','', 'Number of travellers'));
    var paxInput = el('input');
    paxInput.type = 'number'; paxInput.min = 1; paxInput.max = this.cfg.maxPax; paxInput.value = this.state.pax || 1;
    paxField.appendChild(paxInput);
    body.appendChild(paxField);

    var actions = el('div','bsvb-actions');
    var next = el('button','bsvb-btn bsvb-btn-primary','Check Availability');
    next.onclick = function(){
      if(!self.state.date){ alert('Please pick a date from the calendar.'); return; }
      self.state.pkg = self._pkgSel ? self._pkgSel.value : (self.state.pkg||'');
      self.state.pax = Math.max(1, Math.min(self.cfg.maxPax, parseInt(paxInput.value,10)||1));
      self._renderStep2();
    };
    actions.appendChild(el('span'));
    actions.appendChild(next);
    body.appendChild(actions);

    this._shell('Step 1 of 2', 'Choose your date', body);
  };

  BSVBooking.prototype._renderStep2 = function(){
    var self = this;
    var body = el('div');
    var c = this.state.contact;

    var nameField = el('div','bsvb-field');
    nameField.appendChild(el('label','','Full name'));
    var nameInput = el('input'); nameInput.value = c.name;
    nameInput.oninput = function(){ c.name = nameInput.value; };
    nameField.appendChild(nameInput);
    body.appendChild(nameField);

    var dobField = el('div','bsvb-field');
    dobField.appendChild(el('label','','Date of birth'));
    var dobInput = el('input'); dobInput.type='date'; dobInput.value = c.dob;
    dobInput.oninput = function(){ c.dob = dobInput.value; };
    dobField.appendChild(dobInput);
    body.appendChild(dobField);

    var row2 = el('div','bsvb-row');
    var emailField = el('div','bsvb-field');
    emailField.appendChild(el('label','','Email'));
    var emailInput = el('input'); emailInput.type='email'; emailInput.value = c.email;
    emailInput.oninput = function(){ c.email = emailInput.value; };
    emailField.appendChild(emailInput);
    var phoneField = el('div','bsvb-field');
    phoneField.appendChild(el('label','','Phone'));
    var phoneInput = el('input'); phoneInput.type='tel'; phoneInput.value = c.phone;
    phoneInput.oninput = function(){ c.phone = phoneInput.value; };
    phoneField.appendChild(phoneInput);
    row2.appendChild(emailField); row2.appendChild(phoneField);
    body.appendChild(row2);

    var remarksField = el('div','bsvb-field');
    remarksField.appendChild(el('label','','Remarks (optional)'));
    var remarksInput = document.createElement('textarea');
    remarksInput.rows = 3;
    remarksInput.style.cssText = 'width:100%;padding:.65rem .8rem;border:1px solid var(--line,#DCE7F0);font-family:\'Barlow\',sans-serif;font-size:.95rem;background:#fff;color:var(--text,#1E293B);resize:vertical;';
    remarksInput.placeholder = 'Dietary needs, room preferences, special occasions...';
    remarksInput.value = c.remarks || '';
    remarksInput.oninput = function(){ c.remarks = remarksInput.value; };
    remarksField.appendChild(remarksInput);
    body.appendChild(remarksField);

    body.appendChild(el('div','bsvb-note','Availability and final pricing will be confirmed by Blue Sky before payment.'));

    var actions = el('div','bsvb-actions');
    var back = el('button','bsvb-btn bsvb-btn-ghost','Back');
    back.onclick = function(){ self._renderStep1(); };
    var submit = el('button','bsvb-btn bsvb-btn-primary','Check Availability');
    submit.onclick = function(){
      if(!c.name || !c.dob || !c.email || !c.phone){
        alert('Please fill in your name, date of birth, email and phone.');
        return;
      }
      self._submit();
    };
    actions.appendChild(back);
    actions.appendChild(submit);
    body.appendChild(actions);

    this._shell('Step 2 of 2', 'Your contact info', body);
  };

  BSVBooking.prototype._buildMessage = function(){
    var s = this.state, cfg = this.cfg, c = s.contact;
    var reqId = 'BSV-' + Date.now().toString(36).toUpperCase();
    var lines = [];
    lines.push('Hi Blue Sky, I\u2019d like to check availability for:');
    lines.push('');
    lines.push('Trip: ' + cfg.tripName);
    lines.push('Departure: ' + s.date);
    lines.push('Travellers: ' + s.pax);
    if(s.pkg) lines.push('Package / Hotel: ' + s.pkg);
    lines.push('');
    lines.push('Lead Traveller:');
    lines.push('Name: ' + c.name);
    lines.push('Date of Birth: ' + (c.dob || '-'));
    lines.push('Email: ' + c.email);
    lines.push('Phone: ' + c.phone);
    if(c.remarks) lines.push('Remarks: ' + c.remarks);
    lines.push('');
    lines.push('Request ID: ' + reqId);
    lines.push('');
    lines.push('Please help me check availability and the final price.');
    this._reqId = reqId;
    return lines.join('\n');
  };

  BSVBooking.prototype._submit = function(){
    this._buildMessage();
    this._sendEmailNotification();
    this._renderDone();
  };

  BSVBooking.prototype._sendEmailNotification = function(){
    var s = this.state, cfg = this.cfg, c = s.contact;
    var params = {
      trip_name: cfg.tripName,
      departure_date: s.date,
      pax: s.pax,
      package: s.pkg || '-',
      lead_name: c.name,
      lead_dob: c.dob || '-',
      lead_email: c.email,
      lead_phone: c.phone,
      remarks: c.remarks || '-',
      request_id: this._reqId
    };
    loadEmailJs().then(function(emailjs){
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    }).catch(function(err){ console.warn('EmailJS notification failed', err); });
    loadEmailJs().then(function(emailjs){
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, params);
    }).catch(function(err){ console.warn('EmailJS customer confirmation failed', err); });
  };

  BSVBooking.prototype._renderDone = function(){
    var self = this;
    var body = el('div');
    var done = el('div','bsvb-done');
    var check = el('div','bsvb-check','<svg viewBox="0 0 24 24"><path d="M4 12l6 6L20 6"></path></svg>');
    done.appendChild(check);
    done.appendChild(el('h3','', 'Your request is sent!'));
    done.appendChild(el('p','', 'We\u2019ll send you a confirmation email shortly.'));
    var disclaimer = el('div','bsvb-disclaimer','This is an <strong>availability request</strong>, not a booking confirmation. Availability and final pricing will be confirmed by Blue Sky before payment. Request ID: ' + this._reqId);
    done.appendChild(disclaimer);
    body.appendChild(done);

    var actions = el('div','bsvb-actions');
    var closeBtn = el('button','bsvb-btn bsvb-btn-primary','Done');
    closeBtn.style.marginLeft = 'auto';
    closeBtn.onclick = function(){ self.close(); };
    actions.appendChild(closeBtn);
    body.appendChild(actions);

    this._shell('Request sent', 'All done', body);
  };

  window.BSVBooking = BSVBooking;
})();
