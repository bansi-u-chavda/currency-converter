import React, { useState, useEffect } from "react";
import axios from "axios";
import { currencies } from "./currencies";

const App = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);

  // Load conversion history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setConversionHistory(savedHistory);
  }, []);

  // Save conversion history to localStorage
  const saveHistory = (entry) => {
    const updatedHistory = [entry, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  const convertCurrencies = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/convert?base_currency=${baseCurrency}&currencies=${selectedCurrency}`
      );
      let result = Object.values(data.data)[0] * amount;
      let roundofResult = result.toFixed(2);
      const countryCode = currencies.find(
        (currency) => currency.code === selectedCurrency
      );

      saveHistory({
        result: roundofResult,
        flag: countryCode.flag,
        symbol: countryCode.symbol,
        code: countryCode.code,
        countryName: countryCode.name,
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      alert("Error fetching conversion rates.");
    }
  };

  const deleteHistoryItem = (index) => {
    const updatedHistory = conversionHistory.filter((_, i) => i !== index);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setConversionHistory(updatedHistory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-indigo-950 flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Smart Currency Converter
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Base Currency:
            </label>
            <select
              className="w-full border border-gray-300 bg-white text-base rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount:
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 bg-white text-base rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Currencies to Convert:
            </label>
            <select
              className="w-full border border-gray-300 bg-white text-base rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg transition"
            onClick={convertCurrencies}
          >
            Convert
          </button>
        </div>

        <div className="flex-grow max-h-96 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Conversion History</h2>
          <ul className="space-y-4">
            {conversionHistory.length > 0 ? (
              conversionHistory.map((entry, index) => (
                <li
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://flagcdn.com/w40/${entry.flag}.png`}
                      alt="Country Flag"
                      className="w-10 h-10 rounded shadow"
                    />
                    <div className="flex flex-col text-sm">
                      <span className="text-xl font-semibold text-gray-800">
                        {entry.symbol} {entry.result}
                      </span>
                      <span className="text-gray-600">
                        {entry.code} - {entry.countryName}
                      </span>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 text-xl font-bold"
                    onClick={() => deleteHistoryItem(index)}
                  >
                    ×
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-base font-medium">
                Conversion history is empty.
              </p>
            )}
          </ul>
        </div>

         <footer className="mt-10 text-center text-gray-600 text-sm">
          Made with ❤ by Bansi Chavda
        </footer>
      </div>
    </div>
  );
};

export default App;
