import { PackageDetails } from "../types/packageDetails";

export async function getNattie(): Promise<PackageDetails> {
  const res = await fetch(`https://registry.npmjs.org/nathi`);
  const data = await res.json();

  return data as PackageDetails;
}