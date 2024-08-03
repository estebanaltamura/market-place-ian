import { Box } from '@mui/material';
import { IPurchaseEntity } from 'types';

interface IPurchaseCard {
  purchase: IPurchaseEntity;
}

const PurchaseCard: React.FC<IPurchaseCard> = ({ purchase }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {purchase.title}
      {purchase.price}
      {purchase.rewardCategory}
    </Box>
  );
};

export default PurchaseCard;
