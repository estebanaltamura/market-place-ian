// ** Axios Import
import axios from 'axios';
import Big from 'big.js';

const getEnergyPoints: (
  setOriginalEnergyPoints: React.Dispatch<React.SetStateAction<Big | null>>,
) => Promise<void> = async (setOriginalEnergyPoints) => {
  try {
    const response = await fetch('https://www.internal-server-projects.xyz:6000/scrape');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();

    const regex = /class="energy-points-badge"[^>]*>([^<]*)</g;
    let match;
    const matches = [];

    while ((match = regex.exec(data)) !== null) {
      matches.push(match[1].trim());
    }

    console.log(data);
    const energyPointsFormatted = matches[0].replace(',', '');
    const energyPointsFormattedNumber: Big = new Big(energyPointsFormatted);

    setOriginalEnergyPoints(energyPointsFormattedNumber);
  } catch (error) {
    console.error('Error fetching the HTML content:', error);
  }
};

export default getEnergyPoints;
