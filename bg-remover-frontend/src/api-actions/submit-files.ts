import { action } from "@solidjs/router";

export type RemoveBgRequest = {
	images: File[]
}

export type RemoveBgResponse = {
	images: string[]
}

export const RemoveBgAction = action(async (files: RemoveBgRequest): Promise<RemoveBgResponse> => {
	const data = new FormData();

	for (const [index, file] of files.images.entries()) {
		data.append('images', file);
	}

	const res = await fetch("http://localhost:8484/remove-bg", {
		method: "POST",
		body: data,
	});

	const responseData = await res.json();

	return responseData;
});