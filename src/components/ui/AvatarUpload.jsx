import React, { useState, useRef } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import toast from 'react-hot-toast'

function AvatarUpload({ currentAvatar, onAvatarChange, size = 'large' }) {
  const { updateProfile } = useApp()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Simulate upload process
    setIsUploading(true)
    setTimeout(() => {
      // In a real app, you would upload to a server here
      const newAvatarUrl = url // This would be the server URL
      onAvatarChange?.(newAvatarUrl)
      updateProfile({ avatar: newAvatarUrl })
      setIsUploading(false)
      toast.success('Avatar updated successfully!')
    }, 2000)
  }

  const handleRemovePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayAvatar = previewUrl || currentAvatar

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Upload className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Remove preview button */}
      {previewUrl && (
        <button
          onClick={handleRemovePreview}
          className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Upload button for larger sizes */}
      {size === 'large' && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-colors duration-200"
        >
          <Camera className="h-4 w-4" />
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default AvatarUpload