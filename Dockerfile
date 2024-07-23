FROM oven/bun:1-alpine

RUN mkdir -p /home/bun/app/node_modules && chown -R bun:bun /home/bun/app

WORKDIR /home/bun/app

COPY --chown=bun:bun package.json bun.lockb ./

USER bun

RUN bun install --frozen-lockfile --production

COPY --chown=bun:bun . .

EXPOSE 3000

CMD [ "bun", "run", "src/index.js" ]