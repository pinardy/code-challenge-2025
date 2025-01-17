export interface CurrencyInfo {
  currency: string;
  date: string;
  price: number;
}

export interface GitHubFile {
  name: string;
  download_url: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  type: string;
}
