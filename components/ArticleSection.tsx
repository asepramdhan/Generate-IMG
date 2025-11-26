import React from 'react';

interface ArticleSectionProps {
  text: string;
  setText: (text: string) => void;
  disabled: boolean;
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ text, setText, disabled }) => {
  return (
    <div className="flex flex-col h-full bg-cyber-800 rounded-xl border border-cyber-700 overflow-hidden shadow-lg">
      <div className="p-4 border-b border-cyber-700 bg-cyber-900/50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-cyber-accent rounded-sm"></span>
          Source Article
        </h2>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">Indonesian / Input</span>
      </div>
      <div className="flex-1 p-0 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          className="w-full h-full p-6 bg-transparent text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-cyber-accent/20 transition-all font-sans leading-relaxed text-sm lg:text-base"
          placeholder="Paste your article here..."
        />
        <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-cyber-900/80 px-2 py-1 rounded font-mono">
          {text.length} chars
        </div>
      </div>
    </div>
  );
};
