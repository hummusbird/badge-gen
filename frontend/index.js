let flags;
let parsed;

async function init() {
    let res = await fetch("http://localhost:8787/options.json");
    parsed = await res.json();
    flags = parsed["flags"];

    for (const [id, svg] of Object.entries(flags)) {
        var newsvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newsvg.innerHTML = svg;
        newsvg.setAttribute("id", id);
        newsvg.setAttribute('width', 88);
        newsvg.setAttribute("height", 31);
        newsvg.setAttribute("viewBox", "0 0 88 31");
        document.getElementById("flag-options").append(newsvg);
    }

}