import { program } from 'commander';
import EventLog from "../src/models/eventLog"

const benchmarkEventLog = (filename: string, keyword: string, limit: number) => {

    const buffer_size = 16;
    let start = (new Date()).getTime() / 1000;
    const eventLog1 = new EventLog(filename, buffer_size);
    const result1 = eventLog1.search([keyword], limit);
    let end = (new Date()).getTime() / 1000;
    console.log(`time: ${end - start} found: ${result1.length} buffer size: ${buffer_size}`);

    const buffer_size2 = 4*1024;
    start = (new Date()).getTime() / 1000;
    const eventLog2 = new EventLog(filename, buffer_size2);
    const result2 = eventLog2.search([keyword], limit);
    end = (new Date()).getTime() / 1000;
    console.log(`time: ${end - start} found: ${result2.length} buffer size: ${buffer_size2}`);

    const buffer_size3 = 16*1024;
    start = (new Date()).getTime() / 1000;
    const eventLog3 = new EventLog(filename, buffer_size3);
    const result3 = eventLog3.search([keyword], limit);
    end = (new Date()).getTime() / 1000;
    console.log(`time: ${end - start} found: ${result3.length} buffer size: ${buffer_size3}`);

    const buffer_size4 = 64*1024;
    start = (new Date()).getTime() / 1000;
    const eventLog4 = new EventLog(filename, buffer_size4);
    const result4 = eventLog4.search([keyword], limit);
    end = (new Date()).getTime() / 1000;
    console.log(`time: ${end - start} found: ${result4.length} buffer size: ${buffer_size4}`);

    for (const x in [result2, result3, result4]) {
        if (result1.toString() === x.toString()){
          throw new Error("invalid");
        }
    }
};

program
  .option('--filename <filename>', 'log file location', "/var/log/random.log")
  .option('--keyword <keyword>', 'Keyword to search', "test")
  .option('--limit <limit>', 'limit', parseInt, 10000)
  .parse();

const options = program.opts();
benchmarkEventLog(options.filename, options.keyword, options.limit);
