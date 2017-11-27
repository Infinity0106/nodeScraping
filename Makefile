git: 
	git checkout -b $(n) && git add . && git commit -m $(m) && git push origin $(n)

build:
	cd front && npm run build

start:
	nodemon start
