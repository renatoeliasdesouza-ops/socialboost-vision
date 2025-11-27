export interface AnalysisResult {
  score: number;
  title: string;
  caption: string;
  hashtags: string[];
  improvements: string[];
  previewUrl: string;
  type: 'image' | 'link';
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete';
  result: AnalysisResult | null;
  error: string | null;
}
