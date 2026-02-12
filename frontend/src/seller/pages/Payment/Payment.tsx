import { Button, Card, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import TransactionTable from './TransactionTable';
import Payouts from './PayoutsTable';
import { useAppSelector, useAppDispatch } from '../../../Redux Toolkit/Store';
import { requestPayout } from '../../../Redux Toolkit/Seller/payoutRequestSlice';

// Type for tabs
interface TabType {
    name: string;
}

const tabs: TabType[] = [
    { name: "Transaction" },
    // { name: "Payouts" } // you can enable if needed
];

const Payment = () => {
    const [activeTab, setActiveTab] = useState<TabType["name"]>(tabs[0].name);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const dispatch = useAppDispatch();
    const { sellers, payoutRequest } = useAppSelector((store) => store);

    const handleActiveTab = (item: TabType) => {
        setActiveTab(item.name);
    };

    const handleRequestPayout = () => {
        const jwt = localStorage.getItem("jwt") || "";
        dispatch(requestPayout(jwt));
        setSnackbarOpen(true);
    };

    // Safely access pendingPayout and totalEarnings
    const pendingPayout: number = sellers.report?.pendingPayout ?? 0;
    const totalEarnings: number = sellers.report?.totalEarnings ?? 0;

    return (
        <div>
            {/* Earnings Card */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                <Card className='col-span-1 p-5 rounded-md space-y-4'>
                    <h1 className='text-gray-600 font-medium'>Total Earning</h1>
                    <h1 className='font-bold text-xl pb-1'>₹{totalEarnings}</h1>
                    <Divider />
                    <p className='text-gray-600 font-medium pt-1'>
                        Last Payment: <strong>₹0</strong>
                    </p>

                    {pendingPayout > 0 && (
                        <div className='pt-4'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleRequestPayout}
                                disabled={payoutRequest.loading}
                            >
                                {payoutRequest.loading ? <CircularProgress size={20} color="inherit" /> : "Request Payout"}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Snackbar for request feedback */}
            <Snackbar
                open={snackbarOpen && (payoutRequest.success || !!payoutRequest.error)}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <>
                    {payoutRequest.success && (
                        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                            Payout request submitted successfully!
                        </Alert>
                    )}
                    {payoutRequest.error && (
                        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                            {payoutRequest.error}
                        </Alert>
                    )}
                </>
            </Snackbar>


            {/* Tabs Section */}
            <div className='mt-10'>
                <div className='flex gap-4'>
                    {tabs.map((item) => (
                        <Button
                            key={item.name} // key is mandatory
                            onClick={() => handleActiveTab(item)}
                            variant={activeTab === item.name ? "contained" : "outlined"}
                        >
                            {item.name}
                        </Button>
                    ))}
                </div>

                <div className='mt-5'>
                    {activeTab === "Transaction" ? <TransactionTable /> : <Payouts />}
                </div>
            </div>
        </div>
    );
};

export default Payment;
