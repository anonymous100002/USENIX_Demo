// Utility function to read and update the content of a text file
async function readAndUpdateTextFile(fileEntry) {
    const fileHandle = await fileEntry.getFile();
    const fileContents = await fileHandle.text();
    const updatedContents = `File content is changed:\n\n${fileContents}`;

    const writable = await fileEntry.createWritable();
    await writable.write(updatedContents);
    await writable.close();
}

// Utility function to create and append a list item to a given container
function appendListItem(container, textContent) {
    const li = document.createElement('li');
    li.textContent = textContent;
    container.appendChild(li);
}

async function handleDirectoryAccess(directoryHandle, fileList) {
    // Clear the fileList container's inner HTML
    fileList.innerHTML = '';

    // Iterate through the directory entries asynchronously
    for await (const entry of directoryHandle.values()) {
        // If the entry is a file and its name ends with '.txt'
        if (entry.kind === 'file' && entry.name.endsWith('.txt')) {
            // Read and update the file contents
            await readAndUpdateTextFile(entry);
        }

        // Append the entry name to the fileList container
        appendListItem(fileList, entry.name);
    }
}

// Main function to handle the click event
async function onAccessDirectoryButtonClick() {
    try {
        const directoryHandle = await window.showDirectoryPicker();
        const fileList = document.getElementById('fileList');

        await handleDirectoryAccess(directoryHandle, fileList);
    } catch (error) {
        console.error('Error accessing directory:', error);
    }
}

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const accessDirectoryButton = document.getElementById('accessDirectory');
    // Add a click event listener to the accessDirectory button
    accessDirectoryButton.addEventListener('click', onAccessDirectoryButtonClick);
});
