import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import CSS for styling
import settings from '../assets/settings.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('General'); // Default category
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const fetchNews = async (category) => {
    setLoading(true); // Set loading to true when starting to fetch news
    try {
      const response = await fetch(`https://news-aggregator-backend-h2br.onrender.com/top-headlines?category=${category}&language=en&page=1&pageSize=80`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news - ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.data.status === 'ok') {
        setArticles(data.data.articles);
      } else {
        throw new Error('Failed to fetch news - Invalid response');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching news
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">PERSONALIZED NEWS AGGREGATOR - Team H</div>
        <div className="navbar-right">
          <div className="nav-option">
            <select
              value={selectedCategory}
              onChange={(e) => handleChangeCategory(e.target.value)}
              className="nav-select"
            >
              <option value="General">General</option>
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div className="nav-option" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </nav>
      <div className="content">
        <h2>Top Headlines ({selectedCategory})</h2>
        {loading ? (
          <div className="loading">
            <img src={settings} alt="Loading" className="loading-image" />
          </div>
        ) : (
          <div className="articles">
            {articles
              .filter(article => article.title !== '[Removed]' && article.urlToImage)
              .map((article, index) => (
                <div key={index} className="article">
                  <img src={article.urlToImage} alt={article.title} className="article-image" />
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <p>{article.publishedAt}</p>
                  <p>{article.content}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
