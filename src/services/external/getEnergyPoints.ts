import Big from 'big.js';

const getEnergyPoints: (
  setOriginalEnergyPoints: React.Dispatch<React.SetStateAction<Big | null>>,
) => Promise<void> = async (setOriginalEnergyPoints) => {
  try {
    const url = encodeURIComponent('https://www.khanacademy.org/profile/idev0x00');
    const className = 'energy-points-badge';

    const response = await fetch(
      `https://www.internal-server-projects.xyz:3200/scrape?url=${url}&className=${className}`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: string[] = await response.json(); // Obtener la respuesta como un array de strings

    if (data.length === 0) {
      throw new Error('No matches found');
    }

    console.log(data); // Mostrar el contenido de la respuesta en la consola

    const formattedPoints = data[0].replace(',', '');

    console.log(formattedPoints);

    const energyPointsFormattedNumber: Big = new Big(formattedPoints);

    setOriginalEnergyPoints(energyPointsFormattedNumber);
  } catch (error) {
    console.error('Error fetching the HTML content:', error);
  }
};

export default getEnergyPoints;
