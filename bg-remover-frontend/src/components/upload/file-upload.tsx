import { useAction, useSubmission } from "@solidjs/router";
import { Component, For, Match, Show, Switch, createSignal, useContext } from "solid-js";
import { RemoveBgAction, RemoveBgRequest } from "~/api-actions/submit-files";
import { FileCollectionContext } from "~/store/provider";

const FileUpload: Component = () => {
	const { fileStore, dispatch } = useContext(FileCollectionContext);
	const submitFiles = useAction(RemoveBgAction);
	const response = useSubmission(RemoveBgAction);

	let progressBarRef;

	// TODO: eyd - type
	const handleFileChange = (e: any) => {
		dispatch("ADD_FILE", e.target.files[0]);
	}

	const handleRemoveFile = (index: number) => {
		dispatch("DELETE_FILE", index);
	}

	const handleSubmit = (e: any) => {
		e.preventDefault();
		submitFiles({
			images: fileStore.files
		});
	}

	const clearImages = (): void => {
		response.clear();
	}

	const handleDownload = (image: string): void => {
		const byteString = atob(image);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const uint8Array = new Uint8Array(arrayBuffer);

		for (let i = 0; i < byteString.length; i++) {
			uint8Array[i] = byteString.charCodeAt(i);
		}

		const blob = new Blob([uint8Array], { type: "image/png" });
		const url = URL.createObjectURL(blob);

		// Temporary element
		const link = document.createElement('a');
		link.href = url;
		link.download = 'image.png'; // Specify the downloaded file name
		document.body.appendChild(link);

		// Trigger the download
		link.click();

		// Clean up
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	return (
		<div>
			<div ref={progressBarRef}></div>

			<Show when={!response.result}>
				<form onSubmit={handleSubmit}>
					<div class="flex flex-col justify-center items-center">
						<label for="file-upload" class="cursor-pointer px-10 py-5 border rounded-lg mb-10">Upload File</label>
						<For
							each={fileStore.files}
						>
							{(fileItem, i) => (
								<div class="flex items-center">
									<span class="mr-4">{fileItem.name}</span>
									<i class="fa-solid fa-rectangle-xmark cursor-pointer" onClick={() => handleRemoveFile(i())}></i>
								</div>
							)}
						</For>

						<input id="file-upload" type="file" name="file" onChange={handleFileChange} class="hidden" accept="image/*" />
					</div>

					<Show when={fileStore.files.length > 0 && !response.pending && !response.result}>
						<button type="submit" class="cursor-pointer px-10 py-5 border rounded-lg mt-10">Submit</button>
					</Show>
				</form>
			</Show>

			<div class="mt-10">
				<Switch fallback={<></>}>
					<Match when={response.result}>
						<button onclick={clearImages} class="my-15 border rounded-lg px-10 py-5">Clear Images</button>
						<For each={response.result?.images}>
							{(image, i) => (
								<div>
									<img id={"image" + i} src={"data:image/png;base64," + image} />
									<button onClick={() => handleDownload(image)}>Download</button>
								</div>
							)}
						</For>
					</Match>
					<Match when={response.pending}>
						<h1>Converting Images... Please wait.</h1>
					</Match>
				</Switch>
			</div>
		</div>
	);
}

export default FileUpload;
