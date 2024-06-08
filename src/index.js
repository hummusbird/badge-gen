import { initialize, svg2png } from 'svg2png-wasm';
import wasm from 'svg2png-wasm/svg2png_wasm_bg.wasm';
initialize(wasm).catch(() => { });

import { parseSourceSvg, buildBadgeSvg } from './svg';
import sourceSvg from './source.svg';
const { template, flags, clips } = parseSourceSvg(sourceSvg);

export default {
	async fetch(request, env, ctx) {
		const svg = buildBadgeSvg(template, clips['75-degree'], flags['lesbi'], flags['trans']);
		const buf = await svg2png(svg, {});
		return new Response(buf, { headers: { 'content-type': 'image/png' } });
	},
};