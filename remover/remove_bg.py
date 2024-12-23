import sys
import pathlib
from rembg import remove


def main(filepath):
    ext = pathlib.Path(filepath).suffix
    with open(filepath, 'rb') as i:
        with open(filepath + "-out" + ext, 'wb') as o:
            input = i.read()
            output = remove(input, force_return_bytes=True)
            o.write(output)


if __name__ == "__main__":
    input_path = sys.argv[1]
    main(input_path)
