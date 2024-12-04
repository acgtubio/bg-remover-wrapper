import { FileStore, StorePayload } from "~/types/file-store-type";
import { FILE_ACTIONS } from "./actions";
import { createStore, produce } from "solid-js/store";

export const createFileStore = (): [FileStore, (action: FILE_ACTIONS, payload: StorePayload) => void] => {
	const [fileStore, setFileStore] = createStore<FileStore>({
		files: []
	});

	const dispatch = (action: FILE_ACTIONS, payload: StorePayload) => {
		switch (action) {
			case "ADD_FILE":
				if (payload instanceof File) {
					setFileStore(
						"files",
						produce((files) => {
							files.push(payload as File);
						})
					);
				}
				break;
			case "SUBMIT_FILES":
				break;
			case "DELETE_FILE":
				if (typeof payload !== "number") {
					return;
				}
				setFileStore(
					'files',
					produce((files) => {
						files.splice(payload, 1)
					})
				)

				break;
		}
	}

	return [fileStore, dispatch];
}

