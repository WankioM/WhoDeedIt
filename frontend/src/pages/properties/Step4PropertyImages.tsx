import React, { useState, useRef } from 'react';
import propertyService from '@/services/PropertyService';

interface Step4Props {
  onBack: () => void;
  onImagesUploaded: (files: File[], urls: string[]) => void;
}

function Step4PropertyImages({ onBack, onImagesUploaded }: Step4Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        
        if (!isValidType) {
          setError('Only image files are allowed');
          return false;
        }
        
        if (!isValidSize) {
          setError('Files must be smaller than 5MB');
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length === 0) {
        return;
      }
      
      // Create preview URLs for the selected files
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setError(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Remove a file from the selection
  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle direct URL entry
  const [urlInput, setUrlInput] = useState('');
  
  const addImageUrl = () => {
    if (!urlInput.trim()) {
      return;
    }
    
    // Validate URL
    try {
      new URL(urlInput);
    } catch (err) {
      setError('Please enter a valid URL');
      return;
    }
    
    setUploadedUrls(prev => [...prev, urlInput]);
    setUrlInput('');
    setError(null);
  };
  
  // Remove a URL from the list
  const removeUrl = (index: number) => {
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0 && uploadedUrls.length === 0) {
      setError('Please select at least one image');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Upload files and get URLs
      const newUploadedUrls: string[] = [...uploadedUrls];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Get upload URL from the server
        const response = await propertyService.getDocumentUploadUrl({
          fileName: file.name,
          contentType: file.type,
        });
        
        if (response && response.data.uploadUrl) {
          // Upload the file
          await propertyService.uploadFile(response.data.uploadUrl, file, file.type);
          
          // Add the file URL to the list
          newUploadedUrls.push(response.data.fileUrl);
        } else {
          throw new Error('Failed to get upload URL');
        }
      }
      
      // Call the callback with the uploaded files and URLs
      onImagesUploaded(selectedFiles, newUploadedUrls);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-graphite mb-3">Step 4: Property Images</h2>
      
      <div className="bg-white border border-lightstone rounded-lg p-4">
        <p className="text-gray-600 mb-4">
          Upload images of your property to showcase its features and attract potential buyers or renters.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-graphite mb-2">Upload Images</label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="sr-only"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex-1 cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-graphite bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Select Files
            </label>
            <span className="text-xs text-gray-500">Max 5MB per file, images only</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-graphite mb-2">Or Add Image URL</label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-graphite hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Preview of selected files */}
        {previewUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-graphite mb-2">Selected Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={`file-${index}`} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={url}
                      alt={`Selected ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* List of uploaded URLs */}
        {uploadedUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-graphite mb-2">Image URLs</h3>
            <ul className="space-y-2">
              {uploadedUrls.map((url, index) => (
                <li key={`url-${index}`} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                  <div className="truncate flex-1 pr-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
                    className="flex-shrink-0 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-rustyred rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md text-graphite hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || (selectedFiles.length === 0 && uploadedUrls.length === 0)}
          className="px-6 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  );
}

export default Step4PropertyImages;