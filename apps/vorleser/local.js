/* Erweiterung für den lokalen Betrieb: läuft server.py mit, wird aus dem
 * MP3-Abschnitt eine echte Schaltfläche statt einer Anleitung.
 * Ohne Server (oder als reine Datei geöffnet) passiert hier nichts. */

(function () {
  "use strict";

  var isLocal = /^https?:$/.test(location.protocol) &&
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  if (!isLocal) return;

  fetch("api/health")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(setup)
    .catch(function () { /* Server läuft nicht — Anleitung stehen lassen */ });

  function setup(info) {
    var section = document.getElementById("export");
    var editor = document.getElementById("editor");

    section.innerHTML =
      '<h2>Als MP3 speichern</h2>' +
      '<p>Wird über <code>edge-tts</code> erzeugt — neuronale Stimmen, deutlich näher an einer echten Sprecherin als die Stimmen des Betriebssystems.</p>' +
      '<div class="rail" style="border:1px solid var(--line);border-radius:var(--r)">' +
      '  <button id="mp3" class="primary" type="button">MP3 erzeugen</button>' +
      '  <span class="spacer"></span>' +
      '  <div class="field"><label for="nvoice">Stimme</label><select id="nvoice"></select></div>' +
      '  <div class="field"><label for="nrate">Tempo</label>' +
      '    <input id="nrate" type="range" min="-40" max="60" step="5" value="0" />' +
      '    <span class="readout" id="nrateOut">+0 %</span></div>' +
      '</div>' +
      '<p class="readout" id="mp3state" style="min-height:1.2em"></p>';

    var sel = document.getElementById("nvoice");
    var btn = document.getElementById("mp3");
    var rate = document.getElementById("nrate");
    var rateOut = document.getElementById("nrateOut");
    var state = document.getElementById("mp3state");

    (info.voices || []).forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v.name;
      opt.textContent = v.label;
      sel.appendChild(opt);
    });

    rate.addEventListener("input", function () {
      rateOut.textContent = (rate.value >= 0 ? "+" : "") + rate.value + " %";
    });

    btn.addEventListener("click", function () {
      var text = editor.value.trim();
      if (!text) { editor.focus(); return; }

      btn.disabled = true;
      state.textContent = "Wird erzeugt …";

      fetch("api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          voice: sel.value,
          rate: (rate.value >= 0 ? "+" : "") + rate.value + "%"
        })
      })
        .then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error(t || r.statusText); });
          return r.blob();
        })
        .then(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "vorleser.mp3";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
          state.textContent = "Fertig — " + Math.round(blob.size / 1024) + " kB gespeichert.";
        })
        .catch(function (err) {
          state.textContent = "Hat nicht geklappt: " + err.message;
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
