.PHONY: compile deploy clean

compile:
	mkdir -p tmp
	cp 404.html tmp/
	cp style.css tmp/
	cp embed.css tmp/
	cp main.js tmp/
	cp -R landmarks tmp/
	cp -R learning-to-read-new-york tmp/
	cp -R arts-letters tmp/
	cp -R images tmp/
	ruby data/parse.rb

deploy: compile
	aws s3 sync tmp/ s3://capital-newyork.com --delete --profile walkin

clean:
	rm -rf tmp/
