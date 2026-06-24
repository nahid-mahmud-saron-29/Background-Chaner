const fileInput = document.getElementById('fileInput');
const originalImg = document.getElementById('originalImg');
const resultImg = document.getElementById('resultImg');
const removeBtn = document.getElementById('removeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const workspace = document.getElementById('workspace');
const bgSelectors = document.getElementById('bgSelectors');
const resultFrame = document.getElementById('resultFrame');
const thumbs = document.querySelectorAll('.bg-thumb');

let selectedFile;
let processedImageBlobUrl; // Download trigger korar jonno url track rakhbe

// Tomar original unique token active rakhlam
const apiKey = "4uve8V65B2roesCre4cReYAT"; 

// File selection trigger
fileInput.addEventListener('change', function(e) {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        originalImg.src = URL.createObjectURL(selectedFile);
        workspace.style.display = 'grid'; // Workspace dynamic screen update
        
        // Hide previous state results
        resultImg.style.display = 'none';
        downloadBtn.style.display = 'none';
        bgSelectors.style.display = 'none';
        resultFrame.style.background = ''; // default layout grid reset
    }
});

// Processing Engine
removeBtn.addEventListener('click', function() {
    if (!selectedFile) {
        alert("Please upload an image first!");
        return;
    }

    removeBtn.innerText = "Analyzing Layers...";
    removeBtn.disabled = true;

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    formData.append('size', 'auto');

    fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Premium Token limit reached or network interruption.");
        }
        return response.blob();
    })
    .then(blob => {
        processedImageBlobUrl = URL.createObjectURL(blob);
        resultImg.src = processedImageBlobUrl;
        resultImg.style.display = 'block';
        
        // Action reveals
        downloadBtn.style.display = 'inline-flex';
        bgSelectors.style.display = 'block';
        
        removeBtn.innerText = "Process Image";
        removeBtn.disabled = false;
    })
    .catch(error => {
        console.error(error);
        alert("System Error: " + error.message);
        removeBtn.innerText = "Process Image";
        removeBtn.disabled = false;
    });
});

// Premium Feature 1: Dynamic Download System
downloadBtn.addEventListener('click', function() {
    if (!processedImageBlobUrl) return;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = processedImageBlobUrl;
    downloadLink.download = 'AuraCut_Result.png'; // High definition transparent file
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// Premium Feature 2: Creative Background Presets
thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
        const bgType = this.getAttribute('data-bg');
        if (bgType === 'transparent') {
            resultFrame.style.background = ''; // Default transparent grid layout
        } else {
            resultFrame.style.background = bgType; // Neon, Gold or Dark studio style overlay
        }
    });
});