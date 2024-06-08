const { DOMParser } = require('xmldom');

function childrenToDictionary(node) {
    let dict = {};
    for (var i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];
        if (child.nodeType !== 1) {
            continue;
        }
        dict[child.getAttribute('id')] = child;
    }
    return dict;
}

export const parseSourceSvg = (sourceSvg) => {
    const doc = new DOMParser().parseFromString(sourceSvg);

    const flags = childrenToDictionary(doc.getElementById('flags'));
    const clips = childrenToDictionary(doc.getElementById('clips'));

    let svg = doc.getElementsByTagName('svg')[0];
    let emptySvg = svg.cloneNode(false);

    return { template: emptySvg, flags: flags, clips: clips };
};

export const buildBadgeSvg = (svg, clip, flag1, flag2) => {
    const doc = svg.ownerDocument;
    const defs = doc.createElement("defs");
    const clipPath = doc.createElement("clipPath");
    clipPath.setAttribute("shape-rendering", "crispEdges");
    clipPath.setAttribute("id", "clip");
    clipPath.appendChild(clip);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    flag1.setAttribute("clip-path", "url(#clip)");

    svg.appendChild(flag2);
    svg.appendChild(flag1);

    return svg.toString();
};