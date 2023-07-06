export interface Configuration {
  name: string;
  port: number;
  paths: {
    fs: string;
    db: string;
    template: string;
  };
  maxFSSize: number;
  authCode: string;
  noCaching: boolean;
  lockThrottle: number;
}

export interface FlexibleConfiguration {
  name?: string;
  port?: number;
  paths?: {
    fs?: string;
    db?: string;
    template?: string;
  };
  maxFSSize?: number;
  authCode?: string;
  noCaching?: boolean;
  lockThrottle?: number;
}
