import React from "react";

//navbar at the top of the page
//In the center have a "user's little one" with image
//below image include weeks table
//size of a : size
//symptoms: list of symptoms
//write about today:
//journal entry
const HomePage = () => {
  return (
    <div className="centered-container">
      <h1>Welcome, Patsy!</h1>
      <h2>You are currently 17 weeks and 2 days pregnant!</h2>
      <img src="/il_570xN.1057483144_tpmx.avif" alt="Baby Image" />
      Your little one is the size of a vintage wallet! Sorta weird to think of a
      wallet being in your insides but it&rsquo;s still better than talking
      about food! Whether you are going at this alone or with a partner, you are
      really achieving a lot each day! The little one is about 5.12 inches and
      4.94 ounces.
    </div>
  );
};

export default HomePage;
