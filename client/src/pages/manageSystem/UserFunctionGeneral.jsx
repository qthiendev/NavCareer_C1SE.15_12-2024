import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserFunction.css';

function UserFunctionGeneral() {
    const [bannedData, setBannedData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const procedureNames = ['UpdateAuth', 'CreateProfile', 'UpdateProfile'];
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status !== 200) {
                    navigate('/signin');
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/signin');
            }
        };
        checkAdmin();
    }, [navigate]);

    const fetchBannedData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/admin/user/ban/read', { withCredentials: true });
            console.log(response);
            const { banInfo } = response.data;
            setBannedData(banInfo || []);
        } catch (err) {
            console.error('Failed to load banned data:', err);
            setError('Failed to load banned data');
            setBannedData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBannedData();
    }, [fetchBannedData]);

    const handleCheckboxChange = async (authentication_id, procedure_name, isChecked) => {
        setBannedData((prevData) => {
            return prevData.map((ban) => {
                if (ban.authentication_id === authentication_id) {
                    return {
                        ...ban,
                        procedures: {
                            ...ban.procedures,
                            [procedure_name]: isChecked,
                        },
                    };
                }
                return ban;
            });
        });

        // Manage loading state
        setLoading(true);

        try {
            if (isChecked) {
                await axios.post('http://localhost:5000/admin/user/ban/create', {
                    authentication_id,
                    procedure_name,
                }, { withCredentials: true });
            } else {
                await axios.post('http://localhost:5000/admin/user/ban/remove', {
                    authentication_id,
                    procedure_name,
                }, { withCredentials: true });
            }

            await fetchBannedData();
        } catch (err) {
            console.error('Failed to update ban:', err);
            setError('Failed to update ban');

            setBannedData((prevData) => {
                return prevData.map((ban) => {
                    if (ban.authentication_id === authentication_id) {
                        return {
                            ...ban,
                            procedures: {
                                ...ban.procedures,
                                [procedure_name]: !isChecked,
                            },
                        };
                    }
                    return ban;
                });
            });
        } finally {
            // Loading time management
            const startTime = Date.now();
            const minLoadingTime = 500;
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(minLoadingTime - elapsedTime, 0);

            setTimeout(() => {
                setLoading(false);
            }, remainingTime);
        }
    };

    const isProcedureBanned = (authentication_id, procedure_name) => {
        return bannedData.some(
            (ban) => ban.authentication_id === authentication_id && ban.procedure_name === procedure_name
        );
    };

    return (
        <div className="user-function-container">
            <h1>User Function Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? ( // Loading state
                <p>Loading banned data...</p>
            ) : (
                <table className="user-function-table">
                    <thead>
                        <tr>
                            <th>Authentication ID</th>
                            <th>Account</th>
                            {procedureNames.map((name) => (
                                <th key={name}>{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(bannedData) && bannedData
                            .reduce((acc, ban) => {
                                const existing = acc.find((user) => user.authentication_id === ban.authentication_id);
                                if (!existing) {
                                    acc.push({ ...ban, procedures: { [ban.procedure_name]: true } });
                                } else {
                                    existing.procedures[ban.procedure_name] = true;
                                }
                                return acc;
                            }, [])
                            .map((user) => (
                                <tr key={user.authentication_id}>
                                    <td>{user.authentication_id}</td>
                                    <td>{user.account}</td>
                                    {procedureNames.map((procedure_name) => (
                                        <td key={procedure_name}>
                                            <input
                                                type="checkbox"
                                                checked={isProcedureBanned(user.authentication_id, procedure_name)}
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        user.authentication_id,
                                                        procedure_name,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserFunctionGeneral;
