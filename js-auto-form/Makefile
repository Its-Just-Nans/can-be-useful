api:
	cd auto-form-app; npm install
	cd test-api; npm install
	-cd test-api; DEVMODE=true  npm run test
	-make clean

clean:
	rm auto-form-config.json
	rm bdd.zip.enc

interface:
	cd auto-form-app; npm install
	cd auto-form-app; echo "export const URL_SERVER = 'http://localhost:4000';" > pages/src/url.js
	cd auto-form-app; npm run build
	cd auto-form-app; DEVMODE=true PORT=true npm run api &
	cd test-interface-app; npm install
	cd test-interface-app; npm test
	-make clean

solo-api:
	cd auto-form-app; npm install
	cd auto-form-app; npm run api

cipher:
	cd test-cipher; make

app:
	cd auto-form-app; npm install
	cd auto-form-app; npm run start

dev:
	cd auto-form-app; echo "export const URL_SERVER = 'http://localhost:3000';" > pages/src/url.js
	cd auto-form-app; npm run pages-dev

remove:
	#rm ~/.local/share/bdd.zip.enc

.PHONY: api cipher app dev