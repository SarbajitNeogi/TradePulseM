import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';
import { ProfileInterface } from '../Constants/interfaces';
import NavBar from './NavBar';
import Footer from './Footer';

interface PropsInterface {
    isSigned: boolean,
    user: ProfileInterface
}
function MyProfile (props:PropsInterface) {
    const navigate = useNavigate();
    const prevIsSignedIn = useRef(props.isSigned);

    useEffect(() => {
        if (!prevIsSignedIn.current && !props.isSigned) {
          navigate('/signin');
        }
        prevIsSignedIn.current = props.isSigned;
      }, [props.isSigned, navigate]);

    return (
        <>
        <NavBar isSigned={props.isSigned} profile_name={props.isSigned ? props.user.name : 'Profile'}/>
        <div className="my-profile">
            {props.isSigned && (
                <>
                <h1>My Profile</h1>
                <div className="profile-details">
                    <div className="detail-row">
                        <span className="detail-label">Account ID:</span>
                        <span className="detail-value">{props.user._id}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{props.user.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{props.user.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Balance:</span>
                        <span className="detail-value">Rs. {props.user.balance}/-</span>
                    </div>
                    <div className="recent-activities">
                        <h2>Recent Activities</h2>
                        <div className="activity-grid">
                            {props.user.activities.map((activity, index) => (
                                <div className="activity-item" key={index}>
                                    <span className="activity-name">{activity.activity}</span>
                                    <span className="activity-time">{new Date(new Date(activity.time).getTime() - (5.5 * 60 * 60 * 1000)).toLocaleString('en-GB')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
        <Footer/>
        </>
    );
};

export default MyProfile;
