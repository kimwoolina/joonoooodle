import { useState } from 'react'
import MapView from './components/Map/MapView'
import Header from './components/UI/Header'
import Legend from './components/UI/Legend'
import DetailPanel from './components/TreeDetails/DetailPanel'
import AddressSearch from './components/Search/AddressSearch'
import treesData from './data/trees.json'
import './App.css'

function App() {
  const [selectedTree, setSelectedTree] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [mapCenter, setMapCenter] = useState([37.5665, 126.9780])
  const [mapZoom, setMapZoom] = useState(11)

  const handleTreeClick = (tree) => {
    setSelectedTree(tree)
  }

  const handleCloseDetail = () => {
    setSelectedTree(null)
  }

  const handleSearch = (results, center) => {
    setSearchResults(results)
    if (center) {
      setMapCenter(center)
      setMapZoom(14)
    }
  }

  return (
    <div className="app">
      <Header />
      <AddressSearch
        trees={treesData}
        onSearch={handleSearch}
      />
      <Legend />
      <MapView
        trees={treesData}
        onTreeClick={handleTreeClick}
        searchResults={searchResults}
        center={mapCenter}
        zoom={mapZoom}
      />
      {selectedTree && (
        <DetailPanel
          tree={selectedTree}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}

export default App
