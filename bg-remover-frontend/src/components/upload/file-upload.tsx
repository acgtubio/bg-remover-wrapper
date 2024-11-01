import { Component, createSignal, useContext } from "solid-js";
import { FileCollectionContext } from "~/store/provider";

const FileUpload: Component = () => {
	const { fileStore, dispatcher } = useContext(FileCollectionContext);
	const [file, setFile] = createSignal<File>();
	let progressBarRef;

	// TODO: eyd - type
	const handleFileChange = (e: any) => {
		console.info("suck my balls");
		setFile(e.target.files[0]);
	}

	return (
		<div>
			<div ref={progressBarRef}></div>
			<form>
				<input type="file" name="file" onChange={handleFileChange} />
			</form>
		</div>
	);
}

export default FileUpload;
