// Login e gerenciamento: o banco valida permissões em TODAS as operações.
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const dialog = $('demoAdmin');
  const message = $('adminMessage');
  const login = $('adminLogin');
  const panel = $('adminPanel');
  const rows = $('adminRows');
  const dateInput = $('adminDate');
  const professionalInput = $('adminProfessional');
  let client = null;
  let allBookings = [];
  const say = text => { message.textContent = text; };
  const today = () => { const d = new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); };
  dateInput.value = today();

  function getClient() {
    if (!window.supabase) throw new Error('Biblioteca Supabase indisponível.');
    if (!client) client = window.supabase.createClient(
      'https://rvgbxrkucnfrqztljfxb.supabase.co',
      'sb_publishable_xxmkrvTwXQ8SqF8JVbBL_Q_BMN8tQpU',
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }, global: { headers: { 'x-client-info': 'reis-admin' } } }
    );
    return client;
  }
  function render() {
    const filtered = allBookings.filter(b => (!dateInput.value || b.data === dateInput.value) && (!professionalInput.value || b.profissional === professionalInput.value));
    $('adminCount').textContent = filtered.length;
    $('adminPros').textContent = new Set(filtered.map(b => b.profissional)).size;
    $('adminToday').textContent = allBookings.filter(b => b.data === today()).length;
    rows.replaceChildren();
    if (!filtered.length) { const tr = rows.insertRow(); const td = tr.insertCell(); td.colSpan=6; td.textContent='Nenhum agendamento encontrado.'; return; }
    for (const b of filtered) {
      const tr = rows.insertRow();
      [b.data,b.horario,b.nome,b.profissional,b.servico].forEach(v => { const td=tr.insertCell(); td.textContent=String(v ?? ''); });
      const td=tr.insertCell(); const btn=document.createElement('button'); btn.type='button'; btn.className='reis-admin-delete'; btn.textContent='Excluir';
      btn.addEventListener('click', async () => {
        if (!window.confirm(`Excluir o agendamento de ${b.nome} em ${b.data} às ${b.horario}? Esta ação libera o horário.`)) return;
        btn.disabled=true;
        try {
          const { data, error } = await getClient().rpc('admin_excluir_agendamento', { p_id: b.id });
          if (error) throw error;
          if (!data || (typeof data === 'object' && data.sucesso !== true)) throw new Error(data?.mensagem || 'Agendamento não encontrado.');
          say('Agendamento excluído. Horário liberado.'); await refresh();
        } catch(e) { say('Falha ao excluir: '+e.message); btn.disabled=false; }
      });
      td.append(btn);
    }
  }
   function dateKey(d) { return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); }
   function addDays(d,n) { const x=new Date(d.getFullYear(),d.getMonth(),d.getDate(),12); x.setDate(x.getDate()+n); return x; }
   function renderStats() {
     const now=new Date();
     const todayKey=dateKey(now);
     const monday=addDays(now,-((now.getDay()+6)%7));
     const monthStart=dateKey(new Date(now.getFullYear(),now.getMonth(),1));
     const period=Number($('statsPeriod')?.value || 30);
     const start=dateKey(addDays(now,-(period-1)));
     const valid=allBookings.filter(b=>typeof b.data==='string' && /^\d{4}-\d{2}-\d{2}$/.test(b.data));
     const inPeriod=valid.filter(b=>b.data>=start && b.data<=todayKey);
     $('statsToday').textContent=valid.filter(b=>b.data===todayKey).length;
     $('statsWeek').textContent=valid.filter(b=>b.data>=dateKey(monday) && b.data<=todayKey).length;
     $('statsMonth').textContent=valid.filter(b=>b.data>=monthStart && b.data<=todayKey).length;
     $('statsPeriodTotal').textContent=inPeriod.length;
     function horizontal(id, values, limit) {
       const target=$(id); target.replaceChildren();
       const sorted=[...values.entries()].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0],'pt-BR')).slice(0,limit);
       if(!sorted.length){const p=document.createElement('p');p.textContent='Nenhuma reserva no período.';target.append(p);return;}
       const max=Math.max(...sorted.map(x=>x[1]),1);
       for(const [label,count] of sorted){
         const item=document.createElement('div');item.className='reis-chart-row';
         const top=document.createElement('div');top.className='reis-chart-row-top';
         const name=document.createElement('span');name.textContent=label;
         const number=document.createElement('strong');number.textContent=String(count);
         top.append(name,number);
         const track=document.createElement('div');track.className='reis-chart-track';
         const fill=document.createElement('span');fill.style.width=`${count/max*100}%`;track.append(fill);
         item.append(top,track);target.append(item);
       }
     }
     const pros=new Map(),services=new Map(),daily=new Map();
     for(let i=0;i<period;i++)daily.set(dateKey(addDays(now,i-(period-1))),0);
     for(const b of inPeriod){
       const pro=String(b.profissional||'Não informado');
       const service=String(b.servico||'Não informado');
       pros.set(pro,(pros.get(pro)||0)+1);
       services.set(service,(services.get(service)||0)+1);
       daily.set(b.data,(daily.get(b.data)||0)+1);
     }
     horizontal('statsProfessionals',pros,10);
     horizontal('statsServices',services,7);
     const days=$('statsDays');days.replaceChildren();
     const max=Math.max(1,...daily.values());
     for(const [date,count] of daily){
       const bar=document.createElement('div');bar.className='reis-day-column';
       const fill=document.createElement('span');fill.className='reis-day-fill';fill.style.height=`${count?Math.max(7,count/max*100):2}%`;
       fill.title=`${date}: ${count} reserva(s)`;
       bar.append(fill);days.append(bar);
     }
     days.setAttribute('aria-label',`Reservas diárias nos últimos ${period} dias: ${[...daily].filter(x=>x[1]>0).map(x=>x[0]+': '+x[1]).join(', ')||'nenhuma'}`);
   }
   $('statsPeriod')?.addEventListener('change',renderStats);
  async function refresh() {
    const {data,error} = await getClient().rpc('admin_listar_agendamentos');
    if (error) throw error;
    allBookings = Array.isArray(data) ? data : [];
    const current = professionalInput.value;
    professionalInput.replaceChildren(new Option('Todos',''));
    [...new Set(allBookings.map(b=>b.profissional).filter(Boolean))].sort().forEach(name => professionalInput.add(new Option(name,name)));
    professionalInput.value=current;
    render(); renderStats();
  }
  async function checkAuth() {
    const {data:{user},error} = await getClient().auth.getUser();
    if (error || !user) { panel.hidden=true; login.hidden=false; return; }
    const {data:allowed,error:permissionError} = await getClient().rpc('admin_eh_autorizado');
    if (permissionError || allowed !== true) {
      panel.hidden=true; login.hidden=false;
      say('Conta autenticada, mas sem permissão administrativa.');
      await getClient().auth.signOut(); return;
    }
    login.hidden=true; panel.hidden=false; $('adminUser').textContent=user.email || 'Administrador';
    try { await refresh(); say('Acesso administrativo autorizado.'); }
    catch(e) { say('Não foi possível carregar reservas: '+e.message); }
  }
  $('openDemoAdmin')?.addEventListener('click', async () => {
    dialog.showModal(); say('Verificando acesso...');
    try { await checkAuth(); } catch(e) { say(e.message); }
  });
  $('closeDemoAdmin')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if(e.target===dialog) dialog.close(); });
  login.addEventListener('submit', async e => {
    e.preventDefault(); const btn=login.querySelector('button'); btn.disabled=true; say('Autenticando...');
    try {
      const {error}=await getClient().auth.signInWithPassword({email:$('adminEmail').value.trim(),password:$('adminPassword').value});
      if(error) throw error;
      $('adminPassword').value=''; await checkAuth();
    } catch(e) { say('Falha no login: '+e.message); } finally {btn.disabled=false;}
  });
  $('adminLogout').addEventListener('click',async()=>{await getClient().auth.signOut();allBookings=[];rows.replaceChildren();renderStats();panel.hidden=true;login.hidden=false;say('Sessão encerrada.');});
  $('adminRefresh').addEventListener('click',async()=>{try{await refresh();say('Agenda atualizada.');}catch(e){say('Erro: '+e.message);}});
  dateInput.addEventListener('change',render);
  professionalInput.addEventListener('change',render);
});
