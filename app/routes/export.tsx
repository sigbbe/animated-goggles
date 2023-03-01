import { Response } from '@remix-run/node';
import type { ActionArgs } from "@remix-run/server-runtime";
import convertJSONToCSV from '~/jsonTocsv';
import { exportData } from '~/models/question.server';

export const action = async ({ request }: ActionArgs) => {
	const { method } = request;
	const respond404 = () => new Response("Not Found", { status: 404 });
	if (!(method === "POST")) {
		return respond404();
	}
	const data = await request.json();
	const mail = data.mail;
	const token = data.token;

	if (!mail || !token) {
		return respond404();
	}

	if (!(mail === "sigbjorn.berdal14@gmail.com" && token == process.env.SESSION_SECRET)) {
		return respond404();
	}
	// retrieve data from db
	let dump = await exportData();

	// convert to csv and send response
	return new Response(await convertJSONToCSV(dump), {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": "attachment; filename=export.csv",
		},
	});;
};