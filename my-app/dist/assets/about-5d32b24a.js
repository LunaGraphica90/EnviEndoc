(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();function s(){return localStorage.getItem("language")?(localStorage.getItem("language")==="en"&&document.getElementById("language-select").options[1].setAttribute("selected",!0),localStorage.getItem("language")):"fr"}function c(){var t=location.pathname.split("/").pop(),e,r=s();r==="fr"?t==="index.html"?e="EnviEndoc - Faciliter l'accès aux données sur les perturbateurs endocriniens présents dans notre environnement":t==="about.html"?e="EnviEndoc - À propos":t==="help.html"?e="EnviEndoc - Aide":t==="legacy.html"?e="EnviEndoc - Mentions Légales":t==="list.html"?e="EnviEndoc - Liste des perturbateurs endocriniens":t==="map.html"?e="EnviEndoc - Cartographie des perturbateurs endocriniens":t==="sourcedata.html"?e="EnviEndoc - sources des données":e="EnviEndoc - Faciliter l'accès aux données sur les perturbateurs endocriniens présents dans notre environnement":e="EnviEndoc",document.title=e}c();function i(){let t=document.getElementById("language-select");const e=t.options[t.selectedIndex].value;localStorage.removeItem("selectedLang"),localStorage.setItem("language",e),setTimeout(()=>{document.location.reload()},1e3)}document.getElementById("language-select").addEventListener("change",i);function u(){return localStorage.getItem("language")?(localStorage.getItem("language")==="en"&&document.getElementById("language-select").options[1].setAttribute("selected",!0),localStorage.getItem("language")):"fr"}async function d(){const t=u();return await(await fetch(`./lang/${t}.json`)).json()}async function g(){const t=await d();Object.keys(t).forEach(e=>{const r=t[e];document.querySelectorAll(`[data-translate=${e}]`).forEach(n=>{n.innerHTML=r})})}document.addEventListener("DOMContentLoaded",g());let f=new Date,m=f.getFullYear();document.getElementById("copyright").innerHTML="Copyright © "+m;
//# sourceMappingURL=about-5d32b24a.js.map