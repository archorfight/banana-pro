'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Download, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type EditorMode = 'text-to-image' | 'image-to-image';
type Style = 'default' | 'anime' | 'realistic';
type Model = 'banana-pro' | 'flux';

interface GeneratedImage {
  url: string;
  timestamp: number;
}

export default function EditorSection() {
  const t = useTranslations('editor');

  const [mode, setMode] = useState<EditorMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<Style>('default');
  const [model, setModel] = useState<Model>('banana-pro');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles: { value: Style; label: string }[] = [
    { value: 'default', label: t(`styles.default`) },
    { value: 'anime', label: t(`styles.anime`) },
    { value: 'realistic', label: t(`styles.realistic`) },
  ];

  const models: { value: Model; label: string }[] = [
    { value: 'banana-pro', label: t(`models.banana-pro`) },
    { value: 'flux', label: t(`models.flux`) },
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: model === 'flux' ? 'nano-banana' : 'nano-banana-fast',
          ...(uploadedImage && { imageUrls: [uploadedImage] }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成失败');
      }

      const data = await response.json();

      if (data.status === 'succeeded' && data.imageUrl) {
        setGeneratedImage({
          url: data.imageUrl,
          timestamp: Date.now(),
        });
      } else {
        throw new Error(data.failureReason || '生成失败，请重试');
      }

    } catch (error) {
      console.error('生成图片错误:', error);
      alert(error instanceof Error ? error.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = generatedImage.url;
      link.download = `banana-pro-${generatedImage.timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const maxLength = 500;
  const promptLength = prompt.length;
  const canGenerate = prompt.trim().length > 0 && !isGenerating && (mode === 'text-to-image' || uploadedImage);

  return (
    <section id="editor" className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      {/* 背景装饰 - 与 HeroSection 风格统一 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/30 to-pink-50/30 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Editor Container with Frame */}
        <div className="mx-auto max-w-6xl rounded-2xl border border-gray-300/80 bg-gray-50 p-6 shadow-xl dark:border-gray-700 dark:bg-neutral-900">
          <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              {/* Mode Toggle */}
              <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                <button
                  onClick={() => setMode('text-to-image')}
                  className={cn(
                    'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                    mode === 'text-to-image'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  {t('textToImage')}
                </button>
                <button
                  onClick={() => setMode('image-to-image')}
                  className={cn(
                    'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                    mode === 'image-to-image'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  {t('imageToImage')}
                </button>
              </div>

              {/* Image Upload (for Image-to-Image) */}
              {mode === 'image-to-image' && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
                    uploadedImage
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploadedImage ? (
                    <div className="text-center">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="mx-auto mb-4 h-40 w-40 rounded-lg object-cover"
                      />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('clickToChange')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="mb-2 font-medium text-gray-900 dark:text-white">
                        {t('uploadImage')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('dragDrop')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Prompt Input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('promptLabel')}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, maxLength))}
                  placeholder={t('promptPlaceholder')}
                  rows={5}
                  maxLength={maxLength}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                />
                <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{t('promptHint')}</span>
                  <span>{promptLength}/{maxLength}</span>
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('style')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={cn(
                        'rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
                        style === s.value
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('model')}
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as Model)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {models.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all',
                  canGenerate
                    ? 'bg-primary-500 hover:bg-primary-600 hover:shadow-xl hover:-translate-y-0.5'
                    : 'cursor-not-allowed bg-gray-400 dark:bg-gray-700',
                  isGenerating && 'cursor-wait'
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {t('generate')}
                  </>
                )}
              </button>
            </div>

            {/* Right Panel - Result */}
            <div className="flex flex-col">
              <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-300/80 bg-white shadow-inner dark:border-gray-600 dark:bg-black">
                {/* Checkered Pattern for Transparency */}
                <div
                  className="absolute inset-0 opacity-10 dark:opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                />
                <div className="relative h-full">
                  {generatedImage ? (
                    <img
                      src={generatedImage.url}
                      alt="Generated"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full min-h-[400px] items-center justify-center p-8">
                      <div className="text-center">
                        <ImageIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {t('imageWillAppear')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button */}
              {generatedImage && (
                <div className="mt-4">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
                      isDownloading && 'cursor-wait opacity-70'
                    )}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('downloading')}
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        {t('download')}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* End Editor Container */}
      </div>
    </section>
  );
}
