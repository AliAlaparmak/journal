const Time = { value: new Date() };
console.log(Time);
const fs = require('fs');
const path = require('path');
import { cipherText, decryptText, entryExists, entryPath } from './Entry.js';
window.renderTime = renderTime;
const $ = id => document.getElementById(id);

const monthsOfTheYear = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function renderMonthLabel() {
  const y = Time.value.getFullYear();
  const m = Time.value.getMonth();
  const d = Time.value.getDate();
  $("CurrentMonth").textContent = `${monthsOfTheYear[m]} ${y}`;
  $("EntryDate").textContent = `${monthsOfTheYear[m]} ${d}, ${y}`;
}


function generateGrid(year, monthindex) {
  const currentDay = Time.value.getDate();                
  let daysInMonth = new Date(year, monthindex + 1, 0).getDate();
  let html = "";
  let dotw = Time.value.getDay();
  const firstDay = new Date(year, monthindex, 1).getDay();

  for (let k = 0; k < firstDay; k++) {
    html += `<div></div>`;
  }

  for (let i = 1; i <= daysInMonth; i++) {
  const cellDate = new Date(year, monthindex, i);
  const has = entryExists(cellDate); 
  const cls = has ? "calendarSquare has-entry" : "calendarSquare";

  html += `<button class="${cls}" onclick="renderTime({ day: ${i - currentDay} })">${i}</button>`;
  }
  const total = firstDay + daysInMonth;
  for (let i = total; i < 42; i++) {
    html += `<div></div>`;
  }
  $("CalendarGrid").innerHTML = html;
}

async function renderTime(change = {}) {
  if (change.year)  Time.value.setFullYear(Time.value.getFullYear() + change.year);
  if (change.month) Time.value.setMonth(Time.value.getMonth() + change.month);
  if (change.day)   Time.value.setDate(Time.value.getDate() + change.day);

  const y = Time.value.getFullYear();
  const m = Time.value.getMonth();
  const box = $("JournalEntryINP");

  if (entryExists(Time)) {
    try {
      const txt = await decryptText(Time);
      box.value = txt;
    } catch (err) {
      console.error("Decryption failed:", err);
      box.value = "";
    }
  } else {
    box.value = "";
  }

  renderMonthLabel();
  generateGrid(y, m);
  console.log(Time);
}

document.addEventListener("DOMContentLoaded", () => {
  renderTime(); 
  $("submitButton").addEventListener("click", async () => {
    const text = $("JournalEntryINP").value.trim();
    if (!text) return;
    await cipherText(text, Time);
  });
});


