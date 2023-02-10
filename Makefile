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
	find ./src -name '*.js.map' -exec rm {} \;
	find ./tests -name '*.js' -exec rm {} \;
	find ./tests -name '*.js.map' -exec rm {} \;
	find ./bin -name '*.js' -exec rm {} \;
	find ./bin -name '*.js.map' -exec rm {} \;
