// // const WeatherToolOutput = ({ data }: { data: { output: string } }) => {
// //   // Parse temperature from output string if available
// //   let temperature: string | null = null;
// //   let location: string | null = null;
// //   let weatherText = data.output;
// //   let conditions: string | null = null;
  
// //   // Try to extract temperature and location using regex
// //   const tempMatch = data.output.match(/(\d+)°C/);
// //   if (tempMatch) temperature = tempMatch[1];
  
// //   const locationMatch = data.output.match(/in ([A-Za-z\s]+) is/);
// //   if (locationMatch) location = locationMatch[1];
  
// //   // Try to extract weather conditions
// //   const conditionsMatch = data.output.match(/(sunny|cloudy|rainy|snowy|clear|overcast|foggy|windy|thunderstorm|hazy)/i);
// //   if (conditionsMatch) conditions = conditionsMatch[1].toLowerCase();


// const WeatherToolOutput = ({ data }: { data: { output: string } }) => {
//   let temperature: string | null = null;
//   let location: string | null = null;
//   let weatherText = data.output;
//   let conditions: string | null = null;

//   // Try to parse as JSON first
//   try {
//     const jsonData = JSON.parse(data.output);
//     temperature = jsonData.temperature?.replace('°C', '') || null;
//     location = jsonData.city || jsonData.location || null;
//     conditions = jsonData.conditions || jsonData.weather || null;
//     weatherText = `${temperature}°C in ${location}`;
//   } catch (e) {
//     // Fall back to regex parsing if not JSON
//     const tempMatch = data.output.match(/(\d+)°C/);
//     if (tempMatch) temperature = tempMatch[1];
    
//     const locationMatch = data.output.match(/in ([A-Za-z\s]+) is/) || 
//                          data.output.match(/Location: ([A-Za-z\s]+)/);
//     if (locationMatch) location = locationMatch[1];
    
//     const conditionsMatch = data.output.match(/(sunny|cloudy|rainy|snowy|clear|overcast|foggy|windy|thunderstorm|hazy)/i);
//     if (conditionsMatch) conditions = conditionsMatch[1].toLowerCase();
//   }

//   // Rest of your component remains the same...
  
//   // Determine weather icon based on conditions or temperature
//   const getWeatherIcon = () => {
//     if (conditions) {
//       if (conditions.includes('sunny') || conditions.includes('clear')) return '☀️';
//       if (conditions.includes('cloudy') || conditions.includes('overcast')) return '☁️';
//       if (conditions.includes('rainy')) return '🌧️';
//       if (conditions.includes('snowy')) return '❄️';
//       if (conditions.includes('foggy') || conditions.includes('hazy')) return '🌫️';
//       if (conditions.includes('windy')) return '💨';
//       if (conditions.includes('thunderstorm')) return '⛈️';
//     }
    
//     // Fallback to temperature-based icon
//     const temp = parseInt(temperature || '0');
//     if (temp > 30) return '☀️';
//     if (temp > 20) return '⛅';
//     if (temp > 10) return '🌤️';
//     if (temp > 0) return '🌥️';
//     return '❄️';
//   };

//   const getWeatherGradient = () => {
//     if (conditions) {
//       if (conditions.includes('sunny') || conditions.includes('clear')) 
//         return 'from-amber-50 to-orange-50';
//       if (conditions.includes('cloudy') || conditions.includes('overcast')) 
//         return 'from-gray-50 to-slate-100';
//       if (conditions.includes('rainy')) 
//         return 'from-blue-50 to-indigo-100';
//       if (conditions.includes('snowy')) 
//         return 'from-slate-50 to-blue-100';
//       if (conditions.includes('thunderstorm'))
//         return 'from-indigo-50 to-purple-100';
//     }
    
//     // Fallback to temperature-based gradient
//     const temp = parseInt(temperature || '0');
//     if (temp > 30) return 'from-amber-50 to-orange-50';
//     if (temp > 20) return 'from-blue-50 to-sky-50';
//     if (temp > 10) return 'from-sky-50 to-indigo-50';
//     if (temp > 0) return 'from-gray-50 to-slate-50';
//     return 'from-blue-50 to-indigo-100';
//   };

//   return (
//     <div className="weather-tool overflow-hidden rounded-xl shadow-sm border border-gray-200">
//       {/* Weather Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-2 px-4">
//         <h3 className="font-medium text-white flex items-center text-sm">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.9-6.07" />
//           </svg>
//           Weather Conditions
//         </h3>
//       </div>
      
//       {/* Weather Content */}
//       <div className={`p-4 bg-gradient-to-br ${getWeatherGradient()}`}>
//         <div className="flex">
//           {/* Left Column: Icon and Temperature */}
//           <div className="mr-4">
//             <div className="weather-icon flex items-center justify-center w-16 h-16 text-4xl bg-white bg-opacity-70 rounded-full shadow-sm border border-gray-100">
//               {getWeatherIcon()}
//             </div>
//             {temperature && (
//               <div className="mt-2 text-center">
//                 <span className="font-bold text-2xl text-blue-800">{temperature}°</span>
//                 <span className="text-blue-600 text-sm">C</span>
//               </div>
//             )}
//           </div>
          
//           {/* Right Column: Location and Details */}
//           <div className="flex-1">
//             <h4 className="font-semibold text-blue-900 text-lg">
//               {location ? location : 'Current Location'}
//             </h4>
//             <p className="text-gray-700 text-sm mt-1">{weatherText}</p>
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default WeatherToolOutput;


// const WeatherToolOutput = ({ data }: { data: { output: string } }) => {
//   // Parse the response
//   let weatherData = {
//     city: "Unknown Location",
//     temperature: "N/A",
//     condition: "N/A",
//     humidity: "N/A",
//     feels_like: "N/A",
//     wind_speed: "N/A",
//     local_time: "N/A"
//   };

//   try {
//     const jsonData = JSON.parse(data.output);
//     weatherData = {
//       city: jsonData.city || "Unknown Location",
//       temperature: jsonData.temperature || "N/A",
//       condition: jsonData.condition || "N/A",
//       humidity: jsonData.humidity || "N/A",
//       feels_like: jsonData.feels_like || "N/A",
//       wind_speed: jsonData.wind_speed || "N/A",
//       local_time: jsonData.local_time || "N/A"
//     };
//   } catch (e) {
//     console.error("Error parsing weather data:", e);
//   }

//   // Weather icon based on condition
//   const getWeatherIcon = () => {
//     const condition = weatherData.condition.toLowerCase();
//     if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
//     if (condition.includes('cloudy') || condition.includes('overcast')) return '☁️';
//     if (condition.includes('rain')) return '🌧️';
//     if (condition.includes('snow')) return '❄️';
//     if (condition.includes('fog') || condition.includes('haze')) return '🌫️';
//     if (condition.includes('wind')) return '💨';
//     if (condition.includes('thunder')) return '⛈️';
//     return '🌈'; // Default icon
//   };

//   return (
//     <div className="weather-tool overflow-hidden rounded-xl shadow-sm border border-gray-200">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-2 px-4">
//         <h3 className="font-medium text-white flex items-center text-sm">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.9-6.07" />
//           </svg>
//           Current Weather
//         </h3>
//       </div>
      
//       {/* Main Content */}
//       <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-100">
//         <div className="flex flex-col md:flex-row gap-4">
          
//           {/* Left Column - Primary Info */}
//           <div className="flex-1">
//             <div className="flex items-center gap-4">
//               <div className="text-5xl p-2 bg-white bg-opacity-70 rounded-full">
//                 {getWeatherIcon()}
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">{weatherData.city}</h2>
//                 <p className="text-gray-600 text-sm">{weatherData.local_time}</p>
//               </div>
//             </div>
            
//             <div className="mt-4">
//               <div className="text-5xl font-bold text-gray-800">
//                 {weatherData.temperature}
//               </div>
//               <p className="text-gray-600 capitalize">{weatherData.condition}</p>
//               <p className="text-gray-600">Feels like {weatherData.feels_like}</p>
//             </div>
//           </div>
          
//           {/* Right Column - Secondary Info */}
//           <div className="flex-1 grid grid-cols-2 gap-2">
//             <div className="bg-white bg-opacity-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-500">Humidity</p>
//               <p className="font-semibold">{weatherData.humidity}</p>
//             </div>
//             <div className="bg-white bg-opacity-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-500">Wind Speed</p>
//               <p className="font-semibold">{weatherData.wind_speed}</p>
//             </div>
//             <div className="bg-white bg-opacity-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-500">Local Time</p>
//               <p className="font-semibold">{weatherData.local_time}</p>
//             </div>
//             <div className="bg-white bg-opacity-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-500">Feels Like</p>
//               <p className="font-semibold">{weatherData.feels_like}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeatherToolOutput;




const WeatherToolOutput = ({ data }: { data: { output: string } }) => {
  // Parse the response
  let weatherData = {
    city: "Unknown Location",
    temperature: "N/A",
    condition: "N/A",
    humidity: "N/A",
    feels_like: "N/A",
    wind_speed: "N/A",
    local_time: "N/A"
  };

  try {
    const jsonData = JSON.parse(data.output);
    weatherData = {
      city: jsonData.city || "Unknown Location",
      temperature: jsonData.temperature || "N/A",
      condition: jsonData.condition || "N/A",
      humidity: jsonData.humidity || "N/A",
      feels_like: jsonData.feels_like || "N/A",
      wind_speed: jsonData.wind_speed || "N/A",
      local_time: jsonData.local_time || "N/A"
    };
  } catch (e) {
    console.error("Error parsing weather data:", e);
  }

  // Weather icon based on condition
  const getWeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
    if (condition.includes('cloudy') || condition.includes('overcast')) return '☁️';
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('snow')) return '❄️';
    if (condition.includes('fog') || condition.includes('haze')) return '🌫️';
    if (condition.includes('wind')) return '💨';
    if (condition.includes('thunder')) return '⛈️';
    return '🌈'; // Default icon
  };

  return (
    <div className="weather-tool max-w-full overflow-hidden rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-1 px-3">
        <h3 className="font-medium text-white flex items-center text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.9-6.07" />
          </svg>
          Current Weather
        </h3>
      </div>
      
      {/* Main Content */}
      <div className="p-3 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="flex flex-col gap-2">
          
          {/* Top Section - Primary Info */}
          <div className="flex items-center gap-2">
            <div className="text-3xl p-1 bg-white bg-opacity-70 rounded-full">
              {getWeatherIcon()}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 truncate">{weatherData.city}</h2>
              <p className="text-gray-600 text-xs truncate">{weatherData.local_time}</p>
            </div>
          </div>
          
          {/* Temperature Info */}
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {weatherData.temperature}
            </div>
            <p className="text-gray-600 text-xs capitalize truncate">{weatherData.condition}</p>
            <p className="text-gray-600 text-xs truncate">Feels like {weatherData.feels_like}</p>
          </div>
          
          {/* Secondary Info Grid */}
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-white bg-opacity-50 p-1 rounded-lg text-center">
              <p className="text-[0.6rem] text-gray-500">Humidity</p>
              <p className="font-semibold text-xs">{weatherData.humidity}</p>
            </div>
            <div className="bg-white bg-opacity-50 p-1 rounded-lg text-center">
              <p className="text-[0.6rem] text-gray-500">Wind Speed</p>
              <p className="font-semibold text-xs">{weatherData.wind_speed}</p>
            </div>
            <div className="bg-white bg-opacity-50 p-1 rounded-lg text-center">
              <p className="text-[0.6rem] text-gray-500">Local Time</p>
              <p className="font-semibold text-xs">{weatherData.local_time}</p>
            </div>
            <div className="bg-white bg-opacity-50 p-1 rounded-lg text-center">
              <p className="text-[0.6rem] text-gray-500">Feels Like</p>
              <p className="font-semibold text-xs">{weatherData.feels_like}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherToolOutput;