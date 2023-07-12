import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'
// import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import { useParams, useNavigate } from 'react-router-dom';
// import { Display } from "react-bootstrap-icons";
import { Chart } from 'chart.js';

Chart.register(Chart.scaleService.getScaleConstructor('category'));

const BarChart = () => {
  const { year, semester, courseName, courseCode, assignmentName } = useParams();
  const [error, setError] = useState(null)
  const [fromDB, setFromDB] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      
      if (!user || user.userType !== 'student') {
        navigate('/PageToFound'); // Redirect the user to 404 page
        return;
      }
      
      const fetchCourses = async () => {
        try {
          const response = await fetch(`https://college-system-pixh.onrender.com/api/course/statsFor/${year}/${semester}/${courseName}/${assignmentName}`);
          const json = await response.json();

          if (response.ok) {
            setFromDB(json);
          } else {
            setError(json.error);
          }
        } catch (error) {
          setError("Error fetching data.");
        }
      };

      fetchCourses();
    }
  }, [isInitialized, navigate, user, semester, year, courseName, assignmentName]);
  
  /** array to hold the info for the distribution chart */
  const distribution = [0, 0, 0, 0, 0, 0];

  /** loop to fill the distribution array + calculate sum of all grades(for average) */
  let sum = 0;
  for (let i=0; i < fromDB.length; i++){
    sum += fromDB[i];
    if (fromDB[i] <= 54){
      distribution[0] ++;
    }
    else if (fromDB[i] >= 55 && fromDB[i] <= 64){
      distribution[1] ++;
    }
    else if (fromDB[i] >= 65 && fromDB[i] <= 74){
      distribution[2] ++;
    }
    else if (fromDB[i] >= 75 && fromDB[i] <= 84){
      distribution[3] ++;
    }
    else if (fromDB[i] >= 85 && fromDB[i] <= 94){
      distribution[4] ++;
    }
    else if (fromDB[i] >= 95 && fromDB[i] <= 100){
      distribution[5] ++;
    }
  }
  const average = (sum / fromDB.length).toFixed(2);

  /** function to calclate the median */
  function calculateMedian(numbers) {
    const sortedNumbers = numbers.sort((a, b) => a - b);
    const length = sortedNumbers.length;
    if (length === 0) {
      return null;
    }
    if (length % 2 === 1) {
      const middleIndex = Math.floor(length / 2);
      const medianValue = sortedNumbers[middleIndex];
      return medianValue === "Not Graded Yet" ? NaN : medianValue;
    } 
    else {
      const middleIndex1 = length / 2 - 1;
      const middleIndex2 = length / 2;
      const medianValue = Math.floor((sortedNumbers[middleIndex1] + sortedNumbers[middleIndex2]) / 2);
      return medianValue === "Not Graded Yet" ? NaN : medianValue;
    }
  }
  const median = calculateMedian(fromDB);

  /** function to calculate the standard deviation */
  function calculateStandardDeviation(numbers) {
    const mean = calculateMean(numbers);
    const differences = numbers.map((num) => num - mean);
    const squaredDifferences = differences.map((diff) => diff ** 2);
    const meanSquaredDifference = calculateMean(squaredDifferences);
    const standardDeviation = Math.sqrt(meanSquaredDifference);
    return standardDeviation;
  }
  
  /** function that calculates the mean for the standard deviation */
  function calculateMean(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / numbers.length;
    return mean;
  }
  const deviation = calculateStandardDeviation(fromDB).toFixed(2);

  const setAllDetails = () => {
    const labels = ["0-54", "55-64", "65-74", "75-84", "85-94", "95-100"];
  
    const data = {
      labels: labels,
      datasets: [
        {
          data: distribution,
          label: "Students",
          backgroundColor: [
            'rgba(255, 99, 132, 0.3)',
            'rgba(255, 159, 64, 0.3)',
            'rgba(255, 205, 86, 0.3)',
            'rgba(75, 192, 192, 0.3)',
            'rgba(54, 162, 235, 0.3)',
            'rgba(153, 102, 255, 0.3)',
            'rgba(201, 203, 207, 0.3)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1,
        },
      ],
    };
    return data
  }
  
  return (
    <section className='stats'>
      <h1 className="display-5">Stats - {assignmentName}</h1>

      <div className="stats-info">
        <h5 className="stats-avg">Average: {average}</h5>
        <h5 className="stats-mdn">Median: {median}</h5>
        <h5 className="stats-std">Standard Deviation: {deviation}</h5>
      </div>

      <div className="chart-container">
       {fromDB.length > 0 && <Bar data={setAllDetails()} />}
       {error && (
            <div className="error-text">
              {error}
            </div>
          )}
      </div>

      <Button onClick={() => navigate(`/grades/${year}/${semester}/${courseName}/${courseCode}`)} className="btn-secondary back-btn">Back</Button>
    </section>
  );
};

export default BarChart;