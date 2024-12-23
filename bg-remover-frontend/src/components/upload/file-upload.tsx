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

						<input id="file-upload" type="file" name="file" onChange={handleFileChange} class="hidden" />
					</div>

					<button type="submit">Submit</button>
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
