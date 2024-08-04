// ** Types Imports
import { Entities, IRewardEntity } from 'types';

// ** Services Imports
import { dynamicGet } from '../dynamicServices/dynamicGet';

const getRewards: (
  setRewards: React.Dispatch<React.SetStateAction<IRewardEntity[] | null>>,
) => Promise<void> = async (setRewards) => {
  setRewards(null);
  try {
    const getRewardsResponse = await dynamicGet(Entities.rewards);
    if (!getRewardsResponse) {
      alert('No rewards found');

      return;
    }

    setRewards(getRewardsResponse);
  } catch (error) {
    console.log(error);
  } finally {
  }
};

export default getRewards;
