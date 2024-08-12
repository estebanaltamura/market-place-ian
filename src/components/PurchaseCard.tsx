import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Entities, IPurchaseEntity, IRewardEntity } from 'types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { dynamicDelete } from 'services/internal/dynamicServices/dynamicDelete';
import { dynamicUpdate } from 'services/internal/dynamicServices/dynamicUpdate';

interface IPurchaseCardPropTypes {
  purchase: IPurchaseEntity;
  rewards: IRewardEntity[];
  isAdmin: boolean;
}

const PurchaseCard: React.FC<IPurchaseCardPropTypes> = ({ purchase, rewards, isAdmin }) => {
  const MySwal = withReactContent(Swal);

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

  const deletePurchase = async () => {
    const userResponse = await MySwal.fire({
      title: '¿Estás seguro de que quieres eliminar esta compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (userResponse.isConfirmed) {
      try {
        await dynamicDelete(Entities.purchases, purchase.id);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changePaidStatus = async () => {
    const isPaid = purchase.isPaid;
    const title = isPaid
      ? '¿Estás seguro de que quieres marcar como no pagada?'
      : '¿Estás seguro de que quieres marcar como pagada?';

    const confirmButtonText = isPaid ? 'Marcar como no pagada' : 'Marcar como pagada';

    const userResponse = await MySwal.fire({
      title: title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
    });

    if (userResponse.isConfirmed) {
      try {
        await dynamicUpdate(Entities.purchases, purchase.id, {
          ...purchase,
          isPaid: !purchase.isPaid,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

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
        padding: isAdmin
          ? isTablet
            ? '25px 15px 40px 15px'
            : '25px 15px 90px 15px'
          : isTablet
          ? '25px 15px 15px 15px'
          : '25px 15px 15px 15px',
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

      <Box
        className="bangers-font"
        sx={{
          position: 'absolute',
          top: '7px',
          right: '10px',
          transform: 'translateX(-50%)',
          fontSize: '15px',
          fontWeight: '400',
          color: purchase.isPaid ? '#3d8c40' : '#D21F3C',
        }}
      >
        {purchase.isPaid ? (isAdmin ? 'Pagado' : 'Cobrado') : isAdmin ? 'No pagado' : 'No cobrado'}
      </Box>

      {isAdmin && (
        <>
          <Divider
            sx={{
              position: 'absolute',
              bottom: isTablet ? '17px' : '42px',
              left: '15px',
              border: '1px solid #4c4c4c',
              width: 'calc(100% - 30px)',
              margin: '15px 0 22px 0',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: isTablet ? '7px' : '20px',
              left: isTablet ? '27%' : '',
              display: 'flex',
              gap: '20px',
            }}
          >
            <Box
              onClick={deletePurchase}
              sx={{
                display: 'flex',
                padding: '3px 10px',
                height: '25px',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                border: '1px solid  #4c4c4c',
                backgroundColor: '#291F68',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              Eliminar
            </Box>
            <Box
              onClick={changePaidStatus}
              sx={{
                display: 'flex',
                padding: '3px 10px',
                height: '25px',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                border: '1px solid  #4c4c4c',
                backgroundColor: '#291F68',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              {purchase.isPaid ? 'Marcar como no pagada' : 'Marcar como pagada'}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PurchaseCard;
