"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Save } from "lucide-react";
import Image from "next/image";

export function ImageUploadSection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
  };

  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="border border-gray-100 rounded-2xl p-5 bg-[#FFFDF9] space-y-3">
        <h3 className="text-sm font-bold text-text-primary">Product Image</h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 group">
            <Image
              src={imagePreview}
              alt="Product Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={handleContainerClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFFDF9] border border-gray-100 flex items-center justify-center text-gray-400 mb-3 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-gray-700">
              <span className="text-rose-600 font-bold">Click to upload</span> or drag and drop
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}