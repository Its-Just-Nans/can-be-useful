PANDOC_OPTIONS= -V geometry:"left=0.75in, top=0.75in, right=0.75in, bottom=2cm"
PWD=$(shell pwd)

rapport:
	pandoc -H conf.tex $(PANDOC_OPTIONS) header.md README.md -o report.pdf

imgs:
	npx @mermaid-js/mermaid-cli -i img/archi.mmd -o img/archi.png --scale 4
	npx @mermaid-js/mermaid-cli -i img/alarm.mmd -o img/alarm.png --scale 4
	npx @mermaid-js/mermaid-cli -i img/threshold.mmd -o img/threshold.png --scale 4
	npx @mermaid-js/mermaid-cli -i img/data.mmd -o img/data.png --scale 4