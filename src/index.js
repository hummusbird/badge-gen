import fs from 'fs';

import { initialize, svg2png } from 'svg2png-wasm';
import { serveStatic } from 'hono/bun';
await initialize(fs.readFileSync('./node_modules/svg2png-wasm/svg2png_wasm_bg.wasm'));

import { parseSourceSvg, buildBadgeSvg } from './svg.js';

let sourceSvg = fs.readFileSync('src/source.svg', 'utf8');
const { template, flags, clips, overlays } = parseSourceSvg(sourceSvg);

import { Hono } from 'hono';
import { cors } from 'hono/cors';
const app = new Hono();

const w88h31 = new Hono();

w88h31.get('/:flag1/:flag2/:clip/:overlay{.+\\.(png|svg)$}', renderBadge);
w88h31.get('/:flag1/:flag2/:clip{.+\\.(png|svg)$}', renderBadge);
w88h31.get('/:flag1/:overlay{.+\\.(png|svg)$}', renderBadge);
w88h31.get('/:flag1{.+\\.(png|svg)$}', renderBadge);

app.route('/88x31', w88h31);

function processParams(params) {
	for (const [key, value] of Object.entries(params)) {
		if (value.endsWith('.svg')) {
			params[key] = value.replace(/\.svg$/, '');
			params.type = 'svg';
		} else if (value.endsWith('.png')) {
			params[key] = value.replace(/\.png$/, '');
			params.type = 'png';
		}
	}
	return params;
}

async function renderBadge(c) {
	const params = processParams(c.req.param());

	const flag1 = flags[params.flag1];
	const flag2 = flags[params.flag2];
	const clip = clips[params.clip];
	const overlay = overlays[params.overlay];

	if (params.flag2 && (!flag1 || !flag2 || !clip)) {
		return c.text('invalid flags or clip', 400);
	}

	if (params.overlay && !overlay) {
		return c.text('invalid overlay', 400);
	}

	const svg = buildBadgeSvg(template, flag1, flag2, clip, overlay);
	if (params.type === 'svg') {
		return c.body(svg, 200, { 'content-type': 'image/svg+xml' });
	}
	const buf = await svg2png(svg, {});
	return c.body(buf, 200, { 'content-type': 'image/png' });
}

app.use('/options.json', cors());

app.get('/options.json', (c) => {
	return c.json({
		flags: Object.keys(flags),
		clips: Object.keys(clips),
		overlays: Object.keys(overlays),
	});
});

app.use('/*', serveStatic({ root: './frontend' }));

console.log('Serving...');

export default app;
