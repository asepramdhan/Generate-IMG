import React from 'react';
import { AppState, ImageStatus } from '../types';
import { SparklesIcon, PhotoIcon, DownloadIcon, RefreshIcon } from './Icons';

interface VisualsSectionProps {
  state: AppState;
  onGeneratePrompts: () => void;
  onGenerateImages: () => void;
}

export const VisualsSection: React.FC<VisualsSectionProps> = ({ state, onGeneratePrompts, onGenerateImages }) => {
  const isGeneratingPrompts = state.status === ImageStatus.GENERATING_PROMPTS;
  const isGeneratingImages = state.status === ImageStatus.GENERATING_IMAGES;
  const promptsReady = state.status === ImageStatus.PROMPTS_READY || state.status === ImageStatus.COMPLETED || state.status === ImageStatus.GENERATING_IMAGES;
  const imagesReady = state.status === ImageStatus.COMPLETED;

  const handleDownload = (dataUrl: string | null, filename: string) => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Control Panel */}
      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <SparklesIcon />
          <span>AI Visual Director</span>
        </h2>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onGeneratePrompts}
            disabled={isGeneratingPrompts || isGeneratingImages}
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
              ${isGeneratingPrompts 
                ? 'bg-cyber-700 text-gray-400 cursor-not-allowed' 
                : 'bg-cyber-accent text-cyber-900 hover:bg-white hover:shadow-[0_0_15px_rgba(0,242,234,0.3)] active:transform active:scale-95'
              }`}
          >
            {isGeneratingPrompts ? (
              <>
                <RefreshIcon /> Analyzing Article...
              </>
            ) : (
              <>
                <SparklesIcon /> {promptsReady ? 'Regenerate Prompts' : 'Analyze & Plan Visuals'}
              </>
            )}
          </button>

          {promptsReady && (
            <button
              onClick={onGenerateImages}
              disabled={isGeneratingImages || state.images.thumbnail !== null}
              className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
                 ${isGeneratingImages || state.images.thumbnail !== null
                  ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-cyber-danger text-white hover:bg-red-500 hover:shadow-[0_0_15px_rgba(255,0,85,0.3)] active:transform active:scale-95'
                }`}
            >
              {isGeneratingImages ? (
                <span className="animate-pulse">Rendering Pixels...</span>
              ) : (
                state.images.thumbnail ? 'Images Generated' : 'Render Images'
              )}
            </button>
          )}
        </div>

        {state.error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm">
                Error: {state.error}
            </div>
        )}
      </div>

      {/* Prompts & Results Display */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        
        {/* Thumbnail Card */}
        {promptsReady && state.prompts && (
          <div className="bg-cyber-800 rounded-xl border border-cyber-700 overflow-hidden shadow-lg group">
             <div className="p-3 bg-cyber-900/50 border-b border-cyber-700 flex justify-between items-center">
                <span className="text-xs font-mono text-cyber-accent uppercase">Asset 01: Thumbnail (16:9)</span>
                {state.images.thumbnail && (
                  <button 
                    onClick={() => handleDownload(state.images.thumbnail, 'thumbnail.png')}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Download"
                  >
                    <DownloadIcon />
                  </button>
                )}
             </div>
             
             <div className="relative aspect-video bg-cyber-900 flex items-center justify-center">
                {state.images.thumbnail ? (
                  <img src={state.images.thumbnail} alt="Generated Thumbnail" className="w-full h-full object-cover animate-in fade-in duration-700" />
                ) : (
                  <div className="text-center p-6">
                    {isGeneratingImages ? (
                       <div className="flex flex-col items-center gap-2 text-cyber-accent animate-pulse">
                         <div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-sm font-mono">Generating...</span>
                       </div>
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center gap-2">
                            <PhotoIcon />
                            <span className="text-sm">Waiting for render</span>
                        </div>
                    )}
                  </div>
                )}
             </div>

             <div className="p-4 bg-cyber-800/80 border-t border-cyber-700">
                <h3 className="text-white font-medium text-sm mb-1">{state.prompts.thumbnailTitle}</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-mono line-clamp-3 hover:line-clamp-none transition-all cursor-help">
                  Prompt: {state.prompts.thumbnailPrompt}
                </p>
             </div>
          </div>
        )}

        {/* Illustration Card */}
        {promptsReady && state.prompts && (
          <div className="bg-cyber-800 rounded-xl border border-cyber-700 overflow-hidden shadow-lg group">
             <div className="p-3 bg-cyber-900/50 border-b border-cyber-700 flex justify-between items-center">
                <span className="text-xs font-mono text-cyber-accent uppercase">Asset 02: Illustration (4:3)</span>
                {state.images.illustration && (
                  <button 
                    onClick={() => handleDownload(state.images.illustration, 'illustration.png')}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Download"
                  >
                    <DownloadIcon />
                  </button>
                )}
             </div>
             
             <div className="relative aspect-[4/3] bg-cyber-900 flex items-center justify-center">
                {state.images.illustration ? (
                  <img src={state.images.illustration} alt="Generated Illustration" className="w-full h-full object-cover animate-in fade-in duration-700" />
                ) : (
                  <div className="text-center p-6">
                     {isGeneratingImages ? (
                       <div className="flex flex-col items-center gap-2 text-cyber-accent animate-pulse">
                         <div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-sm font-mono">Generating...</span>
                       </div>
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center gap-2">
                            <PhotoIcon />
                            <span className="text-sm">Waiting for render</span>
                        </div>
                    )}
                  </div>
                )}
             </div>

             <div className="p-4 bg-cyber-800/80 border-t border-cyber-700">
                <h3 className="text-white font-medium text-sm mb-1">{state.prompts.illustrationTitle}</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-mono line-clamp-3 hover:line-clamp-none transition-all cursor-help">
                  Prompt: {state.prompts.illustrationPrompt}
                </p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
