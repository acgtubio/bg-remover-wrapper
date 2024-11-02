import { Component, Show, createSignal, useContext } from "solid-js";
import { FileCollectionContext } from "~/store/provider";

const FileUpload: Component = () => {
	const { fileStore, dispatcher } = useContext(FileCollectionContext);
	const [file, setFile] = createSignal<File>();
	let progressBarRef;

	// TODO: eyd - type
	const handleFileChange = (e: any) => {
		setFile(e.target.files[0]);
	}

	const handleRemoveFile = () => {
		setFile(undefined);
	}

	return (
		<div>
			<div ref={progressBarRef}></div>
			<form>
				<div class="flex flex-col justify-center items-center">
					<Show
						when={file() !== undefined}
						fallback={
							<label for="file-upload" class="cursor-pointer px-10 py-5 border rounded-lg">Upload File</label>
						}
					>
						<div class="flex items-center">
							<span class="mr-4">{file()?.name}</span>
							<i class="fa-solid fa-rectangle-xmark cursor-pointer" onClick={handleRemoveFile}></i>
						</div>
					</Show>

					<input id="file-upload" type="file" name="file" onChange={handleFileChange} class="hidden" />
				</div>
			</form>
		</div>
	);
}

export default FileUpload;
