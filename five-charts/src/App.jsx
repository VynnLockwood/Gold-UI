import { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function FiveChart() {
  const chartContainerRef = useRef(null);
  const [data, setData] = useState([]);

  const chartContainerRef2 = useRef(null);
  const [data2, setData2] = useState([]);

  const chartContainerRef3 = useRef(null);
  const [data3, setData3] = useState([]);

  const chartContainerRef4 = useRef(null);
  const [data4, setData4] = useState([]);

  const chartContainerRef5 = useRef(null);
  const [data5, setData5] = useState([]);

  // Fetch XAUUSD
  useEffect(() => {
    fetch('http://127.0.0.1:5040/get_data/XAUUSD')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Fetch SPDR
  useEffect(() => {
    fetch('http://127.0.0.1:5040/get_data/SPDR')
      .then(response => response.json())
      .then(data => setData2(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Fetch VIX
  useEffect(() => {
    fetch('http://127.0.0.1:5040/get_data/VIX')
      .then(response => response.json())
      .then(data => setData3(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Fetch DXY
  useEffect(() => {
    fetch('http://127.0.0.1:5040/get_data/DXY')
      .then(response => response.json())
      .then(data => setData4(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Fetch US10YY
  useEffect(() => {
    fetch('http://127.0.0.1:5040/get_data/US10YY')
      .then(response => response.json())
      .then(data => setData5(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const charts = [];
  const seriesList = [];

  // Utility functions
  function syncCrosshair(chart, series, dataPoint) {
    if (dataPoint) {
      chart.setCrosshairPosition(dataPoint.value, dataPoint.time, series);
    } else {
      chart.clearCrosshairPosition();
    }
  }

  function getCrosshairDataPoint(series, param) {
    if (!param.time) return null;
    const dataPoint = param.seriesData.get(series);
    return dataPoint || null;
  }

  function createChartWithOptions(containerRef, data, watermarkText, color) {
    if (data.length === 0) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background:{
          //color: '#191D41',
          color: '#fff',
          
        },
        textColor: 'black',
        
      
      },
      grid: {
        //vertLines: { color: '#323856' },
        //horzLines: { color: '#323856' },
      },
      
    });

    chart.applyOptions({
      watermark: {
        visible: true,
        fontSize: 20,
        horzAlign: 'left',
        vertAlign: 'top',
        //color: '#C7D0FF',
        color: 'black',
        text: watermarkText,
      },
    });

    const lineSeries = chart.addLineSeries({ color, lineWidth: 2, });
    const formattedData = data.map(item => ({
      time: item.time,
      value: item.value,
    }));

    lineSeries.setData(formattedData);
    return { chart, lineSeries };
  }

  // Create charts
  useEffect(() => {
    const chart1 = createChartWithOptions(chartContainerRef, data, 'XAU/USD', '#234EE8');
    const chart2 = createChartWithOptions(chartContainerRef2, data2, 'SPDR', '#FF0000');
    const chart3 = createChartWithOptions(chartContainerRef3, data3, 'VIX', '#EE0C79');
    const chart4 = createChartWithOptions(chartContainerRef4, data4, 'DXY', '#00A747');
    const chart5 = createChartWithOptions(chartContainerRef5, data5, 'US10YY', '#01C2B7');

    if (chart1) charts.push(chart1.chart);
    if (chart2) charts.push(chart2.chart);
    if (chart3) charts.push(chart3.chart);
    if (chart4) charts.push(chart4.chart);
    if (chart5) charts.push(chart5.chart);

    if (chart1) seriesList.push(chart1.lineSeries);
    if (chart2) seriesList.push(chart2.lineSeries);
    if (chart3) seriesList.push(chart3.lineSeries);
    if (chart4) seriesList.push(chart4.lineSeries);
    if (chart5) seriesList.push(chart5.lineSeries);

    // Synchronize crosshair and visible logical range
    charts.forEach((chart, index) => {
      chart.subscribeCrosshairMove(param => {
        const dataPoint = getCrosshairDataPoint(seriesList[index], param);
        charts.forEach((otherChart, otherIndex) => {
          if (otherChart !== chart) {
            syncCrosshair(otherChart, seriesList[otherIndex], dataPoint);
          }
        });
      });

      chart.timeScale().subscribeVisibleLogicalRangeChange(timeRange => {
        charts.forEach(otherChart => {
          if (otherChart !== chart) {
            otherChart.timeScale().setVisibleLogicalRange(timeRange);
          }
        });
      });
    });

    return () => {
      charts.forEach(chart => chart.remove());
    };
  }, [data, data2, data3, data4, data5]);

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          margin: 0,
          padding: 0,
          left: 0,
          top: 0,
          background: '#1b2260',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100vw',
            height: '7vh',
            top: 0,
            left: 0,
            background: 'linear-gradient(to right, #030337 0%, #080865 50%, #030337 100%)',
          }}
        >
          <a href="https://ideatrade1.com/">
          <img
            style={{
              position: 'absolute',
              top: '0.4vh',
              left: '2vw',
            }}
            src="https://i.postimg.cc/TP1gJwyz/logo-white-02.png"
            alt=""
            width="5%"
            height="auto"
          />
          </a>
          <a href="https://ideatrade1.com/">
            <Box
              sx={{
                position: 'absolute',
                right: '1vw',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white !important',
              }}
            >
              <p style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Back to Ideatrade</p>
              <LogoutIcon style={{ marginLeft: '1vw' }} />
            </Box>
          </a>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            width: '100vw',
            height: '90vh',
            left: '0vw',
            top: '5vh',
          }}
        >
          <div style={{
            //border background
            position: 'absolute',
            width: '96.5vw',
            height: '29vh',
            left: '1.8vw',
            top: '3vh',
            margin: 0,
            padding: 0,
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '17px',
            zIndex: 100

          }}>
          <div
            ref={chartContainerRef}
            style={{
              position: 'absolute',
              width: '93vw',
              height: '26vh',
              left: '3%',
              top: '8%',
              margin: 0,
              padding: 0,
              zIndex: 20
            }}
          />
          </div>

          <div style={{
            position: 'absolute',
            width: '47.5vw',
            height: '29vh',
            left: '1.8vw',
            top: '33.5vh',
            margin: 0,
            padding: 0,
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '17px'
          }}>
          <div
            ref={chartContainerRef2}
            style={{
              position: 'absolute',
              width: '44vw',
              height: '26vh',
              left: '5%',
              top: '8%',
              margin: 0,
              padding: 0,
              zIndex: 20
            }}
          />
          </div>
          
          <div style={{
            position: 'absolute',
            width: '47.5vw',
            height: '29vh',
            right: '1.8vw',
            top: '33.5vh',
            margin: 0,
            padding: 0,
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '17px'
          }}>
          <div
            ref={chartContainerRef3}
            style={{
              position: 'absolute',
              width: '44vw',
              height: '26vh',
              left: '5%',
              top: '8%',
              margin: 0,
              padding: 0,
              zIndex: 20
            }}
          />
          </div>

          <div style={{
            position: 'absolute',
            width: '47.5vw',
            height: '29vh',
            left: '1.8vw',
            top: '64vh',
            margin: 0,
            padding: 0,
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '17px'
          }}>
          <div
            ref={chartContainerRef4}
            style={{
              position: 'absolute',
              width: '44vw',
              height: '26vh',
              left: '5%',
              top: '8%',
              margin: 0,
              padding: 0,
              zIndex: 20
            }}
          />
          </div>

          <div style={{
            position: 'absolute',
            width: '47.5vw',
            height: '29vh',
            right: '1.8vw',
            top: '64vh',
            margin: 0,
            padding: 0,
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '17px'
          }}>
          <div
            ref={chartContainerRef5}
            style={{
              position: 'absolute',
              width: '44vw',
              height: '26vh',
              left: '5%',
              top: '8%',
              margin: 0,
              padding: 0,
              zIndex: 20
            }}
          />
          </div>
        </Box>
      </Box>
    </>
  );
}

export default FiveChart;
