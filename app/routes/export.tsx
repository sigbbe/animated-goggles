import { Response } from '@remix-run/node';
import type { ActionArgs } from "@remix-run/server-runtime";
import { psqlExportAnswers } from '~/models/question.server';
import convertJSONToCSV from '~/scripts/jsonTocsv';

export const action = async ({ request, params }: ActionArgs) => {
	const { method } = request;

	const respond404 = () => new Response("Not Found", { status: 404 });
	if (!(method === "POST")) {
		return respond404();
	}
	const data = await request.json();
	const mail = data.mail;
	const token = data.token;
	const form = data.form;

	if (!mail || !token) {
		return respond404();
	}

	if (!(mail === "sigbjorn.berdal14@gmail.com" && token == process.env.SESSION_SECRET)) {
		return respond404();
	}
	const exportData = await psqlExportAnswers({ form });
	if (!exportData || exportData.length === 0) {
		return respond404();
	}

	// convert to csv and send response
	return new Response(await convertJSONToCSV(exportData), {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": "attachment; filename=export.csv",
		},
	});;
};