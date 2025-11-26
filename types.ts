export interface GeneratedPrompts {
  thumbnailPrompt: string;
  illustrationPrompt: string;
  thumbnailTitle: string;
  illustrationTitle: string;
}

export enum ImageStatus {
  IDLE = 'IDLE',
  GENERATING_PROMPTS = 'GENERATING_PROMPTS',
  PROMPTS_READY = 'PROMPTS_READY',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  type: 'Thumbnail' | 'Illustration';
}

export interface AppState {
  articleText: string;
  status: ImageStatus;
  prompts: GeneratedPrompts | null;
  images: {
    thumbnail: string | null;
    illustration: string | null;
  };
  error: string | null;
}
