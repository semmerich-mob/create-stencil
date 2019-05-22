export interface Starter {
  name: string;
  repo: string;
  description?: string;
  docs?: string;
  hidden?: boolean;
}

export const STARTERS: Starter[] = [
  {
    name: "ionic-app",
    repo: "Mobiquity/ionic-boilerplate",
    description: "Start an Ionic app that matches Mob standards",
    docs: "https://github.com/Mobiquity/ionic-boilerplate/tree/master/doc"
  },
  {
    name: "react-native-app",
    repo: "Mobiquity/react-native-boilerplate",
    description: "Start a React Native app that matches Mob standards",
    docs:
      "https://github.com/Mobiquity/react-native-boilerplate/tree/master/doc"
  },
  {
    name: "stencil-app",
    repo: "Mobiquity/stencil-boilerplate",
    description: "Start a stencil app that can use any framework",
    docs: "https://github.com/Mobiquity/stencil-boilerplate/tree/master/doc"
  }
];

export function getStarterRepo(starterName: string): Starter {
  if (starterName.includes("/")) {
    return {
      name: starterName,
      repo: starterName
    };
  }
  const repo = STARTERS.find(starter => starter.name === starterName);
  if (!repo) {
    throw new Error(`Starter "${starterName}" does not exist.`);
  }
  return repo;
}
