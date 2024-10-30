import os  # Import the os module for interacting with the operating system
from rembg import remove  # Import the remove function from the rembg library for background removal

def process_images(input_folder, output_folder):
    # Check if the input folder exists; if not, create it and notify the user
    if not os.path.exists(input_folder):
        os.makedirs(input_folder)  # Create the input folder
        print(f"The '{input_folder}' folder was not found, so it has been created.")  # Inform the user
        print(f"Please place the images you want to process in the '{input_folder}' folder.")  # Provide instructions
        print(f"The processed images will be saved in the '{output_folder}' folder.")  # Inform where processed images will be saved
        return  # Exit the function if the input folder was created

    # Ensure the output folder exists; create it if it doesn't
    os.makedirs(output_folder, exist_ok=True)

    # Loop through each file in the input folder
    for filename in os.listdir(input_folder):
        input_path = os.path.join(input_folder, filename) # Construct the full path to the input file
        
        # Process only if the file is an image (by checking its extension)
        if os.path.isfile(input_path) and filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            output_path = os.path.join(output_folder, filename)  # Construct the full path for the output file
            
            # Open the input file in binary read mode and the output file in binary write mode
            with open(input_path, 'rb') as i:
                with open(output_path, 'wb') as o:
                    input_data = i.read()  # Read the contents of the input file
                    output_data = remove(input_data, force_return_bytes=True)  # Remove the background using rembg
                    o.write(output_data)  # Write the processed output to the output file
            print(f"Processed {filename} -> {output_path}")  # Inform the user of the processed file

    print("All images in the input folder have been processed.")  # Notify the user that processing is complete

if __name__ == "__main__":
    # Define the input and output folder names
    input_folder = "input"  # Name of the folder containing images to be processed
    output_folder = "output"  # Name of the folder where processed images will be saved
    
    process_images(input_folder, output_folder)  # Call the function to process images
