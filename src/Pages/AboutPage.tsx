import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import './AboutPage.css';
import { ProfileInterface } from '../Constants/interfaces';

interface propsInterface {
  isSigned: boolean
  user: ProfileInterface
}

function AboutPage (props:propsInterface){
  return (
    <div>
      <NavBar isSigned={props.isSigned} profile_name={props.isSigned ? props.user.name : 'Profile'}/>
      <div className="about-page">
      <div className="about-content">
        <h1>About TradePulse</h1>
        <p>
          TradePulse is a cutting-edge paper trading platform designed to provide aspiring traders with a realistic and risk-free environment to hone their skills and strategies in the stock market.
        </p>
        <h2>Our Team</h2>
        <div className="team-members">
          <div className="team-member">
            <h3>Aryan Bhattacharya</h3>
            <p>2105702</p>
          </div>
          <div className="team-member">
            <h3>Samriddha Sil</h3>
            <p>2105741</p>
          </div>
          <div className="team-member">
            <h3>Sarbojit</h3>
            <p>21058--</p>
          </div>
          <div className="team-member">
            <h3>Abanti Ghosh</h3>
            <p>2105----</p>
          </div>
        </div>
      </div>
    </div>
      <Footer/>
    </div>
  );
};

export default AboutPage;