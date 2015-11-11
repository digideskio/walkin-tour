deploy:
	mkdir -p tmp
	cp index.html tmp/
	cp embed.html tmp/
	cp example.html tmp/
	cp style.css tmp/
	cp embed.css tmp/
	cp main.js tmp/
	cp -R images tmp/
	ruby data/parse.rb
	aws s3 sync tmp/ s3://capital-newyork.com --delete --profile walkin

clean:
	rm -rf tmp/
