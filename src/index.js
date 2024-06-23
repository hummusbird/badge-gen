import { initialize, svg2png } from 'svg2png-wasm';
import wasm from 'svg2png-wasm/svg2png_wasm_bg.wasm';
initialize(wasm).catch(() => { });

import { parseSourceSvg, buildBadgeSvg } from './svg';
import sourceSvg from './source.svg';
const { template, flags, clips, overlays } = parseSourceSvg(sourceSvg);

import { Hono } from 'hono';
const app = new Hono();

app.get('/88x31/:flag1/:flag2/:clip/:overlay?', async (c) => {
	const flag1 = flags[c.req.param('flag1')];
	const flag2 = flags[c.req.param('flag2')];
	const clip = clips[c.req.param('clip')];

	if (!flag1 || !flag2 || !clip) {
		return c.text('invalid flags or clip', 400);
	}

	const overlayId = c.req.param('overlay');
	const overlay = overlays[overlayId];
	if (overlayId && !overlay) {
		return c.text('invalid overlay', 400);
	}

	const svg = buildBadgeSvg(template, clip, overlay, flag1, flag2);
	const buf = await svg2png(svg, {});
	return c.body(buf, 200, { 'content-type': 'image/png' });
})

export default app