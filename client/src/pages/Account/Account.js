import './styles.css';
import { useHistory } from 'react-router-dom';

const AccountPage = ({ claimData }) => {
    const history = useHistory();
    if (!claimData) {
        history.push('/');
    }
    return (
        <div>
            <h1>Account</h1>
            {claimData && Object.entries(claimData.claims).map(([key, value]) => {
                return (
                    <div key={key}>
                    {key}: {value.data} | {value.signature}
                    </div>
                )
            })}
        </div>
    )
}

export default AccountPage;