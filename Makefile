run:
	npm run build && npm start

dev:
	npm run build && npm run dev

unit:
	npm run build && npm test

eslint:
	npx eslint .

clean:
	find ./src -name '*.js' -exec rm {} \;
