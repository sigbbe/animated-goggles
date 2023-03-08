import { AsyncParser } from '@json2csv/node';
/**
 * 
 * this function converts json to csv
 * 
 * @param data arbitrary json data
 */
async function convertJSONToCSV(data) {
	const opts = {};
	const transformOpts = {};
	const asyncOpts = {};
	const parser = new AsyncParser(opts, transformOpts, asyncOpts);

	const csv = await parser.parse(data).promise();
	return csv;
}


export default convertJSONToCSV;