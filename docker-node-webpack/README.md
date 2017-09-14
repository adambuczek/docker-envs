# Node + Yarn + Webpack development

<!-- ### Go to `config` and build this with
```bash
docker build -t node:yarn-webpack -f node.dockerfile .
``` -->

### Install dependencies
```bash
docker run --rm -v $(pwd):/app -w /app node bash -c "yarn --no-bin-links"
```

### Serve with a Webpack Dev Server
For watch to work within docker use `devServer.watchOptions.poll` in webpack config.
```bash
docker run -it --rm -p 8080:8080 -v $(pwd):/app -w /app node bash -c "yarn run serve"
```
