export interface PackageDetails {
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