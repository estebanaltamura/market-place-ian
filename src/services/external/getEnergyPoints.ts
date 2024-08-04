// ** Axios Import
import axios from 'axios';

const getEnergyPoints: (
  setOriginalEnergyPoints: React.Dispatch<React.SetStateAction<number | null>>,
) => Promise<void> = async (setOriginalEnergyPoints) => {
  try {
    const url =
      'https://api.scraperapi.com/?api_key=0cecee12b8899432b56746d6eb12712c&url=https%3A%2F%2Fwww.khanacademy.org%2Fprofile%2Fpalta1&output_format=json&autoparse=true&render=true';

    const response = await axios.get(url);

    const data = response.data;

    const regex = /class="energy-points-badge"[^>]*>([^<]*)</g;
    let match;
    const matches = [];

    while ((match = regex.exec(data)) !== null) {
      matches.push(match[1].trim());
    }

    const energyPointsFormatted = matches[0].replace(',', '');
    const energyPointsFormattedNumber: number = parseInt(energyPointsFormatted);

    setOriginalEnergyPoints(energyPointsFormattedNumber);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default getEnergyPoints;
