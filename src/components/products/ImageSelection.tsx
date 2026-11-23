"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

interface ImageUploadSectionProps {
  onChange: (url: string | null) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function ImageUploadSection({ onChange, onUploadingChange }: ImageUploadSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const latestUpload = useRef(0); // ignores results from replaced/removed uploads

  const setUploading = (value: boolean) => {
    setIsUploading(value);
    onUploadingChange(value);
  };

  const processFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WebP images are allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 5 MB or smaller");
      return;
    }

    setError(null);
    const uploadId = ++latestUpload.current;

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    onChange(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await api.upload<{ url: string }>("/admin/uploads/product-image", formData);
      if (uploadId === latestUpload.current) onChange(url);
    } catch (err) {
      if (uploadId === latestUpload.current) {
        setImagePreview(null);
        onChange(null);
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    } finally {
      if (uploadId === latestUpload.current) setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same file be picked again
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    latestUpload.current++; // cancels any upload in flight
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setError(null);
    onChange(null);
    setUploading(false);
  };

  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="border border-gray-100 rounded-2xl p-5 bg-[#FFFDF9] space-y-3">
        <h3 className="text-sm font-bold text-text-primary">Product Image</h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 group">
            <Image src={imagePreview} alt="Product Preview" fill className="object-cover" />
            {isUploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFFDF9] border border-gray-100 flex items-center justify-center text-gray-400 mb-3 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-gray-700">
              <span className="text-rose-600 font-bold">Click to upload</span> or drag and drop
            </p>
            <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WebP (max. 5 MB)</p>
          </div>
        )}

        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      </div>
    </div>
  );
}