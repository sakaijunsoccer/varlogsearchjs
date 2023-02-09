# VarLogSearchJs
This is a demonstration server with the concept of specifying logs in /var/log and returning log lines found using search keywords in a list starting with the latest.

## QuickStart

#### Install node, npm
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
$ nvm --version
0.39.3
$ nvm install 18.12.1
$ npm --version
8.19.2
```
#### Install package

Install required packages
```
$ npm install
```

#### Configure settings file
If necessary, change the port number etc. in the .env configuration file.
```
$ vim .env
PORT=8080
```

#### Compile
Compile from typescript to javascript
```
$ npm run build
```

#### Run 
Start the service
```
$ npm start
```

## How to develop

#### Run test
```
npm run build
npm test
```

#### Run local
The following command uses nodemon to run the service. Detailed command contents are described in package.json. A tool that monitors the source and automatically restarts the server.  If you run your code using nodemon instead of node, the process will automatically restart when you change your code.
```
npm run dev
```

#### Run benchmark
A simple benchmark script for searching search words for files under /var/log/ due to differences in buffers. The following command can be run.
```
npx ts-node bin/benchmark.ts
```
Could see the help
```
npx ts-node bin/benchmark.ts --help
Usage: benchmark [options]

Options:
  --filename <filename>  log file location (default: "/var/log/random.log")
  --keyword <keyword>    Keyword to search (default: "test")
  --limit <limit>        limit (default: 10000)
  -h, --help             display help for command
```

#### Help to reformant code
```
npx eslint .
```

## API

#### Swagger API
http://localhost:8080/docs/api/v1/

#### Example of postman config for using API
Postman config is [here](tools/varlogsearch.postman_collection.json "s/varlogsearch.postman_collection.json")

## Frontend
The basic UI is in the repository below, so if you want to access this server from the UI, please set up a front-end server according to the README in the repository below.
[SearchHead](https://github.com/sakaijunsoccer/searchhead)
