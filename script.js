// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
}

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const filterSelect = document.getElementById('filterSelect');
const startBtn = document.getElementById('startBtn');
const captureBtn = document.getElementById('captureBtn');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');
const capturedImg = document.getElementById('capturedImg');
const capturedImage = document.getElementById('capturedImage');
const imageUpload = document.getElementById('imageUpload');
const uploadBtn = document.getElementById('uploadBtn');

let isStreaming = false;
let filterHistory;
let uploadedImage = null;

// Initialize filter history when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    filterHistory = new FilterHistory();
    
    // Add filter change handler
    filterSelect.addEventListener('change', function(e) {
        const selectedFilter = e.target.value;
        if (filterHistory) {
            filterHistory.saveFilter(selectedFilter);
        }
        if (uploadedImage) {
            applyFilterToUploadedImage(selectedFilter);
        }
    });
});

// Handle image upload
uploadBtn.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImage = new Image();
            uploadedImage.onload = () => {
                // Stop video if it's running
                if (isStreaming) {
                    stopVideo();
                    startBtn.textContent = 'Start Camera';
                    isStreaming = false;
                }
                
                // Set canvas size to match uploaded image
                canvas.width = uploadedImage.width;
                canvas.height = uploadedImage.height;
                
                // Draw the uploaded image
                ctx.drawImage(uploadedImage, 0, 0);
                
                // Apply current filter
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const filteredImageData = applyFilter(imageData, filterSelect.value);
                ctx.putImageData(filteredImageData, 0, 0);
                
                // Show save and download buttons
                saveBtn.style.display = 'inline-block';
                downloadBtn.style.display = 'inline-block';
            };
            uploadedImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function applyFilterToUploadedImage(filter) {
    if (!uploadedImage) return;
    
    ctx.drawImage(uploadedImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const filteredImageData = applyFilter(imageData, filter);
    ctx.putImageData(filteredImageData, 0, 0);
}

// Load face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
]).then(() => {
    console.log('Face detection models loaded');
    startBtn.disabled = false;
})
.catch(err => {
    console.error('Error loading face-api models:', err);
    alert('Error loading face detection models. Please check your internet connection and try again.');
});

// Start Camera button click handler
startBtn.addEventListener('click', () => {
    if (!isStreaming) {
        startVideo();
        startBtn.textContent = 'Stop Camera';
    } else {
        stopVideo();
        startBtn.textContent = 'Start Camera';
    }
    isStreaming = !isStreaming;
});

// Capture button click handler
captureBtn.addEventListener('click', () => {
    if (!isStreaming) {
        alert('Please start the camera first');
        return;
    }

    // Create a temporary canvas to capture the current frame
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the current frame to the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Get the image data and apply the current filter
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const filteredImageData = applyFilter(imageData, filterSelect.value);
    tempCtx.putImageData(filteredImageData, 0, 0);
    
    // Set the captured image source
    capturedImg.src = tempCanvas.toDataURL('image/png');
    capturedImage.style.display = 'block';
    saveBtn.style.display = 'inline-block';
    downloadBtn.style.display = 'inline-block';
});

// Save button click handler
saveBtn.addEventListener('click', () => {
    if (!window.gallery) {
        console.error('Gallery not initialized');
        return;
    }

    // Get the current canvas content
    const imageData = canvas.toDataURL('image/png');
    capturedImg.src = imageData;
    
    // Save to gallery
    window.gallery.saveImage();
});

// Download button click handler
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `filtered-image-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

function startVideo() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support webcam access. Please try using Chrome, Firefox, or Edge.');
        return;
    }

    navigator.mediaDevices.getUserMedia({ 
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
        } 
    })
    .then(stream => {
        console.log('Camera access granted');
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Error accessing camera:', err);
        if (err.name === 'NotAllowedError') {
            alert('Camera access was denied. Please allow camera access and try again.');
        } else if (err.name === 'NotFoundError') {
            alert('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotReadableError') {
            alert('Camera is already in use by another application. Please close other applications using the camera.');
        } else {
            alert('Error accessing camera: ' + err.message);
        }
        isStreaming = false;
        startBtn.textContent = 'Start Camera';
    });
}

function stopVideo() {
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Handle video stream
video.addEventListener('loadedmetadata', () => {
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

// Process video frames
video.addEventListener('play', () => {
    function processFrame() {
        if (video.paused || video.ended) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the entire frame data
        const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Apply filter to the entire frame
        const filteredFrame = applyFilter(frameData, filterSelect.value);
        ctx.putImageData(filteredFrame, 0, 0);

        // Process face detection
        faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .then(detections => {
                detections.forEach(det => {
                    const { x, y, width, height } = det.box;
                    // Draw face box
                    ctx.strokeStyle = '#00FF00';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, width, height);
                });
            })
            .catch(error => {
                console.error('Face detection error:', error);
            });

        // Request next frame
        requestAnimationFrame(processFrame);
    }

    // Start processing frames
    processFrame();
});

function applyFilter(imageData, filter) {
    const data = imageData.data;
    
    switch (filter) {
        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
            break;
            
        case 'invert':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            break;
            
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                data[i] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
                data[i + 1] = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
                data[i + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
            }
            break;
            
        case 'pixelate':
            const pixelSize = 8;
            for (let y = 0; y < imageData.height; y += pixelSize) {
                for (let x = 0; x < imageData.width; x += pixelSize) {
                    const r = data[((y * imageData.width + x) * 4)];
                    const g = data[((y * imageData.width + x) * 4) + 1];
                    const b = data[((y * imageData.width + x) * 4) + 2];
                    for (let py = 0; py < pixelSize; py++) {
                        for (let px = 0; px < pixelSize; px++) {
                            const idx = ((y + py) * imageData.width + (x + px)) * 4;
                            data[idx] = r;
                            data[idx + 1] = g;
                            data[idx + 2] = b;
                        }
                    }
                }
            }
            break;
            
        case 'mirror':
            const temp = new Uint8ClampedArray(data);
            for (let y = 0; y < imageData.height; y++) {
                for (let x = 0; x < imageData.width; x++) {
                    const idx = (y * imageData.width + x) * 4;
                    const mirrorIdx = (y * imageData.width + (imageData.width - x - 1)) * 4;
                    data[idx] = temp[mirrorIdx];
                    data[idx + 1] = temp[mirrorIdx + 1];
                    data[idx + 2] = temp[mirrorIdx + 2];
                    data[idx + 3] = temp[mirrorIdx + 3];
                }
            }
            break;
            
        case 'red':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(data[i] * 1.5, 255);
                data[i + 1] *= 0.5;
                data[i + 2] *= 0.5;
            }
            break;
            
        case 'blue':
            for (let i = 0; i < data.length; i += 4) {
                data[i] *= 0.5;
                data[i + 1] *= 0.5;
                data[i + 2] = Math.min(data[i + 2] * 1.5, 255);
            }
            break;
            
        case 'green':
            for (let i = 0; i < data.length; i += 4) {
                data[i] *= 0.5;
                data[i + 1] = Math.min(data[i + 1] * 1.5, 255);
                data[i + 2] *= 0.5;
            }
            break;
            
        case 'vintage':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                data[i] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
                data[i + 1] = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
                data[i + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
                data[i] = Math.min(data[i] * 1.1, 255);
                data[i + 1] = Math.min(data[i + 1] * 1.1, 255);
                data[i + 2] *= 0.9;
            }
            break;
            
        case 'neon':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const brightness = (r + g + b) / 3;
                const neonIntensity = 1.5;
                
                data[i] = Math.min(r * neonIntensity + brightness * 0.5, 255);
                data[i + 1] = Math.min(g * neonIntensity + brightness * 0.5, 255);
                data[i + 2] = Math.min(b * neonIntensity + brightness * 0.5, 255);
            }
            break;
            
        case 'solarize':
            for (let i = 0; i < data.length; i += 4) {
                const threshold = 128;
                data[i] = data[i] > threshold ? 255 - data[i] : data[i];
                data[i + 1] = data[i + 1] > threshold ? 255 - data[i + 1] : data[i + 1];
                data[i + 2] = data[i + 2] > threshold ? 255 - data[i + 2] : data[i + 2];
            }
            break;
            
        case 'posterize':
            const levels = 4;
            const step = 255 / (levels - 1);
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.round(data[i] / step) * step;
                data[i + 1] = Math.round(data[i + 1] / step) * step;
                data[i + 2] = Math.round(data[i + 2] / step) * step;
            }
            break;
            
        case 'emboss':
            const w = imageData.width;
            const h = imageData.height;
            const copy = new Uint8ClampedArray(data);
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        const idx = (y * w + x) * 4 + c;
                        const topLeft = copy[((y - 1) * w + (x - 1)) * 4 + c];
                        const bottomRight = copy[((y + 1) * w + (x + 1)) * 4 + c];
                        const diff = topLeft - bottomRight;
                        data[idx] = Math.min(Math.max(diff + 128, 0), 255);
                    }
                }
            }
            break;
            
        case 'blur':
            const blurW = imageData.width;
            const blurH = imageData.height;
            const blurCopy = new Uint8ClampedArray(data);
            for (let y = 1; y < blurH - 1; y++) {
                for (let x = 1; x < blurW - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * blurW + (x + dx)) * 4 + c;
                                sum += blurCopy[idx];
                            }
                        }
                        const idx = (y * blurW + x) * 4 + c;
                        data[idx] = sum / 9;
                    }
                }
            }
            break;
    }
    
    return imageData;
}

// Add logout functionality
document.getElementById('logout').addEventListener('click', () => {
    // Stop video if it's running
    if (isStreaming) {
        stopVideo();
    }
    // Clear login state
    localStorage.removeItem('isLoggedIn');
    // Redirect to login page
    window.location.href = 'login.html';
}); 