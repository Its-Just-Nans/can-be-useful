all: build run

build:
	# faster build
	rm -rf node_modules
	docker build -t weather --network=host .

run:
	docker run --network host weather

.PHONY: build