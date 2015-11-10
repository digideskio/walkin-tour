deploy:
	mkdir -p tmp
	cp index.html tmp/
	cp style.css tmp/
	cp main.js tmp/
	cp -R images tmp/
	ruby data/parse.rb
	aws s3 sync tmp/ s3://goldsmith-walkin-tours --delete --profile walkin

clean:
	rm -rf tmp/
