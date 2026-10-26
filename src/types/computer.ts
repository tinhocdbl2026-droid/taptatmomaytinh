export type ComputerState =
  | 'off'
  | 'powering_on'
  | 'booting_bios'
  | 'booting_windows'
  | 'desktop'
  | 'shutting_down'
  | 'restarting'
  | 'sleep';

export type MonitorState = 'off' | 'standby' | 'on';

export type ActiveApp = 'none' | 'paint' | 'typing' | 'lesson_viewer';

export type AppMode = 'sandbox' | 'guided' | 'quiz' | 'components_explore';

export interface ComponentInfo {
  id: string;
  name: string;
  role: string;
  vietnameseDetail: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
}
