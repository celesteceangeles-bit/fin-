const PETS=[
{nombre:"Luna",especie:"Perro",edad:3,tamano:"Mediano",personalidad:"Tranquila",actividad:"Bajo",imagen:"imagenes/luna.jpg"},
{nombre:"Milo",especie:"Gato",edad:2,tamano:"Pequeño",personalidad:"Cariñoso",actividad:"Bajo",imagen:"imagenes/milo.jpg"},
{nombre:"Toby",especie:"Perro",edad:1,tamano:"Grande",personalidad:"Activo",actividad:"Alto",imagen:"imagenes/toby.jpg"},
{nombre:"Nala",especie:"Gato",edad:4,tamano:"Pequeño",personalidad:"Tranquila",actividad:"Medio",imagen:"imagenes/nala.jpg"},
{nombre:"Rocky",especie:"Perro",edad:5,tamano:"Grande",personalidad:"Activo",actividad:"Alto",imagen:"imagenes/rocky.jpg"},
{nombre:"Copito",especie:"Conejo",edad:1,tamano:"Mediano",personalidad:"Tranquila",actividad:"Bajo",imagen:"imagenes/copito.jpg"},
{nombre:"Nube",especie:"Hámster",edad:1,tamano:"Pequeño",personalidad:"Activo",actividad:"Medio",imagen:"imagenes/nube.jpg"},
{nombre:"Kiwi",especie:"Canario",edad:2,tamano:"Pequeño",personalidad:"Activo",actividad:"Medio",imagen:"imagenes/kiwi.jpg"},
{nombre:"Pipo",especie:"Periquito",edad:1,tamano:"Pequeño",personalidad:"Cariñoso",actividad:"Medio",imagen:"imagenes/pipo.jpg"}
];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const supaConfig=window.PETMATCH_SUPABASE||{};
let supabase=null;
// La navegación no depende de Supabase: debe funcionar aunque falte configurar la base.
function switchTab(id){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click',e=>{
  const button=e.target.closest('.tab');
  if(!button)return;
  e.preventDefault();
  switchTab(button.dataset.tab);
});
// Evita que una URL/clave de ejemplo o una configuración incompleta detenga todo el JavaScript.
try{
  const validUrl=typeof supaConfig.url==='string' && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supaConfig.url.trim());
  const validKey=typeof supaConfig.anonKey==='string' && /^(sb_publishable_|eyJ)/.test(supaConfig.anonKey.trim());
  if(window.supabase && validUrl && validKey) supabase=window.supabase.createClient(supaConfig.url.trim(),supaConfig.anonKey.trim());
}catch(error){console.error('No se pudo inicializar Supabase:',error);}
let adminUser=null;
const show=(el,msg,type='')=>{el.innerHTML=`<div class="toast ${type}">${esc(msg)}</div>`};
const favoriteSet=()=>new Set(JSON.parse(localStorage.getItem('petmatch-favorites')||'[]'));
function saveFavorites(s){localStorage.setItem('petmatch-favorites',JSON.stringify([...s]));renderPets();}
function petCard(p,fav=false){let favorite=favoriteSet().has(p.nombre);return `<article class="pet-card"><img src="${p.imagen}" alt="Foto de ${esc(p.nombre)}" loading="lazy"><h3>${esc(p.nombre)}</h3><div class="pet-meta"><span><b>Especie:</b> ${esc(p.especie)}</span><span><b>Edad:</b> ${p.edad} años</span><span><b>Tamaño:</b> ${esc(p.tamano)}</span><span><b>Personalidad:</b> ${esc(p.personalidad)}</span><span><b>Actividad:</b> ${esc(p.actividad)}</span></div><button class="btn secondary favorite-btn" data-pet="${esc(p.nombre)}">${favorite?'♥ Quitar de favoritos':'♡ Agregar a favoritos'}</button><button class="btn small adopt-this" data-pet="${esc(p.nombre)}">Solicitar adopción</button></article>`;}
function renderPets(){const sp=$('#f-especie').value,sz=$('#f-tamano').value,pe=$('#f-personalidad').value;const list=PETS.filter(p=>(sp==='Todas'||p.especie===sp)&&(sz==='Todos'||p.tamano===sz)&&(pe==='Todas'||p.personalidad===pe));$('#pet-count').textContent=`Encontramos ${list.length} mascota(s).`;$('#pet-grid').innerHTML=list.length?list.map(p=>petCard(p)).join(''):'<div class="empty">No encontramos mascotas con esos filtros. Probá con otras opciones.</div>';const favorites=PETS.filter(p=>favoriteSet().has(p.nombre));$('#favorites').innerHTML=favorites.length?favorites.map(p=>petCard(p,true)).join(''):'<div class="empty">Todavía no guardaste favoritas. Podés hacerlo desde las tarjetas de mascotas.</div>';document.querySelectorAll('.favorite-btn').forEach(b=>b.addEventListener('click',()=>{let s=favoriteSet();s.has(b.dataset.pet)?s.delete(b.dataset.pet):s.add(b.dataset.pet);saveFavorites(s);}));document.querySelectorAll('.adopt-this').forEach(b=>b.addEventListener('click',()=>{$('#adopt-pet').value=b.dataset.pet;switchTab('solicitar');}));}
function fillFilters(){const vals=[['#f-especie','Todas','especie'],['#f-tamano','Todos','tamano'],['#f-personalidad','Todas','personalidad']];vals.forEach(([sel,first,key])=>{const v=[...new Set(PETS.map(p=>p[key]))].sort();$(sel).innerHTML=`<option>${first}</option>`+v.map(x=>`<option>${esc(x)}</option>`).join('');$(sel).addEventListener('change',renderPets);});$('#adopt-pet').innerHTML=PETS.map(p=>`<option>${esc(p.nombre)}</option>`).join('');}
function compatibility(p,home,time,activity){let pts=0;if(home==='Casa')pts++;else if(home==='Departamento'&&(p.tamano==='Pequeño'||['Gato','Hámster','Canario','Periquito'].includes(p.especie)))pts++;if(time==='Mucho')pts++;else if(time==='Medio'&&['Bajo','Medio'].includes(p.actividad))pts++;else if(time==='Poco'&&p.actividad==='Bajo')pts++;if(activity==='Indiferente')pts++;else if(activity==='Tranquilo'&&['Bajo','Medio'].includes(p.actividad))pts++;else if(activity==='Activo'&&p.actividad==='Alto')pts++;if(activity==='Tranquilo'&&['Tranquila','Cariñoso'].includes(p.personalidad))pts++;else if(activity==='Activo'&&p.personalidad==='Activo')pts++;else if(!['Tranquilo','Activo'].includes(activity))pts++;return Math.round(pts/4*100);}
$('#test-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#test-name').value.trim();if(!name)return;let rows=PETS.map(p=>({p,score:compatibility(p,$('#test-home').value,$('#test-time').value,$('#test-activity').value)})).sort((a,b)=>b.score-a.score);$('#test-results').innerHTML=`<h3>Resultados para ${esc(name)}</h3><p>Estas son las mascotas ordenadas de mayor a menor compatibilidad.</p>`+rows.map((r,i)=>`<article class="result-card"><img src="${r.p.imagen}" alt="Foto de ${esc(r.p.nombre)}"><div><h3>${esc(r.p.nombre)}: ${r.score}%</h3><div class="progress"><span style="width:${Math.max(0,Math.min(r.score,100))}%"></span></div><p><b>Especie:</b> ${esc(r.p.especie)}<br><b>Personalidad:</b> ${esc(r.p.personalidad)}</p>${r.score===rows[0].score?'<span class="status">Una de tus mayores compatibilidades</span>':''}<p><button class="btn small result-adopt" data-pet="${esc(r.p.nombre)}">Me interesa</button></p></div></article>`).join('')+`<div class="notice">El resultado es orientativo. Antes de adoptar, considerá las necesidades reales de la mascota.</div>`;document.querySelectorAll('.result-adopt').forEach(b=>b.addEventListener('click',()=>{$('#adopt-pet').value=b.dataset.pet;switchTab('solicitar');}));});
$('#adoption-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const feedback=$('#adoption-feedback');
  const payload={nombre:$('#adopt-name').value.trim(),email:$('#adopt-email').value.trim().toLowerCase(),mascota:$('#adopt-pet').value,motivo:$('#adopt-reason').value.trim(),estado:'Pendiente',mensajes:[]};
  if(!payload.nombre||!payload.email||!payload.motivo){show(feedback,'Completá tu nombre, correo y motivo de adopción.','warn');return;}
  if(!supabase){show(feedback,'Falta configurar la URL y la Publishable Key de Supabase en public/supabase-config.js.','error');return;}
  try{
    const {data,error}=await supabase.rpc('crear_solicitud',{p_nombre:payload.nombre,p_email:payload.email,p_mascota:payload.mascota,p_motivo:payload.motivo});
    if(error) throw error;
    show(feedback,`Tu solicitud para ${payload.mascota} se registró correctamente. Tu número de solicitud es ${data}. Guardalo junto con el correo que utilizaste para consultar el estado más adelante.`);
    e.target.reset();
  }catch(err){show(feedback,err.message||'No se pudo registrar la solicitud. Revisá la configuración de Supabase.','error');}
});
$('#status-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const box=$('#status-feedback');
  if(!supabase){show(box,'Falta configurar Supabase en public/supabase-config.js.','error');return;}
  try{
    const {data,error}=await supabase.rpc('consultar_estado_solicitud',{p_id:Number($('#status-id').value),p_email:$('#status-email').value.trim().toLowerCase()});
    if(error) throw error;
    const s=Array.isArray(data)?data[0]:data;
    if(!s){show(box,'No encontramos una solicitud con esos datos. Revisá el número y el correo.','error');return;}
    let msg=s.estado==='Pendiente'?'Tu solicitud está pendiente de revisión.':s.estado==='Aprobada'?'Tu solicitud fue aprobada. El equipo deberá contactarte para coordinar los siguientes pasos.':'La solicitud no fue aprobada. Podés comunicarte con el equipo para recibir más información.';
    box.innerHTML=`<div class="toast"><b>Encontramos tu solicitud.</b><p><b>Número:</b> ${esc(s.id)}<br><b>Mascota:</b> ${esc(s.mascota)}<br><b>Estado:</b> <span class="status ${s.estado.toLowerCase()}">${esc(s.estado)}</span></p>${esc(msg)}</div>`;
  }catch(err){show(box,err.message||'No se pudo consultar el estado.','error');}
});
$('#admin-login').addEventListener('submit',async e=>{
  e.preventDefault();
  const email=$('#admin-email').value.trim().toLowerCase();
  const password=$('#admin-password').value;
  const feedback=$('#admin-login-feedback');
  if(!supabase){show(feedback,'Falta configurar la URL y la Publishable Key de Supabase en public/supabase-config.js.','error');return;}
  try{
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error) throw error;
    const user=data.user;
    const {data:admin,error:adminError}=await supabase.from('administradores').select('user_id').eq('user_id',user.id).maybeSingle();
    if(adminError) throw adminError;
    if(!admin){await supabase.auth.signOut();throw new Error('El usuario inició sesión, pero todavía no está autorizado como administrador.');}
    adminUser=user;
    $('#admin-login').classList.add('hidden');
    $('#admin-dashboard').classList.remove('hidden');
    await loadAdmin();
  }catch(err){
    adminUser=null;
    show(feedback,err.message||'No se pudo iniciar sesión. Revisá el correo, la contraseña y la autorización de administrador.','error');
  }
});
$('#admin-logout').addEventListener('click',async()=>{
  if(supabase) await supabase.auth.signOut();
  adminUser=null;
  $('#admin-dashboard').classList.add('hidden');
  $('#admin-login').classList.remove('hidden');
  $('#admin-password').value='';
});
async function loadAdmin(){
  const root=$('#admin-content');
  root.innerHTML='<p class="muted">Cargando solicitudes...</p>';
  try{
    const {data:rows,error}=await supabase.from('solicitudes').select('*').order('creado',{ascending:false});
    if(error) throw error;
    const total=rows.length,pend=rows.filter(x=>x.estado==='Pendiente').length,approved=rows.filter(x=>x.estado==='Aprobada').length;
    root.innerHTML=`<div class="divider"></div><h3>Solicitudes recibidas</h3><div class="stats"><div class="stat">Total<strong>${total}</strong></div><div class="stat">Pendientes<strong>${pend}</strong></div><div class="stat">Aprobadas<strong>${approved}</strong></div></div>`+(rows.length?rows.map(r=>`<article class="request-card"><div class="request-head"><h3>Solicitud N.º ${esc(r.id)}</h3><span class="status ${r.estado.toLowerCase()}">${esc(r.estado)}</span></div><p><b>Adoptante:</b> ${esc(r.nombre)}<br><b>Correo:</b> ${esc(r.email)}<br><b>Mascota:</b> ${esc(r.mascota)}<br><b>Motivo:</b> ${esc(r.motivo)}<br><b>Estado actual:</b> ${esc(r.estado)}</p><div class="admin-actions"><div><label for="state-${r.id}">Cambiar estado</label><select id="state-${r.id}"><option ${r.estado==='Pendiente'?'selected':''}>Pendiente</option><option ${r.estado==='Aprobada'?'selected':''}>Aprobada</option><option ${r.estado==='Rechazada'?'selected':''}>Rechazada</option></select></div><button class="btn small update-state" data-id="${r.id}">Guardar estado</button></div><div class="divider"></div><h3>Mensajes para el adoptante</h3><label for="message-${r.id}">Escribir mensaje</label><textarea id="message-${r.id}" placeholder="Escribí un mensaje para el adoptante."></textarea><p><button class="btn small save-message" data-id="${r.id}">Guardar mensaje</button></p><div id="feedback-${r.id}"></div><div class="history"><b>Historial de mensajes</b>${(r.mensajes||[]).length?r.mensajes.map(m=>`<div class="history-item"><span class="muted">Fecha: ${esc(m.fecha)}</span><p>${esc(m.texto)}</p><span class="status">Guardado en PetMatch</span></div>`).join(''):'<p class="muted">Todavía no hay mensajes guardados.</p>'}</div></article>`).join(''):'<div class="empty">Todavía no hay solicitudes registradas.</div>');
    document.querySelectorAll('.update-state').forEach(b=>b.addEventListener('click',async()=>{
      try{const {error}=await supabase.from('solicitudes').update({estado:$(`#state-${b.dataset.id}`).value}).eq('id',Number(b.dataset.id));if(error)throw error;await loadAdmin();}
      catch(err){alert(err.message);}
    }));
    document.querySelectorAll('.save-message').forEach(b=>b.addEventListener('click',async()=>{
      const id=Number(b.dataset.id),txt=$(`#message-${id}`).value.trim(),fb=$(`#feedback-${id}`);
      if(!txt){show(fb,'Escribí un mensaje antes de guardarlo.','warn');return;}
      try{
        const row=rows.find(x=>x.id===id);
        const mensajes=Array.isArray(row.mensajes)?row.mensajes:[];
        mensajes.unshift({texto:txt,fecha:new Date().toLocaleString('es-AR'),enviado:false});
        const {error}=await supabase.from('solicitudes').update({mensajes}).eq('id',id);
        if(error)throw error;
        show(fb,'Mensaje guardado en el historial de PetMatch. El envío automático de correos no está incluido en esta versión.','warn');
        await loadAdmin();
      }catch(err){show(fb,err.message,'error');}
    }));
  }catch(err){root.innerHTML=`<div class="toast error">${esc(err.message||'No se pudieron cargar las solicitudes.')}</div>`;}
}
(async()=>{
  if(!supabase)return;
  const {data}=await supabase.auth.getSession();
  if(data.session){
    const {data:admin}=await supabase.from('administradores').select('user_id').eq('user_id',data.session.user.id).maybeSingle();
    if(admin){adminUser=data.session.user;$('#admin-login').classList.add('hidden');$('#admin-dashboard').classList.remove('hidden');loadAdmin();}
    else await supabase.auth.signOut();
  }
})();
fillFilters();renderPets();
