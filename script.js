// script.js

const imageUpload1 = document.getElementById('imageUpload1');
const imageUpload2 = document.getElementById('imageUpload2');
const preview1 = document.getElementById('preview1');
const preview2 = document.getElementById('preview2');
const combineBtn = document.getElementById('combineBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const outputImage = document.getElementById('outputImage');
const outputPlaceholder = document.getElementById('outputPlaceholder');

let imageDataUrl1 = null;
let imageDataUrl2 = null;

// Helper function to convert a File object to a Data URL
async function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Function to update image preview
function updatePreview(input, previewDiv, dataUrl) {
    previewDiv.innerHTML = ''; // Clear existing content
    if (dataUrl) {
        const img = document.createElement('img');
        img.src = dataUrl;
        previewDiv.appendChild(img);
    } else {
        const p = document.createElement('p');
        p.textContent = 'No image selected';
        previewDiv.appendChild(p);
    }
}

// Event listeners for file inputs
imageUpload1.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        imageDataUrl1 = await fileToDataUrl(file);
        updatePreview(imageUpload1, preview1, imageDataUrl1);
    } else {
        imageDataUrl1 = null;
        updatePreview(imageUpload1, preview1, null);
    }
    checkCanCombine();
});

imageUpload2.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        imageDataUrl2 = await fileToDataUrl(file);
        updatePreview(imageUpload2, preview2, imageDataUrl2);
    } else {
        imageDataUrl2 = null;
        updatePreview(imageUpload2, preview2, null);
    }
    checkCanCombine();
});

// Function to enable/disable combine button
function checkCanCombine() {
    if (imageDataUrl1 && imageDataUrl2) {
        combineBtn.disabled = false;
    } else {
        combineBtn.disabled = true;
    }
}

// Initial state of the button
checkCanCombine();

// Event listener for combine button
combineBtn.addEventListener('click', async () => {
    if (!imageDataUrl1 || !imageDataUrl2) {
        alert('Please upload both images.');
        return;
    }

    // Show loading indicator
    loadingIndicator.style.display = 'block';
    combineBtn.disabled = true;
    outputImage.classList.add('hidden');
    outputPlaceholder.classList.remove('hidden');

    try {
        const result = await websim.imageGen({
            prompt: "Merge these two input images into a single, cohesive new image, combining their elements and concepts into a unique object, thing, or person. Aim for a creative and imaginative blend.",
            image_inputs: [
                { url: imageDataUrl1 },
                { url: imageDataUrl2 }
            ],
            aspect_ratio: "1:1" // Using a square aspect ratio for a balanced merge
        });

        if (result && result.url) {
            outputImage.src = result.url;
            outputImage.classList.remove('hidden');
            outputPlaceholder.classList.add('hidden');
        } else {
            alert('Failed to generate image. Please try again.');
        }
    } catch (error) {
        console.error('Error combining images:', error);
        alert('An error occurred while combining images. Please try again.');
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        combineBtn.disabled = false;
    }
});

// Initialize previews with placeholder text
updatePreview(imageUpload1, preview1, null);
updatePreview(imageUpload2, preview2, null);

