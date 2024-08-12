import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { IPurchaseEntity, IRewardEntity } from 'types';

interface IPurchaseCardPropTypes {
  purchase: IPurchaseEntity;
  rewards: IRewardEntity[];
}

const PurchaseCard: React.FC<IPurchaseCardPropTypes> = ({ purchase, rewards }) => {
  const [image, setImage] = useState<string>('');
  const isTablet = useMediaQuery('(min-width:768px)');

  const createdAt = (purchase.createdAt as unknown as Timestamp).toDate();

  const createdAtDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(createdAt)
    .replace(',', '');

  useEffect(() => {
    if (!rewards || !purchase) return;

    const rewardFound = rewards.find((reward) => reward.id === purchase.rewardId);
    if (rewardFound) setImage(rewardFound.imageUrl);
  }, [purchase, rewards]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isTablet ? 'row' : 'column',
        position: 'relative',
        alignItems: 'center',
        width: '100%',
        maxWidth: isTablet ? '700px' : '340px',
        height: 'fit-content',
        padding: '25px 15px 15px 15px',
        backgroundColor: '#291F68',
        borderRadius: '20px',
      }}
    >
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Image */}
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

        {/* Title */}
        <Typography
          className="bangers-font"
          sx={{
            display: '-webkit-box',
            flexGrow: !isTablet ? 1 : 0,
            width: !isTablet ? '' : '150px',
            padding: '0 5px',
            margin: 'auto',
            fontSize: '17px',
            fontWeight: '400',
            color: 'white',
            textAlign: 'center',
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

        {/*Price */}
        {!isTablet && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '15px' }}>
            <img src="/coin.svg" alt="" style={{ width: '30px' }} />
            <Typography
              className="Montserrat-font"
              sx={{
                fontSize: '18px',
                fontWeight: '800',
                color: 'white',
                width: 'fit-content',
                textAlign: 'right',
              }}
            >
              {purchase.price}
            </Typography>
          </Box>
        )}
      </Box>

      {!isTablet && (
        <>
          <Divider sx={{ border: '1px solid #4c4c4c', width: '100%', margin: '15px 0 22px 0' }} />
          <Typography className="Montserrat-font" sx={{ color: 'white', fontWeight: '600' }}>
            Descripción
          </Typography>
        </>
      )}

      <Typography
        className="montserrat-font"
        sx={{
          marginTop: !isTablet ? '10px' : '0',
          padding: '0 5px',
          fontSize: '14px',
          fontWeight: '400',
          color: 'white',
          minWidth: !isTablet ? '' : '300px',
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
        {purchase.description}
      </Typography>

      {isTablet && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '15px' }}>
          <img src="/coin.svg" alt="" style={{ width: '30px' }} />
          <Typography
            className="Montserrat-font"
            sx={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'white',
              width: 'fit-content',
              textAlign: 'right',
            }}
          >
            {purchase.price}
          </Typography>
        </Box>
      )}

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
    </Box>
  );
};

export default PurchaseCard;
