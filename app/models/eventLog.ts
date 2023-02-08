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
        this.fileDiscriptor = fs.openSync(this.filename, 'r');
        this.stat = fs.statSync(this.filename);
        this.offset = this.stat.size;
        this.cousor = this.offset;
        this.matchLine = [];
        this.buffer = "";
        this.bufferSize = bufferSize;
        this.isTimeout = false;
    }

    initialize() {
        this.isTimeout = false
        this.matchLine = []
        this.buffer = ""
        this.offset = this.stat.size;
        this.cousor = this.offset;
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
        /* Backword until newline character is found, read more buffer if buffer is exhausted */
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
        /**
         * Read from the back of the log file for the buffer size, and if there is a log line that hits 
         * the search keyword, return it from the latest one. Also, set a timeout until the searched log line 
         * is found, and if it times out, only the searched line are returned.
         * 
         * @param keyWords - An array of search characters separated by commas. ex) apple,banna
         * @param limit - limit on how many retrieved lines to return
         * @param timeout - The number of seconds to timeout. default is `defaultTimeOut` seconds
         * @returns Returns the loglines with the searched word in an array, starting with the most recent.
         */

        // TODO (sakaijunsoccer) Implement AND search with mulitple keywords. Use one keyword for now.
        const keyWord = keyWords[0].trim();
        const lenKeyWord = keyWord.length;
        const lastCharOfKeyword = keyWord.charAt(lenKeyWord-1);
        
        // TODO (sakaijunsoccer) Use SQS kind of async tasks with timeout
        const now = function(): number {return (new Date()).getTime()}
        const end = (new Date()).getTime() + (timeout * 1000);
        this.isTimeout = false;

        while (this.matchLine.length < limit){
            if (now() >= end){
                this.isTimeout = true;
                console.warn("timeout")
                return this.matchLine
            } 

            // Exit if reading reaches the beginning of the file
            if (this.pos == 0) {
                if (!this.readBuffer()){
                    return this.matchLine;
                }
            }

            // Backword until the end of the search string is found.
            let isMatchLastKeyWordChar = false;
            while (this.pos > 0){
                this.moveCursor(-1);
                const c = this.getChar();
                if (c === '\n') {
                    // If the end of the search string is not found until the newline, 
                    // the buffer after the newline is not needed and delete it.
                    this.trim();
                }else if (c === lastCharOfKeyword) {
                    isMatchLastKeyWordChar = true;
                    break
                }

                // Exit if reading reaches the beginning of the file
                // if not, read more buffers
                if (this.pos === 0) {
                    if (this.offset == 0) {
                        return this.matchLine;
                    }
                    this.readBuffer();
                }
            }

            // Read more buffer if remaining buffer is shorter than search word
            if (this.pos < lenKeyWord) {
                this.readBuffer();
            }
        
            if (isMatchLastKeyWordChar){
                // Determine if find from the end of the search character to the length of the search character
                const backLenKeyword = this.pos - (lenKeyWord-1);
                const isMatchWord = this.buffer.indexOf(keyWord, backLenKeyword) === backLenKeyword;
                if (isMatchWord) {
                    // If the search string is found, backword the search string length
                    this.moveCursor(-(lenKeyWord-1));

                    // Search word found, save logline
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

    find_event(keyWords: string[], limit: number = defaultFindEventNum, timeout = defaultTimeOut): [string[], boolean] {
        const matchLine = this.search(keyWords, limit, timeout)
        const isTimeout = this.isTimeout
        this.initialize()
        return [matchLine , isTimeout]
    }

}