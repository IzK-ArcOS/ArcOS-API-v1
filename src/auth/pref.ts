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
      theme: "light" | "dark";
      sharp: boolean;
    };

    start: {
      small: boolean; //done
    };

    anim: boolean; //done
    noGlass: boolean; //done
    noQuickSettings: boolean;
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
    },
    start: {
      small: true,
    },
    anim: true,

    noQuickSettings: false,
    noGlass: false,
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
