DOCKER := $(if $(LRN_SDK_NO_DOCKER),,$(shell which docker))
NODE_VERSION = 20

TARGETS = build test clean test-unit install-deps audit-deps lint lint-fix generate-types
.PHONY: $(TARGETS)

ifneq (,$(DOCKER))
# Re-run the make command in a container
DKR = docker container run -t --rm \
		-v $(CURDIR):/srv/sdk/node \
		-v lrn-sdk-node_cache:/root/.cache \
		-w /srv/sdk/node \
		-e LRN_SDK_NO_DOCKER=1 \
		-e ENV -e REGION -e VER \
		node:$(NODE_VERSION)

$(TARGETS):
	$(DKR) make -e MAKEFLAGS="$(MAKEFLAGS)" $@

else
ENV = prod
REGION = .learnosity.com
VER = v1

build: install-deps lint

test: build test-unit

clean:
	-rm -rf node_modules

test-unit:
	npm test

install-deps:
	npm install

audit-deps:
	npm audit

lint:
	npm run lint

lint-fix:
	npm run lint -- --fix

generate-types:
	npx tsc
endif
