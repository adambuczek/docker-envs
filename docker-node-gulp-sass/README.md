# Node SASS Gulp Yarn development

### Go to `config` and build this with
```bash
docker build -t node:yarn-gulp-sass -f node.dockerfile .
```

### Install dependencies
```bash
docker run --rm -v $(pwd):/app -w /app node:yarn-gulp-sass yarn --no-bin-links
```

### Running serve
Running trough `bash`. Otherwise the container needs manual stopping afterwards and terminal output may be misformatted. This configuration exposes ports needed for server and live reload. Gulp watch uses [polling](https://stackoverflow.com/questions/28681491/within-docker-vm-gulp-watch-seems-to-not-work-well-on-volumes-hosted-from-the-h). Note that scripts in `package.json` were set up to use run local gulp via node - this may be too much but it is very clear.
```bash
docker run --rm -it -p 3000:3000 -p 35729:35729 -v $(pwd):/app -w /app node:yarn-gulp-sass \
bash -c 'yarn run gulp serve'
```
### Running build
```bash
docker run --rm -v $(pwd):/app -w /app node:yarn-gulp-sass bash -c 'yarn run gulp build'
```
