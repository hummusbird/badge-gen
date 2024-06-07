import { initialize, svg2png } from 'svg2png-wasm';
import wasm from 'svg2png-wasm/svg2png_wasm_bg.wasm';

initialize(wasm).catch(() => { });


export default {
	async fetch(request, env, ctx) {
		const { searchParams } = new URL(request.url);
		let clip = searchParams.get('clip');
		if (!clip) {
			clip = 'M 0,0 V 31 L 88,0 Z';
		}
		const svgtext = "";
		const buf = await svg2png(svgtext, {});
		return new Response(buf, { headers: { 'content-type': 'image/png' } });
	},
};