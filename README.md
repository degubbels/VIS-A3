# vis20w A3
# Dennis Gubbels

procedure
----
x Use the vue.js boilerplate (https://github.com/asilcetin/vis20w-vue-d3) provided. If you have sufficient knowledge in any other reactive JS framework (React, Angular etc.) you're free to use those as well. In that case make sure you document in detail the framework you use and its setup in your README file.

x Import the datasets into the state of your web application on load. The choropleth and scatter plot components bind to that data in state.

x Define a 3x3 bi-variate color scheme for your two data dimensions (median income vs. burglary rate)

x Implement a year slider, which is by default set to the latest available year, 2014. This year selection will be used by both the choropleth and the scatter plot.

x Create a choropleth map and fill each state's polygon on the map with a color representing the median income vs. burglary rate in that state.

x Create a scatter plot with 1) the x-axis displaying the burglary rate in a state, and 2) y-axis displaying the median household income in a state. The background of the scatter plot should be divided and filled by the 3x3 color scheme you have defined.

x Data points (circles) in the scatter plot should have a fixed size (radius) and represent one state each.

x Label x and y axes of the scatter plot: 1) "Burglary Rate (per 100.000 people)" underneath the x-axis, 2) "Median Household Income (in $)" on the left side of the y-axis

x Label the scales on x and y axes: select the intervals and formatting that you find useful / informative

x On mouseover each data point (circle) shows a tooltip containing the name of that state.

x Implement brushing on the scatter plot. Only the states corresponding to the data points which are selected by the brushed rectangle will be shown on the map and the other states will be grayed out. Clicking an empty area inside the scatter plot should deactivate the brush selection.

x Interactivity on the map: on mouseclick on a state highlight the data point of that particular state on the scatter plot. Clicking an empty area inside the map component should deactivate the highlighting.