import { program } from 'commander';
import EventLog from "../src/models/eventLog"

const benchmarkEventLog = (filename: string, keyword: string, limit: number) => {

    const buffer_size = 16;
    const start = (new Date()).getTime() / 1000;
    const eventLog = new EventLog(filename, buffer_size);
    const results = eventLog.search([keyword], limit);
    const end = (new Date()).getTime() / 1000;
    console.log(`time: ${end - start} found: ${results.length} buffer size: ${buffer_size}`);
    if (results.length !== 10000) throw new Error(`${results.length}`);

    const buffer_size2 = 4*1024;
    const start2 = (new Date()).getTime() / 1000;
    const eventLog2 = new EventLog(filename, buffer_size2);
    const results2 = eventLog2.search([keyword], limit);
    const end2 = (new Date()).getTime() / 1000;
    console.log(`time: ${end2 - start2} found: ${results2.length} buffer size: ${buffer_size2}`);
    if (results2.length !== 10000) throw new Error(`${results2.length}`);
};

program
  .option('--filename <filename>', 'log file location', "/var/log/random.log")
  .option('--keyword <keyword>', 'Keyword to search', "test")
  .option('--limit <limit>', 'limit', parseInt, 10000)
  .parse();

const options = program.opts();
benchmarkEventLog(options.filename, options.keyword, options.limit);
