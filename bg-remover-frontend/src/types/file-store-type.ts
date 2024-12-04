import { FILE_ACTIONS } from "~/store/actions";

export type FileStore = {
	files: File[],
};

export type FileStoreContext = {
	fileStore: FileStore,
	dispatch: (action: FILE_ACTIONS, payload: StorePayload) => void,
}

export type StorePayload = File | File[] | number;
