export interface Configuration {
  name: string;
  port: number;
  paths: {
    fs: string;
    db: string;
  };
  maxFSSize: number;
}

export interface FlexibleConfiguration {
  name?: string;
  port?: number;
  paths?: {
    fs?: string;
    db?: string;
  };
  maxFSSize?: number;
}
