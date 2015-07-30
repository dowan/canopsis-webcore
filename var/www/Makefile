SHELL=/bin/bash

serve:
	cd docs/html && python -m SimpleHTTPServer

doc: clean rst-doc html-doc

clean:
	rm -rf ./docs/html

rst-doc:
	node_modules/.bin/jsdoc -t ./node_modules/jsdoc-rst-template/template --recurse canopsis -d docs/rst -c .jsdoc.conf.json

html-doc:
	sphinx-build -b html -c ./ ./docs/rst ./docs/html

# Copy the rst files into canopsis documentation. The rst files must have been built before
install-doc:
	rm -Rf ../../../../doc/sakura/api/frontend && mkdir ../../../../doc/sakura/api/frontend && cp -R docs/rst/* ../../../../doc/sakura/api/frontend
