import axios from 'axios';
import { CurrencyInfo, GitHubFile } from './types';

const pricesUrl = 'https://interview.switcheo.com/prices.json';
const tokensUrl = 'https://api.github.com/repos/Switcheo/token-icons/contents/tokens';

export const fetchPrices = async (): Promise<CurrencyInfo[] | null> => {
  try {
    const prices = await axios.get(pricesUrl).then((currencyInfo) => currencyInfo.data);
    // NOTE: there are duplicate currencies with possibly different prices depending on dates
    // The removal of duplicates is supposed to be handled on the backend
    // Thus we will not handle any data cleaning here
    return prices;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchTokens = async (): Promise<Partial<GitHubFile>[] | null> => {
  try {
    const response = await axios.get(tokensUrl);
    const folderContents = response.data;

    // Filter only SVG files and display them as a JSON object
    const svgFiles = folderContents
      .filter((file: GitHubFile) => file.name.endsWith('.svg'))
      .map((file: GitHubFile) => ({
        name: file.name,
        download_url: file.download_url,
      }));

    // Log the list of SVG files as a JSON object
    return svgFiles;
  } catch (error) {
    console.error('Error fetching data from GitHub:', error);
    return null;
  }
};
