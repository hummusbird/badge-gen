const { DOMParser } = require('xmldom');

function childrenToDictionary(node) {
    let dict = {};
    for (var i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];
        if (child.nodeType !== 1) {
            continue;
        }
        child.setAttribute("shape-rendering", "crispEdges");
        dict[child.getAttribute('id')] = child;
    }
    return dict;
}

export const parseSourceSvg = (sourceSvg) => {
    const doc = new DOMParser().parseFromString(sourceSvg);

    const flags = childrenToDictionary(doc.getElementById('flags'));
    const clips = childrenToDictionary(doc.getElementById('clips'));
    const overlays = childrenToDictionary(doc.getElementById('overlays'));

    let svg = doc.getElementsByTagName('svg')[0];
    let emptySvg = svg.cloneNode(false);

    return { template: emptySvg, flags: flags, clips: clips, overlays: overlays };
};

export const buildBadgeSvg = (svg, clip, overlay, flag1, flag2) => {
    flag1 = flag1.cloneNode(true);
    flag2 = flag2.cloneNode(true);

    const doc = svg.ownerDocument;
    const defs = doc.createElement("defs");
    const clipPath = doc.createElement("clipPath");
    clipPath.setAttribute("id", "clip");
    clipPath.appendChild(clip);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    flag1.setAttribute("clip-path", "url(#clip)");

    svg.appendChild(flag2);
    svg.appendChild(flag1);

    if (overlay) {
        svg.appendChild(overlay);
    }

    return svg.toString();
};