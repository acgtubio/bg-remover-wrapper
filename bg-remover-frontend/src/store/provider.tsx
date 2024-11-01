import { ParentComponent, createContext } from "solid-js";
import { createFileStore } from "./file-store";
import { SetStoreFunction } from "solid-js/store";
import { FileStore, FileStoreContext } from "~/types/file-store-type";
import { FILE_ACTIONS } from "./actions";

const initialContextValue: FileStoreContext = {
  fileStore: {
    files: []
  },
  dispatcher: () => { },
};

export const FileCollectionContext = createContext<FileStoreContext>(initialContextValue);

export const FileCollectionProvider: ParentComponent = (props) => {
  const [fileStore, updateFileStore]: [FileStore, (action: FILE_ACTIONS, file: File) => void] = createFileStore();

  return (
    <FileCollectionContext.Provider value={{ fileStore: fileStore, dispatcher: () => { } }}>
      {props.children}
    </FileCollectionContext.Provider>
  );
}
