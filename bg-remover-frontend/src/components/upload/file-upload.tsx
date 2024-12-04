import { Component, For, Show, createSignal, useContext } from "solid-js";
import { FileCollectionContext } from "~/store/provider";

const FileUpload: Component = () => {
	const { fileStore, dispatch } = useContext(FileCollectionContext);
	// const [file, setFile] = createSignal<File>();
	let progressBarRef;

	// TODO: eyd - type
	const handleFileChange = (e: any) => {
		dispatch("ADD_FILE", e.target.files[0]);
	}

	const handleRemoveFile = (index: number) => {
		dispatch("DELETE_FILE", index);
	}

	return (
		<div>
			<div ref={progressBarRef}></div>
			<form>
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
			</form>
		</div>
	);
}

export default FileUpload;
