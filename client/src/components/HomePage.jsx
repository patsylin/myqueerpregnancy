import React from 'react'

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to My Queer Pregnancy</h1>
        <p>A safe and inclusive space to track your pregnancy journey</p>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>Track Your Progress</h3>
          <p>Monitor your pregnancy milestones and development</p>
        </div>
        
        <div className="feature">
          <h3>Journal Your Journey</h3>
          <p>Document your thoughts, feelings, and experiences</p>
        </div>
        
        <div className="feature">
          <h3>Inclusive Resources</h3>
          <p>Access LGBTQ+-friendly pregnancy information and support</p>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Start Your Journey Today</h2>
        <p>Create an account to begin tracking your pregnancy experience</p>
      </div>
    </div>
  )
}

export default HomePage