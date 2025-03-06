import React from 'react';
import { useRef, useState } from 'react';

function ProfilePicture() {

        const [imagePreview, setImagePreview] = useState(null);
        const fileInputRef = useRef(null);
      
        const handleButtonClick = () => {
          fileInputRef.current.click(); // Triggers the hidden file input
        };
      
        const handleFileChange = (event) => {
          const file = event.target.files[0];
          if (!file) return;
      
          // Preview the selected image
          const imageUrl = URL.createObjectURL(file);
          setImagePreview(imageUrl);
        };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative w-32 h-32 cursor-pointer"
        onClick={handleButtonClick}
      >
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-32 h-32 rounded-full object-cover hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input 
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>

  );
}

export default ProfilePicture;
