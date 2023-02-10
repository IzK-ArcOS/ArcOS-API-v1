export interface Configuration {
  name: string;
  port: number;
  paths: {
    fs: string;
    db: string;
    template: string;
  };
  maxFSSize: number;
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
}
