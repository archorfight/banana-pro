'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Download, Image as ImageIcon, Sparkles, Loader2, Lock, CreditCard, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGenerationQuota } from '@/lib/hooks/useGenerationQuota';
import { GENERATION_CONFIG, getCreditCost, FREE_TIER_RESTRICTIONS } from '@/lib/config/generation';

type EditorMode = 'text-to-image' | 'image-to-image';
type Style = 'default' | 'anime' | 'realistic';
type Model = 'banana-pro' | 'flux';
type Resolution = 'standard' | 'high';

interface GeneratedImage {
  url: string;
  timestamp: number;
}

export default function EditorSection() {
  const t = useTranslations('editor');
  const { isFreeUser, credits, dailyLimit, canUseRealisticStyle, canUseHighResolution, loading: quotaLoading, refresh: refreshQuota } = useGenerationQuota();

  const [mode, setMode] = useState<EditorMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<Style>('default');
  const [model, setModel] = useState<Model>('banana-pro');
  const [resolution, setResolution] = useState<Resolution>('standard');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles: { value: Style; label: string; requiresCredits?: boolean }[] = [
    { value: 'default', label: t(`styles.default`) },
    { value: 'anime', label: t(`styles.anime`) },
    { value: 'realistic', label: t(`styles.realistic`), requiresCredits: true },
  ];

  const models: { value: Model; label: string }[] = [
    { value: 'banana-pro', label: t(`models.banana-pro`) },
    { value: 'flux', label: t(`models.flux`) },
  ];

  const resolutions: { value: Resolution; label: string; requiresCredits?: boolean }[] = [
    { value: 'standard', label: '标准 (1024x1024)' },
    { value: 'high', label: '高清 (2048x2048)', requiresCredits: true },
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过 2MB，请选择更小的图片');
        return;
      }
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
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过 2MB，请选择更小的图片');
        return;
      }
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

  const needsCredits = (style === 'realistic' || resolution === 'high');

  const canGenerate = () => {
    if (!prompt.trim()) return false;
    if (isGenerating) return false;
    if (mode === 'image-to-image' && !uploadedImage) return false;

    if (isFreeUser) {
      if (needsCredits) return false;
      if (dailyLimit && !dailyLimit.can_generate) return false;
    }

    if (!isFreeUser) {
      const cost = getCreditCost(model, resolution);
      if (credits < cost) return false;
    }

    return true;
  };

  const getRestrictionMessage = () => {
    if (isFreeUser && needsCredits) {
      return '此功能需要积分，请购买积分后使用';
    }
    if (isFreeUser && dailyLimit && !dailyLimit.can_generate) {
      return `免费用户每天只能生成1次，请购买积分后无限使用`;
    }
    if (!isFreeUser) {
      const cost = getCreditCost(model, resolution);
      if (credits < cost) {
        return `积分不足，需要${cost}积分，当前${credits}积分`;
      }
    }
    return null;
  };

  const handleGenerate = async () => {
    const restrictionMessage = getRestrictionMessage();
    if (restrictionMessage) {
      alert(restrictionMessage);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: GENERATION_CONFIG[model].apiModel,
          style,
          resolution,
          ...(uploadedImage && { imageUrls: [uploadedImage] }),
        }),
      });

      if (!response.ok) {
        let errorMessage = '生成失败';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;

          // Handle Grasi API credit error
          if (errorData.code === 'GRASI_API_ERROR' && errorData.originalError === 'apikey credits not enough') {
            errorMessage = '生成服务暂时不可用，请稍后重试';
          } else if (errorData.needsUpgrade || errorData.dailyLimit) {
            errorMessage += '\n\n请购买积分后无限使用所有功能';
          } else if (errorData.insufficient) {
            errorMessage += `\n\n需要${errorData.required}积分，当前${errorData.current}积分`;
          }
        } catch {
          if (response.status === 413) {
            errorMessage = '请求体过大，请尝试使用更小的图片或不使用参考图片';
          } else {
            errorMessage = `服务器错误 (${response.status})`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.status === 'succeeded' && data.imageUrl) {
        setGeneratedImage({
          url: data.imageUrl,
          timestamp: Date.now(),
        });
        await refreshQuota();
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
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `banana-pro-${generatedImage.timestamp}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const maxLength = 500;
  const promptLength = prompt.length;
  const canGenerateBtn = canGenerate();

  return (
    <section id="editor" className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
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

          {/* User status display */}
          {!quotaLoading && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              {isFreeUser ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">
                    免费用户 - 今日剩余: <span className="font-semibold text-gray-900 dark:text-white">{dailyLimit?.remaining ?? 0}/1</span>
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 dark:bg-yellow-900/20">
                  <Coins className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-yellow-700 dark:text-yellow-400">
                    积分用户 - 剩余: <span className="font-semibold">{credits}</span> 积分
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Editor Container */}
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

              {/* Image Upload */}
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
                  {styles.map((s) => {
                    const isRestricted = s.requiresCredits && isFreeUser;
                    return (
                      <button
                        key={s.value}
                        onClick={() => !isRestricted && setStyle(s.value)}
                        disabled={isRestricted}
                        className={cn(
                          'relative rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
                          style === s.value
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600',
                          isRestricted && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        <span className="flex items-center justify-center gap-1">
                          {s.label}
                          {isRestricted && <Lock className="h-3 w-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {isFreeUser && style === 'realistic' && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    写实风格需要积分，请购买积分后使用
                  </p>
                )}
              </div>

              {/* Resolution Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  分辨率
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {resolutions.map((r) => {
                    const isRestricted = r.requiresCredits && isFreeUser;
                    return (
                      <button
                        key={r.value}
                        onClick={() => !isRestricted && setResolution(r.value)}
                        disabled={isRestricted}
                        className={cn(
                          'relative rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
                          resolution === r.value
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600',
                          isRestricted && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        <span className="flex items-center justify-center gap-1">
                          {r.label}
                          {isRestricted && <Lock className="h-3 w-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {isFreeUser && resolution === 'high' && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    高清分辨率需要积分，请购买积分后使用
                  </p>
                )}
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

              {/* Generate Button Area */}
              <div className="space-y-3">
                {/* Credit cost preview for paid users */}
                {!isFreeUser && (
                  <div className="rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    本次生成消耗: <span className="font-semibold">{getCreditCost(model, resolution)}</span> 积分
                  </div>
                )}

                {/* Restriction warning */}
                {getRestrictionMessage() && (
                  <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {getRestrictionMessage()}
                    <button
                      onClick={() => window.location.href = '/pricing'}
                      className="ml-2 inline-flex items-center gap-1 font-semibold underline hover:no-underline"
                    >
                      购买积分 <CreditCard className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerateBtn}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all',
                    canGenerateBtn
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
      </div>
    </section>
  );
}
