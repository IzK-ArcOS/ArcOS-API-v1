export interface UserDirectory {
  name: string;
  scopedPath: string;
  files: UserFile[];
  directories: PartialUserDir[];
}

export interface PartialUserDir {
  name: string;
  scopedPath: string;
}

export interface UserFile {
  size: number;
  mime: string;
  filename: string;
  scopedPath: string;
}
