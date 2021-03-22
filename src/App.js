import axios from 'axios';
import moment from 'moment';
import React from 'react';
import './App.css';

const { useState, useEffect } = React;

// Number formater func 
const formatNumber = (num) => {
  return String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// Main component -------------------------------
const Main = (props) => {
  
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    axios.get('https://disease.sh/v3/covid-19/countries')
    .then(response => {
      // console.clear();
      // console.log(response.data);
      setCountries(response.data)
    });
    
  }, []);
  
  const [term, setTerm] = useState();
  const getValue = (value) => {
    setTerm(value);
  }
  
  const handleLandName = (name) => {
    console.log(name);
  }
  
  const genCards = () => {
    let cards = [];
    countries.map(country => {
      cards.push(<Country {...country} getLandName={handleLandName} />);
    });
    
    if(term){
      // Filtering card to match search term 
      let sortedCards = cards.filter(card => {
        let cardCountry = card.props.country.toLowerCase();
        let termLow = term.toLowerCase();
        return cardCountry.includes(termLow);
      });
      return sortedCards;
    };
    // Arranging cards in descending order of cases
    cards = cards.sort((cardA, cardB) => {
      let cardCasesA = cardA.props.cases;
      let cardCasesB = cardB.props.cases;
      return cardCasesB - cardCasesA;
    })
    
    return cards;
  }
  
  let cards = genCards();
  
  return (
    <div className='main'>
      <Latest />
      <Search postValue={getValue} />
      
      <div className='countries'>
        { cards.length === 0 ? <div className='error'>No match found... <i className="fas fa-globe-africa"></i></div> : cards }
      </div>
    </div>
  )
}

// Latest component -----------------------------
const Latest = (props) => {
  
  const [stats, setStats] = useState([])
  useEffect(() => {
    
    axios.get('https://disease.sh/v3/covid-19/all')
    .then(response => {
      // console.clear();
      // console.log(response.data);
      setStats(response.data);
    });
    
  }, []);
  

  
  const totalCases = stats.cases || 'Loading...';
  const totalDeaths = stats.deaths || 'Loading...';
  const totalRecovered = stats.recovered || 'Loading...';
  const lastUpdate = moment(stats.updated).format("dddd, D MMMM YYYY");
  
  return (
    <div className='latest' >
      <div className='latest-inner'>
        
        <div className='latest-box total'>
          <div className='latest-a'>
            <h4>Total cases</h4>
            <i className="fas fa-user-injured"></i>
          </div>
          
          <div className='latest-b'>{formatNumber(totalCases)}</div>
          
          <div className='latest-c'>
            <span className='latest-c-txt'>Last updated </span>
            <span className='latest-c-dt'>{lastUpdate}</span>
          </div>
        </div>
        
        <div className='latest-box death'>
          <div className='latest-a'>
            <h4>Total deaths</h4>
            <i className="fas fa-bed"></i>
          </div>
          
          <div className='latest-b'>{formatNumber(totalDeaths)}</div>
          
          <div className='latest-c'>
            <span className='latest-c-txt'>Last updated </span>
            <span className='latest-c-dt'>{lastUpdate}</span>
          </div>
        </div>
        
        <div className='latest-box recovered'>
          <div className='latest-a'>
            <h4>Total recovered</h4>
            <i className="fas fa-user-plus"></i>
          </div>
          
          <div className='latest-b'>{formatNumber(totalRecovered)}</div>
          
          <div className='latest-c'>
            <span className='latest-c-txt'>Last updated </span>
            <span className='latest-c-dt'>{lastUpdate}</span>
          </div>
        </div>
        
      </div>
    </div>
  )
}

// Country (card) component -----------------------------
const Country = (props) => {
  
  const handleCardClick = e => {
    // console.log(e.target.dataset.name);
    props.getLandName(e.target.dataset.name);
  }
  
  return (
    <div className='country-card' >
      
      <div className="country">
       <div className="country-body">
          <div className="country-title">{props.country || 'Loading...'}</div>
          <p className="country-data">
            <span>Cases: </span>
            <span>{formatNumber(props.cases) || 'Loading...'}</span>
          </p>
          <p className="country-data">
            <span>Deaths: </span>
            <span>{formatNumber(props.deaths) || 'Loading...'}</span>
          </p>
          <p className="country-data">
            <span>Recovered: </span>
            <span>{formatNumber(props.recovered) || 'Loading...'}</span>
          </p>
          <p className="country-data">
            <span>Today's Cases: </span>
            <span>{formatNumber(props.todayCases) || 'Loading...' }</span>
          </p>
          <p className="country-data">
            <span>Today's Deaths: </span>
            <span>{formatNumber(props.todayDeaths) || 'Loading...'}</span>
          </p>
          <p className="country-data">
            <span>Active: </span>
            <span>{formatNumber(props.active) || 'Loading...'}</span>
          </p>
          <p className="country-data">
            <span>Critical: </span>
            <span>{formatNumber(props.critical) || 'Loading...'}</span>
          </p>
       </div>
       <img className="country-img" src={props.countryInfo.flag} data-name={props.country} onClick={handleCardClick} alt={props.country} />
      </div>
      
    </div>
  );
};

// Search component -----------------------------
const Search = (props) => {
  
  const handleValue = (event) => {
    props.postValue(event.target.value);
    // console.log(event.target.value);
  }
  
  return (
    <div className='search'>
      <input type='text' onChange={handleValue} placeholder='Find country...' />
    </div>
  )
}

export default Main;

// ReactDOM.render(<Main />, document.getElementById('app'));