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
```
$ npm install
```

#### Run local
```
$ npm start
```

## How to develop

#### Run local
```
npm run dev
```

#### Run test
```
npm run build
npm test
```

#### Run benchmark
```
npx ts-node bin/benchmark.ts
```

#### Help to reformant code
```
npx eslint .
```