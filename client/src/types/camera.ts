export interface CameraPermission {
  granted: boolean;
  error?: string;
}

export interface CameraConstraints {
  video: {
    facingMode: 'environment' | 'user';
    width?: number;
    height?: number;
  };
}

export type ViewType = 'main' | 'camera' | 'wallet' | 'transactions' | 'help';