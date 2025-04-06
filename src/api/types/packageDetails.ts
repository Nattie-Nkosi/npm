export interface PackageDetails {
  repository: any;
  homepage: any;
  version: string;
  name: string;
  description: string;
  readme: string;
  author: {
    name: string;
    email: string;
  };
  maintainers: {
    name: string;
    email: string;
  }[];
  license: string;
}