import fs from 'fs';

const defaultBufferSize = 16;
const defaultFindEventNum = 5;
const defaultTimeOut = 5;

export default class EventLog {
    readonly filename: string; 
    readonly fileDiscriptor: number;
    private offset: number;
    private stat: fs.Stats;
    private cousor: number;
    private buffer: string;
    public matchLine: string[];
    public bufferSize: number;
    public isTimeout: boolean;
    
    constructor(filename: string, bufferSize: number=defaultBufferSize) {
        this.filename = filename;
        this.stat = fs.statSync(this.filename);
        this.offset = this.stat.size;
        this.cousor = this.offset;
        this.fileDiscriptor = fs.openSync(this.filename, 'r');
        this.matchLine = [];
        this.buffer = "";
        this.bufferSize = bufferSize;
        this.isTimeout = false;
    }

    get pos(): number {
        return this.cousor - this.offset;
    }

    getChar(): string {
        return this.buffer.charAt(this.pos);
    }

    moveCursor(num = -1): void{
        this.cousor += num
    }

    trim(): void{
        this.buffer = this.buffer.slice(0, this.pos+1)
    }

    readBuffer(): (boolean) {
        let num: number = this.bufferSize;
        if (this.offset < this.bufferSize){
            num = this.offset;
        }
        
        if (num == 0) {
            return false
        }
        
        this.offset -= num;
        const buf = Buffer.alloc(num);
        fs.readSync(this.fileDiscriptor, buf, 0, num, this.offset)
        this.buffer = buf.toString() + this.buffer;
        return true;
    }

    findAndMoveLineBreakOrStart(): (boolean) {
        while (this.getChar() != '\n'){
            if (this.pos === 0) {
                if (this.offset === 0) {
                    return false;
                }
                this.readBuffer();
            }
            this.moveCursor(-1);
        }
        return true;
    }

    search(keyWords: string[], limit: number = defaultFindEventNum, timeout = defaultTimeOut): (string[]) {
        // TODO (sakaijunsoccer) Implement AND search with mulitple keywords. Use one keyword for now.
        const keyWord = keyWords[0].trim();
        const lenKeyWord = keyWord.length;
        const lastCharOfKeyword = keyWord.charAt(lenKeyWord-1);
        
        // TODO (sakaijunsoccer) Use SQS kind of async tasks with timeout
        const now = function(): number {return (new Date()).getTime()}
        const end = (new Date()).getTime() + (timeout * 1000);
        while (this.matchLine.length < limit){
            if (now() >= end){
                console.warn("timeout")
                this.isTimeout = true;
                return this.matchLine
            } 

            if (this.pos == 0) {
                if (!this.readBuffer()){
                    return this.matchLine;
                }
            }
            let isMatchLastKeyWordChar = false;
            while (this.pos >0){
                this.moveCursor(-1);
                const c = this.getChar();
                if (c === '\n') {
                    this.trim();
                }else if (c === lastCharOfKeyword) {
                    isMatchLastKeyWordChar = true;
                    break
                }

                if (this.pos === 0) {
                    if (this.offset == 0) {
                        return this.matchLine;
                    }
                    this.readBuffer();
                }
            }

            if (this.pos < lenKeyWord) {
                this.readBuffer();
            }
        
            if (isMatchLastKeyWordChar){
                const backLenKeyword = this.pos - (lenKeyWord-1);
                const isMatchWord = this.buffer.indexOf(keyWord, backLenKeyword) === backLenKeyword;
                if (isMatchWord) {
                    this.moveCursor(-(lenKeyWord-1));

                    let line = ""
                    if (this.findAndMoveLineBreakOrStart()) {
                        line = this.buffer.slice(this.pos+1);
                    }else{
                        line = this.buffer;
                    }

                    if (line.charAt(line.length-1) == "\n") {
                        line = line.slice(0,-1);
                    }
                    
                    this.matchLine.push(line);
                    this.trim();
                }
            } else{
                    this.moveCursor(-1);
            }
        }
        return this.matchLine
    }

}