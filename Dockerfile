FROM node:18

RUN npm install -g @vercel/ncc

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN ncc build src/action.ts -o dist

CMD ["node", "./dist/index.js"]
