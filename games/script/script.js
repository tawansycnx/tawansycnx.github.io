// =================== UI RENDER ===================
const qList = document.getElementById('qList');
const scriptOut = document.getElementById('scriptOut');
const toggleNumbers = document.getElementById('toggleNumbers');
const gameTitle = document.getElementById('gameTitle');
const pageTitle = document.getElementById('pageTitle');
const cast = document.getElementById('cast');

function renderQuestions(){
  gameTitle.innerHTML = TITLE;
  pageTitle.innerHTML = TITLE;
  cast.innerHTML = CAST;
  qList.innerHTML = '';
  QUESTIONS.forEach((q, i)=>{
    const idx = i+1;
    const row = document.createElement('div');
    row.className='row';
    row.innerHTML = `
      <div class="numb">${idx}</div>
      <div>
        <label for="q${idx}">${q}</label>
        <input type="text" id="q${idx}" placeholder="Enter #${idx}…" maxlength="40" />
      </div>
    `;
    qList.appendChild(row);
  });
}
renderQuestions();

function getAnswers(){
  return QUESTIONS.map((_,i)=>{
    const el = document.getElementById('q'+(i+1));
    return (el.value||'').trim();
  });
}

function hasAll(answers){
  return answers.every(v=>v.length>0);
}

function substitute(text, answers){
  return text.replace(/\[#(\d+)\]/g, (_, n)=>{
    const idx = parseInt(n,10)-1;
    const val = answers[idx] || `[${n}]`;
    const showNumbers = toggleNumbers.checked;
    return `<span class="highlight" title="Answer #${n}">${escapeHtml(val)}${showNumbers?`<span class="tiny muted"> [#${n}]</span>`:''}</span>`;
  });
}

function escapeHtml(s){
  return s.replace(/[&<>\"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
}

function renderScript(answers){
  const lines = TEMPLATE_LINES.map(row=>{
    const isStage = !!row.stage;
    const speaker = row.speaker === '_' ? '' : `<span class="speaker">${row.speaker}:</span> `;
    const text = substitute(row.text, answers);
    return `<div class="line">${speaker}${isStage?`<span class="stage">${text}</span>`:text}</div>`;
  }).join('');
  scriptOut.innerHTML = lines;
}

// =================== ACTIONS ===================
const btnGenerate = document.getElementById('btnGenerate');
const btnSample = document.getElementById('btnSample');
const btnClear = document.getElementById('btnClear');
const btnCopy = document.getElementById('btnCopy');
const btnPrint = document.getElementById('btnPrint');

btnGenerate.addEventListener('click', ()=>{
  const answers = getAnswers();
  if(!hasAll(answers)){
    if(!confirm('Some answers are empty. Generate anyway?')) return;
  }
  renderScript(answers);
});

btnSample.addEventListener('click', ()=>{
  QUESTIONS.forEach((_,i)=>{
    const el=document.getElementById('q'+(i+1));
    el.value=SAMPLES[i]||'';
  });
});

btnClear.addEventListener('click', ()=>{
  if(!confirm('Clear all answers and output?')) return;
  QUESTIONS.forEach((_,i)=>{document.getElementById('q'+(i+1)).value='';});
  scriptOut.innerHTML = '<div class="muted">Cleared. Fill the answers then click <b>Generate Script</b>.</div>';
});

toggleNumbers.addEventListener('change', ()=>{
  const answers = getAnswers();
  if(answers.some(Boolean)) renderScript(answers);
});

btnCopy.addEventListener('click', async ()=>{
  // Make a plaintext version without HTML tags
  const answers = getAnswers();
  const plain = TEMPLATE_LINES.map(row=>{
    const speaker = row.speaker === '_' ? '' : row.speaker+': ';
    const line = row.text.replace(/\[#(\d+)\]/g, (_, n)=> answers[parseInt(n,10)-1] || `[#${n}]`);
    return speaker + line;
  }).join('\n');
  try{
    await navigator.clipboard.writeText(plain);
    alert('Script copied to clipboard!');
  }catch(e){
    alert('Copy failed. You can still select the text and copy manually.');
  }
});

btnPrint.addEventListener('click', ()=> window.print());

