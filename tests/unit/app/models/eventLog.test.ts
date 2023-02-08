import fs from 'fs'
import  EventLog  from '../../../../src/models/eventLog'

const tmp = require('tmp');
let tempObj: any

beforeEach(() => {
    tempObj = tmp.fileSync();
});

afterEach(() => {
    tempObj.removeCallback();
});

test("EventLog.search match begging", () => {
    fs.writeSync(tempObj.fd, 'test data\n');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual(['test data']);
});

test("EventLog.search match middle", () => {
    fs.writeSync(tempObj.fd, 'some test data\n');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual(['some test data']);
});

test("EventLog.search match end", () => {
    fs.writeSync(tempObj.fd, 'some test\n');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual(['some test']);
});

test("EventLog.search with other word", () => {
    fs.writeSync(tempObj.fd, 'abc XXXXtestXXXX abc\n');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual(['abc XXXXtestXXXX abc']);
});

test("EventLog.search multi line", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nsome test 2\nsome test 3\n');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual(['some test 3', 'some test 2', 'some test 1']);
});

test("EventLog.search no line break last", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nsome test 2\nsome test 3');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual(['some test 3', 'some test 2', 'some test 1']);
});

test("EventLog.search multi line limit", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nsome test 2\nsome test 3');
    const limit = 1;
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"], limit)
    expect(events).toStrictEqual(['some test 3']);
});

test("EventLog.search multi line limit two", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nsome test 2\nsome test 3');
    const limit = 2;
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"], limit)
    expect(events).toStrictEqual(['some test 3', 'some test 2']);
});

test("EventLog.search multi line more than limit", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nsome test 2\nsome test 3');
    const limit = 100;
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"], limit)
    expect(events).toStrictEqual(['some test 3', 'some test 2', 'some test 1']);
});

test("EventLog.search hit one in multiline", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nsome unique 2\nsome test 3');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["unique"])
    expect(events).toStrictEqual(['some unique 2']);
});

test("EventLog.search two keyword in line line", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nsome test test 2\nsome test 3');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual(['some test 3', 'some test test 2', 'some test 1']);
});

test("EventLog.search text search", () => {
    fs.writeSync(tempObj.fd, 'some test 1\nHello. This is text. Bye.\nsome test 3');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["This is text"])
    expect(events).toStrictEqual(['Hello. This is text. Bye.']);
});

test("EventLog.search word between buffer", () => {
    fs.writeSync(tempObj.fd, '123456789\n');
    const bufferSize = 5;
    const eventLog = new EventLog(tempObj.name, bufferSize)
    const events = eventLog.search(["456"])
    expect(events).toStrictEqual(['123456789']);
});

test("EventLog.search break line", () => {
    fs.writeSync(tempObj.fd, 'some test 1\n');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["\n"])
    expect(events).toStrictEqual([]);
});

test("EventLog.search does not match", () => {
    fs.writeSync(tempObj.fd, 'abc def hij\n');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual([]);
});

test("EventLog.search empty", () => {
    fs.writeSync(tempObj.fd, '');
    const eventLog = new EventLog(tempObj.name)
    const events = eventLog.search(["test"])
    expect(events).toStrictEqual([]);
});