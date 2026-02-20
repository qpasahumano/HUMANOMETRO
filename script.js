/* ===============================
SISTEMA DEFINITIVO BLINDADO V1
================================ */

const BLOCK_DURATION = 7 * 24 * 60 * 60 * 1000;
const SECRET = "HM_SIG_V1_2026";

function now(){ return Date.now(); }

function sign(data){
return btoa(JSON.stringify(data)+SECRET);
}

function verify(data){
return data.sig === sign({
start:data.start,
block1:data.block1,
block2:data.block2,
block3:data.block3,
stage:data.stage
});
}

function getCycle(){
let c = JSON.parse(localStorage.getItem("hm_cycle") || "null");
if(!c) return null;
if(!verify(c)) {
localStorage.removeItem("hm_cycle");
return null;
}
return c;
}

function setCycle(data){
data.sig = sign({
start:data.start,
block1:data.block1,
block2:data.block2,
block3:data.block3,
stage:data.stage
});
localStorage.setItem("hm_cycle", JSON.stringify(data));
}

function resetCycle(){
localStorage.removeItem("hm_cycle");
}

/* CONTADOR VISUAL */

function daysRemaining(timestamp){
let diff = BLOCK_DURATION - (now() - timestamp);
if(diff <= 0) return 0;
return Math.ceil(diff / (24*60*60*1000));
}

function updateCounters(){
const cycle = getCycle();
if(!cycle) return;

if(cycle.block1){
let d = daysRemaining(cycle.block1);
if(d>0) document.getElementById("block1Counter").innerText =
"Disponible en "+d+" día(s)";
}

if(cycle.block2){
let d = daysRemaining(cycle.block2);
if(d>0) document.getElementById("block2Counter").innerText =
"Disponible en "+d+" día(s)";
}
}

setInterval(updateCounters,60000);

/* BLOQUEO 1 */

function activateBlock1(){

let cycle = getCycle();

if(!cycle){
cycle = {
start: now(),
block1: now(),
block2: null,
block3: null,
stage: 1
};
setCycle(cycle);
startWeekly();
return;
}

if(cycle.block1 && daysRemaining(cycle.block1)>0){
alert("Debes esperar 7 días.");
return;
}

cycle.block1 = now();
cycle.stage = 1;
setCycle(cycle);
startWeekly();
}

/* BLOQUEO 2 */

function activateBlock2(){

let cycle = getCycle();
if(!cycle || cycle.stage !== 1){
alert("Orden incorrecto.");
return;
}

if(weeklyScores.length !== 3){
alert("Debes responder exactamente 3 preguntas.");
return;
}

cycle.block2 = now();
cycle.stage = 2;
setCycle(cycle);

window.location.href="./humanometro-v2/";
}
