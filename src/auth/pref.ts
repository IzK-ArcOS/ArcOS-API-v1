export interface UserPreferences {
  sh: {
    taskbar: {
      centered: boolean; //done
      labels: boolean; //done
      pos: "top" | "bottom";
      docked: boolean; //done
    };

    window: {
      bigtb: boolean; //done
      lefttb: boolean; //done
    };

    desktop: {
      wallpaper: string | null;
      icons: boolean;
    };

    start: {
      small: boolean; //done
    };

    anim: boolean; //done
    noGlass: boolean; //done
  };

  disabledApps: string[];
  autoRun: string[];
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
      pos: "bottom",
      docked: true,
    },
    window: {
      lefttb: false,
      bigtb: true,
    },
    desktop: {
      wallpaper: "img04",
      icons: true,
    },
    start: {
      small: false,
    },
    anim: true,

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
  devmode: false,
  appdata: {},
};