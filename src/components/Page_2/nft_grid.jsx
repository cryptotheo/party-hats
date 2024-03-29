import { useEffect, useState } from "react";
import extjs from "../../ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";

import "./nft_grid.css"


function NFT_Grid() {
    const [listings, setListings] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [stats, setStats] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [index, setIndex] = useState(""); // State variable for index input\
    const [indexToken, setIndexToken] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [userCollectionState, setUserColletion] = useState([]);
    const itemsPerPage = 50;

      useEffect(() => {}, [loaded, userCollectionState]);
    
      useEffect(() => {
        (async () => {
          // await getUserCollectionn()
          let listings = await api.token(partyhatscanister).listings();
          let statsResponse = await api.token(partyhatscanister).stats();
          setListings(listings);
          setStats(statsResponse);
        })();
      }, []);
    
      useEffect(() => {
        const fetchListings = async () => {
          try {
            const tokenPromises = [];
            for (let i = 0; i < itemsPerPage; i++) {
              const tokenId = await extjs.encodeTokenId(
                partyhatscanister,
                (currentPage - 1) * itemsPerPage + i
              );
              const details = await fetchTokenDetails(tokenId);
              tokenPromises.push({ tokenId, details });
            }
            const tokenIds = await Promise.all(tokenPromises);
            setTokens(tokenIds);
            setLoaded(true);
          } catch (error) {
            console.error("Error fetching listings:", error);
          }
        };
    
        fetchListings();
      }, [currentPage]);
    
      useEffect(() => {
        setCurrentPage(1); // Reset to page 1 whenever listings change
      }, [listings, tokens]);
    
      const totalPages = Math.ceil(listings.length / itemsPerPage);
    
      const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
        }
      };
    
      const handleIndexChange = async (event) => {
        setIndex(event.target.value);
        let token = await extjs.encodeTokenId(
          partyhatscanister,
          event.target.value - 1
        );
        setIndexToken(token);
      };
    
      const handleSearch = () => {
        if (!isNaN(index) && index > 0 && index <= listings.length) {
          setCurrentPage(Math.ceil(index / itemsPerPage));
        } else {
          setCurrentPage(1);
        }
      };
    
      const fetchTokenDetails = async (tokenId) => {
        try {
          const tokenDetails = await fetch(
            `https://us-central1-entrepot-api.cloudfunctions.net/api/token/${tokenId}`
          );
          return tokenDetails.json();
        } catch (error) {
          console.error("Error fetching token details:", error);
          return [];
        }
      };


      if (!loaded) return <div>merp</div>;

      return <>
      
      <div className="grid-container">
        {listings
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((tokenId, index) => {
            return (
              <div className="gradient-border">
                <div className="card-container">
                  <div key={index} className="nft-image-container">
                    <img
                      src={`https://gq5kt-4iaaa-aaaal-qdhuq-cai.raw.icp0.io/?tokenid=${
                        tokens && tokens[index].tokenId
                      }`}
                      alt={`Item ${index + 1}`}
                      className="nft-image"
                    />
                  </div>
                  <div className="card-description-container">
                    <div className="card-d-container-row">
                      <p className="">#{index + 1}</p>
                      <div className="nri-container">
                        <p className="nri-text">47%</p>
                      </div>
                    </div>
                    <div className="card-d-container-row">
                      <div className="nft-price-container">
                        <p>1.384</p>
                        <img
                          className="dfinity-price-image"
                          src="../src/assets/ICP.png"
                          alt="dfinity logo"
                        />
                      </div>
                      <div className="buy-now-container">
                        <p className="buy-now-text">buy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      </>

}

export default NFT_Grid;