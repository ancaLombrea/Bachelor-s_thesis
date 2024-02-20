"# Bachelor-s_thesis" 

In the implementation of the current project, our main objective was to build a system for monitoring the parameters necessary for determining air quality, both indoors and outdoors. Data will be collected at predefined time intervals and stored in an online database, allowing for processing and display by a software program accessible from a web browser. User permission will be requested for the use of Bluetooth technology, enabling data retrieval from beacons and activating location services on the device, with the location data then being saved to the database.

The detailed objectives are outlined as follows:
• Determination of a solution in the Android Studio programming environment for Bluetooth Low Energy scanning of devices based on the desired Media Access Control (MAC) address.
• Retrieval of information from the sensor based on the client's chosen scanning interval.
• Decoding of the data packet broadcasted by the beacon to obtain the six desired parameters (temperature, atmospheric pressure, relative humidity, equivalent carbon dioxide, equivalent volatile organic compounds, and air quality index).
• Retrieval of the user's current location and real-time transmission of decoded data to an online database.
• Visualization of extracted information during scanning, allowing for comparison with optimal values for each parameter.
• Creation of software for extracting data from the database and displaying it in a user-friendly and evaluative manner.

These objectives are aimed to be achieved at a low cost for all Android device owners compatible with version 21 API or later. The cost for acquiring the BME688 sensor is low, enabling a wide range of individuals to possess such a device.
