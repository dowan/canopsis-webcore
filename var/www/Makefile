SHELL=/bin/bash

serve:
	cd docs/html && python -m SimpleHTTPServer

# COPY BELOW TO YOUR MAKEFILE

doc: clean rst-doc html-doc

clean:
	rm -rf ./docs/html

rst-doc:
	node_modules/.bin/jsdoc -t ./node_modules/jsdoc-rst-template/template --recurse canopsis -d docs/rst -c .jsdoc.conf.json

html-doc:
	sphinx-build -b html -c ./ ./docs/rst ./docs/html

install-doc:
	mkdir ../../../../doc/sakura/api/frontend && cp -R docs/rst/* ../../../../doc/sakura/api/frontend
