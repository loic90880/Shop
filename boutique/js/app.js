(function () {
  var C = window.CONFIG, P = window.PRODUCTS, KEY = "boutique-cart";
  var $ = function (id) { return document.getElementById(id); };
  var cart = {}, cat = "Tout", query = "";
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}

  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML.replace(/"/g, "&quot;"); }
  function money(n) { return n.toLocaleString("fr-FR") + " " + C.currency; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }

  document.title = C.name;
  $("brand").textContent = C.name;
  $("tagline").textContent = C.tagline;
  $("intro").textContent = C.intro;
  $("foot-text").textContent = "© " + new Date().getFullYear() + " " + C.name;

  function renderFilters() {
    var cats = ["Tout"].concat(P.map(function (p) { return p.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    $("filters").innerHTML = cats.map(function (c) {
      return '<button class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + "</button>";
    }).join("");
  }

  function renderGrid() {
    var q = query.toLowerCase();
    var list = P.filter(function (p) {
      return (cat === "Tout" || p.category === cat) && (p.name + " " + p.desc).toLowerCase().indexOf(q) > -1;
    });
    $("empty").hidden = list.length > 0;
    $("grid").innerHTML = list.map(function (p) {
      var thumb = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">' : esc(p.name.charAt(0));
      return '<article class="card"><div class="thumb" style="background:' + esc(p.color || "#1F3D36") + '">' + thumb + '</div>' +
        '<div class="card-body"><span class="cat">' + esc(p.category) + "</span><h3>" + esc(p.name) + "</h3>" +
        '<p class="desc">' + esc(p.desc) + '</p><div class="buy"><span class="price">' + money(p.price) +
        '</span><button class="add" data-add="' + p.id + '">Ajouter</button></div></div></article>';
    }).join("");
  }

  function renderCart() {
    var ids = Object.keys(cart).map(Number).filter(byId), n = 0, total = 0;
    $("lines").innerHTML = ids.map(function (id) {
      var p = byId(id), q = cart[id]; n += q; total += q * p.price;
      return "<li><strong>" + esc(p.name) + "</strong><span>" + money(p.price * q) + '</span><div class="qty">' +
        '<button data-dec="' + id + '" aria-label="Retirer un ' + esc(p.name) + '">−</button><span>' + q +
        '</span><button data-inc="' + id + '" aria-label="Ajouter un ' + esc(p.name) + '">+</button></div></li>';
    }).join("");
    $("count").textContent = n;
    $("total").textContent = money(total);
    $("cart-empty").hidden = n > 0;
    $("order").disabled = n === 0;
  }

  function change(id, d) {
    cart[id] = (cart[id] || 0) + d;
    if (cart[id] <= 0) delete cart[id];
    save(); renderCart();
  }
  function toggle(open) {
    $("drawer").classList.toggle("open", open);
    $("drawer").setAttribute("aria-hidden", String(!open));
    $("scrim").hidden = !open;
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.dataset.cat) { cat = t.dataset.cat; renderFilters(); renderGrid(); }
    if (t.dataset.add) { change(Number(t.dataset.add), 1); toggle(true); }
    if (t.dataset.inc) change(Number(t.dataset.inc), 1);
    if (t.dataset.dec) change(Number(t.dataset.dec), -1);
  });
  $("search").addEventListener("input", function (e) { query = e.target.value; renderGrid(); });
  $("open-cart").addEventListener("click", function () { toggle(true); });
  $("close-cart").addEventListener("click", function () { toggle(false); });
  $("scrim").addEventListener("click", function () { toggle(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });

  $("order").addEventListener("click", function () {
    var total = 0;
    var lines = Object.keys(cart).map(Number).filter(byId).map(function (id) {
      var p = byId(id); total += p.price * cart[id];
      return "- " + cart[id] + " x " + p.name + " (" + money(p.price * cart[id]) + ")";
    });
    var msg = "Bonjour, je souhaite commander :\n" + lines.join("\n") + "\nTotal : " + money(total);
    window.open("https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  renderFilters(); renderGrid(); renderCart();
})();
