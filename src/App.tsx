// ** React Imports
import React, { useEffect, useRef, useState } from 'react';

// ** Material UI Imports
import { Typography, Box } from '@mui/material';

// ** Firebase Imports
import { collection, onSnapshot, query, Timestamp, Unsubscribe } from 'firebase/firestore';
import { db } from 'firebaseConfig';

// ** Services Imports
import { dynamicGet } from 'services/internal/dynamicServices/dynamicGet';
import getEnergyPoints from 'services/external/getEnergyPoints';
import getRewards from 'services/internal/rewards';

// ** Types Imports
import { Entities, IPurchaseEntity, IRewardEntity } from './types';

// ** Components Imports
import PurchaseCard from 'components/PurchaseCard';
import RewardCard from 'components/RewardCard';
import Header from 'components/Header';

const App: React.FC = () => {
  // ** Data states
  const [originalEnergyPoints, setOriginalEnergyPoints] = useState<number | null>(999999);
  const [calculatedEnergyPoints, setCalculatedEnergyPoints] = useState<number | null>(null);
  const [rewards, setRewards] = useState<IRewardEntity[] | null>([]);
  const [purchases, setPurchases] = useState<IPurchaseEntity[] | null>(null);

  // ** Loading states
  const [everythingLoaded, setEverythingLoaded] = useState<boolean>(false);
  const [loadingWording, setLoadingWording] = useState<string | null>(null);

  // ** Tab states
  const [activeTab, setActiveTab] = useState<'marketPlace' | 'purchases'>('marketPlace');

  // ** Firebase subscriptions
  const unsuscribeRef = useRef<Unsubscribe>();

  const purchasesCollectionSubscription: () => void = () => {
    const purchasesCollectionRef = collection(db, Entities.purchases);
    const purchasesQuery = query(purchasesCollectionRef);

    const unsubscribe = onSnapshot(
      purchasesQuery,
      (snapshot) => {
        try {
          const updatedData = snapshot.docs.map((contactRequest) => contactRequest.data());

          setPurchases(updatedData as IPurchaseEntity[]);
        } catch (error) {
          console.log(error);
          setPurchases(null);
        }
      },
      (error) => {
        console.log(error);
      },
    );

    unsuscribeRef.current = unsubscribe;
  };

  useEffect(() => {
    getRewards(setRewards);
    purchasesCollectionSubscription();
    //getEnergyPoints(setOriginalEnergyPoints);

    return () => {
      if (unsuscribeRef.current) unsuscribeRef.current();
    };
  }, []);

  useEffect(() => {
    if (purchases && originalEnergyPoints) {
      const energyPointsSpent =
        purchases.length === 0 ? 0 : purchases.reduce((acc, purchase) => acc + purchase.price, 0);

      setCalculatedEnergyPoints(() => originalEnergyPoints - energyPointsSpent);
    }
  }, [purchases, originalEnergyPoints]);

  useEffect(() => {
    if (rewards && purchases && originalEnergyPoints) setEverythingLoaded(true);
    else {
      if (!rewards) {
        setLoadingWording('Cargando recompensas...');
        setEverythingLoaded(false);

        return;
      }

      if (!purchases) {
        setLoadingWording('Cargando compras...');
        setEverythingLoaded(false);

        return;
      }
      if (!originalEnergyPoints) {
        setLoadingWording('Cargando energy points...');
        setEverythingLoaded(false);

        return;
      }
    }
  }, [rewards, purchases, originalEnergyPoints]);

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundImage: `url('/appBackground.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          maxWidth: '761px',
          margin: '0 auto',
          padding: '30px 20px 0 20px',
          '@media(min-width: 768px)': { padding: '50px 20px 0 20px' },
        }}
      >
        {!everythingLoaded ? (
          <Typography
            className="bangers-font"
            sx={{
              display: 'block',
              margin: 'auto',
              height: '100%',
              color: 'white',
              fontSize: '32px',
              textAlign: 'center',
            }}
          >
            {loadingWording && loadingWording}
          </Typography>
        ) : (
          <>
            {/*Header */}
            <Header calculatedEnergyPoints={calculatedEnergyPoints} />
            {/* Tabs */}
            <Box
              sx={{
                display: 'flex',
                width: 'fit-content',
                margin: '40px auto 0 auto',
                '@media(min-width: 768px)': { margin: '80px auto 0 auto' },
              }}
            >
              <Box
                onClick={() => setActiveTab('marketPlace')}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '150px',
                  height: '55px',
                  border: '1px solid black',
                  backgroundColor: activeTab === 'marketPlace' ? 'white' : 'black',
                  color: activeTab === 'marketPlace' ? 'black' : 'white',
                  cursor: 'pointer',
                }}
              >
                MARKET PLACE
              </Box>
              <Box
                onClick={() => setActiveTab('purchases')}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '150px',
                  height: '55px',
                  border: '1px solid black',
                  backgroundColor: activeTab === 'purchases' ? 'white' : 'black',
                  color: activeTab === 'purchases' ? 'black' : 'white',
                  cursor: 'pointer',
                }}
              >
                COMPRAS
              </Box>
            </Box>
            {/* Body */}
            {activeTab === 'marketPlace' && (
              <>
                {rewards && rewards.length === 0 && (
                  <Typography
                    className="bangers-font"
                    sx={{
                      display: 'block',
                      margin: 'auto',
                      height: '100%',
                      color: 'white',
                      fontSize: '32px',
                      textAlign: 'center',
                    }}
                  >
                    No se encontraron recompensas
                  </Typography>
                )}
                {rewards && rewards.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: 'fit-content',
                      flexWrap: 'wrap',
                      padding: '50px 0px',
                      margin: '0 auto',
                      gap: '25px',
                    }}
                  >
                    {rewards?.map((reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        calculatedEnergyPoints={calculatedEnergyPoints}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
            {activeTab === 'purchases' && (
              <>
                {purchases && purchases.length === 0 && (
                  <Typography
                    className="bangers-font"
                    sx={{
                      display: 'block',
                      margin: 'auto',
                      height: '100%',
                      color: 'white',
                      fontSize: '32px',
                      textAlign: 'center',
                    }}
                  >
                    No se encontraron compras
                  </Typography>
                )}
                {purchases && purchases.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      alignItems: 'center',
                      padding: '50px 0 0 0',
                      gap: '25px',
                    }}
                  >
                    {purchases
                      .sort((a, b) => {
                        const aDate = a.createdAt as unknown as Timestamp;
                        const bDate = b.createdAt as unknown as Timestamp;

                        return bDate.seconds - aDate.seconds;
                      })
                      .map((purchase) => (
                        <PurchaseCard key={purchase.id} purchase={purchase} />
                      ))}
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default App;
