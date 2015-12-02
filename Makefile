.PHONY: compile deploy clean

compile:
	mkdir -p tmp
	ruby data/parse.rb
	cp *.html tmp/
	cp *.css tmp/
	cp *.js tmp/
	cp -R ghost-town tmp/
	cp -R landmarks tmp/
	cp -R learning-to-read-new-york tmp/
	cp -R arts-letters tmp/
	cp -R images tmp/

deploy: compile
	aws s3 sync tmp/ s3://capital-newyork.com --delete --profile walkin

clean:
	rm -rf tmp/
