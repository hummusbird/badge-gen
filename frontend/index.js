async function stats() {
    let res = await fetch("http://127.0.0.1:8787/options.json");
    // let parsed = await res.json();
    console.log(res);
}