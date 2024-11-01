
export type FileStore = {
	files: File[],
};

export type FileStoreContext = {
	fileStore: FileStore,
	dispatcher: (action: string) => void,
}
