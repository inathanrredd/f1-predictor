# F1 Predictor

This predictor uses a simple prediction model which determines the average 
finishing position of each driver this season and adds it to their average 
finishing position in any previous races at the circuit. The total of the 
averages are then sorted from least to greatest and that gives us the predicted 
order from 1st to 20th. This attempts to take into account the driver and teams 
current competitiveness as well as how well they have performed at that 
specific circuit in the past.

There are limitations to this model. One example is Lewis Hamilton. Because 
Hamilton had an extremely competitive car for years, his average finishing 
position at any given circuit in past races is likely to be very low. This 
means he will be placed higher in predictions even though his car is not very 
competitive this year.

This project uses the Ergast F1 API found at http://ergast.com/mrd/
