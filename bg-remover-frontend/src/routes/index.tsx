import FileUpload from "~/components/upload/file-upload";
import { FileCollectionProvider } from "~/store/provider";

export default function Home() {
  return (
    <main class="text-center mx-auto p-4 flex flex-col justify-center h-lvh items-center">
      <h1 class="text-4xl font-bold text-gray-200 mt-20 mb-4">Background Remover</h1>
      <h4 class="font-light italic">powered by rembg</h4>

      <section class="h-2/3 mt-20 p-20 max-w-7xl w-full">

        <FileCollectionProvider>
          <FileUpload />
        </FileCollectionProvider>
      </section>
    </main>
  );
}
