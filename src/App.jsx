import { useState, useEffect } from 'react'
import axios from 'axios'
import Fab from '@mui/material/Fab'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './App.css'
import HowItWorksModal from './HowItWorksModal'

function App() {
  const [predictedResults, setPredictedResults] = useState([])
  const [round, setRound] = useState(1)
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    getRacesThisSeason()
  }, [])
  
  const predictResults = async () => {
    setLoading(true)
    setShowResults(true)
    let driverScores = []
    const drivers = await getCurrentDrivers()
    const driverObjects = {}
    drivers.forEach((driverObject => driverObjects[driverObject.driverId] = driverObject))
    const race =  await getRaceFromRoundThisSeason(round)
    for (const driver of drivers) {
      const driverId = driver.driverId
      const currrentSeasonResults = await getCurrentSeasonResults(driverId)
      const prevResultsAtCircuit = await getPrevResultsAtCircuit(race.Circuit.circuitId, driverId)
      driverScores.push({ driver: driverObjects[driverId], score: currrentSeasonResults + prevResultsAtCircuit })
    }
    driverScores = driverScores.sort((a, b) => { return a.score - b.score })
    setPredictedResults(driverScores.map(obj => obj.driver.givenName + ' ' + obj.driver.familyName))
    setLoading(false)
  }

  const getCurrentSeasonResults = (driver) => {
    const res = parseInt(sessionStorage.getItem(`${driver}-curr`))
    return res
      ? res
      : axios.get(`https://ergast.com/api/f1/current/drivers/${driver}/results.json`)
          .then((results) => {
            const averageResult = getAverageResults(results.data)
            sessionStorage.setItem(`${driver}-curr`, averageResult)
            return averageResult
          })
          .catch((err) => {
            console.log(err)
          })
  }

  const getPrevResultsAtCircuit = (circuit, driver) => {
    const res = parseInt(sessionStorage.getItem(`${driver}-${circuit}`))
    return res
      ? res
      : axios.get(`https://ergast.com/api/f1/circuits/${circuit}/drivers/${driver}/results.json`)
          .then((results) => {
            const averageResult = getAverageResults(results.data)
            sessionStorage.setItem(`${driver}-${circuit}`, averageResult)
            return averageResult
          })
          .catch((err) => {
            console.log(err)
          })
  }

  const getAverageResults = (results) => {
    results = results?.MRData?.RaceTable?.Races
    if (!results) return 999
    let total = 0
    for (const result of results) {
      total += parseInt(result.Results[0].position)
    }
    return total / results.length
  }

  const getCurrentDrivers = () => {
    return axios.get('https://ergast.com/api/f1/current/1/drivers.json')
      .then((results) => {
        return results?.data?.MRData?.DriverTable?.Drivers
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getRaceFromRoundThisSeason = (round) => {
    return axios.get(`https://ergast.com/api/f1/current/${round}.json`)
      .then((results) => {
        return results?.data?.MRData?.RaceTable?.Races[0]
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getRacesThisSeason = () => {
    return axios.get(`https://ergast.com/api/f1/current.json`)
      .then((results) => {
        setRaces(results?.data?.MRData?.RaceTable?.Races)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <h1>F1 {new Date().getFullYear()} Predictor</h1>
      <select
        value={round}
        onChange={e => setRound(e.target.value)}
        style={{ height: "2rem" }}
      >
        {
          races?.map(race => (
            <option key={race.round} value={parseInt(race.round)}>{race.raceName}</option>
          ))
        }
      </select>
      <button style={{ marginLeft: "0.5rem" }} onClick={() => predictResults() }>
        Predict!
      </button>
      {loading ? (
        <>
          <h3>Predicting Results</h3>
          <progress value={null} />
        </>
      ) : showResults && (
        <>
          <h3>Predicted Results</h3>
          <ol>
            {predictedResults.map((res) => (
              <li key={res}>{res}</li>
            ))}
          </ol>
        </>
      )}
      <Fab
        color="primary"
        onClick={() => setModalOpen(true)}
        style={{
          position: "absolute",
          right: "25px",
          bottom: "25px",
        }}
      >
        <InfoOutlinedIcon />
      </Fab>
      <HowItWorksModal open={modalOpen} handleClose={() => setModalOpen(false)} />
    </>
  )
}

export default App
