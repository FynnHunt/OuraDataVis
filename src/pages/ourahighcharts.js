import * as React from "react"
import { useState } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import Layout from "../components/layout"
import SEO from "../components/seo"
import data from "../data/ouradata.json"

const parseActivityData = (activityString) => {
  const activArr = activityString.split('');
  for (let i = 0; i < activArr.length; i++) activArr[i] = parseInt(activArr[i], 10);
  return activArr;
}

const parseReadinessData = (readinessArr) => readinessArr.map(re => re.score);

const OuraHighchartsPage = () => {
  const [age, setAge] = useState(null);
  const [weight, setWeight] = useState(null);
  const [gender, setGender] = useState(null);
  const [show, setShow] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [readinessData, setReadinessData] = useState([]);

  const activityOptions = {
    chart: {
      type: 'line'
    },
    title: {
        text: 'Daily Activity Level'
    },
    subtitle: {
        text: '0 = Non-wear, 1 = Rest (MET level below 1.05), 2 = Inactive (MET level between 1.05 and 2), 3 = Low intensity activity, 4 = Medium intensity activity,5 = High intensity activity'
    },
    xAxis: {
        type: 'datetime',
        // min: new Date(2020, 2, 24, 4, 0, 0, 0),
        // max: new Date(2020, 3, 24, 3, 45, 0, 0),
        tickInterval: 3600 * 1000,
        labels: {
          formatter: function (){
            return Highcharts.dateFormat('%H:%M',this.value);                       
          }
        }
    },
    yAxis: {
      title: {
          text: 'Activity Level'
      }
    },
    plotOptions: {
      series: {
          pointStart: Date.UTC(2021, 2, 23, 4), // start date
          pointInterval: 1000 * 60 * 5 // data every 5 minutes
      },
      spline: {
          lineWidth: 2,
          states: {
              hover: {
                  lineWidth: 3
              }
          },
          marker: {
              enabled: false,
              states: {
                  hover: {
                      enabled: true,
                      symbol: 'circle',
                      radius: 5,
                      lineWidth: 1
                  }
              }
          },
      }
    },
    series: [{
        name: 'Activity Level',
        data: activityData,
    }]
  };

  const sleepOptions = {
    chart: {
      type: 'line'
    },
    title: {
        text: 'Sleep Hypnogram'
    },
    subtitle: {
        text: '1 = deep (N3) sleep, 2 = light (N1 or N2) sleep, 3 = REM sleep, 4 = awake'
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 3600 * 1000,
        labels: {
          formatter: function (){
            return Highcharts.dateFormat('%H:%M',this.value);                       
          }
        }
    },
    yAxis: {
      title: {
          text: 'Sleep Level'
      }
    },
    plotOptions: {
      series: {
          pointStart: Date.UTC(2021, 2, 23, 2, 13, 19), // start date
          pointInterval: 1000 * 60 * 5 // data every 5 minutes
      },
      spline: {
          lineWidth: 2,
          states: {
              hover: {
                  lineWidth: 3
              }
          },
          marker: {
              enabled: false,
              states: {
                  hover: {
                      enabled: true,
                      symbol: 'circle',
                      radius: 5,
                      lineWidth: 1
                  }
              }
          },
      }
    },
    series: [{
        name: 'Sleep Level',
        data: sleepData,
    }]
  };

  const readinessOptions = {
    chart: {
      type: 'column'
    },
    title: {
        text: 'Readiness History (Past week)'
    },
    subtitle: {
      text: 'A Readiness Score above 85% indicates that you\'re well recovered. A score below 70% usually means that an essential Readiness Contributor falls outside your normal range'
    },
    xAxis: {
      type: 'datetime',
      // min: new Date(2020, 2, 24, 4, 0, 0, 0),
      // max: new Date(2020, 3, 24, 3, 45, 0, 0),
      tickInterval: 24 * 3600 * 1000,
      labels: {
        formatter: function (){
          return Highcharts.dateFormat('%H:%M',this.value);                       
        }
      },
    },
    yAxis: {
      title: {
          text: 'Readiness Score %'
      },
      plotLines: [{
        color: '#FF0000',
        width: 2,
        value: 85
      }],
      max: 100
    },
    plotOptions: {
      series: {
          pointStart: Date.UTC(2021, 2, 18), // start date
          pointInterval: 1000 * 60 * 60 * 24 // data every 5 minutes
      },
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Readiness',
        data: readinessData
    }]
  };

  const loadData = () => {
    getUserData();
    getActivityData();
    getSleepData();
    getReadinessData();
    setShow(true);
  }

  const getUserData = () => {
    setAge(data.personalInfo.age);
    setWeight(data.personalInfo.weight);
    setGender(data.personalInfo.gender);
  }

  const getActivityData = () => {
    setActivityData(parseActivityData(data.activity.class_5min));
  }

  const getSleepData = () => {
    setSleepData(parseActivityData(data.sleep.hypnogram_5min));
  }

  const getReadinessData = () => {
    setReadinessData(parseReadinessData(data.readiness));
  }

  return (<Layout>
    <SEO title="Highcharts" />
    <button onClick={() => loadData()}>Load Sample Data</button>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <div style={{ flex: 1 }}>
        <StaticImage
          src="../images/blank-profile.png"
          width={300}
          quality={95}
          formats={["AUTO", "WEBP", "AVIF"]}
          alt="A Gatsby astronaut"
          style={{ marginBottom: `1.45rem` }}
        />
      </div>
      {show ? <div style={{ flex: 2 }}>
        <p><b>Age: </b>{age}</p>
        <p><b>Weight: </b>{weight}</p>
        <p><b>Gender: </b>{gender}</p>
      </div> : <></>}
    </div>
    <HighchartsReact highcharts={Highcharts} options={activityOptions} />
    <HighchartsReact highcharts={Highcharts} options={sleepOptions} />
    <HighchartsReact highcharts={Highcharts} options={readinessOptions} />
    {/* <p>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </p> */}
  </Layout>)
}

export default OuraHighchartsPage
