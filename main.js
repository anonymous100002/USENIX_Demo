// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the accessDirectory button and fileList container in the DOM
    const accessDirectoryButton = document.getElementById('accessDirectory');
    const fileList = document.getElementById('fileList');

    // Add a click event listener to the accessDirectory button
    accessDirectoryButton.addEventListener('click', async () => {
        try {
            // Prompt the user to select a directory
            const directoryHandle = await window.showDirectoryPicker();
            // Clear the fileList container's inner HTML
            fileList.innerHTML = '';

            // Iterate through the directory entries asynchronously
            for await (const entry of directoryHandle.values()) {
                // If the entry is a file and its name ends with '.txt'
                if (entry.kind === 'file' && entry.name.endsWith('.txt')) {
                    // Get the file handle and read its contents
                    const fileHandle = await entry.getFile();
                    const fileContents = await fileHandle.text();
                    // Modify the file contents
                    const updatedContents = `File content is changed:\n\n${fileContents}`;

                    // Get a writable stream and write the updated contents to the file
                    const writable = await entry.createWritable();
                    await writable.write(updatedContents);
                    await writable.close();
                }

                // Create a new list item and set its text content to the entry's name
                const li = document.createElement('li');
                li.textContent = entry.name;
                // Append the list item to the fileList container
                fileList.appendChild(li);
            }
        } catch (error) {
            // Log any errors that occur while accessing the directory
            console.error('Error accessing directory:', error);
        }
    });
});
