import { ParentComponent, createContext } from "solid-js";
import { createFileStore } from "./file-store";
import { FileStore, FileStoreContext, StorePayload } from "~/types/file-store-type";
import { FILE_ACTIONS } from "./actions";

const initialContextValue: FileStoreContext = {
  fileStore: {
    files: []
  },
  dispatch: (action: FILE_ACTIONS, payload: StorePayload) => { },
};

export const FileCollectionContext = createContext<FileStoreContext>(initialContextValue);

export const FileCollectionProvider: ParentComponent = (props) => {
  const [fileStore, dispatcher]: [FileStore, (action: FILE_ACTIONS, payload: StorePayload) => void] = createFileStore();

  return (
    <FileCollectionContext.Provider value={{ fileStore: fileStore, dispatch: dispatcher }}>
      {props.children}
    </FileCollectionContext.Provider>
  );
}
