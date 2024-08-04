import { Box, Typography } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { IPurchaseEntity } from 'types';

interface IPurchaseCard {
  purchase: IPurchaseEntity;
}

const PurchaseCard: React.FC<IPurchaseCard> = ({ purchase }) => {
  const createdAt = (purchase.createdAt as unknown as Timestamp).toDate();

  const createdAtDate = createdAt.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '340px',
        minWidth: '100%',
        height: '110px',
        padding: '20px',
        border: '1px solid white',
        borderRadius: '16px',
      }}
    >
      <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{`Titulo: ${purchase.title}`}</Typography>

      <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{`Precio: ${purchase.price} EC`}</Typography>

      <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{`Fecha: ${createdAtDate}`}</Typography>
    </Box>
  );
};

export default PurchaseCard;
