export interface UserPreferences {
  sh: {
    taskbar: {
      centered: boolean; //done
      labels: boolean; //done
      pos: "vertical" | "" | "vertical-right";
      docked: boolean; //done
    };

    window: {
      bigtb: boolean; //done
      lefttb: boolean; //done
      buttons: string;
    };

    desktop: {
      wallpaper: string | null;
      icons: boolean;
      theme: "light" | "dark" | string;
      sharp: boolean;
      accent: string;
    };

    start: {
      small: boolean; //done
    };

    anim: boolean; //done
    noGlass: boolean; //done
    noQuickSettings: boolean;
    userThemes?: ThemeStore;
  };

  disabledApps: string[];
  autoRun: string[];
  autoLoads: string[];
  askPresist: boolean;
  devmode: boolean;

  acc: {
    enabled: boolean;
    admin: boolean;
    profilePicture: string | number | null;
  };
  volume: {
    level: number;
    muted: boolean;
  };

  appdata: AppData;
}

export interface UserTheme {
  author: string;
  version: string;
  name: string;
  /** */
  anim: boolean;
  noGlass: boolean;
  sharp: boolean;
  theme: string;
  wallpaper: string;
  taskbarCentered: boolean;
  taskbarLabels: boolean;
  taskbarPosition: "vertical" | "" | "vertical-right";
  docked: boolean;
  accent: string;
  smallStart: boolean;
  titleButtons: string;
  titlebarLeft: boolean;
  titlebarLarge: boolean;
}

export type ThemeStore = { [key: string]: UserTheme };

export type AppData = {
  [key: string]: { [key: string]: number | boolean | string | object };
};

export const DefaultUserdata: UserPreferences = {
  sh: {
    taskbar: {
      centered: false,
      labels: false,
      pos: "",
      docked: true,
    },
    window: {
      lefttb: false,
      bigtb: true,
      buttons: "default",
    },
    desktop: {
      wallpaper: "img04",
      icons: true,
      theme: "dark",
      sharp: false,
      accent: "70D6FF",
    },
    start: {
      small: true,
    },
    anim: true,

    noQuickSettings: false,
    noGlass: false,
    userThemes: {},
  },
  acc: {
    enabled: true,
    admin: false,
    profilePicture: 3,
  },
  volume: {
    level: 100,
    muted: false,
  },
  disabledApps: [],
  autoRun: [],
  autoLoads: [],
  askPresist: true,
  devmode: false,
  appdata: {},
};
