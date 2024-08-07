import { Box, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { IPurchaseEntity, IRewardEntity } from 'types';

interface IPurchaseCardPropTypes {
  purchase: IPurchaseEntity;
  rewards: IRewardEntity[];
}

const PurchaseCard: React.FC<IPurchaseCardPropTypes> = ({ purchase, rewards }) => {
  const [image, setImage] = useState<string>('');
  const createdAt = (purchase.createdAt as unknown as Timestamp).toDate();

  const createdAtDate = createdAt.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  useEffect(() => {
    const reward = rewards.find((reward) => reward.id === purchase.rewardId);
    if (reward) setImage(reward.imageUrl);
  }, [purchase, rewards]);

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
        height: '110px',
        padding: '20px 20px 0px 20px',
        backgroundColor: '#291F68',
        borderRadius: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '70px',
          height: '70px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={image} alt="" style={{ width: '70px' }} />
      </Box>
      <Typography
        className="bangers-font"
        sx={{
          padding: '0 5px',
          fontSize: '17px',
          fontWeight: '400',
          color: 'white',
          width: 'fit-content',
          textAlign: 'center',
          display: '-webkit-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {purchase.title}
      </Typography>

      <Typography
        className="bangers-font"
        sx={{
          position: 'absolute',
          top: '3px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '15px',
          fontWeight: '400',
          color: 'white',
        }}
      >
        {createdAtDate}
      </Typography>
      <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '15px' }}>
        <img src="/coin.svg" alt="" style={{ width: '30px' }} />
        <Typography
          className="Montserrat-font"
          sx={{ fontSize: '18px', fontWeight: '800', color: 'white', width: '60px' }}
        >
          {purchase.price}
        </Typography>
      </Box>
    </Box>
  );
};

export default PurchaseCard;
