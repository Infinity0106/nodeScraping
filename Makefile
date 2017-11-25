git: 
	git checkout -b $(n) && git add . && git commit -m $(m) && git push origin $(n)

serve:
	npm start

deploy:
	npm run build && firebase deploy

