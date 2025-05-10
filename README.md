# Webcam Face Detection & Filters Application

## Overview
A modern web application that provides real-time face detection and image filtering capabilities. The application allows users to capture images from their webcam, upload images from their device, and apply various artistic filters to them.

## Features

### 1. Authentication
- Secure login system
- User session management
- Demo credentials for testing
- Responsive login page with modern design

### 2. Webcam Functionality
- Real-time webcam access
- Face detection using face-api.js
- Start/Stop camera controls
- Automatic face detection with visual indicators

### 3. Image Upload
- Support for uploading local images
- Automatic canvas resizing for uploaded images
- Seamless switching between webcam and uploaded images
- Maintains aspect ratio of uploaded images

### 4. Filter System
#### Basic Filters
- Grayscale
- Blur
- Invert
- Sepia

#### Color Effects
- Red Tint
- Blue Tint
- Green Tint

#### Artistic Filters
- Pixelate
- Mirror
- Vintage
- Neon Glow
- Solarize
- Posterize
- Emboss

### 5. Gallery System
- Save filtered images
- View saved images in a grid layout
- Delete unwanted images
- Persistent storage using localStorage
- Maximum of 20 saved images
- Image metadata (filter used, timestamp)

### 6. Filter History
- Tracks last 5 used filters
- Timestamps for each filter use
- Persistent storage
- Real-time updates

### 7. Image Management
- Capture images from webcam
- Download filtered images
- Save to gallery
- Delete from gallery

## Technical Implementation

### Frontend Technologies
- HTML5
- CSS3
- JavaScript (ES6+)
- face-api.js for face detection
- Canvas API for image processing

### Key Components

#### 1. Authentication (`login.html`, `login.js`)
- Form validation
- Session management
- Secure credential handling

#### 2. Main Application (`index.html`, `script.js`)
- Webcam integration
- Face detection
- Filter processing
- Image capture and manipulation

#### 3. Filter System (`script.js`)
- Real-time filter application
- Multiple filter algorithms
- Canvas-based image processing

#### 4. Gallery Management (`gallery.js`)
- Image storage
- Grid display
- Delete functionality
- Local storage integration

#### 5. Filter History (`filterHistory.js`)
- Usage tracking
- Timestamp management
- History display

### Styling (`style.css`)
- Modern, responsive design
- Gradient backgrounds
- Glassmorphic effects
- Smooth animations
- Mobile-friendly layout

## Usage Guide

### 1. Getting Started
1. Open `login.html` in a modern web browser
2. Use demo credentials:
   - Username: admin
   - Password: password
3. Allow webcam access when prompted

### 2. Using the Webcam
1. Click "Start Camera" to begin
2. Position yourself in frame
3. Select a filter from the dropdown
4. Click "Capture" to take a photo
5. Use "Save" to add to gallery or "Download" to save locally

### 3. Uploading Images
1. Click "Upload Image"
2. Select an image from your device
3. Apply filters as desired
4. Save or download the filtered image

### 4. Managing Gallery
1. View saved images in the gallery section
2. Hover over images to see delete option
3. Click × to remove images
4. Maximum of 20 images stored

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Requirements
- Modern web browser
- Webcam (for webcam features)
- JavaScript enabled
- Local storage support

## Security Features
- Client-side authentication
- Secure session management
- Local storage for data persistence
- No server-side dependencies

## Performance Considerations
- Optimized image processing
- Efficient filter algorithms
- Responsive design
- Smooth animations

## Future Enhancements
1. Additional filter effects
2. Filter customization options
3. Social media sharing
4. Cloud storage integration
5. Multiple face detection
6. Filter intensity controls
7. Batch processing
8. Export/Import gallery

## Support
For issues or feature requests, please contact the development team.

## License
This project is licensed under the MIT License. 