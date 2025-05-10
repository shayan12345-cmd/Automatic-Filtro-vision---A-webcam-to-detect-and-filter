class Gallery {
    constructor() {
        this.galleryGrid = document.getElementById('galleryGrid');
        this.saveBtn = document.getElementById('saveBtn');
        this.capturedImg = document.getElementById('capturedImg');
        this.savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
        
        this.initializeEventListeners();
        this.loadGallery();
    }

    initializeEventListeners() {
        this.saveBtn.addEventListener('click', () => this.saveImage());
    }

    saveImage() {
        if (!this.capturedImg.src) {
            this.showNotification('No image to save');
            return;
        }

        const imageData = {
            id: Date.now(),
            src: this.capturedImg.src,
            timestamp: new Date().toLocaleString(),
            filter: document.getElementById('filterSelect').value
        };

        this.savedImages.unshift(imageData);
        this.savedImages = this.savedImages.slice(0, 20); // Keep only last 20 images
        localStorage.setItem('savedImages', JSON.stringify(this.savedImages));
        
        this.loadGallery();
        this.showNotification('Image saved to gallery!');
    }

    loadGallery() {
        if (!this.galleryGrid) {
            console.error('Gallery grid element not found');
            return;
        }
        
        this.galleryGrid.innerHTML = '';
        
        if (this.savedImages.length === 0) {
            this.galleryGrid.innerHTML = '<div class="gallery-empty">No saved images yet</div>';
            return;
        }

        this.savedImages.forEach(image => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = `Saved image with ${image.filter} filter`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteImage(image.id);
            });

            item.appendChild(img);
            item.appendChild(deleteBtn);
            this.galleryGrid.appendChild(item);
        });
    }

    deleteImage(id) {
        this.savedImages = this.savedImages.filter(img => img.id !== id);
        localStorage.setItem('savedImages', JSON.stringify(this.savedImages));
        this.loadGallery();
        this.showNotification('Image deleted from gallery');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
}); 