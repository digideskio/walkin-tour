.PHONY: compile deploy clean

compile:
	mkdir -p tmp
	ruby data/parse.rb
	cp *.html tmp/
	cp *.css tmp/
	cp *.js tmp/
	cp -R alone-together tmp/
	cp -R animal-ny tmp/
	cp -R arts-letters tmp/
	cp -R cinematic-ny tmp/
	cp -R city-stands-up tmp/
	cp -R ghost-town tmp/
	cp -R landmarks tmp/
	cp -R learning-to-read-new-york tmp/
	cp -R new-yorkers tmp/
	cp -R night-walks tmp/
	cp -R politics tmp/
	cp -R the-scene tmp/
	cp -R under-the-influence tmp/
	cp -R images tmp/

deploy: compile
	aws s3 sync tmp/ s3://capital-newyork.com --delete --profile walkin

clean:
	rm -rf tmp/
