document.addEventListener('DOMContentLoaded', () => {
    const accessDirectoryButton = document.getElementById('accessDirectory');
    const fileList = document.getElementById('fileList');
    accessDirectoryButton.addEventListener('click', async () => {
        try {
            const directoryHandle = await window.showDirectoryPicker();
            fileList.innerHTML = '';

            for await (const entry of directoryHandle.values()) {
                if (entry.kind === 'file' && entry.name.endsWith('.txt')) {
                    const fileHandle = await entry.getFile();
                    const fileContents = await fileHandle.text();
                    const updatedContents = `File content is changed:\n\n${fileContents}`;

                    const writable = await entry.createWritable();
                    await writable.write(updatedContents);
                    await writable.close();
                }

                const li = document.createElement('li');
                li.textContent = entry.name;
                fileList.appendChild(li);
            }
        } catch (error) {
            console.error('Error accessing directory:', error);
        }
    });
});
