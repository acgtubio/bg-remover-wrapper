import { FileStore } from "~/types/file-store-type";
import { FILE_ACTIONS } from "./actions";
import { createStore, produce } from "solid-js/store";

export const createFileStore = (): [FileStore, (action: FILE_ACTIONS, file: File) => void] => {
	const [fileStore, setFileStore] = createStore<FileStore>({
		files: []
	});

	const dispatch = (action: FILE_ACTIONS, file: File) => {
		switch (action) {
			case "ADD_FILE":
				setFileStore(
					"files",
					produce((task) => {
						task.push(file);
					})
				);
				break;
		}
	}

	return [fileStore, dispatch];
}

